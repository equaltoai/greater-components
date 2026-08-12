# Hosted Genesis typed-candidate conversation contract

Project 48 M11 supersedes the earlier transcript-completion design with a typed five-body candidate constructed inside
the AppTheory MicroVM. The Host-owned `HostedGenesisSession` DynamoDB row remains the source of truth. Earlier projects
locked the durable async contract for Lesser-driven hosted/off-chain Soul genesis. The observed
failure this contract fixes was a transport-success response (`HTTP 200` plus a request id) while Host persisted the
conversation as `in_progress` with no declarations and Lesser could not persist a `host_conversation_id`.

This document is a contract artifact for Host, Lesser, Greater, and Sim. Project 49 M1.1 locked names and examples.
Project 50 Milestone A implements the Host-owned source-of-truth model/repository foundation. Project 51 M2 routes
the Lesser instance-key runtime through `HostedGenesisSession` first: POST commits the session and idempotency/debit
ledger before transport execution, GET/status projects from the session, completion/finalize gates read declaration
checkpoint readiness and terminal publication truth from the session, and `SoulAgentMintConversation` is a bounded
public projection only.

## Recovery contract is deliberately separate

`GET /api/v1/soul/instance/recovery/agents` and
`GET /api/v1/soul/instance/recovery/agents/{agentId}` are direct Body-to-Host recovery reads documented in
`soul-instance-recovery.md`. They reuse hash-only InstanceKey authentication, but they do not extend or replace the
Lesser-mediated private self-scope conversation routes below. Recovery inventory never returns conversation content;
recovery detail returns only exact produced declarations after graduated promotion, tenant, source, version-chain, and
S3 checksum verification. It never replays this state into completion/finalize/publication or mutates Hosted Genesis.

## Authoritative Lesser route family

The Lesser server calls Host with `instanceKeyAuth`; the browser never receives raw Host credentials or Host
control-plane session tokens.

- `POST /api/v1/soul/instance/agents/register/{id}/mint-conversation`
  - JSON-authoritative for Lesser.
  - Creates or appends a hosted-genesis turn and returns the current durable status envelope.
  - During owner review, the request carries a structural `candidate_action` (`affirm` or `edit`) bound to the exact
    candidate revision, candidate hash, and review hash. Free-form affirmation phrases have no authority.
  - `HTTP 200` or `HTTP 202` is **transport success only**. It is not terminal completion.
  - Lesser must persist `conversation.conversation_id` as soon as it appears, even when `conversation.status` is
    `in_progress`.
- `GET /api/v1/soul/instance/agents/register/{id}/mint-conversation/{conversationId}`
  - Durable status read.
  - Source of truth for polling, resume, declaration readiness, and typed failure recovery.
- `POST /api/v1/soul/instance/agents/register/{id}/mint-conversation/{conversationId}/complete`
  - Progress-safe read/convergence gate for Lesser; it does not start provider or extraction work.
  - `HTTP 202` returns the compact HostConversation progress envelope while MicroVM phase work is still running.
  - `HTTP 200` returns the same compact HostConversation envelope with `status=declaration_ready` only when valid
    produced declarations exist; it never returns raw transcript fields.

SSE may remain available for portal/native Host UI routes, but SSE is not the authoritative completion mechanism for
the Lesser instance-key path.

## Host-owned source-of-truth row

Milestone A introduces `HostedGenesisSession` as the Host DynamoDB/TableTheory business record for hosted/off-chain
genesis. MicroVM session registry, memory, disk, and lifecycle data are execution/cache state only; they are
reconstructible from the Host row and never become the user-visible source of truth. Host persists registry cache through
the repo-owned `HostedGenesisMicroVMExecution` model and `store.NewHostedGenesisMicroVMRegistry` adapter, not through
AppTheory's generic `runtimemicrovm.SessionRegistryRecord` TableTheory model.

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

