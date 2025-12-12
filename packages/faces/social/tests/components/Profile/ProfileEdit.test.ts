import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import EditTest from './EditTest.svelte';
import { mockAccount } from '../../../src/mockData';

describe('Profile/Edit', () => {
	const profile = {
		...mockAccount,
        fields: []
	};

	it('renders edit form with initial values', () => {
		render(EditTest, {
			profile,
			isOwnProfile: true
		});

		expect(screen.getByDisplayValue(profile.displayName)).toBeTruthy();
        // Bio might be empty or mocked
        if (profile.bio) {
             // sanitizeHtml usage in header might strip tags, but here it binds to value
             // MockAccount bio has html. Edit form binds to value.
             // Usually binding handles raw text. The mock bio has <p> etc.
             // Let's check if we find the bio text.
             expect(screen.getByText('Bio')).toBeTruthy();
        }
	});
    
    it('updates fields', async () => {
        render(EditTest, {
            profile: { ...profile, displayName: 'Old Name' },
            isOwnProfile: true
        });
        
        const input = screen.getByLabelText('Display Name');
        await fireEvent.input(input, { target: { value: 'New Name' } });
        
        expect(input).toHaveValue('New Name');
    });
    
    it('handles save', async () => {
        const onSave = vi.fn();
        
        render(EditTest, {
            profile,
            isOwnProfile: true,
            handlers: { onSave }
        });
        
        const saveBtn = screen.getByText('Save Profile');
        await fireEvent.click(saveBtn);
        
        expect(onSave).toHaveBeenCalled();
    });
    
    it('adds and removes fields', async () => {
        render(EditTest, {
            profile,
            isOwnProfile: true
        });
        
        const addBtn = screen.getByText('Add Field');
        await fireEvent.click(addBtn);
        
        const inputs = screen.getAllByPlaceholderText('Label');
        expect(inputs.length).toBeGreaterThan(0);
        
        const removeBtn = screen.getByLabelText('Remove field');
        await fireEvent.click(removeBtn);
        
        // Should be gone
        expect(screen.queryByPlaceholderText('Label')).toBeFalsy();
    });
});
