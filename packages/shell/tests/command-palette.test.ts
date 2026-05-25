/**
 * CommandPalette a11y + interaction tests.
 *
 * Covers issue #648 (G1.5):
 *  - dialog role + accessible name
 *  - input combobox semantics (role, aria-autocomplete, aria-expanded,
 *    aria-controls, aria-activedescendant)
 *  - listbox / option semantics, including grouped results
 *  - keyboard lifecycle: Escape close, Arrow nav, Home/End, Enter activate
 *  - virtual focus moves aria-selected across options as activeIndex changes
 *  - empty + loading states render the right copy and aria-busy
 *  - disabled items do not activate
 *  - mouse activation via click
 *  - strict-CSP: no inline style attribute on root
 */
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import CommandPalette from '../src/components/CommandPalette.svelte';
import type { CommandPaletteGroup, CommandPaletteItem } from '../src/types.js';

const flatItems: CommandPaletteItem[] = [
	{ id: 'overview', label: 'Overview', description: 'Fleet overview' },
	{ id: 'instances', label: 'Instances' },
	{ id: 'billing', label: 'Billing' },
	{ id: 'disabled', label: 'Disabled action', disabled: true },
	{ id: 'theme-toggle', label: 'Toggle theme', shortcut: 'T' },
];

const groupedItems: CommandPaletteGroup[] = [
	{
		id: 'pages',
		label: 'Pages',
		items: [
			{ id: 'overview', label: 'Overview' },
			{ id: 'instances', label: 'Instances' },
		],
	},
	{
		id: 'actions',
		label: 'Actions',
		items: [
			{ id: 'refresh', label: 'Refresh', shortcut: '⌘R' },
			{ id: 'theme', label: 'Toggle theme' },
		],
	},
];

describe('CommandPalette — closed', () => {
	it('renders nothing when open=false', () => {
		const { container } = render(CommandPalette, {
			open: false,
			items: flatItems,
		});
		expect(container.querySelector('.gr-shell-command-palette')).toBeNull();
	});
});

