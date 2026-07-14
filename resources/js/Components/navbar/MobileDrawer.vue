<script setup>
// Mobile navigation drawer — slides in from the inline-start edge (right in
// RTL). Holds the four destinations, points, pending orders, profile and
// logout — everything hidden from the compact top bar on phones.
import { onBeforeUnmount, watch } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import GoldCoin from '@/Components/navbar/GoldCoin.vue';
import { NAV_LINKS } from '@/Components/navbar/nav-links.js';

const props = defineProps({
    open: { type: Boolean, default: false },
    route: { type: String, default: '' },
    user: { type: Object, required: true },
    cartCount: { type: Number, default: 0 },
    pendingCount: { type: Number, default: 0 },
});

const emit = defineEmits(['close', 'navigate']);

const secondaryLinks = [
    { id: 'cart', label: 'סל הקניות', icon: 'cart', countKey: 'cartCount' },
    { id: 'pending', label: 'הזמנות בהמתנה', icon: 'cart_clock', countKey: 'pendingCount' },
    { id: 'contact', label: 'צור קשר', icon: 'mail' },
    { id: 'profile', label: 'עריכת פרטים אישיים', icon: 'user' },
];

function countFor(link) {
    return link.countKey ? props[link.countKey] : 0;
}

function onKeydown(e) {
    if (e.key === 'Escape') emit('close');
}
watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) document.addEventListener('keydown', onKeydown);
        else document.removeEventListener('keydown', onKeydown);
    }
);
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
    <div :class="['nav-drawer', { 'nav-drawer--open': open }]" :aria-hidden="!open">
        <div class="nav-drawer__scrim" @click="emit('close')" />
        <aside class="nav-drawer__panel" role="dialog" aria-label="תפריט ניווט">
            <!-- Header — user + close -->
            <div class="nav-drawer__head">
                <div style="display: flex; align-items: center; gap: 11px; flex-direction: row-reverse">
                    <span
                        :style="{
                            width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            background: 'var(--accent-tint)', border: '1px solid var(--line)',
                        }"
                    >
                        <Icon name="user" :size="21" color="var(--accent)" :stroke="1.7" />
                    </span>
                    <span style="text-align: right">
                        <span style="display: block; font-size: 14.5px; font-weight: 700; color: var(--ink)">{{ user.name }}</span>
                        <span style="display: flex; align-items: center; gap: 6px; margin-top: 2px">
                            <GoldCoin :size="15" />
                            <span class="num" style="font-size: 12.5px; font-weight: 700; color: var(--ink-2)">{{ user.points }}</span>
                            <span style="font-size: 11.5px; color: var(--ink-3)">נקודות</span>
                        </span>
                    </span>
                </div>
                <button class="btn--icon" aria-label="סגור" @click="emit('close')">
                    <Icon name="x" :size="20" color="var(--ink-2)" />
                </button>
            </div>

            <div class="nav-drawer__section">ניווט</div>
            <button
                v-for="link in NAV_LINKS"
                :key="link.id"
                :class="['nav-drawer__item', { 'nav-drawer__item--active': route === link.id }]"
                @click="emit('navigate', link.id)"
            >
                <Icon :name="link.icon" :size="19" :color="route === link.id ? 'var(--accent)' : 'var(--ink-3)'" :stroke="1.6" />
                <span style="flex: 1">{{ link.label }}</span>
                <span v-if="link.id === 'my-formulas'" class="nav-drawer__badge">חדש</span>
            </button>

            <div class="nav-drawer__section">החשבון שלי</div>
            <button
                v-for="link in secondaryLinks"
                :key="link.id"
                :class="['nav-drawer__item', { 'nav-drawer__item--active': route === link.id }]"
                @click="emit('navigate', link.id)"
            >
                <Icon :name="link.icon" :size="19" :color="route === link.id ? 'var(--accent)' : 'var(--ink-3)'" :stroke="1.6" />
                <span style="flex: 1">{{ link.label }}</span>
                <span v-if="countFor(link) > 0" class="nav-drawer__count num">{{ countFor(link) }}</span>
            </button>

            <div class="divider" style="margin: 10px 0" />
            <button class="nav-drawer__item" style="color: var(--danger)" @click="emit('navigate', 'login')">
                <Icon name="logout" :size="19" color="var(--danger)" :stroke="1.6" />
                <span style="flex: 1">התנתק</span>
            </button>
        </aside>
    </div>
</template>
