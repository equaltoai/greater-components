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
premain_branch="${PREMAIN_BRANCH:-premain}"

main_ref="refs/remotes/${remote}/${main_branch}"
premain_ref="refs/remotes/${remote}/${premain_branch}"

if ! git show-ref --verify --quiet "${main_ref}"; then
	echo "release-branch: FAIL (missing ${main_ref}; run: git fetch ${remote} ${main_branch})"
	exit 1
fi

if ! git show-ref --verify --quiet "${premain_ref}"; then
	echo "release-branch: FAIL (missing ${premain_ref}; run: git fetch ${remote} ${premain_branch})"
	exit 1
fi

commit="$(git rev-parse HEAD)"

if [[ "${version}" =~ -rc(\.|$) ]]; then
	if ! git merge-base --is-ancestor "${commit}" "${premain_ref}"; then
		echo "release-branch: FAIL (${expected_tag} must be tagged from ${premain_branch})"
		exit 1
	fi

	# Prereleases must always be on a version line *ahead* of the latest stable on main.
	# Example: if main is 0.1.3, premain prereleases must be 0.1.4-rc.N (not 0.1.2-rc.N).
	stable_version="$(
		git show "${main_ref}:.release-please-manifest.json" 2>/dev/null \
			| node -p "JSON.parse(require('fs').readFileSync(0,'utf8'))['.'] || ''" \
			|| true
	)"
	prerelease_base="${version%%-*}"

	if [[ -n "${stable_version}" && -n "${prerelease_base}" ]]; then
		STABLE_VERSION="${stable_version}" PRERELEASE_BASE="${prerelease_base}" node - <<'NODE'
const stable = process.env.STABLE_VERSION || '';
const prereleaseBase = process.env.PRERELEASE_BASE || '';

function parseBase(v) {
	const match = v.trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
	if (!match) return null;
	return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function compare(a, b) {
	for (let i = 0; i < 3; i += 1) {
		if (a[i] > b[i]) return 1;
		if (a[i] < b[i]) return -1;
	}
	return 0;
}

const stableParsed = parseBase(stable);
const prereleaseParsed = parseBase(prereleaseBase);

if (!stableParsed || !prereleaseParsed) process.exit(0);

if (compare(prereleaseParsed, stableParsed) <= 0) {
	console.error(
		`release-branch: FAIL (prerelease base ${prereleaseBase} must be > stable ${stable} on main)`
	);
	process.exit(1);
}
NODE
	fi
else
	if ! git merge-base --is-ancestor "${commit}" "${main_ref}"; then
		echo "release-branch: FAIL (${expected_tag} must be tagged from ${main_branch})"
		exit 1
	fi
fi

echo "release-branch: PASS (${expected_tag})"
