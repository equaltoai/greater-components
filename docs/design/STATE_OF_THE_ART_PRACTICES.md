# PAI State-of-the-Art Practices Design Document

This document defines high-level goals and requirements for achieving industry-leading observability, privacy, security, and maintainability in PAI, informed by analysis of Claude Code, Codex, and Gemini CLI.

---

## Executive Summary

PAI's generative artifact architecture (scope → spec → implement) differs fundamentally from conversational CLI agents, but shares common requirements for observability, privacy, security, and maintainability. This document outlines goals and requirements adapted to PAI's unique workflow.

---

## 1. Observability

### 1.1 Goals

- **O1**: Full traceability from user requirements through to implemented code
- **O2**: Real-time visibility into workflow progress and health
- **O3**: Post-hoc analysis capability for debugging and improvement
- **O4**: Standardized telemetry compatible with industry tooling

### 1.2 Requirements

#### Artifact Lineage Tracking

| ID   | Requirement                                                                                          | Priority |
| ---- | ---------------------------------------------------------------------------------------------------- | -------- |
| O-R1 | Each artifact (scope, spec, module) must have a unique identifier that links to its parent           | High     |
| O-R2 | Artifact metadata must include: creation timestamp, generating model, input hash, parent artifact ID | High     |
| O-R3 | The system must maintain a manifest file per project tracking all artifacts and their relationships  | High     |
| O-R4 | Artifact files must be immutable once created; modifications create new versions                     | Medium   |

#### Workflow Telemetry

| ID   | Requirement                                                                                             | Priority |
| ---- | ------------------------------------------------------------------------------------------------------- | -------- |
| O-R5 | Each workflow phase must emit structured events: start, progress, completion, failure                   | High     |
| O-R6 | LLM interactions must be logged with: model, token counts (input/output/cached), latency, cost estimate | High     |
| O-R7 | Review loop iterations must be counted and logged per artifact                                          | Medium   |
| O-R8 | Symbolic execution results must be logged with: action type, file path, success/failure, strategy used  | High     |

#### OpenTelemetry Integration

| ID    | Requirement                                                             | Priority |
| ----- | ----------------------------------------------------------------------- | -------- |
| O-R9  | Telemetry must be exportable via OpenTelemetry protocol (OTLP)          | Medium   |
| O-R10 | Telemetry export must be disabled by default (opt-in)                   | High     |
| O-R11 | Local file export must be available as an alternative to network export | Medium   |
| O-R12 | Standard OTEL semantic conventions must be used for resource attributes | Medium   |

#### Session Recording

| ID    | Requirement                                                                   | Priority |
| ----- | ----------------------------------------------------------------------------- | -------- |
| O-R13 | Session recordings must use JSONL format for crash safety and streaming reads | High     |
| O-R14 | Recordings must be organized hierarchically by date and project               | Medium   |
| O-R15 | Session files must support resumption (contain sufficient state to continue)  | High     |

### 1.3 Reference Patterns

- **Codex**: RolloutRecorder with JSONL, date-hierarchical storage (`sessions/YYYY/MM/DD/`)
- **Gemini**: Dual-pipeline telemetry (OTEL + Clearcut), session summaries
- **Claude Code**: Transcript storage with plugin access

---

## 2. Privacy

### 2.1 Goals

- **P1**: User content (requirements, code) never leaves the system without explicit consent
- **P2**: Sensitive data is identified and protected by default
- **P3**: Users have full control over what data is collected and retained
- **P4**: Data retention is bounded and configurable

### 2.2 Requirements

#### Content Protection

| ID   | Requirement                                                                 | Priority |
| ---- | --------------------------------------------------------------------------- | -------- |
| P-R1 | User requirements text must be redacted from telemetry by default           | High     |
| P-R2 | Generated code must never be included in telemetry payloads                 | High     |
| P-R3 | File paths in telemetry must be relative to project root, not absolute      | Medium   |
| P-R4 | Only metadata (lengths, counts, hashes) may be sent without explicit opt-in | High     |

#### Environment Protection

| ID   | Requirement                                                                                                                                    | Priority |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| P-R5 | Environment variables matching sensitive patterns (`*KEY*`, `*SECRET*`, `*TOKEN*`, `*PASSWORD*`) must be filtered from subprocess environments | High     |
| P-R6 | A configurable allowlist/blocklist must control environment variable inheritance                                                               | Medium   |
| P-R7 | Repository identifiers in telemetry must be hashed (SHA256) before transmission                                                                | Medium   |

