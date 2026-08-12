# Soul instance recovery contract

This contract gives a Managed instance an honest, read-only path to Host-retained Hosted Genesis declarations. It is
for migration and recovery; it is not a general transcript API and it does not repair or republish Soul registry state.

## Authentication and tenant boundary

Both routes require `Authorization: Bearer <raw_instance_key>`. Host computes `sha256(raw_key)` and looks up the
corresponding active `InstanceKey`; the raw key is never stored, returned, or logged. The key's Slug is authoritative.
Every returned identity, verified domain, `SoulAgentPromotion`, `HostedGenesisSession`, conversation, version row, and
registration artifact must bind to that Slug and agent. Boundary mismatch returns `403`; incomplete or ambiguous
evidence returns `409` and fails closed.

## Routes

### `GET /api/v1/soul/instance/recovery/agents`

Returns a bounded, paginated inventory for the authenticated Managed instance. `limit` defaults to 20 and is capped at
50; `cursor` is the opaque value from `next_cursor`. The inventory contains identity and integrity metadata only. It
never contains `declarations`, conversation messages, provider output, raw keys, signing material, or tenant content.
Only active identities are recovery-inventory members. A correctly tenant/domain/local-ID-bound index entry for an
inactive identity is omitted while the bounded scan continues, so it cannot strand later active records. This is an
eligibility decision, not an integrity downgrade: an explicit detail read for the inactive identity remains `409`, and
any index-binding or recovery-evidence conflict for an active candidate still fails the inventory closed.

### `GET /api/v1/soul/instance/recovery/agents/{agentId}`

Returns the exact JSON declaration object retained in the selected Hosted Genesis conversation plus:

- the exact registration and conversation identifiers used as the source;
- `migration_read_sha256`, computed over the exact returned declaration JSON bytes;
- explicit provenance stating that this digest is **not** a historical publication digest;
- every immutable `SoulAgentVersion` row and checksum-verified versioned object when those artifacts exist;
- checksum verification that the current registration object equals the latest immutable version;
- one of the two success classifications below.

No response contains source conversation messages.

## Classifications

- `published_artifact_verified`: all claimed version rows exist, every canonical versioned S3 object matches its row's
  SHA256, the previous-hash chain is complete, and the current object matches the latest version.
- `legacy_declarations_only`: the active identity claims a positive version and exact graduated Hosted Genesis
  declarations exist, but **all** version rows and both current/versioned registration artifacts are absent. This is an
  honest legacy state, not proof that a historical public artifact existed.

Any partial history, mismatched checksum, broken chain, invalid binding, invalid declaration object, multiple matching
sources, or other ambiguity returns `soul_recovery.integrity_conflict`. There is no successful "unknown" classification.

## Side-effect boundary

Recovery never calls convergence, completion, finalize, publication, versioning, signing, Mint-signer, or on-chain code.
It never writes identity, promotion, Hosted Genesis session, conversation, `SoulAgentVersion`, or S3 registration state.
Normal authentication/security telemetry remains active: `InstanceKey.LastUsedAt` and redacted audit evidence may be
updated. Those telemetry writes contain only hashes and request metadata, never keys, declarations, or messages.

The public Soul registry projection is not a lossless substitute for this contract. A missing public artifact must not
be recreated as alleged history. Any later public publication/re-attestation is a separate, explicitly authorized
forward operation with a new honest version.

## Consumer rules

Body calls Host directly using the managed `LESSER_HOST_INSTANCE_KEY_ARN` credential reference and resolves the raw key
only at runtime. A consumer must validate the schema, recompute the migration-read digest over exact declaration JSON,
retain the classification/source/provenance, and require operator approval before adoption. InstanceKey authority does
not replace Lesser-mediated private self-scope authorization.

Machine-readable schemas and examples live in `docs/spec/v3/`; OpenAPI binds both routes to those artifacts.