Successful publication advances the authoritative session from `declaration_ready` to the single explicit terminal
state `published`. Before the irreversible publication path starts, Host reserves a bounded publication checkpoint on
the session: registration/conversation/agent ids, the exact registration SHA256, version, and issued timestamp. After
the publication and graduation side effects succeed, Host atomically writes `status=published` plus `published_at` to
the session and writes `status=published` to the `SoulAgentMintConversation` public projection under the session's
expected `version` and `status=declaration_ready` conditions. `published` and `failed` are terminal; only
`declaration_ready -> published` is legal from the publish-ready state.

An interrupted publish does not create a second version. A retry must reproduce the reserved digest, version, and
issued timestamp before the existing version/artifacts can be repaired and the remaining finalization work can
continue. Prototype rows finalized before this checkpoint existed converge only when Host can bind an exact graduated
promotion and exact `SoulAgentVersion` record to the same tenant-scoped session registration, conversation, agent, and
published version. The promotion conversation state must be the prototype's prior `completed` marker or the current
`published` marker; other states are not publication evidence. An active identity alone is insufficient. Exact reads, recovery, finalize/preflight replay, and
agent lists apply this bounded convergence; no Body override, status alias, or indefinite compatibility fallback is
part of the contract.

For the production Lesser instance-key path, Host stores a versioned, hashed typed declaration candidate as the source
of truth. The AppTheory MicroVM exposes exactly one section-specific provider tool at a time for identity, philosophy,
discipline, boundaries, and soul. Accepted tool submissions are normalized and validated immediately, then checkpointed
under tenant/session/turn/candidate guards through TableTheory. Invalid submissions return machine-readable
section/path/code errors and retry only the current section. Every tool payload must repeat the exact current
`candidateRevision` and `candidateHash`; missing, stale, mismatched, or unknown payload fields fail closed before any
candidate mutation. Host rejects section fields above their published limits so provider repair can compress the
current section; it never silently truncates owner-supplied declaration content. The VM actor never rebuilds the
candidate from a transcript.

The owner review is rendered deterministically as a stable human header plus a byte-counted, delimited copy of the
exact canonical JSON. The canonical block is reversible byte-for-byte without a provider and losslessly exposes every
semantic value authenticated by `candidate_hash`, including all notes, self-description/capability/transparency fields,
derived boundaries, refusals, and adversarial-review evidence. `candidate_hash` authenticates those canonical bytes;
`review_hash` separately authenticates the complete `review_text`. The full lossless payload is authoritative at
`declaration_candidate.review.review_text`; clients must not substitute a potentially truncated transcript-message
projection. Structural affirmation binds the candidate revision/hash and review hash; any edit invalidates the prior
review and affirmation, advances the revision, and reopens only the selected section. The revised section regenerates
the deterministic review and bindings; actions from the prior review fail closed. Finalization revalidates and
publishes the exact canonical candidate bytes. **No provider request occurs after affirmation.**
The fifth accepted tool also needs no provider-generated review prose: Host projects the stored deterministic review
directly, including after process/VM recovery from the accepted review checkpoint.
When the actor finalizes, it advances the same durable conversation to `declaration_ready` with `produced_declarations`
under Host status/version/checkpoint guards; the registration-scoped instance-key status read projects that terminal
declaration evidence without publishing as a read side effect. Lesser polls Host status until `declaration_ready`, then
calls the explicit instance-key `/finalize` publish route (`PublishHostedSoul`) to publish the hosted/off-chain
registration from the same Host state. A successful finalize response and every subsequent exact read, recovery read,
and list summary return `status=published`, `published_version`, and `published_at`; they do not return declarations,
polling guidance, or recovery actions.

### Idempotency ledger semantics

The durable `HostedGenesisSession` turn ledger is the Host source of truth for retry semantics. For a caller-provided
`idempotency_key`, Host records the request hash and accepted `turn_id` once. A retry with the same idempotency key and
same request hash replays the existing turn and must not append another user turn, advance `message_count` or
`latest_turn_id`, enqueue duplicate user-visible work, or debit credits again. A retry with the same idempotency key and
a different request hash fails closed as an idempotency conflict.