#### Data Retention

| ID    | Requirement                                                                | Priority |
| ----- | -------------------------------------------------------------------------- | -------- |
| P-R8  | Artifact retention policy must be configurable (max age, max count)        | Medium   |
| P-R9  | Session data must support automatic cleanup based on retention policy      | Medium   |
| P-R10 | A `pai cleanup` command must allow manual purging of local data            | Low      |
| P-R11 | Retention policy must have a minimum floor to prevent accidental data loss | Low      |

#### Consent and Control

| ID    | Requirement                                                           | Priority |
| ----- | --------------------------------------------------------------------- | -------- |
| P-R12 | Telemetry must be disabled by default                                 | High     |
| P-R13 | First-run experience should clearly explain data collection options   | Medium   |
| P-R14 | A `pai privacy` command must show current settings and data locations | Low      |

### 2.3 Reference Patterns

- **Codex**: Privacy-first defaults, `log_user_prompt = false`, environment filtering
- **Gemini**: Prompt redaction, SHA256 hashing of repository names
- **All**: Telemetry opt-in model

---

## 3. Security

### 3.1 Goals

- **S1**: Minimize blast radius of LLM-generated actions
- **S2**: Protect version control and critical system paths
- **S3**: Validate and constrain symbolic execution
- **S4**: Secure credential storage

### 3.2 Requirements

#### Symbolic Execution Sandboxing

| ID   | Requirement                                                                                        | Priority |
| ---- | -------------------------------------------------------------------------------------------------- | -------- |
| S-R1 | File operations must be constrained to project directory and explicit temp paths                   | High     |
| S-R2 | `.git`, `.hg`, `.svn` directories must be read-only by default                                     | High     |
| S-R3 | Bash commands from specs must be validated against an allowlist of safe patterns                   | High     |
| S-R4 | Network access during symbolic execution should be disabled by default                             | Medium   |
| S-R5 | OS-level sandboxing (Landlock on Linux, Seatbelt on macOS) should be available as opt-in hardening | Low      |

#### Spec Validation

| ID    | Requirement                                                           | Priority |
| ----- | --------------------------------------------------------------------- | -------- |
| S-R6  | Module specs must be structurally validated before symbolic execution | High     |
| S-R7  | EDIT actions must require non-empty BEFORE content                    | High     |
| S-R8  | CREATE actions must require non-empty AFTER content                   | High     |
| S-R9  | File paths must be validated as relative and within project bounds    | High     |
| S-R10 | Absolute paths outside project root must be rejected                  | High     |

#### Credential Security

| ID    | Requirement                                                                  | Priority |
| ----- | ---------------------------------------------------------------------------- | -------- |
| S-R11 | Authentication tokens must be encrypted at rest (current: AES-256-GCM)       | High     |
| S-R12 | Credential files must have restrictive permissions (0600)                    | High     |
| S-R13 | OS keyring integration should be available as an alternative to file storage | Medium   |
| S-R14 | Machine-specific key derivation must prevent credential portability          | High     |

#### Input Validation

| ID    | Requirement                                                    | Priority |
| ----- | -------------------------------------------------------------- | -------- |
| S-R15 | Path traversal attempts (`../`) must be detected and blocked   | High     |
| S-R16 | Null bytes and control characters must be stripped from inputs | High     |
| S-R17 | Command injection patterns must be detected in bash arguments  | Medium   |

### 3.3 Reference Patterns

- **Codex**: Dual-layer sandboxing, `.git` protection, command allowlists
- **Gemini**: Multi-platform sandbox profiles (permissive/restrictive × open/closed)
- **Claude Code**: Hook-based dynamic analysis (PreToolUse validation)

---

## 4. Maintainability

### 4.1 Goals

- **M1**: Users can resume interrupted workflows without data loss
- **M2**: Workflow state is transparent and inspectable
- **M3**: Configuration is hierarchical and well-documented
- **M4**: Errors are recoverable with clear guidance

### 4.2 Requirements

#### Workflow Resumption

| ID   | Requirement                                                                           | Priority |
| ---- | ------------------------------------------------------------------------------------- | -------- |
| M-R1 | The `project` command must support resuming from a partially completed scope          | High     |
| M-R2 | Resume must be possible at phase granularity (skip completed phases)                  | High     |
| M-R3 | Resume must be possible at module granularity (skip completed modules)                | Medium   |
| M-R4 | A checkpoint manifest must track: completed phases, completed modules, artifact paths | High     |
| M-R5 | The `--resume` flag must accept: `latest`, scope artifact path, or checkpoint ID      | High     |

