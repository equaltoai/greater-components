import { describe, expect, it } from 'vitest';
import {
	sharedModuleRegistry,
	getSharedModule,
	getAllSharedModuleNames,
	getSharedModulesByDomain,
	type SharedModuleMetadata,
} from '../src/registry/shared.js';

describe('shared module registry', () => {
	describe('sharedModuleRegistry', () => {
		it('should contain all expected shared modules', () => {
			const expectedModules = [
				'auth',
				'compose',
				'notifications',
				'search',
				'chat',
				'admin',
				'messaging',
			];

			for (const name of expectedModules) {
				expect(sharedModuleRegistry[name]).toBeDefined();
			}
		});

		it('should have correct type for all modules', () => {
			for (const module of Object.values(sharedModuleRegistry)) {
				expect(module.type).toBe('shared');
			}
		});

		it('should have required fields for all modules', () => {
			for (const [name, module] of Object.entries(sharedModuleRegistry)) {
				expect(module.name).toBe(name);
				expect(module.description).toBeDefined();
				expect(module.packageName).toBe('@equaltoai/greater-components');
				expect(module.exportPath).toBeDefined();
				expect(Array.isArray(module.exports)).toBe(true);
				expect(Array.isArray(module.files)).toBe(true);
				expect(Array.isArray(module.dependencies)).toBe(true);
				expect(Array.isArray(module.tags)).toBe(true);
				expect(module.version).toBeDefined();
				expect(module.domain).toBeDefined();
			}
		});
	});

	describe('getSharedModule', () => {
		it('should return module metadata for valid name', () => {
			const auth = getSharedModule('auth');

			expect(auth).not.toBeNull();
			expect(auth?.name).toBe('auth');
			expect(auth?.type).toBe('shared');
			expect(auth?.domain).toBe('auth');
		});

		it('should return null for non-existent module', () => {
			const result = getSharedModule('nonexistent-module');

			expect(result).toBeNull();
		});

		it('should return correct metadata for compose module', () => {
			const compose = getSharedModule('compose');

			expect(compose).not.toBeNull();
			expect(compose?.name).toBe('compose');
			expect(compose?.domain).toBe('social');
			expect(compose?.exports).toContain('Editor');
			expect(compose?.exports).toContain('Submit');
		});

		it('should return correct metadata for chat module', () => {
			const chat = getSharedModule('chat');

			expect(chat).not.toBeNull();
			expect(chat?.name).toBe('chat');
			expect(chat?.domain).toBe('chat');
			expect(chat?.exports).toContain('Container');
			expect(chat?.exports).toContain('Messages');
		});

		it('should return correct metadata for admin module', () => {
			const admin = getSharedModule('admin');

			expect(admin).not.toBeNull();
			expect(admin?.name).toBe('admin');
			expect(admin?.domain).toBe('admin');
			expect(admin?.exports).toContain('Overview');
			expect(admin?.exports).toContain('Users');
		});
	});

	describe('getAllSharedModuleNames', () => {
		it('should return array of all module names', () => {
			const names = getAllSharedModuleNames();

			expect(Array.isArray(names)).toBe(true);
			expect(names.length).toBeGreaterThan(0);
		});

		it('should include all expected modules', () => {
			const names = getAllSharedModuleNames();

			expect(names).toContain('auth');
			expect(names).toContain('compose');
			expect(names).toContain('notifications');
			expect(names).toContain('search');
			expect(names).toContain('chat');
			expect(names).toContain('admin');
			expect(names).toContain('messaging');
		});

		it('should return unique names', () => {
			const names = getAllSharedModuleNames();
			const uniqueNames = new Set(names);

			expect(names.length).toBe(uniqueNames.size);
		});
	});

	describe('getSharedModulesByDomain', () => {
		it('should return modules filtered by social domain', () => {
			const socialModules = getSharedModulesByDomain('social');

			expect(Array.isArray(socialModules)).toBe(true);
			expect(socialModules.length).toBeGreaterThan(0);

			for (const module of socialModules) {
				expect(module.domain).toBe('social');
			}
		});

		it('should return modules filtered by auth domain', () => {
			const authModules = getSharedModulesByDomain('auth');

			expect(Array.isArray(authModules)).toBe(true);
			expect(authModules.some((m) => m.name === 'auth')).toBe(true);

			for (const module of authModules) {
				expect(module.domain).toBe('auth');
			}
		});

		it('should return modules filtered by admin domain', () => {
			const adminModules = getSharedModulesByDomain('admin');

			expect(Array.isArray(adminModules)).toBe(true);
			expect(adminModules.some((m) => m.name === 'admin')).toBe(true);

			for (const module of adminModules) {
				expect(module.domain).toBe('admin');
			}
		});

		it('should return modules filtered by chat domain', () => {
			const chatModules = getSharedModulesByDomain('chat');

			expect(Array.isArray(chatModules)).toBe(true);
			expect(chatModules.some((m) => m.name === 'chat')).toBe(true);

			for (const module of chatModules) {
				expect(module.domain).toBe('chat');
			}
		});

		it('should return modules filtered by core domain', () => {
			const coreModules = getSharedModulesByDomain('core');

			expect(Array.isArray(coreModules)).toBe(true);
			expect(coreModules.some((m) => m.name === 'search')).toBe(true);

			for (const module of coreModules) {
				expect(module.domain).toBe('core');
			}
		});

		it('should return empty array for non-existent domain', () => {
			// Cast to any to test non-existent domain
			const result = getSharedModulesByDomain('nonexistent' as 'social');

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(0);
		});
	});

	describe('module structure validation', () => {
		it('auth module should have correct exports', () => {
			const auth = getSharedModule('auth') as SharedModuleMetadata;

			expect(auth.exports).toContain('Root');
			expect(auth.exports).toContain('LoginForm');
			expect(auth.exports).toContain('RegisterForm');
			expect(auth.exports).toContain('WebAuthnSetup');
			expect(auth.exports).toContain('TwoFactorSetup');
		});

		it('compose module should have media-related exports', () => {
			const compose = getSharedModule('compose') as SharedModuleMetadata;

			expect(compose.exports).toContain('MediaUpload');
			expect(compose.exports).toContain('ImageEditor');
		});

		it('admin module should have analytics exports', () => {
			const admin = getSharedModule('admin') as SharedModuleMetadata;

			expect(admin.exports).toContain('Analytics');
			expect(admin.exports).toContain('Cost');
			expect(admin.exports).toContain('Insights');
		});

		it('notifications module should have filtering exports', () => {
			const notifications = getSharedModule('notifications') as SharedModuleMetadata;

			expect(notifications.exports).toContain('Filter');
			expect(notifications.exports).toContain('Group');
		});

		it('messaging module should have conversation exports', () => {
			const messaging = getSharedModule('messaging') as SharedModuleMetadata;

			expect(messaging.exports).toContain('Conversations');
			expect(messaging.exports).toContain('Thread');
			expect(messaging.exports).toContain('Composer');
		});
	});

	describe('module dependencies', () => {
		it('all modules should have svelte as a dependency', () => {
			for (const module of Object.values(sharedModuleRegistry)) {
				const hasSvelte = module.dependencies.some((dep) => dep.name === 'svelte');
				expect(hasSvelte).toBe(true);
			}
		});

		it('auth module should have button and modal as registry dependencies', () => {
			const auth = getSharedModule('auth') as SharedModuleMetadata;

			expect(auth.registryDependencies).toContain('button');
			expect(auth.registryDependencies).toContain('modal');
		});

		it('admin module should have tabs as registry dependency', () => {
			const admin = getSharedModule('admin') as SharedModuleMetadata;

			expect(admin.registryDependencies).toContain('tabs');
		});
	});

	describe('module files', () => {
		it('all modules should have at least one component file', () => {
			for (const module of Object.values(sharedModuleRegistry)) {
				const hasComponentFile = module.files.some((f) => f.type === 'component');
				expect(hasComponentFile).toBe(true);
			}
		});

		it('most modules should have a context or types file', () => {
			for (const module of Object.values(sharedModuleRegistry)) {
				const hasTypesFile = module.files.some(
					(f) => f.type === 'types' || f.path.includes('context') || f.path.includes('types')
				);
				expect(hasTypesFile).toBe(true);
			}
		});

		it('file paths should be correctly formatted', () => {
			for (const module of Object.values(sharedModuleRegistry)) {
				for (const file of module.files) {
					expect(file.path).toMatch(/^shared\//);
					expect(file.path).toMatch(/\.(svelte|ts)$/);
				}
			}
		});
	});

	describe('module tags', () => {
		it('all modules should include shared tag', () => {
			for (const module of Object.values(sharedModuleRegistry)) {
				expect(module.tags).toContain('shared');
			}
		});

		it('modules should include relevant domain tags', () => {
			const auth = getSharedModule('auth') as SharedModuleMetadata;
			expect(auth.tags).toContain('authentication');
			expect(auth.tags).toContain('webauthn');

			const chat = getSharedModule('chat') as SharedModuleMetadata;
			expect(chat.tags).toContain('ai');
			expect(chat.tags).toContain('streaming');

			const admin = getSharedModule('admin') as SharedModuleMetadata;
			expect(admin.tags).toContain('dashboard');
			expect(admin.tags).toContain('moderation');
		});
	});
});
