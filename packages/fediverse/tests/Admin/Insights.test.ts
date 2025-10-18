import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import type { LesserGraphQLAdapter } from '@greater/adapters';
import InsightsAIAnalysisHarness from './InsightsAIAnalysisHarness.svelte';
import InsightsModerationHarness from './InsightsModerationHarness.svelte';

const baseAdapter = (): LesserGraphQLAdapter => ({
  // Provide no-op implementations for unused adapter methods
} as unknown as LesserGraphQLAdapter);

describe('Admin.Insights Components', () => {
  it('renders AI analysis data from adapter', async () => {
    const analysis = {
      id: 'analysis-1',
      objectId: 'status-1',
      objectType: 'NOTE',
      overallRisk: 0.42,
      moderationAction: 'review',
      confidence: 0.91,
      textAnalysis: {
        sentiment: 'neutral',
        toxicityScore: 0.2,
        containsPII: false,
        dominantLanguage: 'en',
      },
      imageAnalysis: {
        isNSFW: false,
        violenceScore: 0.15,
        deepfakeScore: 0.05,
        nsfwConfidence: 0.12,
      },
    };

    const adapter = {
      ...baseAdapter(),
      getAIAnalysis: vi.fn().mockResolvedValue(analysis),
      requestAIAnalysis: vi.fn(),
    } as unknown as LesserGraphQLAdapter;

    render(InsightsAIAnalysisHarness, {
      props: {
        adapter,
        objectId: 'status-1',
      },
    });

    expect(adapter.getAIAnalysis).toHaveBeenCalledWith('status-1');
    expect(await screen.findByText('AI Analysis')).toBeTruthy();
    expect(screen.getByText('42.0% Risk')).toBeTruthy();
    expect(screen.getByText(/Confidence:/i).textContent).toContain('91.0%');
  });

  it('requests analysis when autoRequest enabled and no data present', async () => {
    const adapter = {
      ...baseAdapter(),
      getAIAnalysis: vi.fn().mockResolvedValue(null),
      requestAIAnalysis: vi.fn().mockResolvedValue(undefined),
    } as unknown as LesserGraphQLAdapter;

    render(InsightsAIAnalysisHarness, {
      props: {
        adapter,
        objectId: 'status-2',
        autoRequest: true,
      },
    });

    await waitFor(() => {
      expect(adapter.requestAIAnalysis).toHaveBeenCalledWith('status-2');
    });
  });

  it('loads moderation analytics and displays key metrics', async () => {
    const stats = {
      period: 'DAY',
      totalAnalyses: 120,
      toxicContent: 18,
      spamDetected: 9,
      aiGenerated: 30,
      nsfwContent: 6,
      piiDetected: 2,
      toxicityRate: 0.15,
      spamRate: 0.075,
      aiContentRate: 0.25,
      nsfwRate: 0.05,
      moderationActions: {
        flag: 12,
        hide: 8,
        remove: 5,
        review: 7,
        shadowBan: 1,
      },
    };

    const adapter = {
      ...baseAdapter(),
      getAIStats: vi.fn().mockResolvedValue(stats),
    } as unknown as LesserGraphQLAdapter;

    render(InsightsModerationHarness, {
      props: {
        adapter,
        period: 'DAY',
      },
    });

    await screen.findByText('Moderation Analytics');
    expect(adapter.getAIStats).toHaveBeenCalledWith('DAY');
    expect(screen.getByText('Total Analyses')).toBeTruthy();
    expect(screen.getByText('120')).toBeTruthy();
    expect(screen.getByText('Spam Detected')).toBeTruthy();
    expect(screen.getByText('9')).toBeTruthy();
  });
});
