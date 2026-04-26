import { describe, it, expect, beforeAll } from 'vitest';
import { signToken, verifyToken } from '../src/lib/jwt.js';

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret-' + 'x'.repeat(40);
});

describe('jwt helpers', () => {
  it('signs and verifies a token round-trip', () => {
    const token = signToken({ userId: '123', email: 'a@mcgill.ca' });
    expect(typeof token).toBe('string');
    const payload = verifyToken(token);
    expect(payload.userId).toBe('123');
    expect(payload.email).toBe('a@mcgill.ca');
  });

  it('throws on tampered token', () => {
    const token = signToken({ userId: '123' });
    const tampered = token.slice(0, -4) + 'AAAA';
    expect(() => verifyToken(tampered)).toThrow();
  });

  it('throws on malformed token', () => {
    expect(() => verifyToken('not-a-jwt')).toThrow();
  });
});
