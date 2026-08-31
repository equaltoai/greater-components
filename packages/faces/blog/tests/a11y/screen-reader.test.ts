import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import FullArticleTestWrapper from '../fixtures/FullArticleTestWrapper.svelte';
import { Editor } from '../../src/components/Editor/index.js';
import QueueCard from '../../src/components/Review/QueueCard.svelte';
import {
	REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL,
	REVIEW_STALE_APPROVAL_LABEL,
} from '../../src/components/Review/state.js';
import { createMockArticle } from '../mocks/mockArticle.js';
import {
	createMockAgentActor,
	createMockDraftReview,
	createMockVerdict,
} from '../mocks/mockDraftReview.js';

describe('A11y: Screen Reader Support', () => {
	const mockArticle = createMockArticle('a11y-sr');

	describe('Article Semantics', () => {
		it('uses correct landmarks', () => {
			render(FullArticleTestWrapper, { props: { article: mockArticle } });

			// <article> should be present
			expect(screen.getByRole('article')).toBeInTheDocument();

			// Footer
			expect(screen.getByRole('contentinfo')).toBeInTheDocument();
		});

		it('provides reading progress updates', () => {
			render(FullArticleTestWrapper, { props: { article: mockArticle } });

			const progress = screen.getByRole('progressbar');
			expect(progress).toHaveAttribute('aria-label', 'Reading progress');
			expect(progress).toHaveAttribute('aria-valuemin', '0');
			expect(progress).toHaveAttribute('aria-valuemax', '100');
		});
	});

	describe('Editor Semantics', () => {
		const editorProps = {
			draft: {
				id: 'd1',
				title: 'Draft',
				content: '',
				contentFormat: 'markdown',
				savedAt: new Date(),
			},
			config: { mode: 'markdown' },
		};

		it('toolbar has correct label', () => {
			render(Editor.Root, { props: editorProps });
			expect(screen.getByRole('toolbar', { name: 'Editor toolbar' })).toBeInTheDocument();
		});

		it('status region is polite', () => {
			const { container } = render(Editor.Root, { props: editorProps });
			const status = container.querySelector('[aria-live="polite"]');
			expect(status).toBeInTheDocument();
		});
	});

	describe('Review stale-approval semantics', () => {
		const staleReview = createMockDraftReview('a11y-stale', {
			generatedBy: createMockAgentActor('a1'),
			verdicts: [createMockVerdict({ verdict: 'APPROVED', stale: true })],
			publishEligibility: {
				eligible: false,
				blockingReasons: [],
				reviewersApproved: false,
				principalApprovalRequired: true,
				principalApproved: false,
			},
		});

		it('states the stale approval in text, not colour alone', () => {
			// WCAG 1.4.1: the demotion from current to stale must survive a
			// screen reader, which sees no badge colour at all.
			render(QueueCard, { props: { review: staleReview } });

			expect(screen.getByText(REVIEW_STALE_APPROVAL_LABEL)).toBeInTheDocument();
			expect(screen.getByText(REVIEW_STALE_APPROVAL_DETAIL_PRINCIPAL)).toBeInTheDocument();
		});

		it('names the outstanding approval for assistive technology', () => {
			// WCAG 4.1.2: the state a screen reader announces must say the
			// approval no longer counts and what is outstanding now.
			render(QueueCard, { props: { review: staleReview } });

			const stateGroup = screen.getByText(REVIEW_STALE_APPROVAL_LABEL).closest('div');
			expect(stateGroup?.textContent).toContain('no longer counts');
			expect(stateGroup?.textContent).toContain('Principal approval');
			// No element may announce a bare current-approval state.
			expect(screen.queryByText('Approved', { exact: true })).not.toBeInTheDocument();
		});

		it('keeps the card named by its heading through the state change', () => {
			const { container } = render(QueueCard, { props: { review: staleReview } });

			const article = container.querySelector('article');
			const heading = container.querySelector('h2');
			expect(article).toHaveAttribute('aria-labelledby', heading?.id);
		});
	});
});
