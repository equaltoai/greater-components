<script lang="ts">
	import type { ComponentType } from 'svelte';
	import AuthRoot from '../../src/components/Auth/Root.svelte';
	import type { AuthHandlers, AuthState } from '../../src/components/Auth/context.js';

let {
	component,
	componentProps = {},
	handlers = {},
	initialState = {},
} = $props<{
	component: ComponentType;
	componentProps?: Record<string, unknown>;
	handlers?: AuthHandlers;
	initialState?: Partial<AuthState>;
}>();

</script>

<AuthRoot {initialState} {handlers}>
    {@const ComponentToRender = component}
    <ComponentToRender {...componentProps} />
</AuthRoot>
