# Agent Face Getting Started

`faces/agent` is the face-level home for agent-first workflow screens.

At the current milestone, this package freezes composition boundaries rather than shipping the full product UI. Use it when you need:

- route-shell metadata for agent-first workspaces
- a stable home for future request, review, signing, graduation, and continuity screens
- a composition layer that sits on top of `shared/agent`, `shared/messaging`, `shared/notifications`, `shared/chat`, and `shared/soul`

## Installation

```bash
greater add faces/agent
greater add shared/agent
```

## Export surfaces

```ts
import { AGENT_FACE_PACKAGE_ROLE } from '@equaltoai/greater-components-agent-face';
import {
	AGENT_PACKAGE_BOUNDARIES,
	AGENT_WORKFLOW_IMPLEMENTATION_SHAPE,
} from '@equaltoai/greater-components-agent';
```

Aggregate consumers can use:

```ts
import { AGENT_FACE_PACKAGE_ROLE } from '@equaltoai/greater-components/faces/agent';
import { AGENT_PACKAGE_BOUNDARIES } from '@equaltoai/greater-components/shared/agent';
```

## Current scope

This package intentionally owns composition and route-shell concerns only. Workflow naming and reusable lifecycle contracts live in `shared/agent`.
