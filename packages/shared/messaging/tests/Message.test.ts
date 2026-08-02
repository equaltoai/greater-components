import { describe, it, expect, vi } from 'vitest';
import { mount, unmount } from 'svelte';
import { flushSync } from 'svelte';
import Message from '../src/Message.svelte';

const WHATWG_PREPARSE_EXTERNAL_HREF_CASES = [
	{ name: 'leading space', predicateHref: ' //evil.test/messages' },
	{ name: 'leading tab', predicateHref: '\t//evil.test/messages' },
	{ name: 'leading line breaks', predicateHref: '\n\r//evil.test/messages' },
	{ name: 'leading C0 control', predicateHref: '\x01//evil.test/messages' },
	{ name: 'tab between slashes', predicateHref: '/\t/evil.test/messages' },
	{ name: 'line feed between slashes', predicateHref: '/\n/evil.test/messages' },
	{ name: 'tab before backslash separator', predicateHref: '/\t\\evil.test/messages' },
	{
		name: 'entity-encoded tab',
		predicateHref: '\t//evil.test/messages',
		authoredHref: '&#9;//evil.test/messages',
	},
] as const;

const WHATWG_PREPARSE_EXTERNAL_HREF_MATRIX = WHATWG_PREPARSE_EXTERNAL_HREF_CASES.flatMap(
	({ name, predicateHref, ...hrefCase }) =>
		(['named', '_blank'] as const).map(
			(target) =>
				[
					name,
					predicateHref,
					'authoredHref' in hrefCase ? hrefCase.authoredHref : predicateHref,
					target,
				] as const
		)
);

// Mock context helpers
vi.mock('../src/utils.js', async () => {
	const actual = await vi.importActual('../src/utils.js');
	return {
		...actual,
		formatMessageTime: () => '10:00 AM',
	};
});

