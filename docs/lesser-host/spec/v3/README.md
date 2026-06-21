# lesser-soul v3 contracts (lesser-host)

This folder contains machine-readable JSON Schema contracts and example fixtures for the lesser-soul v3 protocol
surfaces implemented by `lesser-host`.

- `schemas/` — JSON Schema (draft 2020-12)
- `fixtures/` — example payloads intended for cross-repo consumption (`lesser`, `lesser-body`)

The instance-key bootstrap schemas (`soul-instance-bootstrap.*`) and hosted-genesis durable conversation schema
(`hosted-genesis.conversation.response.schema.json`) are the Host ↔ Lesser server-side contract for managed-instance
soul creation. They describe server-held instance-key calls only; they do not establish a browser-held Host credential
path. The hosted-genesis examples lock `in_progress`, terminal `declaration_ready` with produced declarations, and
`failed` with typed bounded recovery.

The hosted-genesis status enum includes `created` for Host durable records that may be reserved before the first
accepted user turn. Host collapses `created` to `in_progress` on the Lesser instance-key projection because Lesser's
first accepted POST response already has a persisted `conversation_id` and user turn. Lesser consumers should persist
`host_conversation_id` immediately and may project any observed `created` snapshot as `in_progress`.

Managed `@lessersoul.ai` email examples use the Project 37 current-channel form
`<agent-local-id>.<instance-slug>@lessersoul.ai`. Bare `<agent-local-id>@lessersoul.ai`
addresses are legacy inbound aliases only after migration and should not appear as
current public managed channels in new fixtures.

These files are intended to be stable. If you need to change a schema, treat it as a protocol change (reviewed
alongside the spec).
