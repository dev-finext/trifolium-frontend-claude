<script setup>
// Secondary patient-path button ("מטופל חדש" / "ללא מטופל") — sits under the
// hero search, highlights with the accent tint when its option is active.
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    icon: { type: String, required: true },
    label: { type: String, required: true },
    sub: { type: String, default: '' },
    active: { type: Boolean, default: false },
    // Optional "חדש"-style inline pill shown beside the label (phones only —
    // hidden on desktop via .tf-new-badge, where a corner ribbon is used).
    badge: { type: String, default: '' },
});

const emit = defineEmits(['click']);
</script>

<template>
    <button
        type="button"
        :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flex: 1,
            textAlign: 'right',
            padding: '13px 16px',
            border: '1px solid ' + (active ? 'var(--accent)' : 'var(--line)'),
            background: active ? 'var(--accent-tint)' : 'var(--surface)',
            borderRadius: 'var(--r-card)',
            cursor: 'pointer',
            boxShadow: active ? 'inset 0 0 0 1px var(--accent)' : 'none',
            fontFamily: 'inherit',
            transition: 'all .15s',
        }"
        @click="emit('click')"
    >
        <span
            :style="{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                flexShrink: 0,
                background: active ? 'var(--accent)' : 'var(--surface-sunk)',
                color: active ? '#fff' : 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }"
        >
            <Icon :name="icon" :size="17" />
        </span>
        <span>
            <span
                :style="{
                    display: 'block',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: active ? 'var(--accent-ink)' : 'var(--ink)',
                }"
            >{{ label }}<span
                v-if="badge"
                class="tf-new-badge"
                style="margin-inline-start: 6px; vertical-align: 2px"
            >{{ badge }}</span></span>
            <span style="display: block; font-size: 11.5px; color: var(--ink-3); font-weight: 300">{{ sub }}</span>
        </span>
    </button>
</template>
