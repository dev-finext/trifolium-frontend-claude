<script setup>
// Success state — large checkmark + next-step links. Two variants: save (no
// patient) and order (patient selected). Navigation replaces the prototype's
// tf:route events; the order hand-off replaces window.__tfLastOrder.
import Icon from '@/components/ui/Icon.vue';
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
    <div class="card py-[64px] px-[32px] text-center">
        <div
            class="inline-flex items-center justify-center w-[80px] h-[80px] mb-[20px] text-accent bg-accent-tint-strong rounded-[50%]"
        >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6L9 17l-5-5" />
            </svg>
        </div>

        <h2 class="m-0 mb-[8px] text-[24px] font-semibold">
            {{ noPatient ? 'הפורמולה נשמרה בהצלחה' : 'ההזמנה נשלחה בהצלחה' }}
        </h2>

        <p class="muted m-0 mx-auto max-w-[480px] text-[14px]">
            <template v-if="noPatient">
                הפורמולה <strong class="text-ink-2">{{ formulaName || 'ללא שם' }}</strong> נשמרה בטיוטות שלך. ניתן לקשר אותה למטופל ולהפוך אותה להזמנה בכל רגע.
            </template>
            <template v-else>
                הפורמולה עבור <strong class="text-ink-2">{{ patientLabel }}</strong> נוספה אל <strong class="text-ink-2">סל הקניות</strong> — ניתן להשלים את הרכישה משם בכל רגע.
            </template>
        </p>

        <div class="mt-[32px] flex flex-wrap justify-center gap-[12px]">
            <a
                v-if="noPatient"
                class="inline-flex items-center gap-[6px] text-[14px] font-semibold text-accent cursor-pointer"
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
