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
    <div class="card pt-[28px] px-[28px] pb-[24px]" :class="cancelled ? 'opacity-55' : 'opacity-100'">
        <div class="flex items-start">
            <template v-for="(s, i) in STAGES" :key="s.key">
                <div class="flex flex-col items-center gap-[10px] min-w-0 shrink-0 w-[96px]">
                    <div
                        class="relative flex items-center justify-center w-[44px] h-[44px] border-[1.5px] rounded-full"
                        :class="[
                            i < activeIndex ? 'bg-accent' : i === activeIndex ? 'bg-accent-tint' : 'bg-surface-sunk',
                            i <= activeIndex ? 'border-accent' : 'border-line-strong',
                            i < activeIndex ? 'text-white' : i === activeIndex ? 'text-accent' : 'text-ink-4',
                        ]"
                    >
                        <Icon
                            :name="i < activeIndex ? 'check' : s.icon"
                            :size="i < activeIndex ? 18 : 17"
                            :stroke="i < activeIndex ? 2.4 : 1.6"
                            :color="i < activeIndex ? '#fff' : i === activeIndex ? 'var(--accent)' : 'var(--ink-4)'"
                        />
                        <span
                            v-if="i === activeIndex"
                            class="absolute inset-[-5px] border-[1.5px] border-accent rounded-full opacity-35"
                        />
                    </div>
                    <div class="text-center">
                        <div
                            class="text-[13px]"
                            :class="[
                                i <= activeIndex ? 'font-semibold' : 'font-medium',
                                i === activeIndex ? 'text-accent' : i < activeIndex ? 'text-ink-2' : 'text-ink-4',
                            ]"
                        >{{ s.label }}</div>
                        <div class="small mt-[2px] leading-[1.4] text-ink-4">{{ s.sub }}</div>
                    </div>
                </div>
                <div
                    v-if="i !== STAGES.length - 1"
                    class="flex-1 h-[2px] mt-[21px] rounded-[2px]"
                    :class="i < activeIndex ? 'bg-accent' : 'bg-(--line)'"
                />
            </template>
        </div>
        <div
            v-if="cancelled"
            class="flex items-center gap-[10px] mt-[22px] pt-[18px] text-[13px] font-medium text-[#a23a2d] border-t border-t-line"
        >
            <Icon name="info" :size="16" color="#a23a2d" />
            הזמנה זו בוטלה. לא בוצעה רקיחה ולא חויב תשלום.
        </div>
        <div
            v-else-if="route === 'patient'"
            class="flex items-center gap-[10px] mt-[22px] pt-[18px] text-[13px] text-ink-2 border-t border-t-line"
        >
            <Icon name="info" :size="16" color="var(--warning)" />
            קישור תשלום נשלח לוואטסאפ של המטופל. ההזמנה תקודם למעבדה אוטומטית עם אישור התשלום.
        </div>
    </div>
</template>
