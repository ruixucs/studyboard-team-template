import { describe, it, expect } from 'vitest';
import { isMcgillEmail, validatePassword } from '../src/lib/validate.js';

describe('isMcgillEmail', () => {
  it('accepts @mcgill.ca', () => {
    expect(isMcgillEmail('jane.doe@mcgill.ca')).toBe(true);
  });
  it('accepts @mail.mcgill.ca', () => {
    expect(isMcgillEmail('xu.rui@mail.mcgill.ca')).toBe(true);
  });
  it('rejects @gmail.com', () => {
    expect(isMcgillEmail('foo@gmail.com')).toBe(false);
  });
  it('rejects missing @', () => {
    expect(isMcgillEmail('mcgill.ca')).toBe(false);
  });
  it('rejects empty/undefined', () => {
    expect(isMcgillEmail('')).toBe(false);
    expect(isMcgillEmail(undefined)).toBe(false);
  });
  it('is case-insensitive', () => {
    expect(isMcgillEmail('Jane@MCGILL.CA')).toBe(true);
  });
});

describe('validatePassword', () => {
  it('accepts min 8 chars with letter + digit', () => {
    expect(validatePassword('abc12345')).toEqual({ ok: true });
  });
  it('rejects too short', () => {
    expect(validatePassword('ab12').ok).toBe(false);
  });
  it('rejects letters only', () => {
    expect(validatePassword('abcdefgh').ok).toBe(false);
  });
  it('rejects digits only', () => {
    expect(validatePassword('12345678').ok).toBe(false);
  });
});
