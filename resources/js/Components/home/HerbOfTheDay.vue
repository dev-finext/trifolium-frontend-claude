<script setup>
// צמח היום — the daily monograph entry of the mobile home "ledger".
// Set as an editorial entry, not a card: kicker between hairlines, the herb
// name in display serif, clinical blurb, uses inline, and a text-rule action
// that drops the herb straight into a new formula in the lab.
//
// One herb from the dispensary rotates in daily — deterministic by date, so
// everyone sees the same herb and it survives reloads. The name respects the
// active treatment mode (Western botanical / Chinese pinyin) via HerbName.
import { computed } from 'vue';
import HerbName from '@/Components/mode/HerbName.vue';
import { HERBS, HERB_BLURBS } from '@/data/mock';
import { useWizardStore } from '@/stores/wizard';
import { visit } from '@/lib/routes';

const wizard = useWizardStore();

// Day-stable pick: days-since-epoch modulo the dispensary size.
const herb = computed(() => HERBS[Math.floor(Date.now() / 86400000) % HERBS.length]);
const blurb = computed(() => HERB_BLURBS[herb.value.id] || '');

function startFormula() {
    // Preload the lab with a fresh tincture built around today's herb; the
    // wizard still walks through patient selection first, as always.
    wizard.setPendingFormula({
        name: '',
        typeId: 'tincture',
        tinctureVolume: null,
        ingredients: [{ herbId: herb.value.id, qty: 1 }],
    });
    visit('compounding');
}
</script>

<template>
    <section class="ldg-herb" aria-label="צמח היום">
        <div class="ldg-herb__kicker">
            <span class="ldg-herb__kicker-line" aria-hidden="true"></span>
            <span class="ldg-herb__kicker-text">צמח היום · {{ herb.form }}</span>
            <span class="ldg-herb__kicker-line" aria-hidden="true"></span>
        </div>

        <div class="ldg-herb__name">
            <HerbName :herb="herb" :primary-size="26" :secondary-size="16" :primary-weight="500" />
        </div>

        <p v-if="blurb" class="ldg-herb__blurb">{{ blurb }}</p>

        <p v-if="herb.uses?.length" class="ldg-herb__uses">
            {{ herb.uses.join(' · ') }}
        </p>

        <button class="ldg-herb__go" @click="startFormula">
            התחל רקיחה עם הצמח
            <span aria-hidden="true">←</span>
        </button>
    </section>
</template>

<style>
.ldg-herb { padding: 34px 20px 0; text-align: center; }

.ldg-herb__kicker {
    display: flex;
    align-items: center;
    gap: 14px;
}
.ldg-herb__kicker-line { flex: 1; height: 1px; background: var(--ldg-rule, rgba(34, 48, 31, 0.18)); }
.ldg-herb__kicker-text {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    color: var(--ldg-amber, #8f5b1c);
    white-space: nowrap;
}

.ldg-herb__name { margin-top: 16px; }
/* HerbName sets the Latin face inline — the ledger swaps it for the brand serif */
.ldg-herb__name [style*='font-latin'] {
    font-family: 'Cormorant Garamond', serif !important;
}

.ldg-herb__blurb {
    margin: 12px auto 0;
    max-width: 42ch;
    font-size: 13.5px;
    line-height: 1.75;
    color: var(--ink-2);
    text-wrap: pretty;
}
.ldg-herb__uses {
    margin: 10px 0 0;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--ink-3);
}

.ldg-herb__go {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding: 6px 2px;
    background: none;
    border: 0;
    border-bottom: 1.5px solid var(--ldg-amber, #8f5b1c);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    color: var(--ldg-amber, #8f5b1c);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: color 0.15s ease, border-color 0.15s ease;
}
.ldg-herb__go:active { color: var(--ldg-ink, #22301f); border-color: var(--ldg-ink, #22301f); }
</style>
