import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import AgentAttribution from '../src/Agents/AgentAttribution.svelte';

describe('Admin.AgentAttribution', () => {
	it('renders the v1.6.0 approval principal', () => {
		render(AgentAttribution, {
			attribution: {
				triggerType: 'scheduled',
				approvedBy: 'owner@example.social',
			},
		});

		expect(screen.getByText('Approved By')).toBeTruthy();
		expect(screen.getByText('owner@example.social')).toBeTruthy();
	});
});
