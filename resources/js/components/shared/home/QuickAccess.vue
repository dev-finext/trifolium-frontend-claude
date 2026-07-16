<script setup>
// QUICK ACCESS — full-width bar, 4 equal tiles, vertical dividers.
// Overlaps the hero bottom edge (negative margin) like the prototype.
import { ref } from 'vue';
import Icon from '@/components/ui/Icon.vue';
import { visit } from '@/lib/routes';

const QUICK_TILES = [
    {
        id: 'catalog',
        route: 'catalog',
        icon: 'package',
        label: 'מוצרי מדף',
        sub: 'מוצרים מוכנים',
    },
    {
        id: 'compounding',
        route: 'compounding',
        icon: 'flask',
        label: 'הכנת פורמולה',
        sub: 'בית המרקחת',
    },
    {
        id: 'orders',
        route: 'orders',
        icon: 'clipboard_list',
        label: 'ההזמנות שלי',
        sub: 'מעקב וסטטוסים',
    },
    {
        id: 'points',
        route: 'profile',
        icon: 'coin',
        label: 'הנקודות שלי',
        sub: '1,240 נקודות',
    },
];

const hoverId = ref(null);
</script>

<template>
    <section class="quick-access relative z-[2] mt-[-46px] px-[24px] py-0">
        <div
            class="mx-auto my-0 max-w-[1200px] overflow-hidden rounded-card border border-line bg-surface shadow-[0_12px_32px_-16px_rgba(40,30,20,0.18),0_2px_6px_-2px_rgba(40,30,20,0.08)]"
        >
            <div class="grid h-[88px] grid-cols-4">
                <button
                    v-for="(t, i) in QUICK_TILES"
                    :key="t.id"
                    class="flex cursor-pointer items-center justify-center gap-[14px] border-none px-[16px] py-0 [font-family:inherit] transition-[background] duration-200 ease-[ease]"
                    :class="[
                        hoverId === t.id ? 'bg-accent-tint' : 'bg-transparent',
                        i === QUICK_TILES.length - 1
                            ? ''
                            : '[border-left:1px_solid_var(--line)]',
                    ]"
                    @click="visit(t.route)"
                    @mouseenter="hoverId = t.id"
                    @mouseleave="hoverId = null"
                >
                    <Icon
                        :name="t.icon"
                        :size="22"
                        :color="
                            hoverId === t.id ? 'var(--accent)' : 'var(--ink)'
                        "
                    />
                    <div class="flex flex-col gap-[2px] text-right">
                        <span
                            class="text-[13px] font-bold transition-[color] duration-200"
                            :class="
                                hoverId === t.id ? 'text-accent' : 'text-ink'
                            "
                            >{{ t.label }}</span
                        >
                        <span
                            class="text-[11px] transition-[color] duration-200"
                            :class="
                                hoverId === t.id ? 'text-accent' : 'text-ink-3'
                            "
                            >{{ t.sub }}</span
                        >
                    </div>
                </button>
            </div>
        </div>
    </section>
</template>
