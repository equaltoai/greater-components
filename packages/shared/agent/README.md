# @equaltoai/greater-components-agent

Reusable workflow contracts and package-boundary metadata for agent-first product surfaces.

This package is the narrow home for:

- lifecycle workflow naming and slot/state contracts
- package ownership boundaries across shared workflow modules
- rollout shape metadata that later milestones can implement without reopening package scope

It intentionally does not own full-screen app shells or route composition. That responsibility lives in `faces/agent`.

## Frozen workflow phases

The reusable lifecycle is intentionally ordered as:

1. `request`
2. `review`
3. `declaration`
4. `signing`
5. `graduation`
6. `continuity`

Every slot and state is phase-prefixed so multiple consumers can safely merge data without inventing project-specific field names.
