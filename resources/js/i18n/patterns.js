// Curated interpolation patterns for the English overlay (see ./overlay.js).
// The whole-string dictionary (dictionary.js) can't hold strings with
// interpolated numbers/units (e.g. "20 × ביום"), so after an exact lookup
// fails the overlay applies these bounded regex replacements to the string.
// Each pattern is deliberately narrow so it can't corrupt unrelated words.
export const PATTERNS = [
    [/(\d[\d.,]*)\s*×\s*ביום/g, '$1×/day'],
    [/×\s*ביום/g, '×/day'],
    [/(\d[\d.,]*)\s*כמוסות/g, '$1 capsules'],
    [/(\d[\d.,]*)\s*שקיות/g, '$1 sachets'],
    [/(\d[\d.,]*)\s*ג(?![֐-׿])/g, '$1g'], // grams after a number
    [/(\d[\d.,]*)\s*מ״ל/g, '$1 ml'],
    [/^אינטראקציה עם\s+/, 'Interaction with '],
    [/^הסר\s+/, 'Remove '],
    [/^הסרת\s+/, 'Remove '],
    [/\bליום\b/g, '/day'],
];
