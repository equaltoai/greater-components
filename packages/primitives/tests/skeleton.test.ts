import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Skeleton from '../src/components/Skeleton.svelte';
import SkeletonHarness from './harness/SkeletonHarness.svelte';

describe('Skeleton.svelte', () => {
  it('applies sizing styles and animation classes', () => {
    const { getByRole } = render(Skeleton, {
      props: { variant: 'circular', width: 48, height: 48, animation: 'wave' }
    });

    const skeleton = getByRole('status', { hidden: true });
    expect(skeleton.className).toContain('gr-skeleton--circular');
    expect(skeleton.className).toContain('gr-skeleton--wave');
    expect(skeleton.getAttribute('style')).toContain('width: 48px');
    expect(skeleton.getAttribute('style')).toContain('height: 48px');
  });

  it('renders children when loading is false', () => {
    const { getByTestId } = render(SkeletonHarness, {
      props: { props: { loading: false } }
    });

    expect(getByTestId('skeleton-children').textContent).toContain('Loaded content');
  });
});
