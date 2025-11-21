import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Card from '../src/components/Card.svelte';
import CardHarness from './harness/CardHarness.svelte';

describe('Card.svelte', () => {
	it('renders with elevated variant by default', () => {
		const { container } = render(Card);
		const card = container.querySelector('.gr-card');
		expect(card).toBeTruthy();
		expect(card?.classList.contains('gr-card--elevated')).toBe(true);
	});

	it('renders with outlined variant', () => {
		const { container } = render(Card, { variant: 'outlined' });
		const card = container.querySelector('.gr-card');
		expect(card?.classList.contains('gr-card--outlined')).toBe(true);
	});

	it('renders with filled variant', () => {
		const { container } = render(Card, { variant: 'filled' });
		const card = container.querySelector('.gr-card');
		expect(card?.classList.contains('gr-card--filled')).toBe(true);
	});

	it('applies padding variants correctly', () => {
		const paddings = ['none', 'sm', 'md', 'lg'] as const;
		paddings.forEach((padding) => {
			const { container } = render(Card, { padding });
			const card = container.querySelector('.gr-card');
			expect(card?.classList.contains(`gr-card--padding-${padding}`)).toBe(true);
		});
	});

	it('renders header snippet when provided', () => {
		const { getByText } = render(CardHarness, {
			headerContent: '<div>Header Content</div>',
		});
		expect(getByText('Header Content')).toBeTruthy();
	});

	it('renders footer snippet when provided', () => {
		const { getByText } = render(CardHarness, {
			footerContent: '<div>Footer Content</div>',
		});
		expect(getByText('Footer Content')).toBeTruthy();
	});

	it('renders children content', () => {
		const { getByText } = render(CardHarness, {
			childrenContent: '<div>Main Content</div>',
		});
		expect(getByText('Main Content')).toBeTruthy();
	});

	it('calls onclick when clickable and clicked', async () => {
		const handleClick = vi.fn();
		const { container } = render(Card, { clickable: true, onclick: handleClick });
		const button = container.querySelector('button');
		expect(button).toBeTruthy();
		if (!button) throw new Error('Button not found');
		await fireEvent.click(button);
		expect(handleClick).toHaveBeenCalled();
	});

	it('renders as button element when clickable', () => {
		const { container } = render(Card, { clickable: true });
		const button = container.querySelector('button.gr-card');
		expect(button).toBeTruthy();
		expect(button?.classList.contains('gr-card--clickable')).toBe(true);
	});

	it('adds hover styles when hoverable', () => {
		const { container } = render(Card, { hoverable: true });
		const card = container.querySelector('.gr-card');
		expect(card?.classList.contains('gr-card--hoverable')).toBe(true);
	});

	it('prevents interaction when not clickable', async () => {
		const handleClick = vi.fn();
		const { container } = render(Card, { onclick: handleClick });
		const card = container.querySelector('.gr-card');
		expect(card).toBeTruthy();
		if (!card) throw new Error('Card not found');
		expect(card.tagName.toLowerCase()).toBe('div');

		// Since clickable is false, and we destructured onclick, it should NOT be applied to the div
		await fireEvent.click(card);
		expect(handleClick).not.toHaveBeenCalled();
	});

	it('renders as semantic button when clickable', () => {
		const { getByRole } = render(Card, { clickable: true });
		expect(getByRole('button')).toBeTruthy();
	});

	it('has proper role when clickable', () => {
		const { getByRole } = render(Card, { clickable: true });
		expect(getByRole('button')).toBeTruthy();
	});

	it('is keyboard accessible when clickable', async () => {
		const handleClick = vi.fn();
		const { container } = render(Card, { clickable: true, onclick: handleClick });
		const button = container.querySelector('button');
		expect(button).toBeTruthy();
		if (!button) throw new Error('Button not found');

		button.focus();
		await fireEvent.keyDown(button, { key: 'Enter' });
		expect(handleClick).toHaveBeenCalled();
	});

	it('respects aria-label prop', () => {
		const { getByLabelText } = render(Card, { 'aria-label': 'Test Card', clickable: true });
		expect(getByLabelText('Test Card')).toBeTruthy();
	});

	it('applies custom className', () => {
		const { container } = render(Card, { class: 'custom-class' });
		const card = container.querySelector('.gr-card');
		expect(card).toBeTruthy();
		if (!card) throw new Error('Card not found');
		expect(card.classList.contains('custom-class')).toBe(true);
	});
});