SQS, Host-owned MicroVM registry/cache state, AI-worker delivery, and HTTP/SSE transport state are reconstructible
execution details. They do not determine user-visible progress, retry, finalize readiness, or billing state. If queue
delivery or MicroVM cache is missing or stale, status remains the compact `HostedGenesisSession` projection and
retry/finalize decisions continue to fail closed from that Host row.

### M11 typed-candidate billing and hard cutover

Project 48 M11 keeps billing at the Host accepted-turn boundary. Phase-local provider work and deterministic finalization
ride the same accepted-turn ledger entry and do not create a second debit or idempotency row. This is a hard cutover:
production whole-transcript extraction, extraction target states, phrase-only affirmation, and compatibility fallback
paths do not exist. Existing lanes without typed candidate state fail closed with `restart_soul_bootstrap`; Host does not
reconstruct or migrate them through an extractor.

### Hosted instance-trust declarations and restart recovery

For the instance-key hosted/off-chain authority model, an agent may complete a valid genesis conversation without
declaring any explicit capability. Host preserves the model-produced declaration shape as `"capabilities": []` and
does not inject a registration capability, a compatibility fallback, or the retired
`simulacrum.hosted-first-default` placeholder into the produced evidence. The registration capability list is prompt
context only. Wallet-principal conversations retain their existing requirement for at least one valid capability.
Every produced declaration still requires a valid self-description, at least one boundary, and a non-null
transparency object.

Declaration validation failures cross the worker and API boundary only as stable field codes, never provider errors,
raw model output, transcripts, or private declaration text. Examples are `self_description.invalid`,
`capabilities.capability.invalid`, `capabilities.scope.invalid`,
`capabilities.claim_level.invalid`, `capabilities.last_validated.invalid`, `boundaries.required`, and
`transparency.required`. Provider capability evidence is deterministically canonicalized into Host identifiers;
malformed rows are not silently dropped. A terminal failure's public message is a fixed code-derived message such as
`Produced declarations are invalid.`; the optional recovery reason is limited to a single stable field code.

When produced declarations are missing or invalid, Host writes the terminal `HostedGenesisSession` and the
`SoulAgentMintConversation` public projection together. `restart_soul_bootstrap` is not a successful no-op:
the recover endpoint returns an actionable `409` conflict with `recovery_action=restart_soul_bootstrap` and the
restart path `/api/v1/soul/instance/agents/register/begin`. Re-beginning the same domain/local id after that failure
creates a fresh registration/conversation lane; a stale failed registration is not replayed.

## HostConversation envelope

Machine-readable schema:

- `docs/spec/v3/schemas/hosted-genesis.conversation.response.schema.json`

Examples:

- `docs/spec/v3/fixtures/hosted-genesis.conversation.in-progress.example.json`
- `docs/spec/v3/fixtures/hosted-genesis.conversation.assistant-turn-ready.example.json`
- `docs/spec/v3/fixtures/hosted-genesis.conversation.completed-declaration-ready.example.json`
- `docs/spec/v3/fixtures/hosted-genesis.conversation.published.example.json`
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
| `messages` | no | Bounded private hosted-genesis transcript projection for Lesser same-origin relay and current-section recovery. Entries expose only `id`, `role`, bounded/redacted `content`, `order`, and `created_at` when Host has a safe timestamp. |
| `messages_truncated` | no | `true` when Host bounded the projected transcript by entry count or content length. |
| `messages_redacted` | no | `true` when one or more secret-shaped message bodies were replaced with the fixed redaction marker. |
| `declaration_candidate` | active typed lanes | Bounded candidate progress: version, phase, current/completed sections, revision, canonical hash, and deterministic review checkpoint when present. Canonical declaration bodies and provider-attempt records are not projected. |
| `produced_declarations` | only `declaration_ready` | Terminal declaration evidence. Publish is forbidden without it. |
| `failure` | only `failed` | Typed bounded recovery instructions. |
| `published_version` | only `published` | Exact durable Soul registration version produced by this session. |
| `published_at` | only `published` | Host terminal-publication timestamp. |
| `request_id` | yes | Host request id for the snapshot; safe for correlation/log lookup. |
| `trace_ids` | no | Client-safe correlation/idempotency ids, never raw transcripts or credential material. |

