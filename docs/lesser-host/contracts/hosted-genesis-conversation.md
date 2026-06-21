# Hosted genesis durable conversation contract

Project 49 locks the Host-owned durable async contract for Lesser-driven hosted/off-chain soul genesis. The observed
failure this contract fixes was a transport-success response (`HTTP 200` plus a request id) while Host persisted the
conversation as `in_progress` with no declarations and Lesser could not persist a `host_conversation_id`.

This document is a contract artifact for Host, Lesser, Greater, and Sim. M1.1 only locks names and examples; it does
not implement the M2 async worker/queue. M2 implements the Lesser instance-key JSON projection, hosted-genesis worker
queue, idempotent retry semantics, and fail-closed finalize behavior described here.

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
7. Human-visible evidence is compact. Responses carry ids, status, typed recovery, and declaration summary/evidence; they
   do not expose raw Host credentials or require raw LLM transcripts.
