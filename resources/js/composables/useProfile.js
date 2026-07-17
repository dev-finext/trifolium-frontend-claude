// Shared practitioner profile — single source of truth for the personal-
// details editor AND the chrome identity (navbar, drawer, mobile greeting).
// Mirrors useAddresses: a module-scope ref persisted to localStorage, so
// saving the profile updates every mounted consumer immediately (this is why
// a name edit is visible in the top bar right after "שמור שינויים").
import { computed, ref } from 'vue';
import { DEMO_POINTS, DEMO_PROFILE } from '@/data/user';

const TF_PROFILE_KEY = 'tf:profile:v1';

// TODO(backend): load the practitioner's profile from the server instead of
// localStorage (Inertia shared prop / profile endpoint).
export function tfLoadProfile() {
    try {
        const raw = localStorage.getItem(TF_PROFILE_KEY);

        if (raw) {
            const stored = JSON.parse(raw);

            if (stored && typeof stored === 'object') {
                // Merge over the seed so newly-added fields keep a value.
                return { ...DEMO_PROFILE, ...stored };
            }
        }
    } catch {
        /* ignore */
    }

    return { ...DEMO_PROFILE };
}

// The one reactive profile every consumer shares.
const profile = ref(tfLoadProfile());

// TODO(backend): persist to the server; localStorage stands in until then.
export function tfSaveProfile(fields) {
    const normalized = { ...profile.value, ...fields };

    try {
        localStorage.setItem(TF_PROFILE_KEY, JSON.stringify(normalized));
    } catch {
        /* ignore */
    }

    profile.value = normalized;

    return normalized;
}

// Reactive hook — updates whenever the profile is saved anywhere in the app.
export function useProfile() {
    return profile;
}

/** Chrome identity derived from the profile: full name, first name, initials
 *  and the points balance — the shape TheNavbar/MobileDrawer/UserMenu expect. */
export const tfUser = computed(() => {
    const p = profile.value;
    const firstName = (p.firstName || '').trim();
    const lastName = (p.lastName || '').trim();

    return {
        name: `${firstName} ${lastName}`.trim(),
        firstName,
        initials: `${firstName.charAt(0)}${lastName.charAt(0)}`,
        points: DEMO_POINTS,
    };
});
