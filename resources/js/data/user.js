// ╔═══════════════════════════════════════════════════════════════════════╗
// ║  ⚠️  DEMO DATA — NOT PART OF THE APPLICATION. DO NOT SHIP.             ║
// ╚═══════════════════════════════════════════════════════════════════════╝
//
// The signed-in practitioner's seed profile + points, one shared demo
// identity for every surface (top bar, drawer, mobile greeting, profile
// editor). The editable fields live behind composables/useProfile.js, which
// persists edits to localStorage until a backend exists.
// TODO(backend): replace with the authenticated user from Inertia shared
// props (e.g. usePage().props.auth.user), then delete this file.
export const DEMO_PROFILE = {
    firstName: 'נעמי',
    lastName: 'שגב',
    treatment: 'נטורופתיה',
    specialty: 'נשים ופוריות',
    email: 'naomi.segev@trifolium.co.il',
    phone: '052-481-9230',
    clinic: 'מרפאת שורש — רעננה',
    license: 'NAT-2019-4471',
};

// Formatted points balance (matches the WALLET_TX ledger sum in data/mock.js).
export const DEMO_POINTS = '1,240';
