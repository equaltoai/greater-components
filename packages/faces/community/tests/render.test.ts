import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Root from '../src/components/Community/Root.svelte';
import type { CommunityData } from '../src/types';

const mockCommunity: CommunityData = {
	id: 'test-community',
	name: 'test',
	title: 'Test Community',
	description: 'A test community',
	rules: [],
	stats: {
		subscriberCount: 100,
		activeCount: 10,
		postCount: 50,
		createdAt: new Date(),
	},
};

describe('Community/Root', () => {
	it('renders with minimal props', () => {
		const { container } = render(Root, {
			props: {
				community: mockCommunity,
			},
		});

		const element = container.querySelector('.gr-community');
		expect(element).toBeInTheDocument();
		expect(element).toHaveAttribute('data-community-id', 'test-community');
	});

	it('renders with compact config', () => {
		const { container } = render(Root, {
			props: {
				community: mockCommunity,
				config: { compact: true },
			},
		});

		const element = container.querySelector('.gr-community');
		expect(element).toHaveClass('gr-community--compact');
	});

	it('renders with custom class', () => {
		const { container } = render(Root, {
			props: {
				community: mockCommunity,
				config: { class: 'custom-class' },
			},
		});

		const element = container.querySelector('.gr-community');
		expect(element).toHaveClass('custom-class');
	});
});
