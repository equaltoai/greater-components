# Security Policy

## Reporting vulnerabilities

Please report security vulnerabilities privately to security@equalto.ai. Do not
open public issues for vulnerabilities until the maintainers have triaged and
coordinated disclosure.

## Project MCP trust posture

The agent surface is a local, untracked working-tree install rendered from the
published `equaltoai` namespace record through `agent_local_install_plan`.
`.mcp.json`, `GEMINI.md`, and the host configuration directories are ephemeral,
git-ignored files and cannot be committed. The canonical namespace route is
`https://theorymcp.ai/equaltoai/mcp`; rendered client configurations also expose
the Greater steward route as `theorymcp` at
`https://theorymcp.ai/equaltoai/agents/greater/mcp`. These routes are first-party
EqualToAI/TheoryMCP infrastructure for routed steward-agent sessions. They are
not shipped to Greater CLI consumers as component runtime code and do not change
the Svelte component production runtime.

Treat every local copy as ephemeral. Regenerate it from the namespace rather
than editing it as repository configuration, and verify it against the
host-specific `install-marker.json` before enabling MCP. Routing must remain a
deliberate, verifiable trust decision even though the generated files are local.

### Ownership and rationale

- `theorymcp.ai` is operated as EqualToAI/TheoryMCP steward-routing
  infrastructure.
- The `equaltoai` namespace publishes the canonical installation record, and the
  `theorymcp` steward route is scoped to the Greater identity and exposes managed
  tools such as memory, email, knowledge, and bounded GitHub operations.
- Greater prefers this routed GitHub path for steward work because it records
  agent provenance, narrows tool access through server-side policy, and keeps
  project memory/email/GitHub activity tied to the steward endpoint.

### Trust assumptions

Enabling project MCP in a compatible client connects the local IDE agent to an
external server that controls MCP tool descriptions, resources, and responses.
Users who enable it are trusting:

- DNS and TLS resolution for `theorymcp.ai`;
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

For non-interactive steward operation, regenerate and verify the local agent
surface rather than adding interactive approval gates. To reduce DNS/TLS
subversion risk, enforce an exact allowlist or pin where your MCP client,
enterprise policy, proxy, firewall, or OS trust tooling supports it:

- exact origin: `https://theorymcp.ai`;
- exact paths: `/equaltoai/mcp` and `/equaltoai/agents/greater/mcp`;
- preferred extra control: certificate/SPKI pinning or equivalent endpoint
  identity monitoring, if available without prompting during agent runs.

Personal overrides must remain local and untracked. Do not broaden allowlists to
unrelated TheoryMCP paths or wildcard domains unless an operator explicitly
approves that larger blast radius.
