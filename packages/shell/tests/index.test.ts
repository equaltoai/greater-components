import { describe, it, expect } from 'vitest';
import * as shell from '../src/index.js';

describe('@equaltoai/greater-components-shell barrel', () => {
	it('exports all 10 shell components', () => {
		expect(shell.Shell).toBeTypeOf('function');
		expect(shell.Sidebar).toBeTypeOf('function');
		expect(shell.Topbar).toBeTypeOf('function');
		expect(shell.Panel).toBeTypeOf('function');
		expect(shell.StatCard).toBeTypeOf('function');
		expect(shell.SummaryStrip).toBeTypeOf('function');
		expect(shell.PageFrame).toBeTypeOf('function');
		expect(shell.PageTitle).toBeTypeOf('function');
		expect(shell.Breadcrumb).toBeTypeOf('function');
		expect(shell.Callout).toBeTypeOf('function');
	});
});