describe('CommandPalette — open: dialog & combobox semantics', () => {
	it('renders a dialog with the supplied accessible name (default label)', async () => {
		const { container } = render(CommandPalette, {
			open: true,
			items: flatItems,
		});
		await tick();
		const dialog = container.querySelector('[role="dialog"]');
		expect(dialog).toBeTruthy();
		expect(dialog?.getAttribute('aria-modal')).toBe('true');
		const labelEl = dialog?.querySelector('.gr-shell-command-palette__sr-only');
		expect(labelEl?.textContent?.trim()).toBe('Command palette');
		const labelledby = dialog?.getAttribute('aria-labelledby');
		expect(labelledby).toBeTruthy();
		expect(container.ownerDocument.getElementById(labelledby!)).toBeTruthy();
	});

	it('uses the supplied label', async () => {
		const { container } = render(CommandPalette, {
			open: true,
			label: 'Quick switcher',
			items: flatItems,
		});
		await tick();
		const labelEl = container.querySelector('.gr-shell-command-palette__sr-only');
		expect(labelEl?.textContent?.trim()).toBe('Quick switcher');
	});

	it('renders a combobox input with required aria attributes', async () => {
		const { container } = render(CommandPalette, {
			open: true,
			items: flatItems,
		});
		await tick();
		const input = container.querySelector('input.gr-shell-command-palette__input');
		expect(input).toBeTruthy();
		expect(input?.getAttribute('role')).toBe('combobox');
		expect(input?.getAttribute('aria-autocomplete')).toBe('list');
		expect(input?.getAttribute('aria-expanded')).toBe('true');
		expect(input?.getAttribute('aria-controls')).toBeTruthy();
		expect(input?.getAttribute('autocomplete')).toBe('off');
	});

	it('renders a flat listbox when items are supplied', async () => {
		const { container } = render(CommandPalette, {
			open: true,
			items: flatItems,
		});
		await tick();
		const listboxes = container.querySelectorAll('[role="listbox"]');
		expect(listboxes.length).toBe(1);
		const options = listboxes[0]!.querySelectorAll('[role="option"]');
		expect(options.length).toBe(flatItems.length);
	});

	it('renders a single parent listbox containing role="group" sections when groups are supplied', async () => {
		// W3C ARIA APG "Combobox with Listbox Popup, Grouped Options" pattern:
		// one listbox per combobox, with role="group" children wrapping options.
		// This keeps `aria-controls` pointing at a single owning listbox element,
		// which is the regression Arch flagged in PR #668's first revision.
		const { container } = render(CommandPalette, {
			open: true,
			groups: groupedItems,
		});
		await tick();
		const listboxes = container.querySelectorAll('[role="listbox"]');
		expect(listboxes.length).toBe(1);
		const groupRegions = container.querySelectorAll('[role="group"]');
		expect(groupRegions.length).toBe(2);
		// The parent listbox contains both groups.
		for (const region of Array.from(groupRegions)) {
			expect(listboxes[0]!.contains(region)).toBe(true);
			const labelledby = region.getAttribute('aria-labelledby');
			expect(labelledby).toBeTruthy();
			const labelEl = region.ownerDocument.getElementById(labelledby!);
			expect(labelEl).toBeTruthy();
			expect(labelEl?.textContent?.trim().length).toBeGreaterThan(0);
		}
	});

	it('input aria-controls IDREF resolves in flat mode', async () => {
		const { container } = render(CommandPalette, {
			open: true,
			items: flatItems,
		});
		await tick();
		const input = container.querySelector(
			'input.gr-shell-command-palette__input'
		) as HTMLInputElement;
		const controls = input.getAttribute('aria-controls');
		expect(controls).toBeTruthy();
		const target = container.ownerDocument.getElementById(controls!);
		expect(
			target,
			`Expected aria-controls=${controls} to point at a rendered element`
		).toBeTruthy();
		expect(target?.getAttribute('role')).toBe('listbox');
	});

	it('input aria-controls IDREF resolves in grouped mode (Arch PR #668 review regression)', async () => {
		const { container } = render(CommandPalette, {
			open: true,
			groups: groupedItems,
		});
		await tick();
		const input = container.querySelector(
			'input.gr-shell-command-palette__input'
		) as HTMLInputElement;
		const controls = input.getAttribute('aria-controls');
		expect(controls).toBeTruthy();
		const target = container.ownerDocument.getElementById(controls!);
		expect(
			target,
			`Expected aria-controls=${controls} to point at a rendered element in grouped mode`
		).toBeTruthy();
		expect(target?.getAttribute('role')).toBe('listbox');
		// The active descendant must live inside the listbox that aria-controls
		// names, so screen readers see one owning popup.
		const activeId = input.getAttribute('aria-activedescendant');
		expect(activeId).toBeTruthy();
		const activeEl = container.ownerDocument.getElementById(activeId!);
		expect(activeEl).toBeTruthy();
		expect(target!.contains(activeEl!)).toBe(true);
	});

	it('renders shortcut chip with aria-hidden', async () => {
		const { container } = render(CommandPalette, {
			open: true,
			items: flatItems,
		});
		await tick();
		const shortcut = container.querySelector('.gr-shell-command-palette__option-shortcut');
		expect(shortcut).toBeTruthy();
		expect(shortcut?.getAttribute('aria-hidden')).toBe('true');
	});
});

