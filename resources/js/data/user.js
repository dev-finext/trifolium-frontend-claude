// The signed-in practitioner — one shared demo identity for every surface
// (top bar, mobile home greeting, drawer).
// TODO(backend): replace with the authenticated user from Inertia shared
// props (e.g. usePage().props.auth.user) once Laravel provides it.
export const DEMO_USER = {
    name: 'נעמי שגב',
    firstName: 'נעמי',
    initials: 'נש',
    points: '1,240',
};
