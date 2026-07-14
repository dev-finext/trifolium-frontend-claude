<script setup>
// Horizontal status timeline — the order's pipeline position.
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    activeIndex: { type: Number, default: 0 },
    /** 'patient' | 'practitioner' — who still needs to pay */
    route: { type: String, default: 'practitioner' },
    cancelled: { type: Boolean, default: false },
});

// Pipeline stages. The "active" index depends on whether the patient still
// needs to pay (paymentRoute === 'patient') or the practitioner already did.
const STAGES = [
    { key: 'received', label: 'התקבלה', icon: 'check', sub: 'ההזמנה נקלטה במערכת' },
    { key: 'payment',  label: 'תשלום',  icon: 'coin',  sub: 'אישור תשלום' },
    { key: 'lab',      label: 'הכנה במעבדה', icon: 'flask', sub: 'רקיחה ובקרת איכות' },
    { key: 'shipped',  label: 'נשלח',   icon: 'package', sub: 'נמסר לשליח' },
    { key: 'delivered',label: 'נמסר',   icon: 'home',  sub: 'הגיע למטופל' },
];
</script>

<template>
    <div class="card" :style="{ padding: '28px 28px 24px', opacity: cancelled ? 0.55 : 1 }">
        <div style="display: flex; align-items: flex-start">
            <template v-for="(s, i) in STAGES" :key="s.key">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; min-width: 0; flex-shrink: 0; width: 96px">
                    <div
                        :style="{
                            width: '44px', height: '44px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: i < activeIndex ? 'var(--accent)' : i === activeIndex ? 'var(--accent-tint)' : 'var(--surface-sunk)',
                            border: '1.5px solid ' + (i <= activeIndex ? 'var(--accent)' : 'var(--line-strong)'),
                            color: i < activeIndex ? '#fff' : i === activeIndex ? 'var(--accent)' : 'var(--ink-4)',
                            position: 'relative',
                        }"
                    >
                        <Icon
                            :name="i < activeIndex ? 'check' : s.icon"
                            :size="i < activeIndex ? 18 : 17"
                            :stroke="i < activeIndex ? 2.4 : 1.6"
                            :color="i < activeIndex ? '#fff' : i === activeIndex ? 'var(--accent)' : 'var(--ink-4)'"
                        />
                        <span
                            v-if="i === activeIndex"
                            :style="{
                                position: 'absolute', inset: '-5px', borderRadius: '50%',
                                border: '1.5px solid var(--accent)', opacity: 0.35,
                            }"
                        />
                    </div>
                    <div style="text-align: center">
                        <div
                            :style="{
                                fontSize: '13px', fontWeight: i <= activeIndex ? 600 : 500,
                                color: i === activeIndex ? 'var(--accent)' : i < activeIndex ? 'var(--ink-2)' : 'var(--ink-4)',
                            }"
                        >{{ s.label }}</div>
                        <div class="small" style="color: var(--ink-4); margin-top: 2px; line-height: 1.4">{{ s.sub }}</div>
                    </div>
                </div>
                <div
                    v-if="i !== STAGES.length - 1"
                    :style="{
                        flex: 1, height: '2px', marginTop: '21px',
                        background: i < activeIndex ? 'var(--accent)' : 'var(--line)',
                        borderRadius: '2px',
                    }"
                />
            </template>
        </div>
        <div
            v-if="cancelled"
            :style="{
                marginTop: '22px', paddingTop: '18px', borderTop: '1px solid var(--line)',
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '13px', color: '#a23a2d', fontWeight: 500,
            }"
        >
            <Icon name="info" :size="16" color="#a23a2d" />
            הזמנה זו בוטלה. לא בוצעה רקיחה ולא חויב תשלום.
        </div>
        <div
            v-else-if="route === 'patient'"
            :style="{
                marginTop: '22px', paddingTop: '18px', borderTop: '1px solid var(--line)',
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '13px', color: 'var(--ink-2)',
            }"
        >
            <Icon name="info" :size="16" color="var(--warning)" />
            קישור תשלום נשלח לוואטסאפ של המטופל. ההזמנה תקודם למעבדה אוטומטית עם אישור התשלום.
        </div>
    </div>
</template>
