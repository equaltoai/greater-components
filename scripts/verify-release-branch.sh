#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

tag="${1:-${GITHUB_REF_NAME:-}}"
if [[ -z "${tag}" ]]; then
	echo "release-branch: FAIL (missing tag name)"
	exit 1
fi

if [[ ! -f "package.json" ]]; then
	echo "release-branch: FAIL (missing package.json)"
	exit 1
fi

version="$(node -p "require('./package.json').version")"
expected_tag="greater-v${version}"

if [[ "${tag}" != "${expected_tag}" ]]; then
	echo "release-branch: FAIL (tag ${tag} != ${expected_tag})"
	exit 1
fi

remote="${GIT_REMOTE:-origin}"
main_branch="${MAIN_BRANCH:-main}"
main_ref="refs/remotes/${remote}/${main_branch}"

if ! git show-ref --verify --quiet "${main_ref}"; then
	echo "release-branch: FAIL (missing ${main_ref}; run: git fetch ${remote} ${main_branch})"
	exit 1
fi

commit="$(git rev-parse HEAD)"

if ! git merge-base --is-ancestor "${commit}" "${main_ref}"; then
	echo "release-branch: FAIL (${expected_tag} must be tagged from ${main_branch})"
	exit 1
fi

echo "release-branch: PASS (${expected_tag} is on ${main_branch})"
