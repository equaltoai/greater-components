# Testing Improvement Plan for Blog and Community Faces

This document provides a comprehensive analysis of the testing implementations in `faces/social` and `faces/artist`, and outlines a plan to apply the same techniques to improve testing coverage in `faces/blog` and `faces/community`.

**Generated:** 2025-12-16

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Testing Architecture in Artist & Social](#testing-architecture-in-artist--social)
4. [Gap Analysis: Blog & Community](#gap-analysis-blog--community)
5. [Implementation Plan](#implementation-plan)
6. [File Structure Templates](#file-structure-templates)
7. [Code Examples](#code-examples)
8. [Agent Implementation Prompt](#agent-implementation-prompt)

---

## Executive Summary

### Test Count Comparison

| Package       | Test Files | Test Categories | Tests Coverage |
| ------------- | ---------- | --------------- | -------------- |
| **Artist**    | ~92 files  | 10 categories   | High           |
| **Social**    | ~73 files  | 7 categories    | High           |
| **Blog**      | 4 files    | 2 categories    | **Low**        |
| **Community** | 4 files    | 2 categories    | **Low**        |

### Key Findings

The `faces/artist` and `faces/social` packages implement comprehensive testing strategies including:

- **Component smoke tests** - Ensure components render without errors
- **Component behavior tests** - Test user interactions and state changes
- **Store tests** - Validate state management logic
- **Integration/flow tests** - Test complete user workflows
- **Accessibility (a11y) tests** - Keyboard navigation, screen reader support, contrast
- **Pattern tests** - Test reusable patterns and utilities
- **Mock infrastructure** - Robust mock adapters, data factories, and transport managers
- **Coverage harnesses** - Systematic coverage generation across all components

The `faces/blog` and `faces/community` packages have minimal testing:

- Only context tests and basic component rendering
- No smoke tests, behavior tests, or integration tests
- No accessibility testing
- Limited mock infrastructure
- No store or pattern tests

---

## Current State Analysis

### Artist Face Testing Structure (`92 files`)

```
tests/
├── setup.ts                           # Comprehensive test setup
├── a11y/                              # Accessibility tests
│   ├── contrast.test.ts               # Color contrast validation
│   ├── keyboard-navigation.test.ts    # Keyboard navigation tests
│   └── screen-reader.test.ts          # Screen reader support tests
├── adapters/                          # Adapter tests
│   └── artist.test.ts
├── components/
│   ├── behavior/                      # Interactive behavior tests
│   │   ├── ArtistProfile.behavior.test.ts
│   │   ├── Community.behavior.test.ts
│   │   ├── CreativeTools.behavior.test.ts
│   │   ├── Discovery.behavior.test.ts
│   │   ├── Exhibition.behavior.test.ts
│   │   ├── Gallery.behavior.test.ts
│   │   ├── MediaViewer.behavior.test.ts
│   │   ├── Monetization.behavior.test.ts
│   │   └── Transparency.behavior.test.ts
│   ├── smoke/                         # Smoke tests (render without errors)
│   │   ├── ArtistProfile.smoke.test.ts
│   │   ├── Artwork.smoke.test.ts
│   │   ├── Community.smoke.test.ts
│   │   ├── CreativeTools.smoke.test.ts
│   │   ├── Curation.smoke.test.ts
│   │   ├── Discovery.smoke.test.ts
│   │   ├── Exhibition.smoke.test.ts
│   │   ├── Gallery.smoke.test.ts
│   │   ├── MediaViewer.smoke.test.ts
│   │   ├── Monetization.smoke.test.ts
│   │   └── Transparency.smoke.test.ts
│   ├── coverage-harness.ts            # Systematic coverage across all components
│   └── coverage.test.ts               # Runs coverage harness scenarios
├── integration/                       # User flow integration tests
│   ├── artwork-flow.test.ts
│   ├── commission-flow.test.ts
│   ├── discovery-flow.test.ts
│   └── journeys/                      # End-to-end user journey tests
│       ├── commission-lifecycle.flow.test.ts
│       ├── discovery-viewer.flow.test.ts
│       ├── federation-follow.flow.test.ts
│       └── gallery-offline.flow.test.ts
├── mocks/                             # Reusable mock infrastructure
│   ├── index.ts
│   ├── mockAdapter.ts                 # Mock API adapter
│   ├── mockArtist.ts                  # Mock artist data factory
│   ├── mockArtwork.ts                 # Mock artwork data factory
│   └── mockCommission.ts              # Mock commission data factory
├── patterns/                          # Pattern and utility tests
│   ├── commission.test.ts
│   ├── critique.test.ts
│   ├── discovery.test.ts
│   ├── exhibition.test.ts
│   ├── gallery.test.ts
│   ├── portfolio.test.ts
│   ├── upload.test.ts
│   └── utils.test.ts
├── stores/                            # Store unit tests
│   ├── artistProfileStore.test.ts
│   ├── commissionStore.test.ts
│   ├── discoveryStore.test.ts
│   ├── galleryStore.test.ts
│   ├── offlineStore.test.ts
│   ├── realtimeStore.test.ts
│   └── utils.test.ts
├── subscriptions/                     # Subscription/realtime tests
│   └── ...
└── utils/                             # Utility function tests
    └── ...
```

### Social Face Testing Structure (`73 files`)

```
tests/
├── setup.ts                           # Shared test setup
├── components/
│   ├── Filters/                       # Sub-component tests
│   ├── Lists/
│   ├── Profile/
│   ├── Status/
│   ├── Timeline/
│   ├── coverage-harness.ts            # Coverage harness with scenarios
│   ├── coverage.test.ts
│   ├── ActionBar.test.ts
│   ├── ComposeBox.test.ts
│   └── ...
├── fixtures/                          # Test fixtures
│   └── ...
├── helpers/                           # Test helper utilities
│   ├── async/
│   ├── browser/
│   ├── fakes/
│   └── fixtures/
├── adapters.*.test.ts                 # Adapter-specific tests
├── *Context.test.ts                   # Context tests
├── *Store.test.ts                     # Store tests
└── integration.test.ts                # Integration tests
```

### Blog Face Testing Structure (`4 files`) ⚠️

```
tests/
├── setup.ts                           # Basic setup
├── Article.test.ts                    # Component tests
├── context.test.ts                    # Context tests
└── fixtures/
    └── ArticleTestWrapper.svelte
```

### Community Face Testing Structure (`4 files`) ⚠️

```
tests/
├── setup.ts                           # Basic setup
├── context.test.ts                    # Context tests
├── render.test.ts                     # Basic render tests
└── structure.test.ts                  # Structure tests
```

---

## Testing Architecture in Artist & Social

### 1. Test Setup Pattern

The `setup.ts` file provides a comprehensive foundation:

```typescript
// Key patterns from artist/tests/setup.ts
import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, vi, beforeAll } from 'vitest';

expect.extend(matchers);

// Svelte 5 runes polyfills
const runtime = globalThis as typeof globalThis & {
	$state?: <T>(value: T) => T;
	$derived?: <T>(fn: () => T) => () => T;
	$effect?: (fn: () => void | (() => void)) => void;
};

if (typeof runtime.$state !== 'function') {
	runtime.$state = <T>(value: T) => value;
}

if (typeof runtime.$derived !== 'function') {
	runtime.$derived = <T>(fn: () => T) => fn;
}

if (typeof runtime.$effect !== 'function') {
	runtime.$effect = () => {};
}

// Browser API mocks
Object.defineProperty(window, 'matchMedia', {
	/* ... */
});
Object.defineProperty(window, 'IntersectionObserver', {
	/* ... */
});
Object.defineProperty(window, 'ResizeObserver', {
	/* ... */
});
Element.prototype.scrollIntoView = vi.fn();
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
	/* ... */
});
```

### 2. Mock Data Factories

Create reusable, type-safe mock data:

```typescript
// Pattern from artist/tests/mocks/mockArtwork.ts
export function createMockArtwork(id: string, overrides: Partial<ArtworkData> = {}): ArtworkData {
	const base: ArtworkData = {
		id,
		title: `Artwork ${id}`,
		description: `Description for artwork ${id}`,
		// ... complete default object
	};

	return {
		...base,
		...overrides,
		// Deep merge nested objects
		metadata: { ...base.metadata, ...overrides.metadata },
	};
}

// Factory for generating lists
export const createMockArtworkList = (count: number, startId = 1): ArtworkData[] =>
	Array.from({ length: count }, (_, i) => createMockArtwork(`artwork-${startId + i}`));
```

### 3. Mock Adapter Pattern

Comprehensive mock for API interactions:

```typescript
// Pattern from artist/tests/mocks/mockAdapter.ts
export interface MockAdapterConfig {
	delay?: number;
	shouldFail?: boolean;
	errorMessage?: string;
}

export function createMockAdapter(config: MockAdapterConfig = {}): MockAdapter {
	const { delay = 0, shouldFail = false, errorMessage = 'Mock error' } = config;

	const mockResponse = <T>(data: T) => {
		if (shouldFail) return Promise.reject(new Error(errorMessage));
		if (delay > 0) return new Promise<T>((resolve) => setTimeout(() => resolve(data), delay));
		return Promise.resolve(data);
	};

	return {
		query: vi.fn().mockImplementation(() => mockResponse({ data: {} })),
		mutate: vi.fn().mockImplementation(() => mockResponse({ data: {} })),
		// ... domain-specific operations
	};
}

// Real-time transport mock
export function createMockTransportManager(): MockTransportManager {
	const handlers = new Map<string, Set<(payload: unknown) => void>>();

	return {
		subscribe: vi.fn().mockImplementation((channel, handler) => {
			/* ... */
		}),
		emit: (channel, payload) => handlers.get(channel)?.forEach((h) => h(payload)),
		// ...
	};
}
```

### 4. Smoke Test Pattern

Verify components render without errors:

```typescript
// Pattern from artist/tests/components/smoke/Gallery.smoke.test.ts
describe('Gallery Components Smoke Tests', () => {
	const mockItems = createMockArtworkList(10);

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Gallery Components', () => {
		const components = [
			{ name: 'Grid', Component: Gallery.Grid, props: { items: mockItems } },
			{ name: 'Masonry', Component: Gallery.Masonry, props: { items: mockItems } },
			{ name: 'Row', Component: Gallery.Row, props: { items: mockItems, title: 'Test Row' } },
		];

		it.each(components)('renders $name without errors', ({ Component, props }) => {
			render(Component, { props });
			expect(console.error).not.toHaveBeenCalled();
		});
	});
});
```

### 5. Behavior Test Pattern

Test user interactions and component behavior:

```typescript
// Pattern from artist/tests/components/behavior/Gallery.behavior.test.ts
describe('Gallery Behavior', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	describe('Infinite Scroll', () => {
		it('triggers load more on scroll', async () => {
			const onLoadMore = vi.fn();
			render(Gallery.Grid, { props: { items: mockItems, onLoadMore } });

			const container = screen.getByRole('region');

			// Mock scroll properties
			Object.defineProperty(container, 'scrollHeight', { value: 1000 });
			Object.defineProperty(container, 'scrollTop', { value: 400 });
			Object.defineProperty(container, 'clientHeight', { value: 500 });

			await fireEvent.scroll(container);
			vi.advanceTimersByTime(200);

			expect(onLoadMore).toHaveBeenCalled();
		});
	});

	describe('Keyboard Navigation', () => {
		it('navigates with arrow keys', async () => {
			render(Gallery.Grid, { props: { items: mockItems, columns: 2 } });

			await fireEvent.keyDown(container, { key: 'ArrowRight' });
			vi.advanceTimersByTime(50);

			expect(getItem(1)).toHaveClass('focused');
		});
	});
});
```

### 6. Store Test Pattern

Test state management logic:

```typescript
// Pattern from artist/tests/stores/galleryStore.test.ts
describe('GalleryStore', () => {
	let mockAdapter: ReturnType<typeof createMockAdapter>;

	beforeEach(() => {
		mockAdapter = createMockAdapter();
		vi.clearAllMocks();
	});

	describe('Pagination', () => {
		it('loads initial items', async () => {
			const store = createGalleryStore({ adapter: mockAdapter as any });
			const artworks = createMockArtworkList(10);

			mockAdapter.query.mockResolvedValue({
				data: {
					artworks: {
						edges: artworks.map((a) => ({ node: a, cursor: a.id })),
						pageInfo: { hasNextPage: true, endCursor: artworks[9].id },
					},
				},
			});

			await store.loadMore();
			expect(store.get().items).toHaveLength(10);
		});
	});

	describe('Optimistic Updates', () => {
		it('optimistically updates item', () => {
			const items = createMockArtworkList(1);
			const store = createGalleryStore({
				adapter: mockAdapter as any,
				initialItems: items as any,
			});

			store.updateItem(items[0].id, { title: 'New Title' });
			expect(store.get().items[0].title).toBe('New Title');
		});
	});
});
```

### 7. Integration/Flow Test Pattern

Test complete user workflows:

```typescript
// Pattern from artist/tests/integration/commission-flow.test.ts
describe('Commission Flow Integration', () => {
	let mockAdapter: ReturnType<typeof createMockAdapter>;
	let mockTransport: ReturnType<typeof createMockTransportManager>;

	beforeEach(() => {
		mockAdapter = createMockAdapter();
		mockTransport = createMockTransportManager();
		vi.clearAllMocks();
	});

	describe('Full Commission Workflow', () => {
		it('completes inquiry to completion flow', async () => {
			const statuses = ['inquiry', 'quoted', 'accepted', 'in_progress', 'completed'];
			let commission = createMockCommission('flow-1', { status: 'inquiry' });

			for (let i = 1; i < statuses.length; i++) {
				mockAdapter.updateCommissionStatus.mockResolvedValue({ success: true });
				await mockAdapter.updateCommissionStatus(commission.id, statuses[i] as any);
				commission = { ...commission, status: statuses[i] as any };
				expect(commission.status).toBe(statuses[i]);
			}
		});
	});

	describe('Real-time Updates', () => {
		it('receives status update notifications', () => {
			const handler = vi.fn();
			mockTransport.subscribe('commission:1:updates', handler);

			mockTransport.emit('commission:1:updates', {
				type: 'status_changed',
				data: { status: 'quoted' },
			});

			expect(handler).toHaveBeenCalled();
		});
	});
});
```

### 8. Accessibility Test Pattern

Test keyboard navigation, screen reader support, and contrast:

```typescript
// Pattern from artist/tests/a11y/keyboard-navigation.test.ts
describe('Keyboard Navigation Accessibility', () => {
	describe('Gallery Arrow Key Navigation', () => {
		it('moves focus right with ArrowRight', () => {
			let focusIndex = 0;
			const itemCount = 10;

			const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
			if (event.key === 'ArrowRight' && focusIndex < itemCount - 1) {
				focusIndex++;
			}

			expect(focusIndex).toBe(1);
		});
	});

	describe('Modal Focus Trap', () => {
		it('traps focus within modal', () => {
			const focusableElements = ['close', 'prev', 'next', 'zoom-in', 'zoom-out'];
			let focusIndex = focusableElements.length - 1;
			focusIndex = (focusIndex + 1) % focusableElements.length;
			expect(focusIndex).toBe(0); // Wrapped to first
		});
	});
});
```

### 9. Coverage Harness Pattern

Systematic coverage generation:

```typescript
// Pattern from social/tests/components/coverage-harness.ts
interface Scenario {
	name: string;
	props: Record<string, unknown>;
	Wrapper?: any;
	wrapperProps?: Record<string, unknown>;
	action?: () => Promise<void>;
}

interface ComponentDefinition {
	component: any;
	scenarios: Scenario[];
}

export const componentsToCover: Record<string, ComponentDefinition> = {
	'Profile/FeaturedHashtags': {
		component: ProfileFeaturedHashtags,
		scenarios: [
			{ name: 'default', props: {}, Wrapper: ProfileRoot, wrapperProps: { profile: mockAccount } },
			{
				name: 'populated',
				props: { hashtags: mockHashtags },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
			},
			{
				name: 'ownProfile',
				props: { hashtags: mockHashtags, isOwnProfile: true },
				Wrapper: ProfileRoot,
				wrapperProps: { profile: mockAccount },
				action: async () => {
					const removeButtons = screen.getAllByLabelText(/Remove/);
					if (removeButtons[0]) await fireEvent.click(removeButtons[0]);
				},
			},
		],
	},
	// ... more components
};
```

---

## Gap Analysis: Blog & Community

### Blog Face Gaps

| Category              | Current                                  | Needed                                                                    |
| --------------------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| **Setup**             | Basic (matchMedia, IntersectionObserver) | Full setup with runes, canvas, IndexedDB, ResizeObserver                  |
| **Mock Factories**    | None                                     | Article, Author, Publication factories                                    |
| **Mock Adapters**     | None                                     | Blog adapter mock with CRUD operations                                    |
| **Smoke Tests**       | None                                     | All 5 component groups (Article, Author, Editor, Navigation, Publication) |
| **Behavior Tests**    | None                                     | Table of contents, share actions, reading progress                        |
| **Store Tests**       | None                                     | Article store, publication store                                          |
| **Pattern Tests**     | None                                     | Content rendering, TOC generation utilities                               |
| **Integration Tests** | None                                     | Article reading flow, editor flow                                         |
| **A11y Tests**        | None                                     | Keyboard navigation, screen reader, contrast                              |
| **Coverage Harness**  | None                                     | Systematic coverage of all components                                     |

### Community Face Gaps

| Category              | Current                                  | Needed                                                                            |
| --------------------- | ---------------------------------------- | --------------------------------------------------------------------------------- |
| **Setup**             | Basic (matchMedia, IntersectionObserver) | Full setup with runes, canvas, IndexedDB, ResizeObserver                          |
| **Mock Factories**    | None                                     | Community, Post, Comment, Flair factories                                         |
| **Mock Adapters**     | None                                     | Community adapter mock with subscriptions, voting, moderation                     |
| **Smoke Tests**       | None                                     | All 7 component groups (Community, Flair, Moderation, Post, Thread, Voting, Wiki) |
| **Behavior Tests**    | None                                     | Voting, comment threading, moderation actions                                     |
| **Store Tests**       | None                                     | Community store, post store, comment store                                        |
| **Pattern Tests**     | None                                     | Voting logic, comment threading utilities                                         |
| **Integration Tests** | None                                     | Post creation flow, moderation flow                                               |
| **A11y Tests**        | None                                     | Keyboard navigation, screen reader, contrast                                      |
| **Coverage Harness**  | None                                     | Systematic coverage of all components                                             |

---

## Implementation Plan

### Phase 1: Test Infrastructure (Priority: High)

1. **Enhance `setup.ts`** for both packages
   - Add Svelte 5 runes polyfills
   - Add ResizeObserver mock
   - Add Canvas context mock
   - Add IndexedDB mock
   - Add navigator.onLine mock
   - Add focus/blur mocks

2. **Create mock factories**
   - **Blog:** `mockArticle.ts`, `mockAuthor.ts`, `mockPublication.ts`
   - **Community:** `mockCommunity.ts`, `mockPost.ts`, `mockComment.ts`, `mockFlair.ts`

3. **Create mock adapters**
   - **Blog:** Article CRUD, publication operations
   - **Community:** Vote operations, comment CRUD, moderation actions, wiki operations

### Phase 2: Component Tests (Priority: High)

1. **Create smoke tests for all component groups**
   - Blog: Article, Author, Editor, Navigation, Publication
   - Community: Community, Flair, Moderation, Post, Thread, Voting, Wiki

2. **Create behavior tests for key interactions**
   - Blog: Table of contents navigation, share dialogs, reading progress, bookmark actions
   - Community: Voting, comment replies, moderation actions, flair selection

### Phase 3: Store & Pattern Tests (Priority: Medium)

1. **Create store tests**
   - Test state initialization, mutations, async operations
   - Test optimistic updates and error handling
   - Test subscription/reactivity

2. **Create pattern tests**
   - Blog: Content rendering, TOC generation, share URL generation
   - Community: Vote calculation, comment tree building, permission checks

### Phase 4: Integration Tests (Priority: Medium)

1. **Blog integration tests**
   - Full article reading flow
   - Editor create/edit flow
   - Publication navigation flow

2. **Community integration tests**
   - Post submission flow
   - Comment thread flow
   - Moderation workflow
   - Wiki editing flow

### Phase 5: Accessibility Tests (Priority: High)

1. **Keyboard navigation tests**
   - Blog: Article TOC navigation, editor keyboard shortcuts
   - Community: Voting via keyboard, comment navigation

2. **Screen reader tests**
   - ARIA labels on interactive elements
   - Live region announcements
   - Alt text on images

3. **Contrast tests**
   - Validate color contrast ratios
   - Test high contrast mode

### Phase 6: Coverage Harness (Priority: Low)

1. **Create coverage harness files**
   - Define all components and their scenarios
   - Include wrapper components for context providers
   - Add interaction actions for each scenario

2. **Create coverage test runner**
   - Iterate through all scenarios
   - Render and optionally execute actions
   - Verify no console errors

---

## File Structure Templates

### Blog Tests Structure (Target)

```
packages/faces/blog/tests/
├── setup.ts                           # Enhanced setup
├── a11y/
│   ├── contrast.test.ts
│   ├── keyboard-navigation.test.ts
│   └── screen-reader.test.ts
├── components/
│   ├── behavior/
│   │   ├── Article.behavior.test.ts
│   │   ├── Editor.behavior.test.ts
│   │   └── Navigation.behavior.test.ts
│   ├── smoke/
│   │   ├── Article.smoke.test.ts
│   │   ├── Author.smoke.test.ts
│   │   ├── Editor.smoke.test.ts
│   │   ├── Navigation.smoke.test.ts
│   │   └── Publication.smoke.test.ts
│   ├── coverage-harness.ts
│   └── coverage.test.ts
├── fixtures/
│   ├── ArticleTestWrapper.svelte
│   ├── EditorTestWrapper.svelte
│   └── ...
├── integration/
│   ├── article-reading.flow.test.ts
│   ├── editor.flow.test.ts
│   └── publication.flow.test.ts
├── mocks/
│   ├── index.ts
│   ├── mockAdapter.ts
│   ├── mockArticle.ts
│   ├── mockAuthor.ts
│   └── mockPublication.ts
├── patterns/
│   ├── content-rendering.test.ts
│   ├── share.test.ts
│   └── toc.test.ts
└── stores/
    ├── articleStore.test.ts
    └── publicationStore.test.ts
```

### Community Tests Structure (Target)

```
packages/faces/community/tests/
├── setup.ts                           # Enhanced setup
├── a11y/
│   ├── contrast.test.ts
│   ├── keyboard-navigation.test.ts
│   └── screen-reader.test.ts
├── components/
│   ├── behavior/
│   │   ├── Community.behavior.test.ts
│   │   ├── Moderation.behavior.test.ts
│   │   ├── Post.behavior.test.ts
│   │   ├── Thread.behavior.test.ts
│   │   ├── Voting.behavior.test.ts
│   │   └── Wiki.behavior.test.ts
│   ├── smoke/
│   │   ├── Community.smoke.test.ts
│   │   ├── Flair.smoke.test.ts
│   │   ├── Moderation.smoke.test.ts
│   │   ├── Post.smoke.test.ts
│   │   ├── Thread.smoke.test.ts
│   │   ├── Voting.smoke.test.ts
│   │   └── Wiki.smoke.test.ts
│   ├── coverage-harness.ts
│   └── coverage.test.ts
├── fixtures/
│   ├── CommunityTestWrapper.svelte
│   ├── PostTestWrapper.svelte
│   └── ...
├── integration/
│   ├── comment-thread.flow.test.ts
│   ├── moderation.flow.test.ts
│   ├── post-submission.flow.test.ts
│   └── wiki.flow.test.ts
├── mocks/
│   ├── index.ts
│   ├── mockAdapter.ts
│   ├── mockComment.ts
│   ├── mockCommunity.ts
│   ├── mockFlair.ts
│   └── mockPost.ts
├── patterns/
│   ├── comment-tree.test.ts
│   ├── permissions.test.ts
│   └── voting.test.ts
└── stores/
    ├── commentStore.test.ts
    ├── communityStore.test.ts
    └── postStore.test.ts
```

---

## Code Examples

### Enhanced Setup.ts Template

```typescript
/**
 * Test setup for [Package] Face
 *
 * Configures Vitest environment with JSDOM, mocks adapters and API calls,
 * and provides test utilities for comprehensive component testing.
 */

import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, vi, beforeAll } from 'vitest';

expect.extend(matchers);

// Svelte 5 runes polyfills for Vitest
const runtime = globalThis as typeof globalThis & {
	$state?: <T>(value: T) => T;
	$derived?: <T>(fn: () => T) => () => T;
	$effect?: (fn: () => void | (() => void)) => void;
};

if (typeof runtime.$state !== 'function') {
	// @ts-expect-error - Test polyfill doesn't need full Svelte 5 runes interface
	runtime.$state = <T>(value: T) => value;
}

if (typeof runtime.$derived !== 'function') {
	// @ts-expect-error - Test polyfill doesn't need full Svelte 5 runes interface
	runtime.$derived = <T>(fn: () => T) => fn;
}

if (typeof runtime.$effect !== 'function') {
	// @ts-expect-error - Test polyfill doesn't need full Svelte 5 runes interface
	runtime.$effect = () => {};
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
	callback: IntersectionObserverCallback;
	options?: IntersectionObserverInit;

	constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
		this.callback = callback;
		this.options = options;
	}

	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
	takeRecords = vi.fn().mockReturnValue([]);
}

Object.defineProperty(window, 'IntersectionObserver', {
	writable: true,
	value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
	callback: ResizeObserverCallback;

	constructor(callback: ResizeObserverCallback) {
		this.callback = callback;
	}

	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
	writable: true,
	value: MockResizeObserver,
});

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Mock focus-related APIs
global.HTMLElement.prototype.focus = vi.fn();
global.HTMLElement.prototype.blur = vi.fn();

// Mock canvas context for image processing
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
	drawImage: vi.fn(),
	getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4) }),
	putImageData: vi.fn(),
	createImageData: vi.fn(),
	scale: vi.fn(),
	translate: vi.fn(),
	rotate: vi.fn(),
	save: vi.fn(),
	restore: vi.fn(),
	fillRect: vi.fn(),
	clearRect: vi.fn(),
	measureText: vi.fn().mockReturnValue({ width: 0 }),
});

// Mock requestIdleCallback
// @ts-expect-error - Mock return type doesn't match exactly
global.requestIdleCallback = vi.fn((cb) => setTimeout(cb, 0));
global.cancelIdleCallback = vi.fn();

// Mock IndexedDB for offline store tests
const mockIndexedDB = {
	open: vi.fn().mockReturnValue({
		result: {
			createObjectStore: vi.fn(),
			transaction: vi.fn().mockReturnValue({
				objectStore: vi.fn().mockReturnValue({
					put: vi.fn(),
					get: vi.fn(),
					delete: vi.fn(),
					getAll: vi.fn(),
				}),
			}),
		},
		onerror: null,
		onsuccess: null,
		onupgradeneeded: null,
	}),
	deleteDatabase: vi.fn(),
};

Object.defineProperty(window, 'indexedDB', {
	writable: true,
	value: mockIndexedDB,
});

// Mock navigator.onLine for offline tests
Object.defineProperty(navigator, 'onLine', {
	writable: true,
	value: true,
});

// Set up environment variables for testing
beforeAll(() => {
	process.env['NODE_ENV'] = 'test';
});
```

### Mock Article Factory (Blog)

```typescript
/**
 * Mock Article Data
 *
 * Factory functions for generating sample article data for tests.
 */

import type { ArticleData } from '../../src/types.js';

export function createMockArticle(id: string, overrides: Partial<ArticleData> = {}): ArticleData {
	const base: ArticleData = {
		id,
		slug: `test-article-${id}`,
		metadata: {
			title: `Test Article ${id}`,
			description: `Description for article ${id}`,
			publishedAt: new Date('2024-01-15'),
			readingTime: 5,
			tags: ['test', 'svelte'],
		},
		content: '<h2>Introduction</h2><p>Test content</p>',
		contentFormat: 'html',
		author: {
			id: `author-${id}`,
			name: `Author ${id}`,
			avatar: `/avatars/author${id}.jpg`,
		},
		isPublished: true,
	};

	return {
		...base,
		...overrides,
		metadata: { ...base.metadata, ...overrides.metadata },
		author: { ...base.author, ...overrides.author },
	};
}

export function createMockArticleList(count: number, startId = 1): ArticleData[] {
	return Array.from({ length: count }, (_, i) => createMockArticle(`article-${startId + i}`));
}

export function createMockArticleWithSeries(id: string): ArticleData {
	return createMockArticle(id, {
		metadata: {
			title: `Series Article ${id}`,
			description: `Part of a series`,
			publishedAt: new Date(),
			series: {
				id: 'series-1',
				title: 'Test Series',
				description: 'A test series',
				totalParts: 3,
				currentPart: 1,
				parts: [
					{ number: 1, title: 'Part 1', slug: 'part-1', isPublished: true },
					{ number: 2, title: 'Part 2', slug: 'part-2', isPublished: true },
					{ number: 3, title: 'Part 3', slug: 'part-3', isPublished: false },
				],
			},
		},
	});
}
```

### Mock Community Factory (Community)

```typescript
/**
 * Mock Community Data
 *
 * Factory functions for generating sample community data for tests.
 */

import type { CommunityData, PostData, CommentData } from '../../src/types.js';

export function createMockCommunity(
	id: string,
	overrides: Partial<CommunityData> = {}
): CommunityData {
	const base: CommunityData = {
		id,
		name: `test-community-${id}`,
		title: `Test Community ${id}`,
		description: `A test community for unit testing`,
		rules: [
			{ order: 1, title: 'Be respectful', description: 'Treat others with respect' },
			{ order: 2, title: 'No spam', description: 'No unsolicited advertisements' },
		],
		stats: {
			subscriberCount: 10000,
			activeCount: 500,
			postCount: 25000,
			createdAt: new Date('2020-01-01'),
		},
	};

	return {
		...base,
		...overrides,
		stats: { ...base.stats, ...overrides.stats },
		rules: overrides.rules ?? base.rules,
	};
}

export function createMockPost(id: string, overrides: Partial<PostData> = {}): PostData {
	return {
		id,
		title: `Test Post ${id}`,
		type: 'text',
		content: `Content for post ${id}`,
		author: { id: `author-${id}`, username: `user${id}` },
		community: { id: 'c1', name: 'test', title: 'Test' },
		score: 100,
		upvoteRatio: 0.95,
		commentCount: 10,
		createdAt: new Date(),
		...overrides,
	};
}

export function createMockComment(
	id: string,
	parentId: string | null = null,
	depth = 0
): CommentData {
	return {
		id,
		parentId,
		postId: 'post-1',
		content: `Comment ${id}`,
		author: { id: `author-${id}`, username: `user${id}` },
		score: 50,
		createdAt: new Date(),
		depth,
	};
}

export function createMockCommentTree(): CommentData[] {
	return [
		{
			...createMockComment('c1', null, 0),
			children: [createMockComment('c2', 'c1', 1), createMockComment('c3', 'c1', 1)],
		},
		createMockComment('c4', null, 0),
	];
}
```

---

## Agent Implementation Prompt

Use the following prompt to drive an AI agent in implementing the improved testing approaches:

---

### Prompt: Implement Comprehensive Testing for Blog and Community Faces

**Context:**
You are tasked with improving the test coverage for the `packages/faces/blog` and `packages/faces/community` packages in the Greater Components repository. Reference the testing patterns established in `packages/faces/artist` and `packages/faces/social`.

**Reference Documentation:**

- Testing improvement plan: `docs/testing-improvement-plan-blog-community.md`
- Artist tests example: `packages/faces/artist/tests/`
- Social tests example: `packages/faces/social/tests/`

**Phase 1: Test Infrastructure**

1. **Enhance `tests/setup.ts`** in both `packages/faces/blog` and `packages/faces/community`:
   - Add Svelte 5 runes polyfills (`$state`, `$derived`, `$effect`)
   - Add `ResizeObserver` mock
   - Add `HTMLCanvasElement.prototype.getContext` mock
   - Add `requestIdleCallback` and `cancelIdleCallback` mocks
   - Add `indexedDB` mock
   - Add `navigator.onLine` mock
   - Add `HTMLElement.prototype.focus` and `blur` mocks
   - Reference: `packages/faces/artist/tests/setup.ts`

2. **Create mock factories** in `tests/mocks/`:
   - **Blog:** Create `mockArticle.ts`, `mockAuthor.ts`, `mockPublication.ts`
   - **Community:** Create `mockCommunity.ts`, `mockPost.ts`, `mockComment.ts`, `mockFlair.ts`
   - Include: factory functions, list generators, and variant generators
   - Reference: `packages/faces/artist/tests/mocks/mockArtwork.ts`

3. **Create mock adapters** in `tests/mocks/mockAdapter.ts`:
   - **Blog:** Article CRUD, publication operations, share tracking
   - **Community:** Vote operations, comment CRUD, moderation actions, subscription operations
   - Include: configurable delay, error simulation, transport manager mock
   - Reference: `packages/faces/artist/tests/mocks/mockAdapter.ts`

**Phase 2: Smoke Tests**

1. **Create smoke tests** in `tests/components/smoke/`:
   - **Blog:** `Article.smoke.test.ts`, `Author.smoke.test.ts`, `Editor.smoke.test.ts`, `Navigation.smoke.test.ts`, `Publication.smoke.test.ts`
   - **Community:** `Community.smoke.test.ts`, `Flair.smoke.test.ts`, `Moderation.smoke.test.ts`, `Post.smoke.test.ts`, `Thread.smoke.test.ts`, `Voting.smoke.test.ts`, `Wiki.smoke.test.ts`
   - Use `it.each` for testing multiple components
   - Spy on `console.error` and `console.warn` to verify no errors
   - Reference: `packages/faces/artist/tests/components/smoke/Gallery.smoke.test.ts`

**Phase 3: Behavior Tests**

1. **Create behavior tests** in `tests/components/behavior/`:
   - **Blog:** Table of contents navigation, share dialogs, reading progress tracking, bookmark actions
   - **Community:** Voting interactions, comment reply flow, moderation quick actions, flair selection
   - Use `vi.useFakeTimers()` for timing-dependent tests
   - Test keyboard interactions with `fireEvent.keyDown`
   - Reference: `packages/faces/artist/tests/components/behavior/Gallery.behavior.test.ts`

**Phase 4: Store Tests**

1. **Create store tests** in `tests/stores/`:
   - **Blog:** `articleStore.test.ts`, `publicationStore.test.ts`
   - **Community:** `communityStore.test.ts`, `postStore.test.ts`, `commentStore.test.ts`
   - Test: initialization, async operations, optimistic updates, error handling, subscriptions
   - Reference: `packages/faces/artist/tests/stores/galleryStore.test.ts`

**Phase 5: Integration Tests**

1. **Create integration tests** in `tests/integration/`:
   - **Blog:** `article-reading.flow.test.ts`, `editor.flow.test.ts`, `publication.flow.test.ts`
   - **Community:** `post-submission.flow.test.ts`, `comment-thread.flow.test.ts`, `moderation.flow.test.ts`, `wiki.flow.test.ts`
   - Test complete user workflows with mock adapters
   - Include real-time update simulation using mock transport
   - Reference: `packages/faces/artist/tests/integration/commission-flow.test.ts`

**Phase 6: Accessibility Tests**

1. **Create a11y tests** in `tests/a11y/`:
   - `keyboard-navigation.test.ts` - Arrow keys, Tab order, focus traps
   - `screen-reader.test.ts` - ARIA attributes, live regions, alt text
   - `contrast.test.ts` - Color contrast validation (optional)
   - Reference: `packages/faces/artist/tests/a11y/`

**Phase 7: Coverage Harness**

1. **Create coverage harness** in `tests/components/`:
   - `coverage-harness.ts` - Define all components with scenarios
   - `coverage.test.ts` - Runner that iterates through scenarios
   - Include wrapper components for context providers
   - Include interaction actions for interactive scenarios
   - Reference: `packages/faces/social/tests/components/coverage-harness.ts`

**Verification:**

After implementation, run the following commands to verify:

```bash
# Run tests for blog
cd packages/faces/blog && pnpm test

# Run tests for community
cd packages/faces/community && pnpm test

# Check coverage
pnpm test --coverage

# Run from root
pnpm test --filter=@equaltoai/greater-components-blog
pnpm test --filter=@equaltoai/greater-components-community
```

**Success Criteria:**

1. All new tests pass
2. No console errors or warnings in smoke tests
3. Test coverage improves significantly
4. `pnpm lint` and `pnpm check` pass
5. Test structure matches the patterns in artist/social packages

**Output Files Expected:**

For Blog (`packages/faces/blog/tests/`):

- `setup.ts` (enhanced)
- `mocks/mockAdapter.ts`
- `mocks/mockArticle.ts`
- `mocks/mockAuthor.ts`
- `mocks/mockPublication.ts`
- `mocks/index.ts`
- `components/smoke/*.smoke.test.ts` (5 files)
- `components/behavior/*.behavior.test.ts` (3 files)
- `stores/*.test.ts` (2 files)
- `integration/*.flow.test.ts` (3 files)
- `a11y/*.test.ts` (3 files)
- `components/coverage-harness.ts`
- `components/coverage.test.ts`

For Community (`packages/faces/community/tests/`):

- `setup.ts` (enhanced)
- `mocks/mockAdapter.ts`
- `mocks/mockCommunity.ts`
- `mocks/mockPost.ts`
- `mocks/mockComment.ts`
- `mocks/mockFlair.ts`
- `mocks/index.ts`
- `components/smoke/*.smoke.test.ts` (7 files)
- `components/behavior/*.behavior.test.ts` (6 files)
- `stores/*.test.ts` (3 files)
- `integration/*.flow.test.ts` (4 files)
- `a11y/*.test.ts` (3 files)
- `components/coverage-harness.ts`
- `components/coverage.test.ts`

---

_End of Testing Improvement Plan_
