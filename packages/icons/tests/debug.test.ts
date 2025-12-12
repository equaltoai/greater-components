import { describe, it, expect } from 'vitest';
import ActivityIcon from '../src/icons/activity.svelte';
import { mount, unmount } from 'svelte';

describe('Debug Icon', () => {
	it('renders ActivityIcon', () => {
		const target = document.createElement('div');
		const instance = mount(ActivityIcon, { target });
		expect(target.querySelector('svg')).toBeTruthy();
		unmount(instance);
	});
});
