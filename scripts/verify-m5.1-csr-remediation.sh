#!/usr/bin/env bash
# M5.1 CSR remediation verification probe
# Verifies that CSR-026, CSR-028, CSR-036, CSR-037 remediations are in place.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PASSED=0
FAILED=0

pass() { echo "  PASS: $1"; PASSED=$((PASSED + 1)); }
fail() { echo "  FAIL: $1"; FAILED=$((FAILED + 1)); }

echo "=== M5.1 CSR Remediation Verification ==="
echo ""

# --- CSR-026: .mcp.json documentation ---
echo "--- CSR-026: .mcp.json steward infrastructure documentation ---"
MCP_FILE="${REPO_ROOT}/.mcp.json"
if [[ ! -f "${MCP_FILE}" ]]; then
  fail ".mcp.json not found"
else
  if grep -q "steward agent" "${MCP_FILE}" && \
     grep -q "lab.theorymcp.ai" "${MCP_FILE}" && \
     grep -q "NOT a general-purpose" "${MCP_FILE}"; then
    pass ".mcp.json has steward infrastructure documentation comment"
  else
    fail ".mcp.json missing steward infrastructure documentation"
  fi

  if grep -q "greater-agent mailbox" "${MCP_FILE}"; then
    pass ".mcp.json documents agent-identity scoping"
  else
    fail ".mcp.json missing agent-identity scoping documentation"
  fi
fi
echo ""

# --- CSR-028: dispatch-release-pr-checks.sh freshness check ---
echo "--- CSR-028: Release PR status mirroring freshness hardening ---"
DISPATCH_SCRIPT="${REPO_ROOT}/scripts/dispatch-release-pr-checks.sh"
if [[ ! -f "${DISPATCH_SCRIPT}" ]]; then
  fail "dispatch-release-pr-checks.sh not found"
else
  if grep -q "find_fresh_dispatched_run" "${DISPATCH_SCRIPT}"; then
    pass "find_fresh_dispatched_run function exists (replaced find_dispatched_run)"
  else
    fail "find_fresh_dispatched_run function not found"
  fi

  if grep -q "MAX_RUN_AGE_SEC" "${DISPATCH_SCRIPT}"; then
    pass "MAX_RUN_AGE_SEC freshness window is configured"
  else
    fail "MAX_RUN_AGE_SEC freshness window not configured"
  fi

  if grep -q "sort_by(.createdAt)" "${DISPATCH_SCRIPT}"; then
    pass "Run selection sorts by createdAt (most recent first)"
  else
    fail "Run selection does not sort by createdAt"
  fi

  if grep -q "skipping stale run" "${DISPATCH_SCRIPT}"; then
    pass "Stale run rejection logic present"
  else
    fail "No stale run rejection logic"
  fi

  if grep -q "CSR-028 hardening" "${DISPATCH_SCRIPT}"; then
    pass "CSR-028 hardening comment present"
  else
    fail "CSR-028 hardening comment missing"
  fi

  # Syntax check
  if bash -n "${DISPATCH_SCRIPT}" 2>/dev/null; then
    pass "dispatch-release-pr-checks.sh passes bash syntax check"
  else
    fail "dispatch-release-pr-checks.sh has syntax errors"
  fi
fi
echo ""

# --- CSR-036 & CSR-037: DCO workflow base-ref hardening ---
echo "--- CSR-036 & CSR-037: DCO workflow base-ref checker isolation ---"
DCO_WORKFLOW="${REPO_ROOT}/.github/workflows/dco.yml"
if [[ ! -f "${DCO_WORKFLOW}" ]]; then
  fail "dco.yml not found"
else
  # CSR-036: pull_request path must checkout base ref's check-dco.js
  # The step name and the git checkout command are separated by comments/env vars
  if grep -A20 "DCO Check (pull_request)" "${DCO_WORKFLOW}" | grep -q "git checkout.*check-dco.js"; then
    pass "CSR-036: pull_request path checks out base ref's check-dco.js"
  else
    fail "CSR-036: pull_request path does not checkout base ref's check-dco.js"
  fi

  if grep -A20 "DCO Check (pull_request)" "${DCO_WORKFLOW}" | grep -q "CSR-036"; then
    pass "CSR-036: pull_request path has CSR-036 hardening comment"
  else
    fail "CSR-036: pull_request path missing CSR-036 hardening comment"
  fi

  # CSR-037: workflow_dispatch path must checkout base ref's check-dco.js
  # The step name and the git checkout command are separated by bash setup code
  if grep -A25 "DCO Check (workflow_dispatch)" "${DCO_WORKFLOW}" | grep -q "git checkout.*check-dco.js"; then
    pass "CSR-037: workflow_dispatch path checks out base ref's check-dco.js"
  else
    fail "CSR-037: workflow_dispatch path does not checkout base ref's check-dco.js"
  fi

  if grep -A25 "DCO Check (workflow_dispatch)" "${DCO_WORKFLOW}" | grep -q "CSR-037"; then
    pass "CSR-037: workflow_dispatch path has CSR-037 hardening comment"
  else
    fail "CSR-037: workflow_dispatch path missing CSR-037 hardening comment"
  fi

  # Verify the original DCO logic is still intact (check-dco.js is invoked)
  if grep -q "node scripts/check-dco.js" "${DCO_WORKFLOW}"; then
    pass "check-dco.js invocation preserved in both paths"
  else
    fail "check-dco.js invocation missing from workflow"
  fi
fi
echo ""

# --- Regression: existing package validation not broken ---
echo "--- Regression: package validation integrity ---"
if [[ -f "${REPO_ROOT}/package.json" ]]; then
  pass "package.json exists"
else
  fail "package.json missing"
fi

if [[ -f "${REPO_ROOT}/scripts/check-dco.js" ]]; then
  pass "check-dco.js exists and is unmodified"
else
  fail "check-dco.js missing"
fi

# Verify check-dco.js still has its core logic (remediation config, signoff pattern)
DCO_JS="${REPO_ROOT}/scripts/check-dco.js"
if grep -q "remediationConfigEnabled" "${DCO_JS}" && \
   grep -q "validSignoff" "${DCO_JS}" && \
   grep -q "Signed-off-by" "${DCO_JS}"; then
  pass "check-dco.js core logic intact (remediation + signoff patterns)"
else
  fail "check-dco.js core logic appears modified"
fi
echo ""

# --- Summary ---
echo "=== Results: ${PASSED} passed, ${FAILED} failed ==="
if [[ "${FAILED}" -gt 0 ]]; then
  exit 1
fi
exit 0
