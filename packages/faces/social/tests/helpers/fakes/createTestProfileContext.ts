import { vi } from 'vitest';
import type {
	ProfileContext,
	ProfileState,
	ProfileHandlers,
} from '../../../src/components/Profile/context';
import type { LesserGraphQLAdapter } from '@equaltoai/greater-components-adapters';

export function createTestProfileContext(
	initialState: Partial<ProfileState> = {},
	initialHandlers: ProfileHandlers = {},
	adapter?: LesserGraphQLAdapter
): ProfileContext {
	const state: ProfileState = {
		profile: null,
		editMode: false,
		loading: false,
		error: null,
		activeTab: 'posts',
		tabs: [],
		isOwnProfile: false,
		followers: [],
		followersLoading: false,
		followersTotal: undefined,
		followersCursor: null,
		following: [],
		followingLoading: false,
		followingTotal: undefined,
		followingCursor: null,
		privacySettings: null,
		preferencesLoading: false,
		...initialState,
	};

	let handlers = { ...initialHandlers };

	const context: ProfileContext = {
		state,
		handlers,
		adapter,
		updateState: vi.fn((partial: Partial<ProfileState>) => {
			Object.assign(state, partial);
		}),
		setHandlers: vi.fn((nextHandlers: ProfileHandlers) => {
			handlers = nextHandlers;
			context.handlers = handlers; // Keep reference sync
		}),
		clearError: vi.fn(() => {
			state.error = null;
		}),
		toggleEdit: vi.fn(() => {
			state.editMode = !state.editMode;
		}),
		setActiveTab: vi.fn((tabId: string) => {
			state.activeTab = tabId;
			handlers.onTabChange?.(tabId);
		}),
	};

	return context;
}