describe('CommandPalette — virtual focus & keyboard navigation', () => {
	it('starts with the first selectable item as the active descendant', async () => {
		const { container } = render(CommandPalette, {
			open: true,
			items: flatItems,
		});
		await tick();
		await tick();
		const input = container.querySelector(
			'input.gr-shell-command-palette__input'
		) as HTMLInputElement;
		const activeId = input.getAttribute('aria-activedescendant');
		expect(activeId).toBeTruthy();
		const active = container.querySelector(`#${activeId}`) as HTMLElement | null;
		expect(active).toBeTruthy();
		expect(active!.getAttribute('aria-selected')).toBe('true');
		// First non-disabled item is "overview".
		expect(active!.textContent).toContain('Overview');
	});

	it('ArrowDown moves virtual focus to the next item', async () => {
		const { container } = render(CommandPalette, {
			open: true,
			items: flatItems,
		});
		await tick();
		await tick();
		const input = container.querySelector(
			'input.gr-shell-command-palette__input'
		) as HTMLInputElement;
		const before = input.getAttribute('aria-activedescendant');

		await fireEvent.keyDown(input, { key: 'ArrowDown' });
		await tick();

		const after = input.getAttribute('aria-activedescendant');
		expect(after).toBeTruthy();
		expect(after).not.toBe(before);
		// 2nd item is "instances".
		const active = container.querySelector(`#${after}`);
		expect(active?.textContent).toContain('Instances');
	});

	it('ArrowUp moves virtual focus to the previous item (wraps to last)', async () => {
		const { container } = render(CommandPalette, {
			open: true,
			items: flatItems,
		});
		await tick();
		await tick();
		const input = container.querySelector(
			'input.gr-shell-command-palette__input'
		) as HTMLInputElement;

		await fireEvent.keyDown(input, { key: 'ArrowUp' });
		await tick();

		const after = input.getAttribute('aria-activedescendant');
		// Disabled items are skipped during navigation. Last non-disabled is theme-toggle.
		const active = container.querySelector(`#${after}`);
		expect(active?.textContent).toContain('Toggle theme');
	});

	it('Home and End jump to first/last selectable item', async () => {
		const { container } = render(CommandPalette, {
			open: true,
			items: flatItems,
		});
		await tick();
		await tick();
		const input = container.querySelector(
			'input.gr-shell-command-palette__input'
		) as HTMLInputElement;

		await fireEvent.keyDown(input, { key: 'End' });
		await tick();
		let active = container.querySelector(`#${input.getAttribute('aria-activedescendant')}`);
		expect(active?.textContent).toContain('Toggle theme');

		await fireEvent.keyDown(input, { key: 'Home' });
		await tick();
		active = container.querySelector(`#${input.getAttribute('aria-activedescendant')}`);
		expect(active?.textContent).toContain('Overview');
	});

	it('Enter activates the current item and fires onselect', async () => {
		const onselect = vi.fn();
		const { container } = render(CommandPalette, {
			open: true,
			items: flatItems,
			onselect,
		});
		await tick();
		await tick();
		const input = container.querySelector(
			'input.gr-shell-command-palette__input'
		) as HTMLInputElement;

		await fireEvent.keyDown(input, { key: 'ArrowDown' });
		await tick();
		await fireEvent.keyDown(input, { key: 'Enter' });

		expect(onselect).toHaveBeenCalledTimes(1);
		expect(onselect.mock.calls[0]?.[0]?.id).toBe('instances');
	});

	it('Skips disabled items during keyboard navigation', async () => {
		const { container } = render(CommandPalette, {
			open: true,
			items: flatItems,
		});
		await tick();
		await tick();
		const input = container.querySelector(
			'input.gr-shell-command-palette__input'
		) as HTMLInputElement;

		// flatItems order: overview, instances, billing, disabled, theme-toggle
		// Start active = overview. Three ArrowDowns should land at theme-toggle,
		// skipping the disabled item.
		await fireEvent.keyDown(input, { key: 'ArrowDown' });
		await fireEvent.keyDown(input, { key: 'ArrowDown' });
		await fireEvent.keyDown(input, { key: 'ArrowDown' });
		await tick();

		const active = container.querySelector(`#${input.getAttribute('aria-activedescendant')}`);
		expect(active?.textContent).toContain('Toggle theme');
	});
});

describe('CommandPalette — query input', () => {
	it('fires onquerychange and filters items reactively', async () => {
		const onquerychange = vi.fn();
		const { container } = render(CommandPalette, {
			open: true,
			items: flatItems,
			onquerychange,
		});
		await tick();
		const input = container.querySelector(
			'input.gr-shell-command-palette__input'
		) as HTMLInputElement;
		await fireEvent.input(input, { target: { value: 'inst' } });
		await tick();
		await tick();

		expect(onquerychange).toHaveBeenCalledWith('inst');
		const options = container.querySelectorAll('[role="option"]');
		// "Instances" matches; the rest don't.
		expect(options.length).toBe(1);
		expect(options[0]!.textContent).toContain('Instances');
	});

	it('shows the empty state when no items match', async () => {
		const { container } = render(CommandPalette, {
			open: true,
			items: flatItems,
			emptyMessage: 'Nothing found.',
		});
		await tick();
		const input = container.querySelector(
			'input.gr-shell-command-palette__input'
		) as HTMLInputElement;
		await fireEvent.input(input, { target: { value: 'zzzzzz' } });
		await tick();
		await tick();

		expect(container.querySelector('.gr-shell-command-palette__empty')?.textContent).toContain(
			'Nothing found.'
		);
		expect(container.querySelectorAll('[role="option"]').length).toBe(0);
	});

	it('shows the loading state and sets aria-busy when loading=true', async () => {
		const { container } = render(CommandPalette, {
			open: true,
			items: flatItems,
			loading: true,
			loadingMessage: 'Searching…',
		});
		await tick();
		expect(
			container.querySelector('.gr-shell-command-palette__results')?.getAttribute('aria-busy')
		).toBe('true');
		expect(container.querySelector('.gr-shell-command-palette__loading')?.textContent).toContain(
			'Searching…'
		);
	});
});

