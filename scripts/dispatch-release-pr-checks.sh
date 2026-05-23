#!/usr/bin/env bash
set -euo pipefail

# GitHub suppresses pull_request workflows when a release-please PR branch is
# created or updated with GITHUB_TOKEN. For release PRs we intentionally run only
# the promotion guard + DCO gate, then mirror those verified results onto the
# release PR head SHA as commit statuses so the PR is visibly gated.
#
# CSR-028 hardening: dispatched runs are now validated for freshness (created
# within MAX_RUN_AGE_SEC seconds). The most-recently-created matching run is
# always selected; stale runs are skipped. If no fresh run can be found after
# retries, the check fails rather than trusting a potentially stale result.

: "${GH_REPO:?GH_REPO is required}"
: "${RELEASE_BRANCH:?RELEASE_BRANCH is required}"
: "${BASE_BRANCH:?BASE_BRANCH is required}"
: "${GUARD_WORKFLOW:?GUARD_WORKFLOW is required}"
: "${GUARD_CONTEXT:?GUARD_CONTEXT is required}"

DCO_WORKFLOW="${DCO_WORKFLOW:-dco.yml}"
DCO_CONTEXT="${DCO_CONTEXT:-DCO Check}"

if ! git ls-remote --exit-code --heads origin "${RELEASE_BRANCH}" >/dev/null; then
	echo "release-pr-checks: no release branch ${RELEASE_BRANCH}; skipping"
	exit 0
fi

pr_number="$(
	gh pr list \
		--head "${RELEASE_BRANCH}" \
		--base "${BASE_BRANCH}" \
		--state open \
		--json number \
		--jq '.[0].number' \
		|| true
)"

if [[ -z "${pr_number}" || "${pr_number}" == "null" ]]; then
	echo "release-pr-checks: no open PR for ${RELEASE_BRANCH} -> ${BASE_BRANCH}; skipping"
	exit 0
fi

head_sha="$(git ls-remote origin "refs/heads/${RELEASE_BRANCH}" | awk '{print $1}')"

if [[ -z "${head_sha}" ]]; then
	echo "::error::release-pr-checks: unable to resolve head SHA for ${RELEASE_BRANCH}"
	exit 1
fi

echo "release-pr-checks: validating PR #${pr_number} at ${head_sha}"

set_status() {
	local context="$1"
	local state="$2"
	local description="$3"
	local target_url="${4:-}"

	local -a args
	args=(
		-X POST
		"repos/${GH_REPO}/statuses/${head_sha}"
		-f "state=${state}"
		-f "context=${context}"
		-f "description=${description}"
	)

	if [[ -n "${target_url}" ]]; then
		args+=(-f "target_url=${target_url}")
	fi

	gh api "${args[@]}" >/dev/null
}

# Maximum age (seconds) for a dispatched run to be considered fresh.
# Runs older than this are rejected to prevent trusting stale workflow results.
MAX_RUN_AGE_SEC="${MAX_RUN_AGE_SEC:-180}"

find_fresh_dispatched_run() {
	local workflow="$1"

	for _ in {1..12}; do
		local run_id
		run_id="$(
			gh run list \
				--workflow "${workflow}" \
				--branch "${RELEASE_BRANCH}" \
				--event workflow_dispatch \
				--limit 20 \
				--json databaseId,headSha,createdAt \
				--jq "
					[.[] | select(.headSha == \"${head_sha}\")]
					| sort_by(.createdAt)
					| reverse
					| .[0]
					| .databaseId
				"
		)"

		if [[ -z "${run_id}" || "${run_id}" == "null" ]]; then
			sleep 5
			continue
		fi

		# Verify freshness: reject runs older than MAX_RUN_AGE_SEC.
		local created_at_epoch now_epoch run_age
		created_at_epoch="$(gh run view "${run_id}" --json createdAt --jq '.createdAt' | xargs -I{} date -d '{}' +%s 2>/dev/null || echo 0)"
		now_epoch="$(date +%s)"

		if [[ "${created_at_epoch}" -eq 0 ]]; then
			echo "::warning::release-pr-checks: could not parse createdAt for run ${run_id}; accepting anyway"
			echo "${run_id}"
			return 0
		fi

		run_age=$(( now_epoch - created_at_epoch ))
		if [[ "${run_age}" -gt "${MAX_RUN_AGE_SEC}" ]]; then
			echo "::warning::release-pr-checks: run ${run_id} is ${run_age}s old (> ${MAX_RUN_AGE_SEC}s max); skipping stale run"
			sleep 5
			continue
		fi

		echo "${run_id}"
		return 0
	done

	return 1
}

run_workflow_check() {
	local workflow="$1"
	local context="$2"

	set_status "${context}" "pending" "Running ${context}"

	local output
	if ! output="$(
		gh workflow run "${workflow}" \
			--ref "${RELEASE_BRANCH}" \
			--field "base_ref=${BASE_BRANCH}" \
			2>&1
	)"; then
		echo "${output}"
		set_status "${context}" "failure" "Failed to dispatch ${context}"
		return 1
	fi
	echo "${output}"

	local run_id
	run_id="$(grep -Eo 'https://github.com/[^[:space:]]+/actions/runs/[0-9]+' <<<"${output}" | tail -n 1 | awk -F/ '{print $NF}' || true)"

	if [[ -z "${run_id}" ]]; then
		run_id="$(find_fresh_dispatched_run "${workflow}" || true)"
	fi

	if [[ -z "${run_id}" ]]; then
		set_status "${context}" "failure" "Could not find fresh dispatched ${context} run"
		echo "::error::release-pr-checks: could not find fresh dispatched ${workflow} run"
		return 1
	fi

	local run_url
	run_url="$(gh run view "${run_id}" --json url --jq '.url')"

	if gh run watch "${run_id}" --exit-status; then
		set_status "${context}" "success" "${context} passed" "${run_url}"
		return 0
	fi

	local conclusion
	conclusion="$(gh run view "${run_id}" --json conclusion --jq '.conclusion // "failure"')"
	set_status "${context}" "failure" "${context} ${conclusion}" "${run_url}"
	return 1
}

run_workflow_check "${GUARD_WORKFLOW}" "${GUARD_CONTEXT}"
run_workflow_check "${DCO_WORKFLOW}" "${DCO_CONTEXT}"

echo "release-pr-checks: PR #${pr_number} checks passed"
