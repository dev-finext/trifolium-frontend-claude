<script setup>
// Mobile navigation drawer — slides in from the inline-start edge (right in
// RTL). Holds the four destinations, points, pending orders, profile and
// logout — everything hidden from the compact top bar on phones.
import { ref, watch, nextTick } from 'vue';
import GoldCoin from '@/components/shared/navbar/GoldCoin.vue';
import { NAV_LINKS } from '@/components/shared/navbar/nav-links.js';
import Icon from '@/components/ui/Icon.vue';
import { useModal } from '@/composables/useModal';

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
    {
        id: 'pending',
        label: 'הזמנות בהמתנה',
        icon: 'cart_clock',
        countKey: 'pendingCount',
    },
    { id: 'contact', label: 'צור קשר', icon: 'mail' },
    { id: 'profile', label: 'עריכת פרטים אישיים', icon: 'user' },
];

function countFor(link) {
    return link.countKey ? props[link.countKey] : 0;
}

// Accessible-dialog semantics. The drawer persists in the DOM (pointer-events:
// none, panel translated off-screen when closed), so useModal must NOT trap
// focus while closed. We arm it — point dialogRef at the panel — only while
// OPEN, and clear it on close; useModal's Escape + Tab-trap both no-op when
// dialogRef is null. Focus return to the opener (the burger) is handled here
// because useModal's onMounted/onBeforeUnmount fire at mount, not per open.
const { dialogRef } = useModal(() => emit('close'));
const panel = ref(null);
let opener = null;

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            opener = document.activeElement; // the burger that opened the drawer
            dialogRef.value = panel.value; // arm trap + Escape
            nextTick(() => {
                const first = panel.value?.querySelector(
                    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
                );
                (first || panel.value)?.focus();
            });
        } else {
            dialogRef.value = null; // disarm while closed

            if (
                opener &&
                typeof opener.focus === 'function' &&
                document.contains(opener)
            ) {
                opener.focus(); // return focus to the burger
            }
        }
    },
);
</script>

<template>
    <div
        :class="['nav-drawer', { 'nav-drawer--open': open }]"
        :aria-hidden="!open"
    >
        <div class="nav-drawer__scrim" @click="emit('close')" />
        <aside
            ref="panel"
            class="nav-drawer__panel"
            :role="open ? 'dialog' : undefined"
            :aria-modal="open ? 'true' : undefined"
            aria-label="תפריט ניווט"
            tabindex="-1"
            :inert="!open"
        >
            <!-- Header — user + close -->
            <div class="nav-drawer__head">
                <div class="flex flex-row-reverse items-center gap-[11px]">
                    <span
                        class="inline-flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full border border-line bg-accent-tint"
                    >
                        <Icon
                            name="user"
                            :size="21"
                            color="var(--accent)"
                            :stroke="1.7"
                        />
                    </span>
                    <span class="text-right">
                        <span class="block text-[14.5px] font-bold text-ink">{{
                            user.name
                        }}</span>
                        <span class="mt-[2px] flex items-center gap-[6px]">
                            <GoldCoin :size="15" />
                            <span
                                class="num text-[12.5px] font-bold text-ink-2"
                                >{{ user.points }}</span
                            >
                            <span class="text-[11.5px] text-ink-3">נקודות</span>
                        </span>
                    </span>
                </div>
                <button
                    class="btn--icon"
                    aria-label="סגור"
                    @click="emit('close')"
                >
                    <Icon name="x" :size="20" color="var(--ink-2)" />
                </button>
            </div>

            <div class="nav-drawer__section">ניווט</div>
            <button
                v-for="link in NAV_LINKS"
                :key="link.id"
                :class="[
                    'nav-drawer__item',
                    { 'nav-drawer__item--active': route === link.id },
                ]"
                @click="emit('navigate', link.id)"
            >
                <Icon
                    :name="link.icon"
                    :size="19"
                    :color="
                        route === link.id ? 'var(--accent)' : 'var(--ink-3)'
                    "
                    :stroke="1.6"
                />
                <span class="flex-1">{{ link.label }}</span>
                <span v-if="link.id === 'my-formulas'" class="nav-drawer__badge"
                    >חדש</span
                >
            </button>

            <div class="nav-drawer__section">החשבון שלי</div>
            <button
                v-for="link in secondaryLinks"
                :key="link.id"
                :class="[
                    'nav-drawer__item',
                    { 'nav-drawer__item--active': route === link.id },
                ]"
                @click="emit('navigate', link.id)"
            >
                <Icon
                    :name="link.icon"
                    :size="19"
                    :color="
                        route === link.id ? 'var(--accent)' : 'var(--ink-3)'
                    "
                    :stroke="1.6"
                />
                <span class="flex-1">{{ link.label }}</span>
                <span v-if="countFor(link) > 0" class="nav-drawer__count num">{{
                    countFor(link)
                }}</span>
            </button>

            <div class="divider mx-0 my-[10px]" />
            <button
                class="nav-drawer__item text-danger"
                type="button"
                @click="emit('navigate', 'login')"
            >
                <Icon
                    name="logout"
                    :size="19"
                    color="var(--danger)"
                    :stroke="1.6"
                />
                <span class="flex-1">התנתק</span>
            </button>
        </aside>
    </div>
</template>