#### State Transparency

| ID   | Requirement                                                          | Priority |
| ---- | -------------------------------------------------------------------- | -------- |
| M-R6 | A `pai status` command must show current workflow state and progress | Medium   |
| M-R7 | Artifact manifest must be human-readable (YAML or JSON)              | Medium   |
| M-R8 | `--dry-run` mode must show planned actions without executing         | Medium   |

#### Configuration

| ID    | Requirement                                                                                | Priority |
| ----- | ------------------------------------------------------------------------------------------ | -------- |
| M-R9  | Configuration must follow hierarchical precedence: CLI > Env > Workspace > User > Defaults | High     |
| M-R10 | User-level configuration must be supported at `~/.pai/config.yaml`                         | High     |
| M-R11 | Workspace-level configuration must be supported at `.pai/config.yaml`                      | High     |
| M-R12 | Configuration schema must be documented and validated on load                              | Medium   |
| M-R13 | Named profiles must allow predefined configuration sets                                    | Low      |

#### Error Recovery

| ID    | Requirement                                                               | Priority |
| ----- | ------------------------------------------------------------------------- | -------- |
| M-R14 | Failed modules must not block subsequent independent modules              | Medium   |
| M-R15 | Module healing attempts must be bounded (max retries configurable)        | High     |
| M-R16 | Failed workflows must produce actionable error summaries                  | High     |
| M-R17 | A `pai diagnose` command should analyze recent failures and suggest fixes | Low      |

### 4.3 Reference Patterns

- **Codex**: Session listing with pagination, cursor-based resume
- **Gemini**: Checkpoint system (save/restore named states), retention policies
- **Claude Code**: `/resume` command, 24hr context expiry

---

## 5. Artifact Storage Design

### 5.1 Proposed Directory Structure

```
.pai/
├── config.yaml                     # Workspace configuration
├── manifest.yaml                   # Artifact lineage manifest
├── scopes/
│   └── scope_<timestamp>.md        # Scope artifacts
├── specs/
│   └── <scope_id>/
│       ├── phase_1_spec.md         # Phase-specific specs
│       └── phase_2_spec.md
├── checkpoints/
│   └── <scope_id>.yaml             # Resume checkpoints
├── logs/
│   ├── workflow.jsonl              # Workflow events
│   ├── llm_interactions.jsonl      # LLM call logs
│   └── symbolic_execution.jsonl    # Execution logs
└── sessions/
    └── <session_id>/
        └── session_complete.json   # Full session data
```

### 5.2 Manifest Schema

```yaml
# .pai/manifest.yaml
version: 1
project_id: <uuid>
created: <timestamp>
last_updated: <timestamp>

artifacts:
  - id: scope_20250115_143022
    type: scope
    path: .pai/scopes/scope_20250115_143022.md
    created: <timestamp>
    model: claude-opus-4-5-20251101
    input_hash: <sha256>
    phases: 5

  - id: spec_phase1_20250115_143530
    type: spec
    path: .pai/specs/scope_20250115_143022/phase_1_spec.md
    parent: scope_20250115_143022
    phase: 1
    created: <timestamp>
    model: claude-opus-4-5-20251101
    modules: 3

checkpoints:
  - scope_id: scope_20250115_143022
    completed_phases: [1, 2]
    current_phase: 3
    completed_modules: [1]
    current_module: 2
    last_updated: <timestamp>
```

### 5.3 Checkpoint Schema

```yaml
# .pai/checkpoints/<scope_id>.yaml
scope_artifact: .pai/scopes/scope_20250115_143022.md
scope_id: scope_20250115_143022
total_phases: 5

phases:
  - index: 0
    name: 'Phase 1: Core Setup'
    status: completed # pending | in_progress | completed | failed
    spec_artifact: .pai/specs/.../phase_1_spec.md
    modules:
      - index: 0
        name: 'Module 1: Config'
        status: completed
      - index: 1
        name: 'Module 2: Types'
        status: completed

  - index: 1
    name: 'Phase 2: API Layer'
    status: in_progress
    spec_artifact: .pai/specs/.../phase_2_spec.md
    modules:
      - index: 0
        name: 'Module 1: Client'
        status: completed
      - index: 1
        name: 'Module 2: Handlers'
        status: failed
        error: 'BEFORE content not found'

  - index: 2
    name: 'Phase 3: Database'
    status: pending

last_successful:
  phase: 1
  module: 1
  timestamp: <timestamp>
```

