<script setup>
// App chrome for every authenticated screen: navbar, footer, cart toast, and
// the treatment-style switch confirmation. Applied automatically to all pages
// except Auth/* (see resources/js/app.js).
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import TheNavbar from '@/Components/navbar/TheNavbar.vue';
import TheFooter from '@/Components/TheFooter.vue';
import CartToast from '@/Components/CartToast.vue';
import ModeSwitchConfirmModal from '@/Components/mode/ModeSwitchConfirmModal.vue';
import { useCartStore } from '@/stores/cart';
import { useModeStore } from '@/stores/mode';
import { routeNameFromUrl } from '@/lib/routes';

const page = usePage();
const cart = useCartStore();
const modeStore = useModeStore();

// TODO(backend): replace with the authenticated practitioner from Inertia
// shared props (e.g. usePage().props.auth.user) once Laravel provides it.
const USER = { name: 'נעמי שגב', initials: 'נש', points: '1,240' };

const currentRoute = computed(() => routeNameFromUrl(page.url));
// The article detail view highlights the "מאמרים" nav entry.
const navRoute = computed(() => (currentRoute.value === 'article' ? 'articles' : currentRoute.value));

// Canonical screen index from the design handoff — kept as a data attribute
// for traceability back to the spec (each screen's `data-screen-label`).
const SCREEN_LABELS = {
    'home': '01 ראשי',
    'catalog': '02 מוצרי מדף',
    'compounding': '03 הכנת פורמולה',
    'articles': '04 מאמרים',
    'article': '04 מאמר',
    'orders': '05 כל ההזמנות',
    'order': '05 צפייה בהזמנה',
    'cart': '06 סל הקניות',
    'pending': '07 הזמנות בהמתנה',
    'contact': '08 צור קשר',
    'profile': '09 עריכת פרטים אישיים',
    'change-password': '09b שינוי סיסמה',
    'my-formulas': '10 רשימת הפורמולות שלי',
};
const screenLabel = computed(() => SCREEN_LABELS[currentRoute.value] || currentRoute.value);
</script>

<template>
    <div :data-screen-label="screenLabel">
        <TheNavbar
            :route="navRoute"
            :user="USER"
            :cart-count="cart.state.items.length"
            :pending-count="cart.state.pendingItems.length"
        />

        <slot />

        <TheFooter />

        <CartToast />

        <ModeSwitchConfirmModal
            v-if="modeStore.state.pendingMode"
            :target-mode="modeStore.state.pendingMode"
            @confirm="modeStore.confirmPendingMode"
            @cancel="modeStore.cancelPendingMode"
        />
    </div>
</template>
