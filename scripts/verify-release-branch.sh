#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

tag="${1:-${GITHUB_REF_NAME:-}}"
if [[ -z "${tag}" ]]; then
	echo "release-branch: FAIL (missing tag name)"
	exit 1
fi

if [[ ! "${tag}" =~ ^greater-v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
	echo "release-branch: FAIL (tag must match greater-vX.Y.Z; got ${tag})"
	exit 1
fi

remote="${GIT_REMOTE:-origin}"
main_branch="${MAIN_BRANCH:-main}"
main_ref="refs/remotes/${remote}/${main_branch}"

if ! git show-ref --verify --quiet "${main_ref}"; then
	echo "release-branch: FAIL (missing ${main_ref}; run: git fetch ${remote} ${main_branch})"
	exit 1
fi

if git rev-parse -q --verify "refs/tags/${tag}" >/dev/null; then
	commit="$(git rev-list -n 1 "${tag}")"
else
	commit="$(git rev-parse HEAD)"
fi

if ! git merge-base --is-ancestor "${commit}" "${main_ref}"; then
	echo "release-branch: FAIL (${tag} must point at a commit reachable from ${main_branch})"
	exit 1
fi

echo "release-branch: PASS (${tag} target is on ${main_branch})"
