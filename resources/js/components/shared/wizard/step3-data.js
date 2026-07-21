// Step-3-only constant maps + tiny pure helpers that are NOT part of the
// shared wizard contract (wizard-rules.js / wizard-lib.js). Everything here is
// local to the compounding lab's presentation layer.

// Chip tones — "רך וממולא": soft tinted circle, icon in the matching hue.
export const CHIP_TONE = {
    info: { bg: 'var(--accent-tint)', fg: 'var(--accent)' },
    warn: { bg: '#f4ecda', fg: 'var(--warning)' },
    danger: { bg: 'var(--danger-tint)', fg: 'var(--danger)' },
};
