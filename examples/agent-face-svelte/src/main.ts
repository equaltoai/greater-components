import { mount } from 'svelte';
import AgentFaceDemo from './AgentFaceDemo.svelte';

const target = document.getElementById('app');

if (!target) {
	throw new Error('Agent face example mount point is missing');
}

mount(AgentFaceDemo, {
	target,
});