describe('Message', () => {
	const alice = {
		id: 'u1',
		username: 'alice',
		displayName: 'Alice',
		avatar: 'https://example.com/a.jpg',
	};
	const bob = { id: 'u2', username: 'bob', displayName: 'Bob', avatar: '' };

	it('renders own message correctly', () => {
		const target = document.createElement('div');
		const message = {
			id: 'm1',
			conversationId: 'c1',
			sender: alice,
			content: 'My message',
			createdAt: new Date().toISOString(),
			read: true,
		};

		const instance = mount(Message, { target, props: { message, currentUserId: 'u1' } });

		const msg = target.querySelector('.message');
		expect(msg?.classList.contains('message--own')).toBe(true);

		// Own message shouldn't show avatar or name usually (depending on CSS/Design, but based on template logic)
		expect(target.querySelector('.message__avatar')).toBeFalsy();
		expect(target.querySelector('.message__sender')).toBeFalsy();

		expect(target.querySelector('.message__content')?.textContent).toBe('My message');
		expect(target.querySelector('.message__time')?.textContent).toBe('10:00 AM');

		unmount(instance);
	});

	it('matches own messages by original actor id when participant id is normalized', () => {
		const target = document.createElement('div');
		const message = {
			id: 'm1-actor',
			conversationId: 'c1',
			sender: {
				...alice,
				id: 'alice',
				actorId: 'https://dev.simulacrum.greater.website/users/alice',
			},
			content: 'My normalized message',
			createdAt: new Date().toISOString(),
			read: true,
		};

		const instance = mount(Message, {
			target,
			props: { message, currentUserId: 'https://dev.simulacrum.greater.website/users/alice' },
		});

		expect(target.querySelector('.message')?.classList.contains('message--own')).toBe(true);

		unmount(instance);
	});

	it('renders other user message correctly', () => {
		const target = document.createElement('div');
		const message = {
			id: 'm2',
			conversationId: 'c1',
			sender: bob,
			content: 'Hello',
			createdAt: new Date().toISOString(),
			read: true,
		};

		const instance = mount(Message, { target, props: { message, currentUserId: 'u1' } });

		const msg = target.querySelector('.message');
		expect(msg?.classList.contains('message--own')).toBe(false);

		expect(target.querySelector('.message__avatar')).toBeTruthy();
		// Bob has no avatar, check placeholder
		expect(target.querySelector('.message__avatar-placeholder')?.textContent?.trim()).toBe('B');

		expect(target.querySelector('.message__sender')?.textContent).toBe('Bob');
		expect(target.querySelector('.message__content')?.textContent).toBe('Hello');

		unmount(instance);
	});

	it('renders server HTML while neutralizing executable markup', () => {
		const target = document.createElement('div');
		const message = {
			id: 'm-html',
			conversationId: 'c1',
			sender: bob,
			content:
				'<p>Hello <strong>world</strong></p><img src="x" onerror="alert(1)"><script>alert(2)</script>',
			createdAt: new Date().toISOString(),
			read: true,
		};

		const instance = mount(Message, { target, props: { message, currentUserId: 'u1' } });

		const content = target.querySelector('.message__content');
		expect(content?.querySelector('strong')?.textContent).toBe('world');
		expect(content?.textContent).toBe('Hello world');
		expect(content?.querySelector('img')).toBeNull();
		expect(content?.querySelector('script')).toBeNull();
		expect(content?.innerHTML).not.toContain('onerror');

		unmount(instance);
	});

	it('drops style elements with their text from the sanitized message body', () => {
		const target = document.createElement('div');
		const message = {
			id: 'm-style',
			conversationId: 'c1',
			sender: bob,
			content: '<style>body{display:none}</style><p>Visible message</p>',
			createdAt: new Date().toISOString(),
			read: true,
		};

		const instance = mount(Message, { target, props: { message, currentUserId: 'u1' } });
		const content = target.querySelector('.message__content');

		expect(content?.textContent).toBe('Visible message');
		expect(content?.textContent).not.toContain('display:none');
		expect(content?.querySelector('style')).toBeNull();

		unmount(instance);
	});

	it('secures external links while preserving existing rel tokens and target intent', () => {
		const target = document.createElement('div');
		const message = {
			id: 'm-link',
			conversationId: 'c1',
			sender: bob,
			content:
				'<a href="https://example.test" rel="nofollow" target="_blank">first</a> <a href="https://example.test/second" title="rel= target=">second</a>',
			createdAt: new Date().toISOString(),
			read: true,
		};

		const instance = mount(Message, { target, props: { message, currentUserId: 'u1' } });
		const links = target.querySelectorAll('.message__content a');

		expect(links[0]?.getAttribute('rel')?.split(/\s+/u)).toEqual([
			'nofollow',
			'noopener',
			'noreferrer',
		]);
		expect(links[1]?.getAttribute('target')).toBeNull();
		expect(links[1]?.getAttribute('rel')).toBe('noopener noreferrer');

		unmount(instance);
	});

	it.each([
		[
			'NEW-20 quote-parity payload',
			'<a href="https://evil.test" title=" rel=" target="a><img src=x onerror=alert(1)>">click me</a>',
		],
		[
			'latent authored-rel payload',
			'<a href="https://evil.test" rel="a><img src=x onerror=alert(1)>" target="_blank">click me</a>',
		],
	])('keeps the %s inert through the real message render path', (_case, dirty) => {
		const target = document.createElement('div');
		const message = {
			id: 'm-link-parity',
			conversationId: 'c1',
			sender: bob,
			content: dirty,
			createdAt: new Date().toISOString(),
			read: true,
		};

		const instance = mount(Message, { target, props: { message, currentUserId: 'u1' } });
		const content = target.querySelector('.message__content');
		const elements = Array.from(content?.querySelectorAll('*') ?? []);
		const anchor = content?.querySelector('a');

		expect(elements.map((element) => element.localName)).toEqual(['a']);
		expect(content?.querySelector('img, form, input')).toBeNull();
		expect(content?.querySelector('[onerror], [onclick], [onload]')).toBeNull();
		expect(anchor?.textContent).toBe('click me');
		expect(anchor?.getAttribute('rel')?.split(/\s+/u)).toEqual(
			expect.arrayContaining(['noopener', 'noreferrer'])
		);

		unmount(instance);
	});

	it('hardens protocol-relative links through the real message render path', () => {
		const target = document.createElement('div');
		const message = {
			id: 'm-protocol-relative',
			conversationId: 'c1',
			sender: bob,
			content: '<a href="//evil.test/messages" target="named">external</a>',
			createdAt: new Date().toISOString(),
			read: true,
		};

		const instance = mount(Message, { target, props: { message, currentUserId: 'u1' } });
		const anchor = target.querySelector('.message__content a');

		expect(anchor?.getAttribute('href')).toBe('//evil.test/messages');
		expect(anchor?.getAttribute('target')).toBe('named');
		expect(anchor?.getAttribute('rel')?.split(/\s+/u)).toEqual(['noopener', 'noreferrer']);

		unmount(instance);
	});

	it.each([
		['backslash pair', String.raw`\\evil.test/messages`],
		['slash-backslash pair', String.raw`/\evil.test/messages`],
		['backslash-slash pair', String.raw`\/evil.test/messages`],
	])(
		'hardens browser-normalized protocol-relative links using a %s through the real message render path',
		(_case, href) => {
			for (const linkTarget of ['named', '_blank']) {
				const target = document.createElement('div');
				const message = {
					id: `m-backslash-${linkTarget}`,
					conversationId: 'c1',
					sender: bob,
					content: `<a href="${href}" target="${linkTarget}">external</a>`,
					createdAt: new Date().toISOString(),
					read: true,
				};

				const instance = mount(Message, { target, props: { message, currentUserId: 'u1' } });
				const anchor = target.querySelector('.message__content a');

				expect(anchor?.getAttribute('href')).toBe(href);
				expect(anchor?.getAttribute('target')).toBe(linkTarget);
				expect(anchor?.getAttribute('rel')?.split(/\s+/u)).toEqual(['noopener', 'noreferrer']);

				unmount(instance);
			}
		}
	);

	it.each(WHATWG_PREPARSE_EXTERNAL_HREF_MATRIX)(
		'hardens a %s external href %j authored as %j after WHATWG pre-parse normalization with target %s through the real message render path',
		(_case, predicateHref, authoredHref, linkTarget) => {
			const target = document.createElement('div');
			const message = {
				id: `m-preparse-${linkTarget}`,
				conversationId: 'c1',
				sender: bob,
				content: `<a href="${authoredHref}" target="${linkTarget}">external</a>`,
				createdAt: new Date().toISOString(),
				read: true,
			};

			const instance = mount(Message, { target, props: { message, currentUserId: 'u1' } });
			const anchor = target.querySelector('.message__content a');

			// Exercise the raw entity end-to-end while pinning the decoded predicate input.
			if (authoredHref.startsWith('&#9;')) {
				expect(anchor?.getAttribute('href')).toBe(predicateHref);
			}
			expect(new URL(anchor?.getAttribute('href') ?? '', 'https://messages.test').origin).toBe(
				'https://evil.test'
			);
			expect(anchor?.getAttribute('target')).toBe(linkTarget);
			expect(anchor?.getAttribute('rel')?.split(/\s+/u)).toEqual(['noopener', 'noreferrer']);

			unmount(instance);
		}
	);

	it.each([' /local/path', '\t#frag', ' ../up'])(
		'keeps the parser-normalized internal href %j unhardened through the real message render path',
		(href) => {
			const target = document.createElement('div');
			const message = {
				id: 'm-preparse-internal',
				conversationId: 'c1',
				sender: bob,
				content: `<a href="${href}" target="named">internal</a>`,
				createdAt: new Date().toISOString(),
				read: true,
			};

			const instance = mount(Message, { target, props: { message, currentUserId: 'u1' } });
			const anchor = target.querySelector('.message__content a');

			expect(
				new URL(anchor?.getAttribute('href') ?? '', 'https://messages.test/base/').origin
			).toBe('https://messages.test');
			expect(anchor?.getAttribute('target')).toBe('named');
			expect(anchor?.getAttribute('rel')).toBeNull();

			unmount(instance);
		}
	);

	it('renders avatar image when available', () => {
		const target = document.createElement('div');
		const message = {
			id: 'm3',
			conversationId: 'c1',
			sender: alice,
			content: 'Hi',
			createdAt: new Date().toISOString(),
			read: true,
		};

		const instance = mount(Message, { target, props: { message, currentUserId: 'u2' } }); // Alice is 'other'

		const img = target.querySelector('.message__avatar img') as HTMLImageElement;
		expect(img).toBeTruthy();
		expect(img.src).toBe('https://example.com/a.jpg');

		unmount(instance);
	});

	it('renders workflow moments for async review and approval threads', () => {
		const target = document.createElement('div');
		const message = {
			id: 'm4',
			conversationId: 'c1',
			sender: bob,
			content: 'Please review the declaration thread.',
			createdAt: new Date().toISOString(),
			read: true,
			workflowMoments: [
				{
					id: 'moment-1',
					kind: 'review_request',
					title: 'Review requested',
					summary: 'Please evaluate the declaration and signer memo.',
					phase: 'review',
					requestedBy: 'Drone Zephyr-2',
					actionLabel: 'Open review thread',
				},
			],
		};

		const instance = mount(Message, { target, props: { message, currentUserId: 'u1' } });

		expect(target.textContent).toContain('Review requested');
		expect(target.textContent).toContain('Open review thread');
		expect(target.querySelector('.workflow-thread-moment')).toBeTruthy();

		unmount(instance);
	});

	it('hides sensitive message content until explicitly revealed', () => {
		const target = document.createElement('div');
		const message = {
			id: 'm-sensitive',
			conversationId: 'c1',
			sender: bob,
			content: 'Hidden message body',
			createdAt: new Date().toISOString(),
			read: true,
			sensitive: true,
			spoilerText: 'CW: private topic',
		};

		const instance = mount(Message, { target, props: { message, currentUserId: 'u1' } });

		expect(target.textContent).toContain('CW: private topic');
		expect(target.querySelector('.message__content')).toBeNull();

		const button = target.querySelector('.message__content-warning-toggle') as HTMLButtonElement;
		expect(button?.getAttribute('aria-expanded')).toBe('false');
		button.click();
		flushSync();

		expect(button.getAttribute('aria-expanded')).toBe('true');
		expect(target.querySelector('.message__content')?.textContent).toBe('Hidden message body');

		unmount(instance);
	});
});
