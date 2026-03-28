# @equaltoai/greater-components-agent

Reusable workflow contracts and package-boundary metadata for agent-first product surfaces.

This package is the narrow home for:

- lifecycle workflow naming and slot/state contracts
- package ownership boundaries across shared workflow modules
- rollout shape metadata that later milestones can implement without reopening package scope

It intentionally does not own full-screen app shells or route composition. That responsibility lives in `faces/agent`.
