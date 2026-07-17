<script setup>
// App chrome for every authenticated screen: navbar, footer, cart toast, and
// the treatment-style switch confirmation. Applied automatically to all pages
// except Auth/* (see resources/js/app.js).
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import CartToast from '@/components/shared/CartToast.vue';
import ModeSwitchConfirmModal from '@/components/shared/mode/ModeSwitchConfirmModal.vue';
import BottomTabBar from '@/components/shared/navbar/BottomTabBar.vue';
import TheNavbar from '@/components/shared/navbar/TheNavbar.vue';
import TheFooter from '@/components/shared/TheFooter.vue';
import { DEMO_USER } from '@/data/user';
import { routeNameFromUrl } from '@/lib/routes';
import { useCartStore } from '@/stores/cart';
import { useModeStore } from '@/stores/mode';

const page = usePage();
const cart = useCartStore();
const modeStore = useModeStore();

const USER = DEMO_USER; // TODO(backend): auth user via Inertia shared props

const currentRoute = computed(() => routeNameFromUrl(page.url));
// The article detail view highlights the "מאמרים" nav entry.
const navRoute = computed(() =>
    currentRoute.value === 'article' ? 'articles' : currentRoute.value,
);

// Canonical screen index from the design handoff — kept as a data attribute
// for traceability back to the spec (each screen's `data-screen-label`).
const SCREEN_LABELS = {
    home: '01 ראשי',
    catalog: '02 המוצרים שלנו',
    compounding: '03 הכנת פורמולה',
    articles: '04 מאמרים',
    article: '04 מאמר',
    orders: '05 כל ההזמנות',
    order: '05 צפייה בהזמנה',
    cart: '06 סל הקניות',
    pending: '07 הזמנות בהמתנה',
    contact: '08 צור קשר',
    profile: '09 עריכת פרטים אישיים',
    'change-password': '09b שינוי סיסמה',
    'my-formulas': '10 רשימת הפורמולות שלי',
};
const screenLabel = computed(
    () => SCREEN_LABELS[currentRoute.value] || currentRoute.value,
);
</script>

<template>
    <div :data-screen-label="screenLabel">
        <!-- A11 · Skip to content — first focusable element, visible on focus. -->
        <a href="#main" class="skip-link">דלג לתוכן</a>

        <TheNavbar
            :route="navRoute"
            :user="USER"
            :cart-count="cart.state.items.length"
            :pending-count="cart.state.pendingItems.length"
        />

        <main id="main">
            <slot />
        </main>

        <TheFooter />

        <!-- Mobile app shell: bottom tab bar (phones only, via CSS). The wizard
             owns the bottom edge with its own action bar, so it opts out. -->
        <BottomTabBar v-if="navRoute !== 'compounding'" :route="navRoute" />

        <CartToast />

        <ModeSwitchConfirmModal
            v-if="modeStore.state.pendingMode"
            :target-mode="modeStore.state.pendingMode"
            @confirm="modeStore.confirmPendingMode"
            @cancel="modeStore.cancelPendingMode"
        />
    </div>
</template>
