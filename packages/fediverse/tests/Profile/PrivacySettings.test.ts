import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import PrivacySettings from '../../src/components/Profile/PrivacySettings.svelte';
import ProfileTestHarness from './ProfileTestHarness.svelte';
import { createProfile, createMockHandlers } from './test-utils';
import type { ProfileHandlers, PrivacySettings as PrivacySettingsShape } from '../../src/components/Profile/context.js';

function renderPrivacySettings(
	settings: Partial<PrivacySettingsShape> = {},
	handlerOverrides: Partial<ProfileHandlers> = {}
) {
	const handlers = createMockHandlers(handlerOverrides);

	return render(ProfileTestHarness, {
		props: {
			component: PrivacySettings,
			componentProps: { settings },
			profile: createProfile(),
			handlers,
			isOwnProfile: true,
		},
	});
}

describe('Profile.PrivacySettings', () => {
	it('renders default checkbox states when no settings are provided', () => {
		renderPrivacySettings();

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

		renderPrivacySettings(initialSettings, { onUpdatePrivacySettings });

		const discoverable = screen.getByLabelText(/Suggest account to others/i) as HTMLInputElement;
		const autoplayVideos = screen.getByLabelText(/Autoplay videos/i) as HTMLInputElement;
		const saveButton = screen.getByRole('button', { name: /save changes/i });

		expect(discoverable.checked).toBe(false);
		expect(autoplayVideos.checked).toBe(true);
		expect(saveButton).toBeDisabled();

		await fireEvent.click(discoverable);
		await fireEvent.click(autoplayVideos);

		expect(discoverable.checked).toBe(true);
		expect(autoplayVideos.checked).toBe(false);
		expect(saveButton).not.toBeDisabled();

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
		renderPrivacySettings(
			{
				isPrivate: true,
				discoverable: true,
			},
			{ onUpdatePrivacySettings }
		);

		const privateAccount = screen.getByLabelText(/Private account/i) as HTMLInputElement;
		const resetButton = screen.getByRole('button', { name: /reset/i });

		expect(privateAccount.checked).toBe(true);
		expect(resetButton).toBeDisabled();

		await fireEvent.click(privateAccount);
		expect(privateAccount.checked).toBe(false);
		expect(resetButton).not.toBeDisabled();

		await fireEvent.click(resetButton);
		expect(privateAccount.checked).toBe(true);
		expect(resetButton).toBeDisabled();
	});
});
