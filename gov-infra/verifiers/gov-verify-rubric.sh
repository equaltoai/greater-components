#!/usr/bin/env bash
# GovTheory Rubric Verifier (Single Entrypoint)
# Rendered from namespace pack bc41187efb6f5b3c3bfb4d9295836d4e071941d7 for greater-components.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
EVIDENCE=gov-infra/evidence
PLAN=gov-infra/planning
REPORT="$EVIDENCE/gov-rubric-report.json"
mkdir -p "$EVIDENCE" gov-infra/.tools/bin
rm -f "$REPORT" "$EVIDENCE"/*-output.log "$EVIDENCE/DOC-5-parity.log"
declare -a RESULTS=()
pass=0 fail=0 blocked=0
escape() { node -p 'JSON.stringify(process.argv[1])' "$1"; }
record() { local id=$1 category=$2 status=$3 message=$4 evidence=$5; case "$status" in PASS) ((pass++)) || true;; FAIL) ((fail++)) || true;; BLOCKED) ((blocked++)) || true;; *) exit 2;; esac; RESULTS+=("{\"id\":$(escape "$id"),\"category\":$(escape "$category"),\"status\":$(escape "$status"),\"message\":$(escape "$message"),\"evidencePath\":$(escape "$evidence")}"); }
run() { local id=$1 category=$2 command=$3 out="$EVIDENCE/$1-output.log"; if [[ "$command" == TODO:* || -z "$command" ]]; then printf '%s\n' "$command" > "$out"; record "$id" "$category" BLOCKED "Verifier command not configured" "$out"; return; fi; set +e; ( set -o pipefail; eval "$command" ) >"$out" 2>&1; local rc=$?; set -e; if [[ $rc -eq 0 ]]; then record "$id" "$category" PASS "Command succeeded" "$out"; else record "$id" "$category" FAIL "Command failed with exit code $rc" "$out"; fi; }
check_supply_chain() {
  local allow="$PLAN/greater-components-supply-chain-allowlist.txt"
  grep -R --include='*.yml' --include='*.yaml' -nE '^[[:space:]]*uses:[[:space:]].*@v[0-9]+' .github/workflows && return 1 || true
  [[ -f pnpm-lock.yaml ]] || { echo 'missing pnpm-lock.yaml'; return 1; }
  corepack pnpm install --frozen-lockfile --ignore-scripts
  node <<'NODE'
const fs=require('fs'),path=require('path');
const root='node_modules', hooks=['preinstall','install','postinstall','prepare','prepublishOnly'];
const allowed=new Set(fs.readFileSync('gov-infra/planning/greater-components-supply-chain-allowlist.txt','utf8').split(/\r?\n/).filter(x=>x&&!x.startsWith('#')));
const findings=[]; function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(e.name==='.pnpm') continue;const p=path.join(d,e.name);if(e.isDirectory()) walk(p);else if(e.name==='package.json'){try{const x=JSON.parse(fs.readFileSync(p));for(const h of hooks){const s=x.scripts?.[h]; if(typeof s==='string'&&/(curl\s+[^|]*\|\s*(sh|bash)|wget\s+[^|]*\|\s*(sh|bash)|webhook\.site|NPM_TOKEN|GITHUB_TOKEN)/i.test(s)){const id=`GOV-SUPPLY:NODE:SCRIPT:pkg=${x.name||p}:ver=${x.version||''}:hook=${h}`;if(!allowed.has(id)) findings.push(id)}}}catch{}}}}
walk(root); if(findings.length){console.error(findings.join('\n'));process.exit(1)}
NODE
}
check_parity() { local out="$EVIDENCE/DOC-5-parity.log"; local missing=0; for t in $(grep -oE 'THR-[0-9]+' "$PLAN/greater-components-threat-model.md"|sort -u); do grep -q "$t" "$PLAN/greater-components-controls-matrix.md" || { echo "unmapped $t" >> "$out"; missing=1; }; done; [[ $missing -eq 0 ]]; }
check_ci_hook() { grep -R -q 'gov-verify-rubric.sh' .github/workflows; }
run QUA-1 Quality 'corepack pnpm test:unit'
run QUA-2 Quality 'corepack pnpm test:a11y'
run QUA-3 Quality 'corepack pnpm test:coverage && corepack pnpm test:coverage:report'
run CON-1 Consistency 'corepack pnpm format:check'
run CON-2 Consistency 'corepack pnpm lint && corepack pnpm typecheck'
run CON-3 Consistency 'corepack pnpm check:openapi-auth && corepack pnpm generate-registry:validate'
run COM-1 Completeness 'corepack pnpm build'
run COM-2 Completeness 'test "$(node -p "require(\"./package.json\").packageManager")" = pnpm@10.25.0 && grep -Eq "^v?24(\.[0-9]+){0,2}$" .nvmrc'
run COM-3 Completeness 'corepack pnpm validate:check-parity'
run COM-4 Completeness 'corepack pnpm test:coverage:report'
run COM-5 Completeness 'corepack pnpm validate:csp'
run COM-6 Completeness 'test -f AGENTS.md && test -f .github/workflows/test.yml'
run SEC-1 Security 'test -f .github/workflows/codeql.yml && grep -q "github/codeql-action/init@[0-9a-f]\{40\}" .github/workflows/codeql.yml'
run SEC-2 Security 'corepack pnpm audit --prod --audit-level=high'
run SEC-3 Security check_supply_chain
run SEC-4 Security 'corepack pnpm validate:csp && test -f .github/workflows/a11y.yml'
for x in controls-matrix evidence-plan threat-model; do f="$PLAN/greater-components-$x.md"; id=CMP-1; [[ $x == evidence-plan ]]&&id=CMP-2; [[ $x == threat-model ]]&&id=CMP-3; [[ -f $f ]] && record "$id" Compliance PASS 'File exists' "$f" || record "$id" Compliance FAIL 'Required file missing' "$f"; done
run MAI-1 Maintainability 'test -s gov-infra/verifiers/gov-verify-rubric.sh'
run MAI-2 Maintainability 'test -s gov-infra/planning/greater-components-10of10-roadmap.md'
run MAI-3 Maintainability 'test "$(find gov-infra/verifiers -name "gov-verify-rubric.sh" | wc -l | tr -d " ")" = 1'
run MAI-4 Maintainability check_ci_hook
for x in threat-model evidence-plan 10of10-rubric; do f="$PLAN/greater-components-$x.md"; id=DOC-1; [[ $x == evidence-plan ]]&&id=DOC-2; [[ $x == 10of10-rubric ]]&&id=DOC-3; [[ -f $f ]] && record "$id" Docs PASS 'File exists' "$f" || record "$id" Docs FAIL 'Required file missing' "$f"; done
if check_parity; then record DOC-5 Docs PASS 'All threat IDs mapped in controls matrix' "$EVIDENCE/DOC-5-parity.log"; else record DOC-5 Docs FAIL 'Threat/control parity failed' "$EVIDENCE/DOC-5-parity.log"; fi
run DOC-4 Docs 'test -s README.md && ! grep -R -q "{{[A-Z_][A-Z_]*}}" gov-infra/planning'
status=PASS; [[ $fail -gt 0 ]] && status=FAIL; [[ $blocked -gt 0 && $fail -eq 0 ]] && status=BLOCKED
printf -v joined '%s,' "${RESULTS[@]}"; joined="[${joined%,}]"
cat > "$REPORT" <<EOF2
{"\$schema":"https://gov.pai.dev/schemas/gov-rubric-report.schema.json","schemaVersion":1,"timestamp":"$(date -u +%Y-%m-%dT%H:%M:%SZ)","pack":{"version":"bc41187efb6f5b3c3bfb4d9295836d4e071941d7","digest":"a613e19a4367d98a8f4b45f7c19c11881d21491eb55b8409446ca4a10d4e5cd7"},"project":{"name":"greater-components","slug":"greater-components"},"summary":{"status":"$status","pass":$pass,"fail":$fail,"blocked":$blocked},"results":$joined}
EOF2
node -e 'JSON.parse(require("fs").readFileSync(process.argv[1]));' "$REPORT"
echo "Report written to $REPORT: $status ($pass pass, $fail fail, $blocked blocked)"
[[ $status == PASS ]]
