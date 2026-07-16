<script setup>
// QUICK ACCESS — full-width bar, 4 equal tiles, vertical dividers.
// Overlaps the hero bottom edge (negative margin) like the prototype.
import { ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import { visit } from '@/lib/routes';

const QUICK_TILES = [
    { id: 'catalog', route: 'catalog', icon: 'package', label: 'מוצרי מדף', sub: 'מוצרים מוכנים' },
    { id: 'compounding', route: 'compounding', icon: 'flask', label: 'הכנת פורמולה', sub: 'בית המרקחת' },
    { id: 'orders', route: 'orders', icon: 'clipboard_list', label: 'ההזמנות שלי', sub: 'מעקב וסטטוסים' },
    { id: 'points', route: 'profile', icon: 'coin', label: 'הנקודות שלי', sub: '1,240 נקודות' },
];

const hoverId = ref(null);
</script>

<template>
    <section class="quick-access relative z-[2] py-0 px-[24px] mt-[-46px]">
        <div
            class="max-w-[1200px] mx-auto my-0 bg-surface border border-line rounded-card overflow-hidden shadow-[0_12px_32px_-16px_rgba(40,30,20,0.18),0_2px_6px_-2px_rgba(40,30,20,0.08)]"
        >
            <div class="grid grid-cols-4 h-[88px]">
                <button
                    v-for="(t, i) in QUICK_TILES"
                    :key="t.id"
                    class="flex items-center justify-center gap-[14px] py-0 px-[16px] border-none cursor-pointer transition-[background] duration-200 ease-[ease] [font-family:inherit]"
                    :class="[
                        hoverId === t.id ? 'bg-accent-tint' : 'bg-transparent',
                        i === QUICK_TILES.length - 1 ? '' : '[border-left:1px_solid_var(--line)]',
                    ]"
                    @click="visit(t.route)"
                    @mouseenter="hoverId = t.id"
                    @mouseleave="hoverId = null"
                >
                    <Icon :name="t.icon" :size="22" :color="hoverId === t.id ? 'var(--accent)' : 'var(--ink)'" />
                    <div class="flex flex-col gap-[2px] text-right">
                        <span
                            class="text-[13px] font-bold transition-[color] duration-200"
                            :class="hoverId === t.id ? 'text-accent' : 'text-ink'"
                        >{{ t.label }}</span>
                        <span
                            class="text-[11px] transition-[color] duration-200"
                            :class="hoverId === t.id ? 'text-accent' : 'text-ink-3'"
                        >{{ t.sub }}</span>
                    </div>
                </button>
            </div>
        </div>
    </section>
</template>
