<script setup>
// One saved-address radio row inside the "משלוח אליי" picker.
defineProps({
    addr: { type: Object, required: true },
    selected: { type: Boolean, default: false },
});
const emit = defineEmits(['select']);
</script>

<template>
    <label
        :style="{
            display: 'flex', alignItems: 'flex-start', gap: '11px', cursor: 'pointer',
            padding: '11px 13px', borderRadius: 'var(--r-control)',
            border: '1px solid ' + (selected ? 'var(--accent)' : 'var(--line)'),
            background: selected ? 'var(--accent-tint)' : 'var(--surface)',
            transition: 'border-color .15s, background .15s',
        }"
        @click="emit('select')"
    >
        <span
            :style="{
                width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                border: '1.5px solid ' + (selected ? 'var(--accent)' : 'var(--line-strong)'),
                background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }"
        >
            <span v-if="selected" style="width: 9px; height: 9px; border-radius: 50%; background: var(--accent)" />
        </span>
        <span style="min-width: 0; flex: 1">
            <span style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap">
                <span style="font-size: 13.5px; font-weight: 600; color: var(--ink)">{{ addr.label || addr.name || 'כתובת' }}</span>
                <span
                    v-if="addr.primary"
                    :style="{
                        padding: '1px 8px', borderRadius: '999px', fontSize: '10.5px', fontWeight: 700,
                        background: 'var(--accent)', color: '#fff',
                    }"
                >ברירת מחדל</span>
            </span>
            <span class="small muted" style="display: block; margin-top: 3px; font-size: 12px; line-height: 1.45">
                {{ [addr.street, addr.city].filter(Boolean).join(', ') }}
            </span>
        </span>
    </label>
</template>
