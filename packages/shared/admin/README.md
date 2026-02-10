# @equaltoai/greater-components-admin

Admin dashboard components for Greater Components.

These components are API-agnostic: you provide `handlers` to `Admin.Root` to fetch data and perform actions.

## Usage (recommended)

```svelte
<script>
	import * as Admin from '@equaltoai/greater-components/shared/admin';
</script>

<Admin.Root
	handlers={{
		// Users
		onFetchUsers: async (filters) => [],
		onSuspendUser: async (userId, reason) => {},
		onUnsuspendUser: async (userId) => {},
		onChangeUserRole: async (userId, role) => {},
		onDeleteUserContent: async (userId, reason) => {},

		// Reports
		onFetchReports: async (status) => [],
		onResolveReport: async (reportId, action) => {},
		onDismissReport: async (reportId) => {},
		onAssignReport: async (reportId, assigneeId) => {},
	}}
>
	<Admin.Overview />
	<Admin.Users />
	<Admin.Reports />
	<Admin.Moderation />
</Admin.Root>
```

## Reports workflow

- `Admin.Reports` includes status filtering, search, a detail panel, and optional assignment controls (`onAssignReport`).

## Standalone package

```svelte
<script>
	import * as Admin from '@equaltoai/greater-components-admin';
</script>
```
