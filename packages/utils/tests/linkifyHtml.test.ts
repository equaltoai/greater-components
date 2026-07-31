import { describe, it, expect } from 'vitest';
import { linkifyHtml, linkifyMentions } from '../src/linkifyMentions';

describe('linkifyHtml', () => {
	describe('sanitized markup passes through unescaped', () => {
		it('preserves ordinary markup with no mentions or tags (issue #926)', () => {
			const html = '<p>Hello <strong>world</strong></p>';
			const result = linkifyHtml(html);

			expect(result).toBe('<p>Hello <strong>world</strong></p>');
			expect(result).not.toContain('&lt;p&gt;');
			expect(result).not.toContain('&lt;strong&gt;');
		});

		it('is the behaviour linkifyMentions cannot provide for markup input', () => {
			const html = '<p>Hello <strong>world</strong></p>';

			// linkifyMentions is a *text* linkifier: escaping markup is its contract.
			expect(linkifyMentions(html)).toContain('&lt;p&gt;');
			// linkifyHtml treats the same input as trusted markup.
			expect(linkifyHtml(html)).not.toContain('&lt;p&gt;');
		});

		it('preserves nested and sibling elements', () => {
			const html = '<p>One</p><ul><li><em>two</em></li><li>three</li></ul>';
			expect(linkifyHtml(html)).toBe(html);
		});

		it('returns an empty string for empty or non-string input', () => {
			expect(linkifyHtml('')).toBe('');
			expect(linkifyHtml(undefined as unknown as string)).toBe('');
		});
	});

	describe('generic linkification of text nodes', () => {
		it('linkifies mentions inside markup without escaping the markup', () => {
			const result = linkifyHtml('<p>Hello <strong>world</strong> @alice</p>');

			expect(result).toContain('<strong>world</strong>');
			expect(result).toContain('<a href="/users/alice" class="mention"');
			expect(result).toContain('>@alice</a>');
		});

		it('linkifies hashtags and URLs inside markup', () => {
			const result = linkifyHtml('<p>See #svelte at https://example.com</p>');

			expect(result).toContain('<a href="/tags/svelte" class="hashtag"');
			expect(result).toContain('<a href="https://example.com" class="url"');
			expect(result).toContain('<p>');
		});

		it('handles mixed markup, mention, hashtag and URL in one body', () => {
			const result = linkifyHtml(
				'<p>Hi @alice, see <strong>#svelte</strong> at https://example.com</p>'
			);

			expect(result).toContain('<a href="/users/alice" class="mention"');
			expect(result).toContain('<strong><a href="/tags/svelte" class="hashtag"');
			expect(result).toContain('<a href="https://example.com" class="url"');
		});

		it('honours custom base URLs and link options', () => {
			const result = linkifyHtml('<p>@user #tag</p>', {
				mentionBaseUrl: 'https://mastodon.social/@',
				hashtagBaseUrl: 'https://mastodon.social/tags/',
				openInNewTab: false,
				nofollow: false,
			});

			expect(result).toContain('href="https://mastodon.social/@user"');
			expect(result).toContain('href="https://mastodon.social/tags/tag"');
			expect(result).not.toContain('target="_blank"');
			expect(result).not.toContain('rel=');
		});

		it('encodes Unicode hashtags exactly once', () => {
			const result = linkifyHtml('<p>#日本語</p>');

			expect(result).toContain('href="/tags/%E6%97%A5%E6%9C%AC%E8%AA%9E"');
			expect(result).not.toContain('%25');
			expect(result).toContain('>#日本語</a>');
		});

		it('truncates long URL display text but keeps the full href', () => {
			const result = linkifyHtml(
				'<p>https://example.com/very/long/path/that/should/be/truncated</p>',
				{ maxUrlLength: 20 }
			);

			expect(result).toContain(
				'href="https://example.com/very/long/path/that/should/be/truncated"'
			);
			expect(result).toContain('example.com/very/...');
		});

		it('does not double-encode entities in URL query strings', () => {
			const result = linkifyHtml('<p>https://example.com/a?x=1&amp;y=2</p>');

			// `&#x26;` is the serializer's encoding of a single `&`.
			expect(result).toContain('href="https://example.com/a?x=1&#x26;y=2"');
			expect(result).not.toContain('&amp;amp;');
		});

		it('leaves text that only looks like a URL alone', () => {
			const result = linkifyHtml('<p>httpfoo.com</p>');
			expect(result).toBe('<p>httpfoo.com</p>');
		});
	});

	describe('linkification barriers', () => {
		it('does not linkify inside an existing anchor', () => {
			const html = '<p>Visit <a href="https://x.example/@alice">@alice</a> now</p>';
			expect(linkifyHtml(html)).toBe(html);
		});

		it('does not linkify inside code or pre', () => {
			const html = '<pre><code>@notalink #nope https://example.com</code></pre>';
			expect(linkifyHtml(html)).toBe(html);
		});

		it('still linkifies text outside the barrier element', () => {
			const result = linkifyHtml('<p><code>@skipped</code> @linked</p>');

			expect(result).toContain('<code>@skipped</code>');
			expect(result).toContain('<a href="/users/linked" class="mention"');
		});
	});

	describe('known mentions and tags', () => {
		const mentions = [{ username: 'alice', url: 'https://example.com/@alice' }];
		const tags = [{ name: 'svelte', url: 'https://example.com/tags/svelte' }];

		it('uses the supplied URLs and skips generic linkification', () => {
			const result = linkifyHtml('<p>Hi @alice about #svelte and https://other.example</p>', {
				mentions,
				tags,
			});

			expect(result).toContain('<a href="https://example.com/@alice" class="mention"');
			expect(result).toContain('<a href="https://example.com/tags/svelte" class="hashtag"');
			// Generic URL linkification is skipped when known entities are supplied.
			expect(result).not.toContain('class="url"');
		});

		it('preserves surrounding markup', () => {
			const result = linkifyHtml('<p>Hello <strong>world</strong> @alice</p>', { mentions });

			expect(result).toContain('<strong>world</strong>');
			expect(result).toContain('<a href="https://example.com/@alice" class="mention"');
		});

		it('matches a mention with a domain suffix', () => {
			const result = linkifyHtml('<p>Hi @alice@example.com</p>', { mentions });
			expect(result).toContain('>@alice@example.com</a>');
		});

		it('does not corrupt attribute values that contain the mention text', () => {
			const result = linkifyHtml('<p><a href="https://example.com/@alice">profile</a> @alice</p>', {
				mentions,
			});

			// The href of the pre-existing anchor is untouched...
			expect(result).toContain('<a href="https://example.com/@alice">profile</a>');
			// ...and only the bare text mention is linkified.
			expect(result.match(/class="mention"/g)).toHaveLength(1);
		});

		it('leaves the text alone when a mention or tag URL is unsafe', () => {
			const result = linkifyHtml('<p>Hi @evil #bad</p>', {
				mentions: [{ username: 'evil', url: 'javascript:alert(1)' }],
				tags: [{ name: 'bad', url: 'javascript:alert(1)' }],
			});

			expect(result).toBe('<p>Hi @evil #bad</p>');
			expect(result).not.toContain('javascript:');
			expect(result).not.toContain('<a');
		});

		it('treats a mention name with regex metacharacters literally', () => {
			const result = linkifyHtml('<p>@a.b and @axb</p>', {
				mentions: [{ username: 'a.b', url: 'https://example.com/@a.b' }],
			});

			expect(result).toContain('>@a.b</a>');
			expect(result).toContain('@axb');
			expect(result.match(/class="mention"/g)).toHaveLength(1);
		});

		it('resolves a whole token, so a shorter username is not a prefix match', () => {
			// The pass-per-entity implementation matched `@user1` inside `@user10`,
			// linking the wrong profile and stranding the trailing digits as text.
			const result = linkifyHtml('<p>@user1 @user10</p>', {
				mentions: [
					{ username: 'user1', url: 'https://example.com/@user1' },
					{ username: 'user10', url: 'https://example.com/@user10' },
				],
			});

			expect(result).toContain('href="https://example.com/@user1" class="mention"');
			expect(result).toContain('href="https://example.com/@user10" class="mention"');
			expect(result).toContain('>@user10</a>');
			expect(result).not.toContain('</a>0');
		});

		it('leaves an unknown mention alone even when a known one is a prefix of it', () => {
			const result = linkifyHtml('<p>@alice @alicia</p>', {
				mentions: [{ username: 'alice', url: 'https://example.com/@alice' }],
			});

			expect(result).toContain('>@alice</a>');
			expect(result).toContain('@alicia');
			expect(result.match(/class="mention"/g)).toHaveLength(1);
		});

		it('links the entity but not the sentence punctuation that follows it', () => {
			const result = linkifyHtml('<p>ask @alice. see #svelte.</p>', {
				mentions: [{ username: 'alice', url: 'https://example.com/@alice' }],
				tags: [{ name: 'svelte', url: 'https://example.com/tags/svelte' }],
			});

			expect(result).toContain('>@alice</a>.');
			expect(result).toContain('>#svelte</a>.');
		});

		it('keeps a hashtag boundary: a known tag does not match a longer word', () => {
			const result = linkifyHtml('<p>#svelte #svelte5</p>', {
				tags: [{ name: 'svelte', url: 'https://example.com/tags/svelte' }],
			});

			expect(result).toContain('>#svelte</a>');
			expect(result).toContain('#svelte5');
			expect(result.match(/class="hashtag"/g)).toHaveLength(1);
		});

		it('matches a hashtag case-insensitively but keeps the text as written', () => {
			const result = linkifyHtml('<p>#Svelte</p>', {
				tags: [{ name: 'svelte', url: 'https://example.com/tags/svelte' }],
			});

			expect(result).toContain('href="https://example.com/tags/svelte"');
			expect(result).toContain('>#Svelte</a>');
		});

		it('takes the first entry when two entities share a name', () => {
			const result = linkifyHtml('<p>@alice</p>', {
				mentions: [
					{ username: 'alice', url: 'https://first.example/@alice' },
					{ username: 'alice', url: 'https://second.example/@alice' },
				],
			});

			expect(result).toContain('href="https://first.example/@alice"');
			expect(result).not.toContain('second.example');
		});
	});

	describe('known-entity processing scales linearly (SSR resource safety)', () => {
		// Status bodies render on the server, so the cost of a federated peer's
		// mention and tag arrays is spent on a render worker. The previous
		// implementation ran one segment-splitting pass per entity over a segment
		// list the earlier passes had grown: doubling the reference count cost
		// roughly 4x. These bounds are deliberately loose — they are an
		// order-of-growth assertion, not a benchmark.
		const buildStatus = (refs: number) => {
			const mentions = Array.from({ length: refs }, (_, i) => ({
				username: `user${i}`,
				url: `https://example.com/@user${i}`,
			}));
			const tags = Array.from({ length: refs }, (_, i) => ({
				name: `tag${i}`,
				url: `https://example.com/tags/tag${i}`,
			}));
			const body = Array.from({ length: refs }, (_, i) => `@user${i} #tag${i}`).join(' ');

			return { html: `<p>${body}</p>`, mentions, tags };
		};

		const timeLinkify = (refs: number): number => {
			const { html, mentions, tags } = buildStatus(refs);
			// Warm the code paths so the measurement is not dominated by first-call JIT.
			linkifyHtml(html, { mentions, tags });

			const started = performance.now();
			const result = linkifyHtml(html, { mentions, tags });
			const elapsed = performance.now() - started;

			// Guard against measuring a no-op.
			expect(result.match(/class="mention"/g)).toHaveLength(refs);
			expect(result.match(/class="hashtag"/g)).toHaveLength(refs);

			return elapsed;
		};

		it('grows sub-quadratically as the reference count grows 8x', () => {
			const small = Math.max(timeLinkify(1_000), 1);
			const large = timeLinkify(8_000);

			// Linear is ~8x. Quadratic is ~64x. Fail well below the quadratic curve.
			expect(large / small).toBeLessThan(24);
		});

		it('processes 10,000 references well inside an SSR request budget', () => {
			// ~37ms on the indexed walk against ~1450ms on the pass-per-entity walk.
			expect(timeLinkify(5_000)).toBeLessThan(750);
		});
	});

	describe('security invariants', () => {
		it('rejects javascript: hrefs supplied through base URLs', () => {
			const result = linkifyHtml('<p>@alice</p>', { mentionBaseUrl: 'javascript:alert#' });

			expect(result).not.toContain('javascript:');
			expect(result).not.toContain('<a');
		});

		it('escapes quotes in generated hrefs so attributes cannot break out', () => {
			const result = linkifyHtml('<p>Hi @a</p>', {
				mentions: [{ username: 'a', url: 'https://example.com/"onmouseover=alert(1)' }],
			});

			expect(result).toContain('&#x22;onmouseover=alert(1)');
			expect(result).not.toContain('"onmouseover');
		});

		it('does not introduce script content that was not already present', () => {
			// linkifyHtml is not a sanitizer, but it must not *create* a new sink.
			const result = linkifyHtml('<p>@alice</p>');
			expect(result).not.toContain('<script');
			expect(result).not.toContain('onerror');
		});

		// Chromium resolution for every string below is pinned in
		// packages/testing/tests/demo/linkify-url-policy.spec.ts. Keep the two lists
		// in step: this asserts what linkifyHtml emits, that asserts what a browser
		// does with it.
		describe('generated hrefs stay on an explicit scheme or the page origin', () => {
			const offOrigin = [
				['scheme-relative', '//evil.example/p'],
				['scheme-relative with backslashes', '\\\\evil.example\\p'],
				['slash-backslash authority', '/\\evil.example/p'],
				['backslash-slash authority', '\\/evil.example/p'],
				['scheme-relative with an embedded newline', '/\n/evil.example/p'],
			] as const;

			for (const [shape, url] of offOrigin) {
				it(`rejects a ${shape} mention URL`, () => {
					const result = linkifyHtml('<p>Hi @a and #b</p>', {
						mentions: [{ username: 'a', url }],
						tags: [{ name: 'b', url }],
					});

					expect(result).toBe('<p>Hi @a and #b</p>');
					expect(result).not.toContain('evil.example');
					expect(result).not.toContain('<a');
				});
			}

			const sameOriginOrExplicit = [
				['absolute https', 'https://example.com/@a'],
				['absolute http', 'http://example.com/@a'],
				['mailto', 'mailto:a@example.com'],
				['absolute path', '/users/a'],
				['relative path', 'users/a'],
				['dot-relative path', './users/a'],
				['query only', '?user=a'],
				['fragment only', '#a'],
			] as const;

			for (const [shape, url] of sameOriginOrExplicit) {
				it(`accepts an ${shape} mention URL`, () => {
					const result = linkifyHtml('<p>Hi @a</p>', { mentions: [{ username: 'a', url }] });
					expect(result).toContain('class="mention"');
				});
			}

			it('rejects a non-allow-listed absolute scheme', () => {
				for (const url of [
					'javascript:alert(1)',
					'data:text/html,<script>1</script>',
					'vbscript:x',
				]) {
					const result = linkifyHtml('<p>Hi @a</p>', { mentions: [{ username: 'a', url }] });
					expect(result).toBe('<p>Hi @a</p>');
				}
			});
		});

		describe('raw-text elements are linkification barriers', () => {
			// linkifyHtml is not a sanitizer, so a caller whose policy retains any of
			// these must get their character data back unmodified: it is a script, a
			// stylesheet or a control value, not prose.
			const rawText = [
				'script',
				'style',
				'textarea',
				'title',
				'iframe',
				'noembed',
				'noframes',
				'noscript',
				'xmp',
			];

			for (const tag of rawText) {
				it(`does not rewrite text inside <${tag}>`, () => {
					const html = `<${tag}>@alice #svelte https://example.com</${tag}>`;
					const result = linkifyHtml(html);

					expect(result).not.toContain('<a href');
					expect(result).toContain('@alice');
				});
			}

			it('still linkifies prose that follows a raw-text element', () => {
				const result = linkifyHtml('<p><style>@media a</style> @linked</p>');

				expect(result).toContain('<style>@media a</style>');
				expect(result).toContain('<a href="/users/linked" class="mention"');
			});
		});

		it('escapes text content that arrives as raw characters', () => {
			// A `<` surviving sanitization as text stays inert text after linkify.
			const result = linkifyHtml('<p>a &lt;script&gt;alert(1)&lt;/script&gt; @alice</p>');

			expect(result).not.toContain('<script>');
			// `<` is escaped so the tag cannot re-form; a bare `>` in text is inert.
			expect(result).toContain('&#x3C;script>');
			expect(result).toContain('class="mention"');
		});
	});

	describe('determinism', () => {
		it('produces identical output for identical input', () => {
			const inputs = [
				'<p>Hello <strong>world</strong></p>',
				'<p>Hi @alice</p>',
				'<p>Hi @alice and <em>#svelte</em> at https://example.com</p>',
			];

			for (const input of inputs) {
				expect(linkifyHtml(input)).toBe(linkifyHtml(input));
			}
		});

		it('is idempotent: re-linkifying its own output is a no-op', () => {
			const once = linkifyHtml('<p>Hi @alice and #svelte at https://example.com</p>');
			expect(linkifyHtml(once)).toBe(once);
		});
	});
});
