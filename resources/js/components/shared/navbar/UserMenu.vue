<script setup>
// User avatar + name → dropdown (edit profile / logout).
import { onBeforeUnmount, ref, watch } from 'vue';
import Icon from '@/components/ui/Icon.vue';

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
    <div ref="rootEl" class="relative">
        <button
            aria-haspopup="true"
            :aria-expanded="open"
            class="inline-flex flex-row-reverse items-center gap-[9px] py-[4px] pr-[6px] pl-[12px] cursor-pointer [font:inherit] border rounded-[999px] transition-[background,border-color] duration-120"
            :class="open ? 'bg-surface-sunk border-line' : 'bg-transparent border-transparent'"
            @click="open = !open"
        >
            <span class="inline-flex items-center justify-center w-[34px] h-[34px] shrink-0 bg-accent-tint border border-line rounded-full">
                <Icon name="user" :size="19" color="var(--accent)" :stroke="1.7" />
            </span>
            <span class="text-[14px] font-medium text-ink">{{ user.name }}</span>
            <Icon
                name="chevron_down"
                :size="15"
                color="var(--ink-3)"
                class="transition-transform duration-180"
                :class="open ? '[transform:rotate(180deg)]' : ''"
            />
        </button>

        <div
            v-if="open"
            role="menu"
            class="absolute start-0 top-[calc(100%_+_12px)] z-[80] w-[232px] p-[7px] bg-surface border border-line rounded-card shadow-[0_18px_50px_rgba(20,28,24,0.16)] animate-[tf-pa-in_.16s_ease_both]"
        >
            <div class="flex flex-row-reverse items-center gap-[11px] pt-[8px] px-[10px] pb-[11px] mb-[6px] border-b border-line">
                <span class="inline-flex items-center justify-center w-[38px] h-[38px] shrink-0 bg-accent-tint rounded-full">
                    <Icon name="user" :size="20" color="var(--accent)" :stroke="1.7" />
                </span>
                <span class="text-right">
                    <span class="block text-[13.5px] font-semibold text-ink">{{ user.name }}</span>
                    <span class="block mt-[1px] text-[11px] text-ink-3">חשבון מקצועי</span>
                </span>
            </div>

            <button
                v-for="item in MENU_ITEMS"
                :key="item.id"
                role="menuitem"
                class="tf-usermenu-item flex flex-row-reverse items-center gap-[11px] w-full py-[10px] px-[11px] text-right [font-family:inherit] text-[13.5px] font-medium cursor-pointer bg-transparent border border-transparent rounded-[calc(var(--r-card)_-_2px)] transition-[background] duration-120"
                :class="item.danger ? 'text-[var(--danger,#b4452f)]' : 'text-ink'"
                @click="pick(item.id)"
            >
                <Icon :name="item.icon" :size="17" :color="item.danger ? 'var(--danger, #b4452f)' : 'var(--ink-2)'" />
                <span class="flex-1">{{ item.label }}</span>
            </button>
        </div>
    </div>
</template>

<style>
.tf-usermenu-item:hover {
    background: var(--surface-sunk);
}
</style>
