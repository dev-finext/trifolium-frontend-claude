// Client-side validators for the auth flow (ported verbatim from auth.jsx).
// TODO(backend): server-side validation is authoritative; these only gate UX.

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export const onlyDigits = (v) => v.replace(/\D/g, '');

export const isPhone = (v) => /^0\d{8,9}$/.test(onlyDigits(v));

// Israeli ID check digit (Luhn-like weighting over 9 digits).
export function isIsraeliID(v) {
    const id = onlyDigits(v);
    if (!/^\d{9}$/.test(id)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        let step = Number(id[i]) * ((i % 2) + 1);
        if (step > 9) step -= 9;
        sum += step;
    }
    return sum % 10 === 0;
}
