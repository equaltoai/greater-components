import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import PrivacySettings from '../../src/components/Profile/PrivacySettings.svelte';
import type {
	ProfileHandlers,
	PrivacySettings as PrivacySettingsShape,
} from '../../src/components/Profile/context.js';

type MockProfileContext = {
	state: {
		isOwnProfile: boolean;
		privacySettings: PrivacySettingsShape | null;
	};
	handlers: ProfileHandlers;
};

const mockContext: MockProfileContext = {
	state: {
		isOwnProfile: false,
		privacySettings: null,
	},
	handlers: {},
};

vi.mock('../../src/components/Profile/context.js', () => ({
	getProfileContext: () => mockContext,
}));

function resetMockContext() {
	mockContext.state.isOwnProfile = false;
	mockContext.state.privacySettings = null;
	mockContext.handlers = {};
}

function withHandlers(overrides: Partial<ProfileHandlers>) {
	mockContext.handlers = { ...overrides } as ProfileHandlers;
}

function withState(overrides: Partial<MockProfileContext['state']>) {
	Object.assign(mockContext.state, overrides);
}

describe('Profile.PrivacySettings', () => {
	beforeEach(() => {
		resetMockContext();
	});

	it('renders default checkbox states when no settings are provided', () => {
		render(PrivacySettings, { settings: {} });

		expect((screen.getByLabelText(/Private account/i) as HTMLInputElement).checked).toBe(false);
		expect((screen.getByLabelText(/Allow search engine indexing/i) as HTMLInputElement).checked).toBe(true);
		expect((screen.getByLabelText(/Autoplay animated GIFs/i) as HTMLInputElement).checked).toBe(true);
		expect((screen.getByLabelText(/Autoplay videos/i) as HTMLInputElement).checked).toBe(false);
	});

	it('applies provided settings and submits updates when Save is clicked', async () => {
		const initialSettings: Partial<PrivacySettingsShape> = {
			isPrivate: true,
			requireFollowApproval: true,
			hideFollowers: true,
			hideFollowing: false,
			hideRelationships: false,
			searchableBySearchEngines: false,
			discoverable: false,
			showAdultContent: true,
			autoplayGifs: false,
			autoplayVideos: true,
		};

		const onUpdatePrivacySettings = vi.fn().mockResolvedValue(undefined);
		withHandlers({ onUpdatePrivacySettings });
		withState({ isOwnProfile: true });

		render(PrivacySettings, { settings: initialSettings });

		const discoverable = screen.getByLabelText(/Suggest account to others/i) as HTMLInputElement;
		const autoplayVideos = screen.getByLabelText(/Autoplay videos/i) as HTMLInputElement;
		const saveButton = screen.getByRole('button', { name: /save changes/i });

		expect(discoverable.checked).toBe(false);
		expect(autoplayVideos.checked).toBe(true);
		expect(saveButton).to.have.property('disabled', true);

		await fireEvent.click(discoverable);
		await fireEvent.click(autoplayVideos);

		expect(discoverable.checked).toBe(true);
		expect(autoplayVideos.checked).toBe(false);
		expect(saveButton).to.have.property('disabled', false);

		await fireEvent.click(saveButton);

		await waitFor(() => {
			expect(onUpdatePrivacySettings).toHaveBeenCalledTimes(1);
		});

		const [payload] = onUpdatePrivacySettings.mock.calls[0];
		expect(payload.isPrivate).toBe(true);
		expect(payload.discoverable).toBe(true);
		expect(payload.autoplayVideos).toBe(false);
	});

	it('allows resetting changes back to the original values', async () => {
		const onUpdatePrivacySettings = vi.fn().mockResolvedValue(undefined);
		withHandlers({ onUpdatePrivacySettings });
		withState({ isOwnProfile: true });

		render(PrivacySettings, {
			settings: {
				isPrivate: true,
				discoverable: true,
			},
		});

		const privateAccount = screen.getByLabelText(/Private account/i) as HTMLInputElement;
		const resetButton = screen.getByRole('button', { name: /reset/i });

		expect(privateAccount.checked).toBe(true);
		expect(resetButton).to.have.property('disabled', true);

		await fireEvent.click(privateAccount);
		expect(privateAccount.checked).toBe(false);
		expect(resetButton).to.have.property('disabled', false);

		await fireEvent.click(resetButton);
		expect(privateAccount.checked).toBe(true);
		expect(resetButton).to.have.property('disabled', true);
	});
});
