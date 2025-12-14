
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getCurrentBreakpoint,
  matchesBreakpoint,
  responsive,
  createBreakpointObserver,
  createLoadingState,
  setLoading,
  setSuccess,
  setError,
  isStale,
  composeClasses,
  debounce,
  throttle,
  createErrorBoundaryState,
  handleBoundaryError,
  resetErrorBoundary,
  formatErrorMessage,
} from '../../src/patterns/utils.js';

describe('Pattern Utilities', () => {
  describe('Breakpoint Utilities', () => {
    // Mock window.innerWidth
    const setWindowWidth = (width: number) => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      });
      window.dispatchEvent(new Event('resize'));
    };

    it('getCurrentBreakpoint returns correct breakpoint', () => {
      setWindowWidth(1600);
      expect(getCurrentBreakpoint()).toBe('2xl');
      setWindowWidth(1300);
      expect(getCurrentBreakpoint()).toBe('xl');
      setWindowWidth(1100);
      expect(getCurrentBreakpoint()).toBe('lg');
      setWindowWidth(800);
      expect(getCurrentBreakpoint()).toBe('md');
      setWindowWidth(650);
      expect(getCurrentBreakpoint()).toBe('sm');
      setWindowWidth(400);
      expect(getCurrentBreakpoint()).toBe('xs');
    });

    it('matchesBreakpoint checks min width correctly', () => {
      setWindowWidth(800); // md (768)
      expect(matchesBreakpoint('sm')).toBe(true);
      expect(matchesBreakpoint('md')).toBe(true);
      expect(matchesBreakpoint('lg')).toBe(false);
    });

    it('responsive returns correct value based on breakpoint', () => {
      setWindowWidth(800); // md
      const values = {
        sm: 'small',
        md: 'medium',
        lg: 'large',
      };
      // Should pick md
      expect(responsive(values, 'default')).toBe('medium');

      setWindowWidth(400); // xs
      // Should fall back to default as xs is not in values
      expect(responsive(values, 'default')).toBe('default');
    });
  });

  describe('Loading State Utilities', () => {
    it('createLoadingState initializes correctly', () => {
      const state = createLoadingState<string>('init');
      expect(state).toEqual({
        state: 'idle',
        data: 'init',
        error: null,
        timestamp: expect.any(Number),
      });
    });

    it('setLoading updates state', () => {
      const initial = createLoadingState<string>('init');
      const next = setLoading(initial);
      expect(next.state).toBe('loading');
      expect(next.error).toBeNull();
    });

    it('setSuccess updates state and data', () => {
      const initial = createLoadingState<string>('init');
      const next = setSuccess(initial, 'success-data');
      expect(next.state).toBe('success');
      expect(next.data).toBe('success-data');
      expect(next.error).toBeNull();
    });

    it('setError updates state and error', () => {
      const initial = createLoadingState<string>('init');
      const error = new Error('fail');
      const next = setError(initial, error);
      expect(next.state).toBe('error');
      expect(next.error).toBe(error);
    });

    it('isStale returns correct boolean', () => {
      vi.useFakeTimers();
      const state = createLoadingState('test');
      
      // Initially not stale
      expect(isStale(state, 1000)).toBe(false);
      
      // Advance time beyond maxAge
      vi.advanceTimersByTime(1001);
      expect(isStale(state, 1000)).toBe(true);
      
      vi.useRealTimers();
    });
  });

  describe('Composition Utilities', () => {
    it('composeClasses joins classes and filters falsy', () => {
      expect(composeClasses('a', 'b')).toBe('a b');
      expect(composeClasses('a', undefined, 'b', false, null)).toBe('a b');
    });
  });

  describe('Timer Utilities', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('debounce delays execution', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('throttle limits execution', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Boundary Utilities', () => {
    it('createErrorBoundaryState initializes correctly', () => {
      expect(createErrorBoundaryState()).toEqual({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    });

    it('handleBoundaryError updates state', () => {
      const state = createErrorBoundaryState();
      const error = new Error('oops');
      const next = handleBoundaryError(state, error, 'component stack');
      
      expect(next.hasError).toBe(true);
      expect(next.error).toBe(error);
      expect(next.errorInfo).toBe('component stack');
    });

    it('resetErrorBoundary resets state', () => {
      expect(resetErrorBoundary()).toEqual({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    });

    it('formatErrorMessage respects NODE_ENV', () => {
        const error = new Error('sensitive info');
        
        // Mock non-prod
        process.env.NODE_ENV = 'test';
        expect(formatErrorMessage(error)).toBe('sensitive info');

        // Mock prod
        process.env.NODE_ENV = 'production';
        expect(formatErrorMessage(error)).toBe('An unexpected error occurred');
        
        // Restore
        process.env.NODE_ENV = 'test';
    });
  });
});
