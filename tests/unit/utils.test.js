import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isEmpty, generateId, debounce } from '../../src/shared/utils/index.js';

describe('Shared Utils', () => {
    describe('isEmpty()', () => {
        it('should return true for null', () => {
            expect(isEmpty(null)).toBe(true);
        });

        it('should return true for undefined', () => {
            expect(isEmpty(undefined)).toBe(true);
        });

        it('should return true for empty string', () => {
            expect(isEmpty('')).toBe(true);
        });

        it('should return true for whitespace-only string', () => {
            expect(isEmpty('   ')).toBe(true);
        });

        it('should return false for non-empty string', () => {
            expect(isEmpty('hello')).toBe(false);
        });
    });

    describe('generateId()', () => {
        it('should return a non-empty string', () => {
            const id = generateId();
            expect(typeof id).toBe('string');
            expect(id.length).toBeGreaterThan(0);
        });

        it('should return unique values', () => {
            const id1 = generateId();
            const id2 = generateId();
            expect(id1).not.toBe(id2);
        });
    });

    describe('debounce()', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should delay function execution', () => {
            const fn = vi.fn();
            const debouncedFn = debounce(fn, 300);

            debouncedFn();
            expect(fn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(300);
            expect(fn).toHaveBeenCalledTimes(1);
        });

        it('should reset timer on subsequent calls', () => {
            const fn = vi.fn();
            const debouncedFn = debounce(fn, 300);

            debouncedFn();
            vi.advanceTimersByTime(200);
            debouncedFn();
            vi.advanceTimersByTime(200);

            expect(fn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(100);
            expect(fn).toHaveBeenCalledTimes(1);
        });
    });
});