Locked status enum:

- `created`
- `in_progress`
- `assistant_turn_ready`
- `declaration_ready`
- `published`
- `failed`

`declaration_ready` is publish-ready and still actionable. It is not successful publication. `published` is the only
successful terminal publication status; clients proceed to agent read/list surfaces and must not repeat complete or
finalize preflight after observing it.


### Bounded private transcript projection

While a conversation is active, and when `conversation.status=failed`, the Lesser instance-key route family may include `conversation.messages`
so Lesser can relay the hosted genesis dialogue through its same-origin UI without giving the browser Host credentials.
This is a private server-to-server projection, not a new source of truth: `HostedGenesisSession` remains authoritative for
ids, status, retry, billing, recovery, and declaration readiness. Host sources the transcript from decoded
`SoulAgentMintConversation.Messages` only after the conversation id and agent id match the session, and omits the field
when the public projection row is absent, malformed, or mismatched. Credential-shaped material is redacted per entry so one
unsafe historical message cannot erase otherwise safe operator recovery context.

Transcript bounds are part of the contract: at most 64 entries are projected, each entry has at most 8192 characters of
`content`, and `messages_truncated=true` indicates that Host bounded the projection. Entries contain only:

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | yes | Opaque stable ordinal id (`msg_000001`, `msg_000002`, ...). |
| `role` | yes | `user` or `assistant`; system/tool/internal roles are not projected. |
| `content` | yes | Bounded client-visible turn text. |
| `order` | yes | 1-based absolute order in the stored hosted-genesis transcript. |
| `created_at` | no | Present only when Host has a safe durable timestamp, currently user turn acceptance time from the session turn ledger. |
| `truncated` | no | Present and true only when this entry's content was bounded. |
| `redacted` | no | Present and true only when `content` is the fixed `[redacted: sensitive content]` marker. |

`messages` never carries provider secrets, Instance API keys, bearer-token values, wallet/signing material, SSM/AWS
details, MicroVM endpoint tokens, target-account IAM details, or raw infrastructure state. Host detects value-shaped
credentials (rather than broad words such as "private key" or "bearer") and replaces only the affected message with a
fixed marker. `messages_redacted=true` makes that loss explicit; `messages_truncated=true` independently signals count or
length bounding.

### Content-free failure class

`failure.class` is optional for legacy/non-provider failures and is written by the official Hosted Genesis MicroVM actor
for provider-backed failures. It is metadata-only and one of `provider_timeout`, `provider_canceled`,
`provider_api_failure`, `invalid_provider_output`, or `parse_validation_failure`. Provider error text, response bodies,
tool arguments/results, transcript text, and declarations never enter this field. `failure.code` continues to own
recovery semantics; the class only locates the safe failure boundary for operators when runtime log delivery is absent.

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
2. `HTTP 200` and `HTTP 202` are not terminal by themselves. Publish readiness requires
   `status=declaration_ready` plus valid `produced_declarations`; successful publication requires durable
   `status=published` plus its exact publication checkpoint.
3. `conversation_id` is persisted early. Lesser persists it before returning control to a browser or retry loop.
4. Publish requires declaration evidence. Lesser, Greater, and Sim fail closed without active-conversation
   `produced_declarations`.
5. Recovery is typed and bounded. `failure.recovery.action` is one of `refresh_state`, `retry_same_step`,
   `restart_soul_bootstrap`, or `operator_action`.
6. Idempotency is cross-boundary. `idempotency_key` and `correlation_id` are accepted on POST and echoed through
   `trace_ids` when available; callers must keep them client-safe.
7. Finalized-but-stale prototype convergence is deterministic. Only exact tenant/session-bound promotion and version
   evidence can advance an existing row to `published`; ambiguous rows remain fail-closed and actionable rather than
   being hidden by a client override.
8. `SoulAgentMintConversation` is a public projection after Project 51 M2. It may supply the bounded private
   transcript projection for Lesser display and receives the exact finalized candidate bytes in the same guarded
   transaction as `HostedGenesisSession`; it does not reconstruct typed candidate state or define user-visible status,
   retry, billing, recovery, or finalize authority for the Lesser instance-key route family.
