<script setup>
// Icon-button with a count badge + hover tooltip (cart / pending actions).
import { ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    icon: { type: String, required: true },
    tooltip: { type: String, required: true },
    count: { type: Number, default: 0 },
    active: { type: Boolean, default: false },
});

defineEmits(['click']);

const hover = ref(false);
</script>

<template>
    <div style="position: relative; display: inline-flex">
        <button
            :aria-label="tooltip"
            :style="{
                position: 'relative', width: '38px', height: '38px', borderRadius: 'var(--r-control)',
                border: '1px solid ' + (active ? 'var(--accent)' : hover ? 'var(--line-strong)' : 'transparent'),
                background: active ? 'var(--accent-tint)' : 'transparent',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all .15s', flexShrink: 0,
            }"
            @click="$emit('click')"
            @mouseenter="hover = true"
            @mouseleave="hover = false"
        >
            <Icon :name="icon" :size="19" :color="active ? 'var(--accent)' : 'var(--ink-2)'" :stroke="1.6" />
            <span
                v-if="count > 0"
                class="num"
                :style="{
                    position: 'absolute', top: '-5px', left: '-5px',
                    minWidth: '18px', height: '18px', padding: '0 5px',
                    borderRadius: '999px', background: 'var(--accent)', color: '#fff',
                    fontSize: '11px', fontWeight: 700, lineHeight: '18px', textAlign: 'center',
                    border: '2px solid var(--surface)',
                }"
            >{{ count }}</span>
        </button>
        <span
            v-if="hover"
            role="tooltip"
            :style="{
                position: 'absolute', top: 'calc(100% + 8px)', insetInlineStart: 0,
                whiteSpace: 'nowrap', padding: '5px 9px', borderRadius: '7px',
                background: 'var(--ink)', color: 'var(--surface)',
                fontSize: '11.5px', fontWeight: 600, lineHeight: 1, zIndex: 90,
                boxShadow: '0 6px 18px rgba(20,28,24,0.22)', pointerEvents: 'none',
                animation: 'tf-tip-in .12s ease both',
            }"
        >{{ tooltip }}</span>
    </div>
</template>
