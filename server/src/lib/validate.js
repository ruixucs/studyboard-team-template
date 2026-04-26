const MCGILL_EMAIL = /^[a-zA-Z0-9._%+-]+@(mail\.)?mcgill\.ca$/i;

export function isMcgillEmail(email) {
  if (typeof email !== 'string' || !email) return false;
  return MCGILL_EMAIL.test(email.trim());
}

export function validatePassword(pw) {
  if (typeof pw !== 'string' || pw.length < 8) {
    return { ok: false, reason: 'Password must be at least 8 characters' };
  }
  if (!/[a-zA-Z]/.test(pw) || !/[0-9]/.test(pw)) {
    return { ok: false, reason: 'Password must contain a letter and a digit' };
  }
  return { ok: true };
}
