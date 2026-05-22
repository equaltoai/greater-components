# lesser-soul v3 contracts (lesser-host)

This folder contains machine-readable JSON Schema contracts and example fixtures for the lesser-soul v3 protocol
surfaces implemented by `lesser-host`.

- `schemas/` — JSON Schema (draft 2020-12)
- `fixtures/` — example payloads intended for cross-repo consumption (`lesser`, `lesser-body`)

Managed `@lessersoul.ai` email examples use the Project 37 current-channel form
`<agent-local-id>.<instance-slug>@lessersoul.ai`. Bare `<agent-local-id>@lessersoul.ai`
addresses are legacy inbound aliases only after migration and should not appear as
current public managed channels in new fixtures.

These files are intended to be stable. If you need to change a schema, treat it as a protocol change (reviewed
alongside the spec).
