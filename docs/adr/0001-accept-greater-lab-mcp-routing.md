# ADR 0001: Accept and document `greater_lab` MCP steward routing

- **Status:** Accepted
- **Date:** 2026-05-30
- **Issue:** [#716](https://github.com/equaltoai/greater-components/issues/716)
- **Decision owner:** Aron / Greater stewardship governance

## Context

Greater commits a project-scoped `.mcp.json` that registers the remote
`greater_lab` MCP server:

```json
{
	"mcpServers": {
		"greater_lab": {
			"type": "http",
			"url": "https://lab.theorymcp.ai/equaltoai/agents/greater/mcp"
		}
	}
}
```

MCP-enabled developer tools may auto-discover this file. When a contributor or
steward enables the project MCP config, the local IDE agent connects to
`lab.theorymcp.ai`; that remote server controls the MCP tool descriptions,
resources, and responses presented to the agent. This expands the developer-tool
trust surface even though it does not affect Greater's shipped Svelte component
runtime.

The same remote-MCP-routing class was reviewed for SIM-02 and LB-02. Governance
for Project 43 M2 is **accept and document**: keep `.mcp.json`, keep
`greater_lab` as the preferred routed GitHub path, avoid approval gates that
break non-interactive steward operation, and document the residual trust model
plus endpoint pinning recommendation.

## Decision

Keep the root `.mcp.json` and the `greater_lab` remote endpoint active. Treat
`lab.theorymcp.ai` as first-party EqualToAI/TheoryMCP steward-routing
infrastructure for the Greater steward identity.

Document the trust posture in contributor- and agent-facing repo docs:

- ownership of `lab.theorymcp.ai` as EqualToAI/TheoryMCP infrastructure;
- why `greater_lab` is preferred for supported GitHub work (bounded routed tools,
  provenance, memory/email/knowledge continuity);
- trust assumptions for DNS/TLS, TheoryMCP service behavior, and server-side
  authorization;
- informed consent for contributors who enable project MCP; and
- endpoint pinning / exact allowlist recommendations for environments that can
  enforce them without interactive prompts.

Do not add interactive approval gates. Do not move the endpoint out of the
project root while this governance decision stands.

## Endpoint pinning / allowlist control

The desired mitigation for DNS/TLS subversion is an exact non-interactive
allowlist or pin applied by the MCP client, enterprise policy, egress proxy,
firewall, OS trust tooling, or equivalent operator control:

- origin: `https://lab.theorymcp.ai`;
- path: `/equaltoai/agents/greater/mcp`;
- preferred enhancement: certificate/SPKI pinning or endpoint identity monitoring
  where supported without prompting during agent runs.

No concrete pin is added to `.mcp.json` in this ADR because the portable project
config used here declares the remote server by `type` and `url`; adding
unsupported pinning fields could be ignored by clients or trigger compatibility
and approval-prompt behavior. The enforceable pin belongs in the MCP runtime or
network policy layer unless/until the project config format supports a portable,
non-interactive pin.

## Rejected alternatives

### Remove `.mcp.json` / remove `greater_lab`

Rejected. Removing the project MCP config would reduce auto-discovered remote MCP
exposure, but it would also break the accepted steward workflow that relies on
routed memory, email, knowledge, and bounded GitHub tools. It would weaken
provenance for GitHub writes and diverge from the SIM-02/LB-02 governance ruling.

### Add interactive approval gates

Rejected. Approval gates can reduce accidental endpoint use, but Project 43 M2
explicitly requires non-interactive Greater steward operation. Gates that prompt
mid-run would strand routed memory/GitHub/email workflows and make automation
less reliable.

### Move steward routing to an opt-in location

Rejected. A user-scoped or hidden opt-in config would make the trust decision
less visible in the repository and would make the Greater steward environment
less reproducible. The accepted mitigation is transparent documentation,
informed consent, and endpoint pinning/allowlisting outside `.mcp.json`.

## Consequences

- Contributors have a visible repo-level warning before enabling project MCP.
- The Greater steward keeps the preferred routed `greater_lab` GitHub path and
  non-interactive memory/email/knowledge/GitHub operation.
- The residual developer-tool trust surface remains accepted: anyone enabling
  project MCP trusts `lab.theorymcp.ai` and the local client/agent boundary.
- Production component code, adapter contracts, registry checksums, theming
  tokens, and shipped Greater CLI component source are unchanged by this ADR.
