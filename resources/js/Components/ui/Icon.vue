<script>
/**
 * Inline icon set — lucide-style: 1.5px stroke, never filled, viewBox 0 0 24 24.
 * Ported verbatim from the design handoff (shared.jsx). To add an icon, add its
 * inner SVG markup here; to swap the whole set for lucide-vue-next later, keep
 * this component's props API and render the library icon instead.
 *
 * The markup below is a static, trusted constant (no user input), so v-html is safe.
 */
const PATHS = {
    search: '<circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />',
    coin: '<circle cx="12" cy="12" r="9" /><path d="M12 7v10M9 9.5h4.5a1.5 1.5 0 0 1 0 3H10a1.5 1.5 0 0 0 0 3h4.5" />',
    plus: '<path d="M12 5v14M5 12h14" />',
    minus: '<path d="M5 12h14" />',
    x: '<path d="M18 6L6 18M6 6l12 12" />',
    check: '<path d="M20 6L9 17l-5-5" />',
    chevron_down: '<path d="M6 9l6 6 6-6" />',
    chevron_left: '<path d="M15 18l-6-6 6-6" />',
    chevron_right: '<path d="M9 18l6-6-6-6" />',
    sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-9h7v7a9 9 0 0 1-9 9z"/><path d="M2 22l8-8"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><circle cx="17" cy="9" r="3"/><path d="M22 20a5 5 0 0 0-6-4.9"/>',
    package: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
    flask: '<path d="M9 3h6"/><path d="M10 3v6L4 20a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 20l-6-11V3"/><path d="M7.5 14h9"/>',
    book: '<path d="M4 4a2 2 0 0 1 2-2h14v18H6a2 2 0 0 0-2 2V4z"/><path d="M4 20a2 2 0 0 0 2 2h12"/>',
    file_text: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 4h2l2.5 12h11l2-8H6"/>',
    whatsapp: '<path d="M3 21l1.5-5A8 8 0 1 1 8 19.5L3 21z"/><path d="M8.5 9.5c.5 2 2 3.5 4 4l1.2-1.2a1 1 0 0 1 1.1-.2l2 .8a1 1 0 0 1 .6 1.1c-.4 1.8-2 2.5-3.5 2.2-3-.6-5.7-3.3-6.3-6.3-.3-1.5.4-3.1 2.2-3.5a1 1 0 0 1 1.1.6l.8 2a1 1 0 0 1-.2 1.1L9.5 11"/>',
    edit: '<path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
    filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/>',
    sparkles: '<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
    arrow_left: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    arrow_right: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/>',
    home: '<path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7H10v7H6a2 2 0 0 1-2-2v-9z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    hourglass: '<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4a2 2 0 0 0-.6 1.4V22"/><path d="M7 2v4.2a2 2 0 0 0 .6 1.4L12 12l4.4-4.4a2 2 0 0 0 .6-1.4V2"/>',
    cart_clock: '<path d="M13.2 2.8H6.4a1.8 1.8 0 0 0-1.8 1.8v14.8a1.8 1.8 0 0 0 1.8 1.8h5.8"/><path d="M13.2 2.8v4.2h4.2"/><path d="M17.4 7v3.3"/><path d="M7.6 12.5h4M7.6 16h2.8"/><circle cx="18.7" cy="17.1" r="4"/><path d="M18.7 15.1v2l1.4 1"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>',
    clipboard_list: '<rect x="8" y="3" width="8" height="4" rx="1"/><path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/><path d="M9 12h.01M9 16h.01M13 12h5M13 16h5"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6 2 2 0 0 1 2-2.2h3a2 2 0 0 1 2 1.7 13 13 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.4a2 2 0 0 1 2.1-.5 13 13 0 0 0 2.8.7 2 2 0 0 1 1.7 2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    map_pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    alert: '<path d="M10.3 3.2L2 18a2 2 0 0 0 1.7 3h16.6A2 2 0 0 0 22 18L13.7 3.2a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
    eye_off: '<path d="M3 3l18 18"/><path d="M10.6 10.6a3 3 0 0 0 4.2 4.2"/><path d="M9.4 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.3 4.1"/><path d="M6.1 6.1A17.4 17.4 0 0 0 2 12s3.5 7 10 7a10.5 10.5 0 0 0 3.9-.7"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 9l5-5 5 5M12 4v12"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    camera: '<rect x="2" y="7" width="13" height="11" rx="2"/><path d="M15 11l6-3.5v9L15 13"/>',
};

// Exposed for tooling/tests that want the icon inventory.
export { PATHS };
</script>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    /** Icon key — see PATHS above for the full inventory. */
    name: { type: String, required: true },
    size: { type: Number, default: 18 },
    stroke: { type: Number, default: 1.5 },
    color: { type: String, default: 'currentColor' },
    /**
     * Accessible name. Icons are DECORATIVE by default (aria-hidden — most sit
     * inside an already-labeled button/link, so announcing them is noise). Set
     * `label` only for the rare icon that is the sole meaning of its control;
     * it then becomes role="img" with that label. (A6)
     */
    label: { type: String, default: '' },
});

const markup = computed(() => PATHS[props.name] || null);
</script>

<template>
    <svg
        v-if="markup"
        :width="size"
        :height="size"
        viewBox="0 0 24 24"
        fill="none"
        :stroke="color"
        :stroke-width="stroke"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="flex-shrink: 0"
        :role="label ? 'img' : undefined"
        :aria-label="label || undefined"
        :aria-hidden="label ? undefined : 'true'"
        focusable="false"
        v-html="markup"
    />
</template>
