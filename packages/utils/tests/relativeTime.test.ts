import { describe, it, expect } from 'vitest';
import { relativeTime, formatDateTime, getDuration } from '../src/relativeTime';

describe('relativeTime', () => {
  const now = new Date('2024-01-15T12:00:00Z');

  it('should format "just now" for very recent times', () => {
    const date = new Date('2024-01-15T11:59:58Z');
    expect(relativeTime(date, { now })).toBe('just now');
  });

  it('should format seconds ago', () => {
    const date = new Date('2024-01-15T11:59:30Z');
    expect(relativeTime(date, { now })).toBe('30 seconds ago');
  });

  it('should format minutes ago', () => {
    const date = new Date('2024-01-15T11:30:00Z');
    expect(relativeTime(date, { now })).toBe('30 minutes ago');
  });

  it('should format hours ago', () => {
    const date = new Date('2024-01-15T09:00:00Z');
    expect(relativeTime(date, { now })).toBe('3 hours ago');
  });

  it('should format yesterday', () => {
    const date = new Date('2024-01-14T12:00:00Z');
    expect(relativeTime(date, { now, numeric: 'auto' })).toBe('yesterday');
  });

  it('should format days ago with numeric always', () => {
    const date = new Date('2024-01-14T12:00:00Z');
    expect(relativeTime(date, { now, numeric: 'always' })).toBe('1 day ago');
  });

  it('should format weeks ago', () => {
    const date = new Date('2024-01-01T12:00:00Z');
    expect(relativeTime(date, { now })).toBe('2 weeks ago');
  });

  it('should format months ago', () => {
    const date = new Date('2023-11-15T12:00:00Z');
    expect(relativeTime(date, { now })).toBe('2 months ago');
  });

  it('should format years ago', () => {
    const date = new Date('2022-01-15T12:00:00Z');
    expect(relativeTime(date, { now })).toBe('2 years ago');
  });

  it('should format future times', () => {
    const date = new Date('2024-01-15T13:00:00Z');
    expect(relativeTime(date, { now })).toBe('in 1 hour');
  });

  it('should respect maxUnit option', () => {
    const date = new Date('2022-01-15T12:00:00Z');
    expect(relativeTime(date, { now, maxUnit: 'day' })).toBe('730 days ago');
  });

  it('should handle invalid dates', () => {
    expect(relativeTime('invalid', { now })).toBe('Invalid date');
  });

  it('should handle string dates', () => {
    const date = '2024-01-15T11:00:00Z';
    expect(relativeTime(date, { now })).toBe('1 hour ago');
  });

  it('should handle timestamps', () => {
    const date = new Date('2024-01-15T11:00:00Z').getTime();
    expect(relativeTime(date, { now })).toBe('1 hour ago');
  });
});

describe('formatDateTime', () => {
  const date = new Date('2024-01-15T12:30:45Z');

  it('should return absolute, relative, and ISO formats', () => {
    const result = formatDateTime(date);
    expect(result).toHaveProperty('absolute');
    expect(result).toHaveProperty('relative');
    expect(result).toHaveProperty('iso');
    expect(result.iso).toBe(date.toISOString());
  });

  it('should handle invalid dates', () => {
    const result = formatDateTime('invalid');
    expect(result.absolute).toBe('Invalid date');
    expect(result.relative).toBe('Invalid date');
    expect(result.iso).toBe('');
  });

  it('should use custom date and time styles', () => {
    const result = formatDateTime(date, { 
      dateStyle: 'short',
      timeStyle: 'long'
    });
    expect(result.absolute).toBeTruthy();
  });
});

describe('getDuration', () => {
  it('should calculate duration between dates', () => {
    const start = new Date('2024-01-15T10:00:00Z');
    const end = new Date('2024-01-15T12:30:45Z');
    const duration = getDuration(start, end);
    expect(duration).toBe('2 hours, 30 minutes');
  });

  it('should handle reverse order', () => {
    const start = new Date('2024-01-15T12:30:45Z');
    const end = new Date('2024-01-15T10:00:00Z');
    const duration = getDuration(start, end);
    expect(duration).toBe('2 hours, 30 minutes');
  });

  it('should limit units', () => {
    const start = new Date('2024-01-15T10:00:00Z');
    const end = new Date('2024-01-15T12:30:45Z');
    const duration = getDuration(start, end, { units: 1 });
    expect(duration).toBe('2 hours');
  });

  it('should handle same dates', () => {
    const date = new Date('2024-01-15T10:00:00Z');
    const duration = getDuration(date, date);
    expect(duration).toBe('0 seconds');
  });

  it('should handle invalid dates', () => {
    expect(getDuration('invalid', new Date())).toBe('Invalid date');
  });
});