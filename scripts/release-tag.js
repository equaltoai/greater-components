#!/usr/bin/env node
/**
 * Release Tag Script
 *
 * Orchestrates the full release flow for shadcn-style distribution:
 * 1. Runs `changeset version` to bump versions and generate changelogs
 * 2. Regenerates `registry/index.json` with new version
 * 3. Updates `registry/latest.json` to point to new tag
 * 4. Creates git tag `greater-vX.Y.Z`
 *
 * Usage:
 *   node scripts/release-tag.js [options]
 *
 * Options:
 *   --dry-run       Preview changes without committing or tagging
 *   --skip-version  Skip changeset version step (if already done)
 *   --sign          Sign the git tag with GPG
 *   --push          Push commits and tag to remote after creation
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Colors for terminal output
const colors = {
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m',
	reset: '\x1b[0m',
	bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
	console.log(`${color}${message}${colors.reset}`);
}

function exec(command, options = {}) {
	log(`  → ${command}`, colors.cyan);
	return execSync(command, {
		cwd: rootDir,
		encoding: 'utf8',
		stdio: options.silent ? 'pipe' : 'inherit',
		...options,
	});
}

function getVersion() {
	const packageJsonPath = path.join(rootDir, 'package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
	return packageJson.version;
}

function updateLatestJson(version, dryRun = false) {
	const latestPath = path.join(rootDir, 'registry', 'latest.json');
	const data = {
		ref: `greater-v${version}`,
		version,
		updatedAt: new Date().toISOString(),
	};

	if (dryRun) {
		log('\n📄 Would update registry/latest.json:', colors.yellow);
		console.log(JSON.stringify(data, null, 2));
	} else {
		fs.writeFileSync(latestPath, JSON.stringify(data, null, 2) + '\n');
		log('✅ Updated registry/latest.json', colors.green);
	}
}

function hasUncommittedChanges() {
	try {
		const status = exec('git status --porcelain', { silent: true, stdio: 'pipe' });
		return status.trim().length > 0;
	} catch {
		return true;
	}
}

function hasPendingChangesets() {
	const changesetDir = path.join(rootDir, '.changeset');
	const files = fs.readdirSync(changesetDir);
	// Filter out config.json, README.md, and hidden files
	const changesets = files.filter(
		(f) => f.endsWith('.md') && f !== 'README.md' && !f.startsWith('.')
	);
	return changesets.length > 0;
}

async function main() {
	const args = process.argv.slice(2);
	const dryRun = args.includes('--dry-run');
	const skipVersion = args.includes('--skip-version');
	const signTag = args.includes('--sign');
	const push = args.includes('--push');

	log('\n' + '='.repeat(60), colors.bold);
	log('🚀 Greater Components Release Tag', colors.bold);
	log('='.repeat(60) + '\n');

	if (dryRun) {
		log('📋 DRY RUN MODE - No changes will be made\n', colors.yellow);
	}

	// Step 1: Check for pending changesets
	log('1️⃣  Checking for pending changesets...', colors.blue);

	if (!skipVersion && hasPendingChangesets()) {
		log('   Found pending changesets', colors.green);
	} else if (!skipVersion) {
		log('   ⚠️  No pending changesets found', colors.yellow);
		log('   Use --skip-version if you want to release without version bumps', colors.yellow);
	}

	// Step 2: Run changeset version (unless skipped)
	if (!skipVersion) {
		log('\n2️⃣  Running changeset version...', colors.blue);

		if (dryRun) {
			log('   Would run: pnpm changeset version', colors.yellow);
		} else {
			try {
				exec('pnpm changeset version');
				log('✅ Versions bumped and changelogs updated', colors.green);
			} catch (error) {
				log('❌ Changeset version failed', colors.red);
				process.exit(1);
			}
		}
	} else {
		log('\n2️⃣  Skipping changeset version (--skip-version)', colors.yellow);
	}

	// Get the version (after changeset version, if ran)
	const version = getVersion();
	const tagName = `greater-v${version}`;

	log(`\n📋 Release version: ${version}`, colors.cyan);
	log(`🏷️  Tag name: ${tagName}`, colors.cyan);

	// Step 3: Regenerate registry index
	log('\n3️⃣  Regenerating registry/index.json...', colors.blue);

	if (dryRun) {
		log(`   Would run: node scripts/generate-registry-index.js --ref ${tagName}`, colors.yellow);
	} else {
		try {
			exec(`node scripts/generate-registry-index.js --ref ${tagName}`);
			log('✅ Registry index regenerated', colors.green);
		} catch (error) {
			log('❌ Registry index generation failed', colors.red);
			process.exit(1);
		}
	}

	// Step 4: Update latest.json
	log('\n4️⃣  Updating registry/latest.json...', colors.blue);
	updateLatestJson(version, dryRun);

	// Step 5: Stage and commit changes
	log('\n5️⃣  Staging and committing changes...', colors.blue);

	if (dryRun) {
		log('   Would stage: registry/, package.json, pnpm-lock.yaml, CHANGELOG.md', colors.yellow);
		log(`   Would commit: "chore(release): ${tagName}"`, colors.yellow);
	} else {
		if (hasUncommittedChanges()) {
			exec(
				'git add registry/ package.json pnpm-lock.yaml CHANGELOG.md packages/*/package.json packages/*/CHANGELOG.md packages/*/*/package.json packages/*/*/CHANGELOG.md || true'
			);
			exec(`git commit -m "chore(release): ${tagName}"`);
			log('✅ Changes committed', colors.green);
		} else {
			log('   No changes to commit', colors.yellow);
		}
	}

	// Step 6: Create git tag
	log('\n6️⃣  Creating git tag...', colors.blue);

	const tagFlags = signTag ? '-s' : '-a';
	const tagMessage = `Release ${version}

This release was created using the shadcn-style distribution model.
Install components using: greater add <component>

See CHANGELOG.md for details.`;

	if (dryRun) {
		log(`   Would create tag: git tag ${tagFlags} ${tagName}`, colors.yellow);
		log(`   Message:\n${tagMessage}`, colors.cyan);
	} else {
		try {
			// Check if tag already exists
			try {
				exec(`git rev-parse ${tagName}`, { silent: true, stdio: 'pipe' });
				log(`   ⚠️  Tag ${tagName} already exists`, colors.yellow);
			} catch {
				// Tag doesn't exist, create it
				exec(`git tag ${tagFlags} -m "${tagMessage}" ${tagName}`);
				log(`✅ Created tag ${tagName}${signTag ? ' (signed)' : ''}`, colors.green);
			}
		} catch (error) {
			log(`❌ Failed to create tag: ${error.message}`, colors.red);
			process.exit(1);
		}
	}

	// Step 7: Push (optional)
	if (push) {
		log('\n7️⃣  Pushing to remote...', colors.blue);

		if (dryRun) {
			log('   Would run: git push && git push --tags', colors.yellow);
		} else {
			try {
				exec('git push');
				exec('git push --tags');
				log('✅ Pushed to remote', colors.green);
			} catch (error) {
				log(`❌ Push failed: ${error.message}`, colors.red);
				process.exit(1);
			}
		}
	}

	// Summary
	log('\n' + '='.repeat(60));
	log('📊 Release Summary:', colors.bold);
	log(`  • Version: ${version}`);
	log(`  • Tag: ${tagName}`);
	log(`  • Signed: ${signTag ? 'Yes' : 'No'}`);
	log(`  • Pushed: ${push ? 'Yes' : 'No'}`);
	log('='.repeat(60) + '\n');

	if (dryRun) {
		log('🔍 This was a dry run. No changes were made.', colors.yellow);
		log('   Run without --dry-run to execute the release.\n', colors.yellow);
	} else {
		log('✅ Release complete!', colors.green);

		if (!push) {
			log('\n📌 Next steps:', colors.blue);
			log('   1. Review the changes:', colors.reset);
			log('      git log --oneline -5', colors.cyan);
			log('      git show ' + tagName, colors.cyan);
			log('   2. Push when ready:', colors.reset);
			log('      git push && git push --tags', colors.cyan);
		}

		log('\n📦 Consumers can now install with:', colors.blue);
		log(`   greater init --ref ${tagName}`, colors.cyan);
		log(`   greater add button modal`, colors.cyan);
	}
}

main().catch((error) => {
	log(`\n❌ Error: ${error.message}`, colors.red);
	console.error(error);
	process.exit(1);
});
