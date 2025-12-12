import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPassword, isValidUsername, isValidInstanceUrl } from '../src/context.js';

describe('Auth Context Utilities', () => {
    describe('isValidEmail', () => {
        it('validates correct emails', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user.name+tag@sub.domain.co.uk')).toBe(true);
        });

        it('rejects invalid emails', () => {
            expect(isValidEmail('plainaddress')).toBe(false);
            expect(isValidEmail('@missingusername.com')).toBe(false);
            expect(isValidEmail('username@.com')).toBe(false);
        });
    });

    describe('isValidPassword', () => {
        it('validates strong passwords', () => {
            expect(isValidPassword('StrongP@ss1').valid).toBe(true);
        });

        it('checks length', () => {
            expect(isValidPassword('Short1!').valid).toBe(false);
            expect(isValidPassword('Short1!').message).toContain('at least 8 characters');
        });

        it('checks lowercase', () => {
            expect(isValidPassword('ALLCAPS1!').valid).toBe(false);
            expect(isValidPassword('ALLCAPS1!').message).toContain('lowercase letter');
        });

        it('checks uppercase', () => {
            expect(isValidPassword('nocaps1!').valid).toBe(false);
            expect(isValidPassword('nocaps1!').message).toContain('uppercase letter');
        });

        it('checks number', () => {
            expect(isValidPassword('NoNumbers!').valid).toBe(false);
            expect(isValidPassword('NoNumbers!').message).toContain('number');
        });
    });

    describe('isValidUsername', () => {
        it('validates correct usernames', () => {
            expect(isValidUsername('valid_user_1').valid).toBe(true);
        });

        it('checks length', () => {
            expect(isValidUsername('no').valid).toBe(false);
            expect(isValidUsername('a'.repeat(31)).valid).toBe(false);
        });

        it('checks characters', () => {
            expect(isValidUsername('invalid-char').valid).toBe(false);
            expect(isValidUsername('user@name').valid).toBe(false);
        });
    });

    describe('isValidInstanceUrl', () => {
        it('validates correct URLs', () => {
            expect(isValidInstanceUrl('example.com')).toBe(true);
            expect(isValidInstanceUrl('https://example.com')).toBe(true);
        });

        it('rejects empty or invalid URLs', () => {
            expect(isValidInstanceUrl('')).toBe(false);
            expect(isValidInstanceUrl('   ')).toBe(false);
            expect(isValidInstanceUrl('http://')).toBe(false); // Just protocol
        });
    });
});
