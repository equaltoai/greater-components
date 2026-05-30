#!/usr/bin/env bash
set -euo pipefail

# GitHub suppresses pull_request workflows when a release-please PR branch is
# created or updated with GITHUB_TOKEN. For release PRs we intentionally run only
# the promotion guard + DCO gate, then mirror those verified results onto the
# release PR head SHA as commit statuses so the PR is visibly gated.
#
# CSR-028/GC-05 hardening: dispatched runs are bound to this script's dispatch
# timestamp and, for list-based resolution, to the expected workflow_dispatch
# base_ref input. If the dispatched run cannot be resolved deterministically,
# the check fails closed rather than trusting a stale or raced workflow result.

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

RUN_LOOKUP_ATTEMPTS="${RUN_LOOKUP_ATTEMPTS:-12}"
RUN_LOOKUP_SLEEP_SEC="${RUN_LOOKUP_SLEEP_SEC:-5}"

date_to_epoch() {
	local value="$1"
	date -d "${value}" +%s 2>/dev/null
}

validate_dispatched_run() {
	local run_id="$1"
	local dispatch_started_epoch="$2"
	local workflow="$3"
	local require_base_ref_input="$4"

	local run_json
	if ! run_json="$(gh api "repos/${GH_REPO}/actions/runs/${run_id}")"; then
		echo "::error::release-pr-checks: could not fetch metadata for run ${run_id}" >&2
		return 1
	fi

	local event created_at run_head_sha head_branch workflow_path
	event="$(jq -r '.event // empty' <<<"${run_json}")"
	created_at="$(jq -r '.created_at // .createdAt // empty' <<<"${run_json}")"
	run_head_sha="$(jq -r '.head_sha // .headSha // empty' <<<"${run_json}")"
	head_branch="$(jq -r '.head_branch // .headBranch // empty' <<<"${run_json}")"
	workflow_path="$(jq -r '.path // empty' <<<"${run_json}")"

	if [[ "${event}" != "workflow_dispatch" ]]; then
		echo "::error::release-pr-checks: run ${run_id} event is ${event:-<missing>}, not workflow_dispatch" >&2
		return 1
	fi

	if [[ "${head_branch}" != "${RELEASE_BRANCH}" ]]; then
		echo "::error::release-pr-checks: run ${run_id} head branch is ${head_branch:-<missing>}, expected ${RELEASE_BRANCH}" >&2
		return 1
	fi

	if [[ "${run_head_sha}" != "${head_sha}" ]]; then
		echo "::error::release-pr-checks: run ${run_id} head SHA is ${run_head_sha:-<missing>}, expected ${head_sha}" >&2
		return 1
	fi

	if [[ -n "${workflow_path}" && "${workflow_path}" != ".github/workflows/${workflow}" && "${workflow_path##*/}" != "${workflow}" ]]; then
		echo "::error::release-pr-checks: run ${run_id} workflow path is ${workflow_path}, expected ${workflow}" >&2
		return 1
	fi

	local created_at_epoch
	if [[ -z "${created_at}" ]] || ! created_at_epoch="$(date_to_epoch "${created_at}")"; then
		echo "::error::release-pr-checks: could not parse createdAt for run ${run_id}" >&2
		return 1
	fi

	if (( created_at_epoch < dispatch_started_epoch )); then
		echo "::error::release-pr-checks: run ${run_id} was created before this dispatch started" >&2
		return 1
	fi

	if [[ "${require_base_ref_input}" == "true" ]]; then
		local base_ref
		base_ref="$(
			jq -r '
				.inputs.base_ref
				// .event.inputs.base_ref
				// .workflow_dispatch.inputs.base_ref
				// .workflowDispatch.inputs.base_ref
				// empty
			' <<<"${run_json}"
		)"

		if [[ -z "${base_ref}" ]]; then
			echo "::error::release-pr-checks: could not verify workflow_dispatch input base_ref for run ${run_id}" >&2
			return 1
		fi

		if [[ "${base_ref}" != "${BASE_BRANCH}" ]]; then
			echo "::error::release-pr-checks: run ${run_id} base_ref is ${base_ref}, expected ${BASE_BRANCH}" >&2
			return 1
		fi
	fi
}

find_fresh_dispatched_run() {
	local workflow="$1"
	local dispatch_started_epoch="$2"

	for (( attempt = 1; attempt <= RUN_LOOKUP_ATTEMPTS; attempt++ )); do
		local runs_json
		runs_json="$(
			gh run list \
				--workflow "${workflow}" \
				--branch "${RELEASE_BRANCH}" \
				--event workflow_dispatch \
				--limit 20 \
				--json databaseId,headSha,createdAt
		)"

		local -a candidate_run_ids
		mapfile -t candidate_run_ids < <(
			jq -r \
				--arg head_sha "${head_sha}" \
				--argjson dispatch_started_epoch "${dispatch_started_epoch}" \
				'
					[
						.[] |
						select(.headSha == $head_sha) |
						select((.createdAt | fromdateiso8601) >= $dispatch_started_epoch) |
						.databaseId
					] |
					.[]?
				' <<<"${runs_json}"
		)

		if [[ "${#candidate_run_ids[@]}" -eq 0 ]]; then
			sleep "${RUN_LOOKUP_SLEEP_SEC}"
			continue
		fi

		if [[ "${#candidate_run_ids[@]}" -ne 1 ]]; then
			echo "::error::release-pr-checks: found ${#candidate_run_ids[@]} candidate ${workflow} runs after dispatch; refusing heuristic selection" >&2
			return 1
		fi

		local run_id="${candidate_run_ids[0]}"
		if ! validate_dispatched_run "${run_id}" "${dispatch_started_epoch}" "${workflow}" "true"; then
			return 1
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

	local dispatch_started_at dispatch_started_epoch
	dispatch_started_at="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
	if ! dispatch_started_epoch="$(date_to_epoch "${dispatch_started_at}")"; then
		set_status "${context}" "failure" "Could not timestamp ${context} dispatch"
		echo "::error::release-pr-checks: could not parse dispatch timestamp ${dispatch_started_at}"
		return 1
	fi

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
		run_id="$(find_fresh_dispatched_run "${workflow}" "${dispatch_started_epoch}" || true)"
	elif ! validate_dispatched_run "${run_id}" "${dispatch_started_epoch}" "${workflow}" "false"; then
		set_status "${context}" "failure" "Dispatched ${context} run failed validation"
		return 1
	fi

	if [[ -z "${run_id}" ]]; then
		set_status "${context}" "failure" "Could not find deterministic dispatched ${context} run"
		echo "::error::release-pr-checks: could not find deterministic dispatched ${workflow} run"
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
