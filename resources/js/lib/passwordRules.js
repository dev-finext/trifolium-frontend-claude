// Shared password strength rules for the auth flow (ResetPassword + ChangePassword).
// Policy (F11/F13): min 8, max 64, at least one Latin letter, one digit, and
// either an uppercase Latin letter OR a symbol. Hebrew letters no longer count
// toward the "letter" requirement. The individual checks double as the live
// requirement checklist rendered on those screens.
// TODO(backend): server-side validation remains authoritative.

export const PASSWORD_RULES = [
    { id: 'len', label: 'בין 8 ל-64 תווים', test: (v) => v.length >= 8 && v.length <= 64 },
    { id: 'letter', label: 'אות באנגלית אחת לפחות', test: (v) => /[a-zA-Z]/.test(v) },
    { id: 'digit', label: 'ספרה אחת לפחות', test: (v) => /\d/.test(v) },
    { id: 'strong', label: 'אות גדולה או תו מיוחד', test: (v) => /[A-Z]/.test(v) || /[^a-zA-Z0-9]/.test(v) },
];

// Run every rule against a password. Returns the per-rule results plus an
// overall `valid` flag, so callers can reuse the checks for both gating and
// the live checklist.
export function validate(password) {
    const value = password || '';
    const checks = {};
    for (const r of PASSWORD_RULES) checks[r.id] = r.test(value);
    return { valid: PASSWORD_RULES.every(r => checks[r.id]), checks };
}
