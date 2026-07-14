<script setup>
// User avatar + name → dropdown (edit profile / logout).
import { onBeforeUnmount, ref, watch } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    user: { type: Object, required: true },
});

const emit = defineEmits(['navigate']);

const open = ref(false);
const rootEl = ref(null);

const MENU_ITEMS = [
    { id: 'profile', label: 'עריכת פרטים אישיים', icon: 'user' },
    { id: 'login', label: 'התנתק', icon: 'logout', danger: true },
];

function onDocumentClick(e) {
    if (rootEl.value && !rootEl.value.contains(e.target)) open.value = false;
}
function onKeydown(e) {
    if (e.key === 'Escape') open.value = false;
}

// Attach the outside-click / Escape listeners only while the menu is open.
watch(open, (isOpen) => {
    if (isOpen) {
        document.addEventListener('mousedown', onDocumentClick);
        document.addEventListener('keydown', onKeydown);
    } else {
        document.removeEventListener('mousedown', onDocumentClick);
        document.removeEventListener('keydown', onKeydown);
    }
});
onBeforeUnmount(() => {
    document.removeEventListener('mousedown', onDocumentClick);
    document.removeEventListener('keydown', onKeydown);
});

function pick(id) {
    open.value = false;
    emit('navigate', id);
}
</script>

<template>
    <div ref="rootEl" style="position: relative">
        <button
            aria-haspopup="true"
            :aria-expanded="open"
            :style="{
                display: 'inline-flex', alignItems: 'center', gap: '9px', flexDirection: 'row-reverse',
                background: open ? 'var(--surface-sunk)' : 'transparent',
                border: '1px solid ' + (open ? 'var(--line)' : 'transparent'),
                borderRadius: '999px', padding: '4px 6px 4px 12px', cursor: 'pointer',
                font: 'inherit', transition: 'background .12s, border-color .12s',
            }"
            @click="open = !open"
        >
            <span
                :style="{
                    width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--accent-tint)', border: '1px solid var(--line)',
                }"
            >
                <Icon name="user" :size="19" color="var(--accent)" :stroke="1.7" />
            </span>
            <span style="font-size: 14px; font-weight: 500; color: var(--ink)">{{ user.name }}</span>
            <Icon
                name="chevron_down"
                :size="15"
                color="var(--ink-3)"
                :style="{ transition: 'transform .18s', transform: open ? 'rotate(180deg)' : 'none' }"
            />
        </button>

        <div
            v-if="open"
            role="menu"
            :style="{
                position: 'absolute', insetInlineStart: 0, top: 'calc(100% + 12px)',
                width: '232px', background: 'var(--surface)',
                border: '1px solid var(--line)', borderRadius: 'var(--r-card)',
                boxShadow: '0 18px 50px rgba(20,28,24,0.16)',
                padding: '7px', zIndex: 80, animation: 'tf-pa-in .16s ease both',
            }"
        >
            <div
                :style="{
                    display: 'flex', alignItems: 'center', gap: '11px', flexDirection: 'row-reverse',
                    padding: '8px 10px 11px', borderBottom: '1px solid var(--line)', marginBottom: '6px',
                }"
            >
                <span
                    :style="{
                        width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--accent-tint)',
                    }"
                >
                    <Icon name="user" :size="20" color="var(--accent)" :stroke="1.7" />
                </span>
                <span style="text-align: right">
                    <span style="display: block; font-size: 13.5px; font-weight: 600; color: var(--ink)">{{ user.name }}</span>
                    <span style="display: block; font-size: 11px; color: var(--ink-3); margin-top: 1px">חשבון מקצועי</span>
                </span>
            </div>

            <button
                v-for="item in MENU_ITEMS"
                :key="item.id"
                role="menuitem"
                class="tf-usermenu-item"
                :style="{
                    width: '100%', textAlign: 'right', fontFamily: 'inherit', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '11px', flexDirection: 'row-reverse',
                    padding: '10px 11px', borderRadius: 'calc(var(--r-card) - 2px)',
                    border: '1px solid transparent', background: 'transparent',
                    fontSize: '13.5px', fontWeight: 500,
                    color: item.danger ? 'var(--danger, #b4452f)' : 'var(--ink)',
                    transition: 'background .12s',
                }"
                @click="pick(item.id)"
            >
                <Icon :name="item.icon" :size="17" :color="item.danger ? 'var(--danger, #b4452f)' : 'var(--ink-2)'" />
                <span style="flex: 1">{{ item.label }}</span>
            </button>
        </div>
    </div>
</template>

<style>
.tf-usermenu-item:hover {
    background: var(--surface-sunk);
}
</style>
