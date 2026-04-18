# API contracts (lesser-host)

This directory contains **pinned, machine-readable contract artifacts** for downstream consumers that generate clients
from `lesser-host` APIs (for example, `greater-components`).

- `openapi.yaml` — OpenAPI snapshot for build-time client/type generation. Do not serve this file at runtime.
- `soul-mint-conversation-sse.json` — Canonical SSE event names and payload contracts referenced by the OpenAPI snapshot.
- `../spec/v3/` — JSON Schema + fixtures for lesser-soul v3 protocol surfaces implemented by `lesser-host`.

Release automation packages these artifacts as GitHub Release assets on every `v*` tag.
