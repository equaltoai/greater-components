import type { FaceContext } from '@theory-cloud/facetheory';
import {
	createThemeBootstrapSnapshot,
	getThemeDocumentAttributes,
	type ThemeDocumentAttributes,
} from '@equaltoai/greater-components-primitives';
import { tokens } from '@equaltoai/greater-components-tokens';
import type { PostData } from '../../../packages/faces/community/src/types.ts';

export interface FaceTheoryDemoProps {
	post: PostData;
	docsHref: string;
	hostLabel: string;
	themeAttributes: ThemeDocumentAttributes;
}

function readHeader(ctx: FaceContext, name: string): string | null {
	const value = ctx.request.headers[name]?.[0]?.trim();
	return value ? value : null;
}

export function createFaceTheoryDemoProps(ctx: FaceContext): FaceTheoryDemoProps {
	const hostLabel =
		readHeader(ctx, 'x-forwarded-host') ?? readHeader(ctx, 'host') ?? 'facetheory.local';
	const canonicalUrl = `https://${hostLabel}/articles/facetheory-greater`;
	const docsHref = '/docs/facetheory-integration';
	const themeSnapshot = createThemeBootstrapSnapshot({
		cookie: readHeader(ctx, 'cookie') ?? '',
		system: {
			colorScheme: 'light',
			motion: 'normal',
			highContrast: false,
		},
	});
	const themeAttributes = getThemeDocumentAttributes(themeSnapshot);
	const primaryToken = tokens.color.primary['600'].value;
	const spacingToken = tokens.spacing.scale['6'].value;

	return {
		post: {
			id: 'facetheory-greater',
			title: 'Shipping Greater Components through FaceTheory',
			type: 'text',
			content: `
## Host-owned boundaries

FaceTheory owns the request lifecycle, routing, and hydration assets while Greater Components stays import-safe on the server.

- Serving host: ${hostLabel}
- Theme: ${themeAttributes['data-theme']}
- Density: ${themeAttributes['data-density']}

## Representative stack

This example renders a reusable community post through \`createSvelteFace()\` while server-preparing primitives theme attributes and token values.

- Primary 600: ${primaryToken}
- Spacing 6: ${spacingToken}
- Canonical URL: ${canonicalUrl}

[Read the integration guide](${docsHref})
			`.trim(),
			author: {
				id: 'greater-maintainers',
				username: 'greater',
			},
			community: {
				id: 'hosted-components',
				name: 'hosted-components',
				title: 'Hosted Components',
			},
			score: 128,
			upvoteRatio: 0.97,
			commentCount: 12,
			createdAt: '2026-03-27T12:00:00.000Z',
		},
		docsHref,
		hostLabel,
		themeAttributes,
	};
}
