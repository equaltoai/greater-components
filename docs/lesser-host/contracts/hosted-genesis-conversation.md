# Hosted genesis durable conversation contract

Project 50 Milestone A extends the Project 49 contract by adding the Host-owned `HostedGenesisSession` DynamoDB source of truth. Project 49 locked the Host-owned durable async contract for Lesser-driven hosted/off-chain soul genesis. The observed
failure this contract fixes was a transport-success response (`HTTP 200` plus a request id) while Host persisted the
conversation as `in_progress` with no declarations and Lesser could not persist a `host_conversation_id`.

This document is a contract artifact for Host, Lesser, Greater, and Sim. Project 49 M1.1 locked names and examples.
Project 50 Milestone A implements the Host-owned source-of-truth model/repository foundation. Project 51 M2 routes
the Lesser instance-key runtime through `HostedGenesisSession` first: POST commits the session and idempotency/debit
ledger before transport execution, GET/status projects from the session, completion/finalize gates read declaration
checkpoint readiness from the session, and `SoulAgentMintConversation` is compatibility/projection input only.

## Authoritative Lesser route family

The Lesser server calls Host with `instanceKeyAuth`; the browser never receives raw Host credentials or Host
control-plane session tokens.

- `POST /api/v1/soul/instance/agents/register/{id}/mint-conversation`
  - JSON-authoritative for Lesser.
  - Creates or appends a hosted-genesis turn and returns the current durable status envelope.
  - `HTTP 200` or `HTTP 202` is **transport success only**. It is not terminal completion.
  - Lesser must persist `conversation.conversation_id` as soon as it appears, even when `conversation.status` is
    `in_progress`.
- `GET /api/v1/soul/instance/agents/register/{id}/mint-conversation/{conversationId}`
  - Durable status read.
  - Source of truth for polling, resume, declaration readiness, and typed failure recovery.
- `POST /api/v1/soul/instance/agents/register/{id}/mint-conversation/{conversationId}/complete`
  - Progress-safe completion/extraction handoff for Lesser.
  - `HTTP 202` returns the compact HostConversation progress envelope while assistant or declaration extraction work is
    still running.
  - `HTTP 200` returns the same compact HostConversation envelope with `status=declaration_ready` only when valid
    produced declarations exist; it never returns raw transcript fields.

SSE may remain available for portal/native Host UI routes, but SSE is not the authoritative completion mechanism for
the Lesser instance-key path.

## Host-owned source-of-truth row

Milestone A introduces `HostedGenesisSession` as the Host DynamoDB/TableTheory business record for hosted/off-chain
genesis. AppTheory MicroVM session registry, memory, disk, and lifecycle data are execution/cache state only; they are
reconstructible from the Host row and never become the user-visible source of truth.

Key shape and tenancy rules:

- primary key: `PK=HOSTED_GENESIS#INSTANCE#{instance_slug}`, `SK=SESSION#{conversation_id}`
- registration and agent GSIs also include `instance_slug` so lookups cannot cross Managed instance boundaries
- writes after create use TableTheory optimistic-lock `version` checks; stale expected versions fail closed instead of
  overwriting a concurrent state transition
- status updates also carry an expected current status condition, so an otherwise current `version` cannot skip the
  locked Host state-machine transition table
- `created` is valid only for pre-turn Host rows and still collapses to `in_progress` on Lesser instance-key reads
- accepted turns are tracked in a compact `turn_ledger` of turn ids, idempotency keys, request hashes, checkpoint refs,
  and billing ledger refs only

Durable fields are ids, bounded status, and checkpoint references only. The model does not carry raw prompts, raw
message lists, provider keys, Instance API keys, wallet signatures, signing material, SSM values, AWS credentials,
provider secrets, MicroVM endpoint tokens, or browser Host credentials. Declaration publish/finalize readiness is gated
by `status=declaration_ready` plus a valid declaration checkpoint (`declaration_id`, `declaration_hash`,
`checkpoint_ref`, registration/conversation/agent ids, message count, request id, and produced timestamp). Typed
`failed` recovery actions are server-authored and limited to the locked recovery enum below.

### Idempotency ledger semantics

The durable `HostedGenesisSession` turn ledger is the Host source of truth for retry semantics. For a caller-provided
`idempotency_key`, Host records the request hash and accepted `turn_id` once. A retry with the same idempotency key and
same request hash replays the existing turn and must not append another user turn, advance `message_count` or
`latest_turn_id`, enqueue duplicate user-visible work, or debit credits again. A retry with the same idempotency key and
a different request hash fails closed as an idempotency conflict.