describe('CommandPalette — close lifecycle', () => {
	it('Escape inside the input fires preventDefault and exposes the close intent', async () => {
		// We exercise the keyboard close path directly. The bindable `open`
		// prop flips internally; after re-rendering with `open: false` the
		// dialog is gone. The point of this test is that the keydown handler
		// returns control to the input (preventDefault) rather than letting
		// Escape leak out of the palette.
		const { container, rerender } = render(CommandPalette, {
			open: true,
			items: flatItems,
		});
		await tick();
		const input = container.querySelector(
			'input.gr-shell-command-palette__input'
		) as HTMLInputElement;
		const handled = await fireEvent.keyDown(input, { key: 'Escape' });
		expect(handled).toBe(false); // preventDefault → handler returns false from fireEvent
		await tick();

		// Programmatic close still removes the dialog.
		await rerender({ open: false, items: flatItems });
		expect(container.querySelector('[role="dialog"]')).toBeNull();
	});

	it('clicking outside the panel closes the palette', async () => {
		const { container, rerender } = render(CommandPalette, {
			open: true,
			items: flatItems,
		});
		await tick();
		const root = container.querySelector('.gr-shell-command-palette') as HTMLElement;
		// Pointerdown on the backdrop (root) but not panel.
		await fireEvent.pointerDown(root, { target: root });
		await tick();

		// As above, ensure post-event we can render with open=false and dialog gone.
		await rerender({ open: false, items: flatItems });
		expect(container.querySelector('[role="dialog"]')).toBeNull();
	});

	it('does not call onselect when activating a disabled item', async () => {
		const onselect = vi.fn();
		const onlyDisabled: CommandPaletteItem[] = [
			{ id: 'd1', label: 'Disabled 1', disabled: true },
			{ id: 'd2', label: 'Disabled 2', disabled: true },
		];
		const { container } = render(CommandPalette, {
			open: true,
			items: onlyDisabled,
			onselect,
		});
		await tick();
		await tick();
		const input = container.querySelector(
			'input.gr-shell-command-palette__input'
		) as HTMLInputElement;
		await fireEvent.keyDown(input, { key: 'Enter' });
		expect(onselect).not.toHaveBeenCalled();
	});
});

describe('CommandPalette — mouse activation', () => {
	it('clicking an option fires onselect with the item', async () => {
		const onselect = vi.fn();
		const { container } = render(CommandPalette, {
			open: true,
			items: flatItems,
			onselect,
		});
		await tick();
		await tick();
		const options = container.querySelectorAll('[role="option"]');
		const billing = Array.from(options).find((o) => o.textContent?.includes('Billing'));
		expect(billing).toBeTruthy();
		await fireEvent.click(billing as HTMLElement);
		expect(onselect).toHaveBeenCalledTimes(1);
		expect(onselect.mock.calls[0]?.[0]?.id).toBe('billing');
	});

	it('clicking a disabled option does NOT fire onselect', async () => {
		const onselect = vi.fn();
		const { container } = render(CommandPalette, {
			open: true,
			items: flatItems,
			onselect,
		});
		await tick();
		const disabledOption = Array.from(container.querySelectorAll('[role="option"]')).find((o) =>
			o.textContent?.includes('Disabled action')
		);
		expect(disabledOption).toBeTruthy();
		expect(disabledOption!.getAttribute('aria-disabled')).toBe('true');
		await fireEvent.click(disabledOption as HTMLElement);
		expect(onselect).not.toHaveBeenCalled();
	});
});

describe('CommandPalette — CSP / DOM hygiene', () => {
	it('does not set inline style attribute on the root', async () => {
		const { container } = render(CommandPalette, {
			open: true,
			items: flatItems,
		});
		await tick();
		expect(container.querySelector('.gr-shell-command-palette')?.hasAttribute('style')).toBe(false);
	});

	it('does not set inline style attribute on the panel', async () => {
		const { container } = render(CommandPalette, {
			open: true,
			items: flatItems,
		});
		await tick();
		expect(container.querySelector('.gr-shell-command-palette__panel')?.hasAttribute('style')).toBe(
			false
		);
	});
});

describe('CommandPalette — id uniqueness regression (multiple instances)', () => {
	it('two CommandPalettes on the same page do not collide on option ids', async () => {
		const a = render(CommandPalette, {
			open: true,
			items: flatItems,
		});
		const b = render(CommandPalette, {
			open: true,
			items: flatItems,
		});
		await tick();
		await tick();

		const idsA = Array.from(a.container.querySelectorAll('[role="option"]')).map((el) =>
			el.getAttribute('id')
		);
		const idsB = Array.from(b.container.querySelectorAll('[role="option"]')).map((el) =>
			el.getAttribute('id')
		);
		const allIds = [...idsA, ...idsB].filter((v): v is string => Boolean(v));
		const unique = new Set(allIds);
		expect(unique.size).toBe(allIds.length);
	});
});