---

## 6. Configuration Schema

### 6.1 User Configuration (`~/.pai/config.yaml`)

```yaml
# Default models
models:
  scope: claude-opus-4-5-20251101
  spec: claude-opus-4-5-20251101
  implement: claude-haiku-4-5-20251001

# Privacy settings
privacy:
  telemetry_enabled: false
  log_prompts: false
  log_generated_code: false

# Security settings
security:
  sandbox_bash_commands: true
  protect_vcs_directories: true
  credential_store: file # file | keyring

# Retention settings
retention:
  max_age_days: 30
  max_artifacts: 100
  min_retention_days: 1

# Workflow settings
workflow:
  max_healing_attempts: 3
  module_timeout_minutes: 30
  phase_timeout_minutes: 60
```

### 6.2 Environment Variable Mapping

| Setting                          | Environment Variable    |
| -------------------------------- | ----------------------- |
| `privacy.telemetry_enabled`      | `PAI_TELEMETRY_ENABLED` |
| `privacy.log_prompts`            | `PAI_LOG_PROMPTS`       |
| `security.sandbox_bash_commands` | `PAI_SANDBOX_BASH`      |
| `models.scope`                   | `PAI_SCOPE_MODEL`       |
| `models.spec`                    | `PAI_SPEC_MODEL`        |
| `models.implement`               | `PAI_IMPLEMENT_MODEL`   |

---

## 7. Implementation Priorities

### Phase 1: Alpha Critical (Before Limited Release)

| ID      | Requirement               | Rationale                              |
| ------- | ------------------------- | -------------------------------------- |
| M-R1    | Resume from partial scope | Users lose hours of work on failure    |
| M-R4    | Checkpoint manifest       | Required for M-R1                      |
| S-R2    | VCS directory protection  | Prevent catastrophic git corruption    |
| S-R6-10 | Spec validation           | Catch malformed specs before execution |
| O-R13   | JSONL session format      | Crash safety                           |

### Phase 2: Alpha Feedback (During Alpha)

| ID      | Requirement           | Rationale                  |
| ------- | --------------------- | -------------------------- |
| M-R2    | Phase-level resume    | Finer-grained recovery     |
| M-R9-11 | Hierarchical config   | User/workspace preferences |
| P-R5    | Environment filtering | Prevent secret leakage     |
| O-R1-3  | Artifact lineage      | Debugging and traceability |
| M-R8    | Dry-run mode          | Preview before execution   |

### Phase 3: Post-Alpha (Production Hardening)

| ID      | Requirement          | Rationale                    |
| ------- | -------------------- | ---------------------------- |
| O-R9-12 | OpenTelemetry export | Enterprise observability     |
| S-R5    | OS-level sandboxing  | Defense in depth             |
| S-R13   | Keyring integration  | Enhanced credential security |
| P-R8-9  | Retention policies   | Long-term data management    |
| M-R13   | Named profiles       | CI/CD and enterprise use     |

---

## 8. Success Metrics

| Goal            | Metric                        | Target                                    |
| --------------- | ----------------------------- | ----------------------------------------- |
| Observability   | Artifact lineage completeness | 100% of artifacts traceable to parent     |
| Observability   | Session recoverability        | 100% of interrupted sessions resumable    |
| Privacy         | Default data exposure         | Zero PII/code in telemetry without opt-in |
| Security        | Spec validation coverage      | 100% of specs validated before execution  |
| Security        | VCS protection                | Zero accidental .git modifications        |
| Maintainability | Resume success rate           | >95% of interrupted workflows resumable   |
| Maintainability | Config validation             | 100% of configs validated on load         |

---

## References

### Source Analysis Reports

- `claude-code-analysis/reports/` - Claude Code sandboxing, session logging, data collection
- `codex-analysis/reports/` - Codex sandboxing, session logging, privacy analysis
- `gemini-analysis/reports/` - Gemini sandboxing, session logging, telemetry analysis

### Synthesis Reports

- `.pai/synthesis-reports/TELEMETRY_PRACTICES.md`
- `.pai/synthesis-reports/PRIVACY_AND_SECURITY.md`
- `.pai/synthesis-reports/CONFIGURATION_PATTERNS.md`
- `.pai/synthesis-reports/IDENTITY_AND_SESSION_MANAGEMENT.md`
- `.pai/synthesis-reports/ERROR_REPORTING_MECHANISMS.md`

### Overview Documents

- `cli-agent-practices-overview/` - Synthesized best practices across all analyzed tools
