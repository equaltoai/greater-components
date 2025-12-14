import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import ButtonHarness from './harness/ButtonHarness.svelte';

const renderButton = (props?: Record<string, unknown>, label = 'Action') =>
	render(ButtonHarness, {
		props: { props, label },
	});

describe('Button.svelte', () => {
	it('calls onclick when enabled', async () => {
		const handleClick = vi.fn();
		renderButton({ onclick: handleClick });

		await fireEvent.click(screen.getByRole('button'));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('prevents clicks when disabled', async () => {
		const handleClick = vi.fn();
		renderButton({ disabled: true, onclick: handleClick });

		const button = screen.getByRole('button');
		expect(button.getAttribute('disabled')).toBeDefined();
		expect(button.getAttribute('aria-disabled')).toBe('true');

		await fireEvent.click(button);
		expect(handleClick).not.toHaveBeenCalled();
	});

	it('shows loading spinner and suppresses clicks when loading', async () => {
		const handleClick = vi.fn();
		const { container } = renderButton({ loading: true, onclick: handleClick });

		const button = screen.getByRole('button');
		expect(button.getAttribute('aria-busy')).toBe('true');
		expect(container.querySelector('.gr-button__spinner')).toBeTruthy();

		await fireEvent.click(button);
		expect(handleClick).not.toHaveBeenCalled();
	});

	describe('Variants', () => {
		const variants = ['solid', 'outline', 'ghost'] as const;

		variants.forEach((variant) => {
			it(`renders ${variant} variant class`, () => {
				const { container } = renderButton({ variant });
				const button = container.querySelector('button');
				expect(button?.classList.contains(`gr-button--${variant}`)).toBe(true);
			});
		});
	});

	describe('Sizes', () => {
		const sizes = ['sm', 'md', 'lg'] as const;

		sizes.forEach((size) => {
			it(`renders ${size} size class`, () => {
				const { container } = renderButton({ size });
				const button = container.querySelector('button');
				expect(button?.classList.contains(`gr-button--${size}`)).toBe(true);
			});
		});
	});

	describe('Loading Behaviors', () => {
		it('renders prepend spinner', () => {
			const { container } = renderButton({ loading: true, loadingBehavior: 'prepend' });
			expect(container.querySelector('.gr-button__spinner--prepend')).toBeTruthy();
		});

		it('renders append spinner', () => {
			const { container } = renderButton({ loading: true, loadingBehavior: 'append' });
			expect(container.querySelector('.gr-button__spinner--append')).toBeTruthy();
		});

		it('renders prefix spinner (default)', () => {
			const { container } = renderButton({ loading: true, loadingBehavior: 'replace-prefix' });
			expect(container.querySelector('.gr-button__spinner--prefix')).toBeTruthy();
		});
	});

	describe('Keyboard Interaction', () => {
		it('triggers onclick on Enter', async () => {
			const handleClick = vi.fn();
			renderButton({ onclick: handleClick });

			const button = screen.getByRole('button');
			button.focus();
			await fireEvent.keyDown(button, { key: 'Enter' });

			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it('triggers onclick on Space', async () => {
			const handleClick = vi.fn();
			renderButton({ onclick: handleClick });

			const button = screen.getByRole('button');
			button.focus();
			await fireEvent.keyDown(button, { key: ' ' });

			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it('does not trigger on Enter when disabled', async () => {
			const handleClick = vi.fn();
			renderButton({ disabled: true, onclick: handleClick });

			const button = screen.getByRole('button');
			button.focus();
			await fireEvent.keyDown(button, { key: 'Enter' });

			expect(handleClick).not.toHaveBeenCalled();
		});

		it('calls onkeydown prop', async () => {
			const handleKeydown = vi.fn();
			renderButton({ onkeydown: handleKeydown });

			const button = screen.getByRole('button');
			await fireEvent.keyDown(button, { key: 'A' });

			expect(handleKeydown).toHaveBeenCalled();
		});
	});
});
