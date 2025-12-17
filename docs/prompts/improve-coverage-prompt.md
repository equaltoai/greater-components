# Reusable Agent Prompt: Improve Test Coverage

Use this prompt template to instruct an agent to improve test coverage for any package in the greater-components repository.

---

## Prompt Template

Replace `shared/chat` with the target package path (e.g., `faces/blog`, `shared/auth`, `primitives`).

---

### Prompt:

````
**Objective**: Improve test coverage for the `packages/shared/chat` package to 90%+ line coverage.

**Step 1: Identify the 3 Lowest Coverage Files**

Run the following command to generate a coverage report:

```bash
cd packages/shared/chat && pnpm test --coverage
````

From the coverage output, identify the **3 files with the lowest line coverage percentage**. Focus on source files (`.ts`, `.svelte`), not test files. Record:

- File path
- Current line coverage %
- Current branch coverage %

**Step 2: Analyze Each File**

For each of the 3 lowest coverage files, examine:

1. What functionality does the file provide?
2. What code paths are currently untested (check uncovered line numbers)?
3. What edge cases or error handling is missing coverage?

**Step 3: Create Tests Using Established Patterns**

Reference the testing infrastructure from `packages/faces/blog/tests/` and `packages/faces/community/tests/` for patterns:

**If the file is a Svelte component:**

- Create a **smoke test** to verify it renders without errors
- Create a **behavior test** to test user interactions (clicks, inputs, keyboard)
- Test different prop combinations and edge cases
- Mock any external dependencies or context providers

Pattern example (from `faces/blog/tests/components/smoke/Article.smoke.test.ts`):

```typescript
import { render } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ComponentName } from '../../src/components/ComponentName/index.js';
import TestWrapper from '../fixtures/TestWrapper.svelte';
import { createMockData } from '../mocks/mockData.js';

describe('ComponentName Smoke Tests', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders without errors', () => {
		render(TestWrapper, { props: { data: createMockData('1') } });
		expect(console.error).not.toHaveBeenCalled();
	});
});
```

**If the file is a utility/store/context:**

- Create **unit tests** for each exported function
- Test success paths AND error paths
- Test edge cases (empty inputs, null values, boundary conditions)
- Mock external dependencies

Pattern example (from `faces/blog/tests/stores/articleStore.test.ts`):

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { functionName } from '../../src/utils/utility.js';

describe('Utility Function', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('handles normal input', () => {
		expect(functionName('input')).toBe('expected');
	});

	it('handles edge case: empty input', () => {
		expect(functionName('')).toBe('default');
	});

	it('handles edge case: null input', () => {
		expect(() => functionName(null)).toThrow();
	});
});
```

**If the file needs mock data:**

- Create a mock factory in `tests/mocks/` following this pattern:

```typescript
export function createMockEntityName(id: string, overrides: Partial<EntityType> = {}): EntityType {
	return {
		id,
		field1: `default-${id}`,
		field2: 'default-value',
		...overrides,
	};
}
```

**Step 4: Test Uncovered Code Paths**

For each file, specifically target the uncovered line numbers from the coverage report:

1. **Conditional branches**: Test both `if` and `else` paths
2. **Error handling**: Test `try`/`catch` blocks by forcing errors
3. **Callbacks**: Test event handlers and async callbacks
4. **Default/fallback cases**: Test switch statement defaults, optional chaining fallbacks
5. **Early returns**: Test conditions that cause early returns

**Step 5: Create Test Fixtures if Needed**

If the component requires context providers, create a test wrapper in `tests/fixtures/`:

```svelte
<script lang="ts">
	import { ParentContext } from '../../src/components/Parent/index.js';

	interface Props {
		data: DataType;
		component?: any;
		componentProps?: Record<string, any>;
	}

	let { data, component: Component, componentProps = {} }: Props = $props();
</script>

<ParentContext.Root {data}>
	{#if Component}
		<Component {...componentProps} />
	{:else}
		<slot />
	{/if}
</ParentContext.Root>
```

**Step 6: Verify Coverage Improvement**

After writing tests, run:

```bash
cd packages/shared/chat && pnpm test --coverage
```

Verify that each of the 3 files now has:

- **Line coverage: 90%+**
- **Function coverage: 85%+**
- **Branch coverage: 75%+**

If any file is still below target, add additional tests for the remaining uncovered lines.

**Step 7: Final Verification**

Run the full test suite to ensure no regressions:

```bash
pnpm test
```

Run lint and type check:

```bash
pnpm lint && pnpm check
```

**Deliverables:**

1. List of the 3 files targeted with before/after coverage percentages
2. New test files created
3. Any mock factories or fixtures created
4. Final coverage report showing 90%+ for each targeted file

**Reference Documentation:**

- Testing improvement plan: `docs/testing-improvement-plan-blog-community.md`
- Blog test examples: `packages/faces/blog/tests/`
- Community test examples: `packages/faces/community/tests/`
- Artist test examples: `packages/faces/artist/tests/`

```

---

## Example Usage

### For `faces/community`:
Replace `shared/chat` with `faces/community`

### For `shared/auth`:
Replace `shared/chat` with `shared/auth`

### For `primitives`:
Replace `shared/chat` with `primitives`

---

## Quick Reference: Package Paths

| Package | Path |
|---------|------|
| Adapters | `adapters` |
| CLI | `cli` |
| Content | `content` |
| Artist Face | `faces/artist` |
| Blog Face | `faces/blog` |
| Community Face | `faces/community` |
| Social Face | `faces/social` |
| Headless | `headless` |
| Icons | `icons` |
| Primitives | `primitives` |
| Admin Shared | `shared/admin` |
| Auth Shared | `shared/auth` |
| Chat Shared | `shared/chat` |
| Compose Shared | `shared/compose` |
| Messaging Shared | `shared/messaging` |
| Notifications Shared | `shared/notifications` |
| Search Shared | `shared/search` |
| Tokens | `tokens` |
| Utils | `utils` |

---

## Current Coverage Snapshot (for reference)

From `pnpm test:coverage:report`:

| Package | Lines | Functions | Branches | Priority |
|---------|-------|-----------|----------|----------|
| faces/community | 66.0% | 67.5% | 44.6% | 🔴 High |
| faces/blog | 78.5% | 78.7% | 55.8% | 🟡 Medium |
| faces/artist | 80.6% | 76.1% | 63.2% | 🟡 Medium |
| cli | 82.5% | 86.0% | 71.7% | 🟢 Low |
| tokens | 83.5% | 95.5% | 70.0% | 🟢 Low |

---

*Generated: 2024-12-16*
```
