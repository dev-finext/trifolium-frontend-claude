<script setup>
// Courier-authorization checkbox row + "form signed" confirmation strip.
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    checked: { type: Boolean, default: false },
    signedName: { type: String, default: '' },
});
const emit = defineEmits(['toggle', 'view']);
</script>

<template>
    <div style="margin-bottom: 16px">
        <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer" @click="emit('toggle')">
            <span
                :style="{
                    width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0, marginTop: '1px',
                    border: '1.5px solid ' + (checked ? 'var(--accent)' : 'var(--line-strong)'),
                    background: checked ? 'var(--accent)' : '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all .12s',
                }"
            >
                <Icon v-if="checked" name="check" :size="13" color="#fff" :stroke="2.6" />
            </span>
            <span style="font-size: 13.5px; line-height: 1.5; color: var(--ink)">
                אני מאשר/ת קבלת תכשירים באמצעות שליח
            </span>
        </label>
        <div
            v-if="checked"
            :style="{
                marginTop: '8px', marginInlineStart: '30px', padding: '8px 11px',
                borderRadius: 'var(--r-control)', background: 'var(--accent-tint)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
                fontSize: '12px', color: 'var(--accent-ink)',
            }"
        >
            <span style="display: inline-flex; align-items: center; gap: 6px">
                <Icon name="check" :size="13" color="var(--accent)" /> טופס ייפוי הכוח נחתם{{ signedName ? ' · ' + signedName : '' }}
            </span>
            <a
                href="#"
                style="color: var(--accent-ink); font-weight: 600; text-decoration: underline"
                @click.prevent="emit('view')"
            >צפייה</a>
        </div>
    </div>
</template>
