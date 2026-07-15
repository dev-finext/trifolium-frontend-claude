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
    <section class="quick-access" style="padding: 0 24px; margin-top: -46px; position: relative; z-index: 2">
        <div
            :style="{
                maxWidth: '1200px',
                margin: '0 auto',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-card)',
                boxShadow: '0 12px 32px -16px rgba(40, 30, 20, 0.18), 0 2px 6px -2px rgba(40, 30, 20, 0.08)',
                overflow: 'hidden',
            }"
        >
            <div style="height: 88px; display: grid; grid-template-columns: repeat(4, 1fr)">
                <button
                    v-for="(t, i) in QUICK_TILES"
                    :key="t.id"
                    :style="{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '14px',
                        background: hoverId === t.id ? 'var(--accent-tint)' : 'transparent',
                        border: 'none',
                        borderLeft: i === QUICK_TILES.length - 1 ? 'none' : '1px solid var(--line)',
                        cursor: 'pointer',
                        transition: 'background .2s ease',
                        padding: '0 16px',
                        fontFamily: 'inherit',
                    }"
                    @click="visit(t.route)"
                    @mouseenter="hoverId = t.id"
                    @mouseleave="hoverId = null"
                >
                    <Icon :name="t.icon" :size="22" :color="hoverId === t.id ? 'var(--accent)' : 'var(--ink)'" />
                    <div style="text-align: right; display: flex; flex-direction: column; gap: 2px">
                        <span
                            :style="{
                                fontSize: '13px',
                                fontWeight: 700,
                                color: hoverId === t.id ? 'var(--accent)' : 'var(--ink)',
                                transition: 'color .2s',
                            }"
                        >{{ t.label }}</span>
                        <span
                            :style="{
                                fontSize: '11px',
                                color: hoverId === t.id ? 'var(--accent)' : 'var(--ink-3)',
                                transition: 'color .2s',
                            }"
                        >{{ t.sub }}</span>
                    </div>
                </button>
            </div>
        </div>
    </section>
</template>
