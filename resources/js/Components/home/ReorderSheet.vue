<script setup>
// Bottom-sheet reorder confirmation — 2-click reorder.
import { ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import Mini from '@/Components/home/Mini.vue';

defineProps({
    order: { type: Object, required: true },
});
const emit = defineEmits(['close']);

const confirmed = ref(false);
</script>

<template>
    <div
        :style="{
            position: 'fixed', inset: 0,
            background: 'rgba(20,18,14,0.40)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            zIndex: 100,
            animation: 'tf-fade-in .15s ease',
        }"
        @click="emit('close')"
    >
        <div
            :style="{
                width: '100%',
                maxWidth: '640px',
                background: 'var(--surface)',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                border: '1px solid var(--line)',
                borderBottom: 'none',
                padding: '28px',
                animation: 'tf-slide-up .22s ease',
            }"
            @click.stop
        >
            <template v-if="!confirmed">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px">
                    <div>
                        <h3 style="margin: 0; font-size: 18px; font-weight: 600">הזמן שוב</h3>
                        <p class="small muted" style="margin: 4px 0 0">
                            שליחה חוזרת של אותה פורמולה ל{{ order.patient }}
                        </p>
                    </div>
                    <button class="btn--icon" @click="emit('close')">
                        <Icon name="x" :size="16" />
                    </button>
                </div>

                <div class="card" style="padding: 16px; margin-bottom: 20px; background: var(--surface-sunk); border: none">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
                        <Mini label="מטופל">{{ order.patient }}</Mini>
                        <Mini label="פורמולה">{{ order.formula }}</Mini>
                        <Mini label="סוג">{{ order.type }}</Mini>
                        <Mini label="הזמנה מקורית"><span class="num">{{ order.id }}</span></Mini>
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 8px">
                    <button class="btn btn--ghost" @click="emit('close')">ביטול</button>
                    <button class="btn btn--accent" @click="confirmed = true">
                        <Icon name="whatsapp" :size="16" /> אשר ושלח קישור
                    </button>
                </div>
            </template>
            <template v-else>
                <div style="text-align: center; padding: 20px 0">
                    <div
                        :style="{
                            width: '52px', height: '52px', borderRadius: '50%',
                            background: 'var(--accent-tint-strong)', color: 'var(--accent)',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 14px',
                        }"
                    >
                        <Icon name="check" :size="24" />
                    </div>
                    <h3 style="margin: 0; font-size: 18px; font-weight: 600">ההזמנה נשלחה</h3>
                    <p class="small muted" style="margin: 6px 0 20px">
                        {{ order.patient }} קיבלה הודעת וואטסאפ עם קישור לתשלום.
                    </p>
                    <button class="btn btn--primary" @click="emit('close')">סגור</button>
                </div>
            </template>
        </div>
    </div>
</template>

<style>
@keyframes tf-slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: none; opacity: 1; }
}
@keyframes tf-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
