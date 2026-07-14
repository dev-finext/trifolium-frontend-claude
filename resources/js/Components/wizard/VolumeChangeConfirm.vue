<script setup>
// Confirmation shown when changing an already-chosen formula volume.
import { onMounted, onBeforeUnmount } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    unit: { type: String, required: true },
    newVolume: { type: [Number, String], required: true },
});
const emit = defineEmits(['confirm', 'cancel']);

function onKey(e) { if (e.key === 'Escape') emit('cancel'); }
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
    <div
        :style="{
            position: 'fixed', inset: 0,
            background: 'rgba(20, 18, 14, 0.46)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(2px)',
        }"
        @click="emit('cancel')"
    >
        <div
            style="background: var(--surface); border-radius: var(--r-card); width: min(440px, 100%); padding: 24px; box-shadow: 0 30px 80px rgba(0,0,0,0.22)"
            @click.stop
        >
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px">
                <span style="width: 38px; height: 38px; border-radius: 50%; background: var(--accent-tint); color: var(--accent); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0">
                    <Icon name="info" :size="18" />
                </span>
                <h3 style="margin: 0; font-size: 16px; font-weight: 600">
                    שינוי נפח ל-<span class="num">{{ newVolume }}</span> {{ unit }}
                </h3>
            </div>
            <p style="margin: 4px 0 18px; font-size: 13.5px; color: var(--ink-2); line-height: 1.55">
                שינוי הנפח לא ישפיע על האחוזים. הרכב הרכיבים ישמר. האם להמשיך?
            </p>
            <div style="display: flex; justify-content: flex-end; gap: 10px">
                <button class="btn btn--ghost" @click="emit('cancel')">ביטול</button>
                <button class="btn btn--primary" style="padding-inline: 18px" @click="emit('confirm')">שנה נפח</button>
            </div>
        </div>
    </div>
</template>
