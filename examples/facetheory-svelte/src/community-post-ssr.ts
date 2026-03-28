import { render } from 'svelte/server';
import { Post } from '@equaltoai/greater-components-community';
import type { FaceTheoryDemoProps } from './demo-data.js';

const CommunityPostRoot = Post.Root;

function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

export const FaceTheoryExampleSSR = {
	render(props?: FaceTheoryDemoProps) {
		if (!props) {
			throw new Error('FaceTheory example props are required');
		}

		const { body: postHtml } = render(CommunityPostRoot, {
			props: {
				post: props.post,
			},
		});

		return {
			html: `
				<div class="ft-shell">
					<header class="ft-shell__header">
						<span class="ft-shell__mark" aria-hidden="true"></span>

						<div class="ft-shell__copy">
							<p class="ft-shell__eyebrow">FaceTheory Host Example</p>
							<h1 class="ft-shell__title">Greater Components through public package surfaces</h1>
							<p class="ft-shell__lede">
								Serving <strong>${escapeHtml(props.hostLabel)}</strong> with
								<strong>${escapeHtml(props.themeAttributes['data-theme'])}</strong>
								and
								<strong>${escapeHtml(props.themeAttributes['data-density'])}</strong>
								theme bootstrap attributes before hydration.
							</p>
							<a class="ft-shell__link" href="${escapeHtml(props.docsHref)}">Read the integration guide</a>
						</div>
					</header>

					<div id="facetheory-post-root">${postHtml}</div>
				</div>
			`.trim(),
		};
	},
};
