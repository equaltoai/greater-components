import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import HeaderTest from './HeaderTest.svelte';
import { mockAccount } from '../../../src/mockData';

describe('Profile/Header', () => {
	const profile = {
		...mockAccount,
		fields: [
			{ name: 'Website', value: '<a href="https://example.com">example.com</a>', verifiedAt: '2023-01-01' },
			{ name: 'Location', value: 'Internet' }
		]
	};

	it('renders profile info', () => {
		render(HeaderTest, {
			profile,
			isOwnProfile: false
		});

		expect(screen.getByText(profile.displayName)).toBeTruthy();
		expect(screen.getByText(`@${profile.username}`)).toBeTruthy();
        
        // Check fields
        expect(screen.getByText('Website')).toBeTruthy();
        expect(screen.getByText('Location')).toBeTruthy();
	});

	it('renders edit button for own profile', () => {
        const toggleEdit = vi.fn(); // We can't easily spy on internal context methods unless we mock context
        // But we can check if the button is there.
        
		render(HeaderTest, {
			profile,
			isOwnProfile: true
		});

		expect(screen.getByText('Edit Profile')).toBeTruthy();
	});

    it('renders follow button for other profile', () => {
        const onFollow = vi.fn();
        
        render(HeaderTest, {
            profile: { ...profile, relationship: { following: false } },
            isOwnProfile: false,
            handlers: { onFollow }
        });
        
        const btn = screen.getByText('Follow');
        expect(btn).toBeTruthy();
        fireEvent.click(btn);
        
        // Wait for async?
        // The handler is passed to Root -> Context -> Header uses context.handlers
        expect(onFollow).toHaveBeenCalledWith(profile.id);
    });

    it('renders following state', () => {
        render(HeaderTest, {
            profile: { ...profile, relationship: { following: true } },
            isOwnProfile: false
        });
        
        expect(screen.getByText('Following')).toBeTruthy();
    });
});