9. Human-visible evidence is compact. Responses carry ids, status, typed recovery, optional bounded `messages`, and
   declaration summary/evidence; they do not expose raw Host credentials, raw Instance API keys, provider secrets,
   signing material, SSM/AWS details, MicroVM endpoint tokens, target-account details, or raw infrastructure state.

## Project 48 M11 conversation-lifetime MicroVM actor contract

ADR 0010 locks the Hosted Genesis MicroVM actor contract for the Project 48 M11 implementation line. The public
Lesser-facing route family above remains unchanged, but the execution contract for #942/#943 is now:

- first accepted user turn launches or resumes an AppTheory MicroVM session with `session_id=conversation_id`;
- Host remains control/gateway/observer and durable `HostedGenesisSession` source of truth;
- the in-VM runtime owns provider SDK session/trace, turn sequencing, phase-local typed construction,
  ask/wait/revise/finalize/fail decisions, and safe checkpoint metadata;
- Host uses only AppTheory MicroVM controller/provider/session operations (`Run`, `Get`, `Invoke`, `Suspend`, `Resume`,
  `Terminate`, and safe registry/reconstruction) for MicroVM lifecycle; no raw AWS MicroVM SDK path or local framework
  substitute is allowed;
- direct VM writes to Host truth are allowed only through status/version/checkpoint conditional guards plus
  tenant/auth/id envelope checks; retry budgets, billing/debit policy, publication, and final governed commits remain
  Host-owned;
- if controller reconstruction observes a terminal/expired MicroVM before Host truth has advanced, Host records a loud
  retryable `failed` state with `failure.code=microvm_unavailable`; recovery may relaunch the actor only after a
  persisted VM-authored checkpoint validates as a completed assistant actor step for a prior turn in the same durable
  turn ledger,
  the current accepted turn is the last ledger entry, and both the session and that entry carry the exact deterministic
  current-turn input checkpoint reference; the relaunch binds the official AppTheory MicroVM `Run` to that same current
  turn, preserves its ledger/input/charge, decrements the retry budget, clears stale execution refs, and remains
  conditional on the failed Host status/version;
  a missing or invalid checkpoint is an actionable conflict, never a silent success and never a Host-run provider loop;
- `MaximumDurationSeconds` caps one active in-VM provider/declaration step. The actor deliberately has no
  `ProviderIdlePolicy`: AppTheory/AWS endpoint-idle traffic is not a guest-work signal. Durable typed checkpoints and
  explicit relaunch/replay semantics cover human wait gaps;
- a `provider_timeout` `retry_same_step` prepares a fresh official AppTheory runtime through `Get` / `Terminate` /
  `Run` / readiness `Get`, using the deployment-pinned image version and execution role while retaining the same Host
  conversation, accepted turn, and durable transcript. Host atomically binds that content-free lifecycle identity to
  the retry/debit write before one `Invoke`; preparation failure consumes neither retry nor debit;
- until live lab evidence proves process-memory preservation across human-scale suspend/resume, process memory is an
  optimization only, never the recovery source of truth.

The prior completed VM checkpoint plus the current durable input checkpoint and final turn-ledger entry is sufficient
for `microvm_unavailable` replay because the actor rebuilds from the last completed state and consumes the already-paid,
already-accepted current turn. A provider that dies before producing current-turn SDK output cannot author a
current-turn VM checkpoint. Requiring `VMCheckpoint.latest_turn_id == HostedGenesisSession.latest_turn_id` therefore
made the observer-authored `retry_same_step` action unreachable for exactly that failure. Recovery instead requires the
VM checkpoint turn to precede the current ledger tail and fails closed for a first turn with no prior completed actor
checkpoint, malformed or cross-conversation refs, invalid ledger/input state, non-completed checkpoint transitions, or
checkpoint sequences ahead of the durable session version. Recovery never appends another owner message or turn,
debits another charge, resumes/nudges the dead provider, or selects a synchronous/local fallback.