SQS, AppTheory MicroVM registry/cache state, AI-worker delivery, and HTTP/SSE transport state are reconstructible
execution details. They do not determine user-visible progress, retry, finalize readiness, or billing state. If queue
delivery is missing or stale, status remains the compact `HostedGenesisSession` projection and retry/finalize decisions
continue to fail closed from that Host row.

## HostConversation envelope

Machine-readable schema:

- `docs/spec/v3/schemas/hosted-genesis.conversation.response.schema.json`

Examples:

- `docs/spec/v3/fixtures/hosted-genesis.conversation.in-progress.example.json`
- `docs/spec/v3/fixtures/hosted-genesis.conversation.completed-declaration-ready.example.json`
- `docs/spec/v3/fixtures/hosted-genesis.conversation.failed.example.json`

Field names locked for M1.1:

| Field | Required | Meaning |
| --- | --- | --- |
| `registration_id` | yes | Host registration id for the active hosted genesis attempt. |
| `conversation_id` | yes | Host durable conversation id. Persist early and use for polling/resume. |
| `agent_id` | yes | Host Soul registry agent id. |
| `status` | yes | One of the locked status names below. |
| `latest_turn_id` | no | Opaque Host id for the most recent durable turn. |
| `message_count` | yes | Count of durable turns/messages Host has accepted into this conversation. |
| `produced_declarations` | only `declaration_ready` | Terminal declaration evidence. Publish is forbidden without it. |
| `failure` | only `failed` | Typed bounded recovery instructions. |
| `request_id` | yes | Host request id for the snapshot; safe for correlation/log lookup. |
| `trace_ids` | no | Client-safe correlation/idempotency ids, never raw transcripts or credential material. |

Locked status enum:

- `created`
- `in_progress`
- `assistant_turn_ready`
- `declaration_extraction_pending`
- `declaration_ready`
- `failed`

The current implementation's legacy `completed` state maps to the locked `declaration_ready` contract status when and
only when valid `produced_declarations` are present. Downstream M1.2/M1.3 consumers should project
`declaration_ready`, not infer terminal success from transport status or from the legacy word `completed`.

### `created` projection decision for Lesser

Host keeps `created` in the locked enum for durable records that exist before the first accepted user turn (for example,
future pre-created/reserved conversations). On the Lesser instance-key route family, Host collapses `created` snapshots
to `in_progress`. The POST path persists a conversation id and accepted user turn before returning to Lesser, so the
first successful Lesser-visible status is `in_progress`, not `created`.

Lesser M3 should therefore project Host `created` as its local `in_progress` row if a status read ever observes it, and
should not wait for an explicit local `created` projection before persisting `host_conversation_id`.

## Invariants

1. Transport is not state. SSE, JSON, and HTTP status codes only deliver state; durable Host records are the source of
   truth.
2. `HTTP 200` and `HTTP 202` are not terminal. Terminal publish readiness requires `status=declaration_ready` plus
   valid `produced_declarations`.
3. `conversation_id` is persisted early. Lesser persists it before returning control to a browser or retry loop.
4. Publish requires declaration evidence. Lesser, Greater, and Sim fail closed without active-conversation
   `produced_declarations`.
5. Recovery is typed and bounded. `failure.recovery.action` is one of `refresh_state`, `retry_same_step`,
   `restart_soul_bootstrap`, or `operator_action`.
6. Idempotency is cross-boundary. `idempotency_key` and `correlation_id` are accepted on POST and echoed through
   `trace_ids` when available; callers must keep them client-safe.
7. Legacy migration is deterministic. Existing `SOUL_REG` / `MINT_CONVERSATION` rows are dry-run planned into
   `HostedGenesisSession` seeds without importing raw transcripts; ambiguous active rows become typed recovery states
   rather than deriving progress from SQS.
8. `SoulAgentMintConversation` is compatibility/projection input after Project 51 M2. It may supply legacy declaration
   JSON or safe migration hints, but it no longer defines user-visible status, retry, billing, recovery, or finalize
   authority for the Lesser instance-key route family.
9. Human-visible evidence is compact. Responses carry ids, status, typed recovery, and declaration summary/evidence; they
   do not expose raw Host credentials or require raw LLM transcripts.
