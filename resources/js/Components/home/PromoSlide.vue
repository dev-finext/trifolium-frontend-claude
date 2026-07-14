<script setup>
// One promotional slide of the hero carousel. Retained from the prototype's
// rotating-promo hero; the current HeroPromo banner does not render it.
import Icon from '@/Components/ui/Icon.vue';
import PromoMedia from '@/Components/home/PromoMedia.vue';

defineProps({
    promo: { type: Object, required: true },
    visible: { type: Boolean, default: false },
});
// CTA hook kept for API parity with the prototype's `onFire` prop.
defineEmits(['fire']);
</script>

<template>
    <div
        :aria-hidden="!visible"
        :style="{
            position: 'absolute', inset: 0, insetInlineStart: '26px',
            opacity: visible ? 1 : 0, transition: 'opacity .5s ease',
            pointerEvents: visible ? 'auto' : 'none',
            display: 'grid', gridTemplateColumns: '54% 46%',
        }"
    >
        <!-- copy (right under RTL) -->
        <div style="padding: 50px 56px 64px; display: flex; flex-direction: column; justify-content: center">
            <div style="margin-bottom: 16px">
                <span
                    :style="{
                        display: 'inline-flex', alignItems: 'center', gap: '7px', height: '28px', padding: '0 13px',
                        borderRadius: '999px', background: 'var(--accent-tint-strong)', color: 'var(--accent-ink)',
                        fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em',
                    }"
                >
                    <Icon :name="promo.icon" :size="15" color="var(--accent-ink)" />{{ promo.kicker }}
                </span>
            </div>

            <h1 style="margin: 0 0 14px; font-size: 36px; line-height: 1.12; font-weight: 700; letter-spacing: -0.02em; color: var(--ink); text-wrap: balance">
                {{ promo.title }}<br /><span style="color: var(--accent)">{{ promo.titleB }}</span>
            </h1>

            <p style="margin: 0 0 20px; font-size: 15.5px; line-height: 1.55; font-weight: 300; color: var(--ink-2); max-width: 430px; text-wrap: pretty">{{ promo.desc }}</p>

            <div v-if="promo.when" style="display: flex; align-items: center; gap: 22px; margin-bottom: 22px; flex-wrap: wrap">
                <span style="display: inline-flex; align-items: center; gap: 9px; font-size: 15px; color: var(--ink-2); font-weight: 600">
                    <Icon name="calendar" :size="18" color="var(--accent)" />
                    <span>{{ promo.when.wday }}, </span><span class="num">{{ promo.when.date }}</span>
                </span>
                <span style="display: inline-flex; align-items: center; gap: 9px; font-size: 15px; color: var(--ink-2); font-weight: 600">
                    <Icon name="clock" :size="18" color="var(--accent)" />
                    <span class="num" dir="ltr" style="display: inline-block">{{ promo.when.time }}</span>
                </span>
            </div>

            <p v-if="promo.note" style="margin: 16px 0 0; font-size: 12.5px; color: var(--ink-3); display: flex; align-items: center; gap: 7px">
                <Icon :name="promo.kind === 'webinar' ? 'whatsapp' : 'info'" :size="15" color="var(--ink-4)" />{{ promo.note }}
            </p>
        </div>

        <!-- media (left under RTL) -->
        <div style="position: relative; overflow: hidden">
            <PromoMedia :media="promo.media" />
        </div>
    </div>
</template>
