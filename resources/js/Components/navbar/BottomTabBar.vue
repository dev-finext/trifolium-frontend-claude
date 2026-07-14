<script setup>
// Mobile bottom tab bar — the app-like primary navigation on phones.
//
// Visible only under html.tf-mobile (CSS-gated), and not rendered during the
// formula wizard, where the wizard's own action bar owns the bottom edge
// (AppLayout handles that). Five destinations; the center "רקיחה" action is a
// raised accent button — the app's primary call to action.
//
// Native-feel details: fixed to the viewport bottom with safe-area padding
// (iPhone home indicator), ≥44px touch targets, immediate :active feedback,
// and a hairline top border on a solid surface so content scrolls "under" it.
import Icon from '@/Components/ui/Icon.vue';
import { visit } from '@/lib/routes';
import { useCartStore } from '@/stores/cart';

defineProps({
    /** Logical name of the active screen (see lib/routes.js). */
    route: { type: String, default: '' },
});

const cart = useCartStore();

const TABS = [
    { id: 'home', label: 'ראשי', icon: 'home' },
    { id: 'catalog', label: 'מוצרים', icon: 'package' },
    // center slot: compounding FAB (rendered separately)
    { id: 'orders', label: 'הזמנות', icon: 'clipboard_list' },
    { id: 'cart', label: 'סל', icon: 'cart', badge: true },
];
</script>

<template>
    <nav class="tabbar" aria-label="ניווט ראשי">
        <button
            v-for="tab in TABS.slice(0, 2)"
            :key="tab.id"
            :class="['tabbar__item', { 'tabbar__item--active': route === tab.id }]"
            :aria-current="route === tab.id ? 'page' : undefined"
            @click="visit(tab.id)"
        >
            <Icon :name="tab.icon" :size="22" :stroke="route === tab.id ? 2 : 1.6" color="currentColor" />
            <span class="tabbar__label">{{ tab.label }}</span>
        </button>

        <!-- Center: the primary action — start compounding -->
        <button
            class="tabbar__fab-wrap"
            :aria-current="route === 'compounding' ? 'page' : undefined"
            aria-label="הכנת פורמולה"
            @click="visit('compounding')"
        >
            <span class="tabbar__fab">
                <Icon name="flask" :size="24" color="#fff" :stroke="1.8" />
            </span>
            <span class="tabbar__label tabbar__label--fab">רקיחה</span>
        </button>

        <button
            v-for="tab in TABS.slice(2)"
            :key="tab.id"
            :class="['tabbar__item', { 'tabbar__item--active': route === tab.id }]"
            :aria-current="route === tab.id ? 'page' : undefined"
            @click="visit(tab.id)"
        >
            <span class="tabbar__icon-wrap">
                <Icon :name="tab.icon" :size="22" :stroke="route === tab.id ? 2 : 1.6" color="currentColor" />
                <span v-if="tab.badge && cart.state.items.length" class="tabbar__badge num">{{ cart.state.items.length }}</span>
            </span>
            <span class="tabbar__label">{{ tab.label }}</span>
        </button>
    </nav>
</template>

<style>
/* Hidden by default; the mobile tier turns it on (see html.tf-mobile below). */
.tabbar {
    display: none;
}

html.tf-mobile .tabbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 120;
    display: flex;
    align-items: stretch;
    height: calc(60px + env(safe-area-inset-bottom, 0px));
    padding: 0 6px env(safe-area-inset-bottom, 0px);
    background: var(--surface);
    border-top: 1px solid var(--line);
    box-shadow: 0 -6px 24px -18px rgba(31, 46, 29, 0.35);
}

.tabbar__item,
.tabbar__fab-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    min-width: 44px;
    border: none;
    background: transparent;
    color: var(--ink-3);
    font-family: inherit;
    cursor: pointer;
    padding: 6px 2px 8px;
    -webkit-tap-highlight-color: transparent;
    transition: color 0.15s;
}
.tabbar__item:active {
    color: var(--ink);
}
.tabbar__item--active {
    color: var(--accent);
}

.tabbar__label {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.01em;
    line-height: 1;
}
.tabbar__item--active .tabbar__label {
    font-weight: 700;
}

/* Center compounding action — raised accent disc */
.tabbar__fab-wrap {
    color: var(--accent-ink);
}
.tabbar__fab {
    width: 46px;
    height: 46px;
    margin-top: -18px; /* rises above the bar edge */
    border-radius: 50%;
    background: var(--accent);
    border: 3px solid var(--surface);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 16px -6px rgba(42, 64, 40, 0.55);
    transition: transform 0.15s ease;
}
.tabbar__fab-wrap:active .tabbar__fab {
    transform: scale(0.94);
}
.tabbar__label--fab {
    color: var(--accent-ink);
    font-weight: 700;
}

.tabbar__icon-wrap {
    position: relative;
    display: inline-flex;
}
.tabbar__badge {
    position: absolute;
    top: -5px;
    inset-inline-end: -8px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: 999px;
    background: var(--accent);
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    line-height: 16px;
    text-align: center;
    border: 2px solid var(--surface);
}

@media (prefers-reduced-motion: reduce) {
    .tabbar__fab,
    .tabbar__item {
        transition: none;
    }
}
</style>
