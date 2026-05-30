# Security Policy

## Reporting vulnerabilities

Please report security vulnerabilities privately to security@equalto.ai. Do not
open public issues for vulnerabilities until the maintainers have triaged and
coordinated disclosure.

## Project MCP trust posture

The root `.mcp.json` intentionally registers the `greater_lab` remote MCP server
at `https://lab.theorymcp.ai/equaltoai/agents/greater/mcp`. This endpoint is
first-party EqualToAI/TheoryMCP infrastructure for routed Greater steward-agent
sessions. It is not shipped to Greater CLI consumers as component runtime code,
and it does not change the Svelte component production runtime.

### Ownership and rationale

- `lab.theorymcp.ai` is operated as EqualToAI/TheoryMCP steward-routing
  infrastructure.
- The `greater_lab` route is scoped to the Greater steward identity and exposes
  managed tools such as memory, email, knowledge, and bounded GitHub operations.
- Greater prefers this routed GitHub path for steward work because it records
  agent provenance, narrows tool access through server-side policy, and keeps
  project memory/email/GitHub activity tied to the steward endpoint.

### Trust assumptions

Enabling project MCP in a compatible client connects the local IDE agent to an
external server that controls MCP tool descriptions, resources, and responses.
Users who enable it are trusting:

- DNS and TLS resolution for `lab.theorymcp.ai`;
- the TheoryMCP service implementation and its operational controls;
- server-side authorization that scopes the route to the Greater steward's
  allowed mailbox, memory, knowledge, and GitHub surfaces; and
- the local agent/client to avoid sending secrets or unrelated sensitive data
  through MCP tool calls.

Do not pass local secrets, access tokens, wallet keys, seed phrases, private
customer data, or unrelated repository content through MCP tools. If you do not
accept this trust model, leave project MCP disabled and use normal local/GitHub
workflows instead.

### Endpoint pinning / allowlist recommendation

For non-interactive steward operation, keep `.mcp.json` active and do not add
interactive approval gates. To reduce DNS/TLS subversion risk, enforce an exact
allowlist or pin outside the portable project config where your MCP client,
enterprise policy, proxy, firewall, or OS trust tooling supports it:

- exact origin: `https://lab.theorymcp.ai`;
- exact path: `/equaltoai/agents/greater/mcp`;
- preferred extra control: certificate/SPKI pinning or equivalent endpoint
  identity monitoring, if available without prompting during agent runs.

The repo-level `.mcp.json` remains limited to the portable non-interactive MCP
server declaration (`type` + `url`). Do not broaden allowlists to unrelated
TheoryMCP paths or wildcard domains unless an operator explicitly approves that
larger blast radius.
