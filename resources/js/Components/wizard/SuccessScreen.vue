<script setup>
// Success state — large checkmark + next-step links. Two variants: save (no
// patient) and order (patient selected). Navigation replaces the prototype's
// tf:route events; the order hand-off replaces window.__tfLastOrder.
import Icon from '@/Components/ui/Icon.vue';
import { visit } from '@/lib/routes';
import { setLastOrder } from '@/lib/orders';

const props = defineProps({
    noPatient: { type: Boolean, default: false },
    patientLabel: { type: String, default: null },
    formulaName: { type: String, default: '' },
    order: { type: Object, default: null },
});

// "צפה בהזמנה" — hand the freshly-built order to the Order view, then navigate.
function viewOrder() {
    setLastOrder(props.order);
    visit('order', { id: props.order?.id });
}
function goCart() {
    visit('cart');
    window.scrollTo(0, 0);
}
function goHome() {
    visit('home');
}
</script>

<template>
    <div class="card" style="padding: 64px 32px; text-align: center">
        <div
            style="width: 80px; height: 80px; border-radius: 50%; background: var(--accent-tint-strong); color: var(--accent); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px"
        >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6L9 17l-5-5" />
            </svg>
        </div>

        <h2 style="font-size: 24px; font-weight: 600; margin: 0 0 8px">
            {{ noPatient ? 'הפורמולה נשמרה בהצלחה' : 'ההזמנה נשלחה בהצלחה' }}
        </h2>

        <p class="muted" style="margin: 0; font-size: 14px; max-width: 480px; margin-inline: auto">
            <template v-if="noPatient">
                הפורמולה <strong style="color: var(--ink-2)">{{ formulaName || 'ללא שם' }}</strong> נשמרה בטיוטות שלך. ניתן לקשר אותה למטופל ולהפוך אותה להזמנה בכל רגע.
            </template>
            <template v-else>
                הפורמולה עבור <strong style="color: var(--ink-2)">{{ patientLabel }}</strong> נוספה אל <strong style="color: var(--ink-2)">סל הקניות</strong> — ניתן להשלים את הרכישה משם בכל רגע.
            </template>
        </p>

        <div class="mt-32" style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap">
            <a
                v-if="noPatient"
                style="font-size: 14px; color: var(--accent); font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px"
            >
                קשר למטופל ושלח להזמנה
                <Icon name="arrow_left" :size="14" />
            </a>
            <template v-else>
                <button class="btn btn--ghost" @click="viewOrder">
                    <Icon name="file_text" :size="16" /> צפה בהזמנה
                </button>
                <button class="btn btn--primary" @click="goCart">
                    <Icon name="cart" :size="16" color="#fff" /> עבור לסל הקניות
                </button>
                <button class="btn btn--ghost" @click="goHome">
                    חזור ללוח הבקרה
                </button>
            </template>
        </div>
    </div>
</template>
