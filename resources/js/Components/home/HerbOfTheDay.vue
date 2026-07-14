<script setup>
// צמח היום — the mobile home's signature card. One herb from the dispensary
// rotates in daily (deterministic by date, so everyone sees the same herb and
// it survives reloads). Shows the mode-aware name, the clinical blurb from
// the monograph data, its use-chips — and drops the herb straight into a new
// formula in the lab.
import { computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
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
    <section class="hotd card" aria-label="צמח היום">
        <div class="hotd__head">
            <span class="hotd__kicker">
                <Icon name="leaf" :size="13" color="var(--accent)" />
                צמח היום
            </span>
            <span class="hotd__form">{{ herb.form }}</span>
        </div>

        <div class="hotd__name">
            <HerbName :herb="herb" :primary-size="21" :secondary-size="14" />
        </div>

        <p v-if="blurb" class="hotd__blurb">{{ blurb }}</p>

        <div v-if="herb.uses?.length" class="hotd__uses">
            <span v-for="use in herb.uses" :key="use" class="hotd__use">{{ use }}</span>
        </div>

        <button class="btn btn--primary hotd__cta" @click="startFormula">
            <Icon name="flask" :size="16" color="#fff" />
            התחל רקיחה עם הצמח
        </button>
    </section>
</template>

<style>
.hotd {
    padding: 18px 18px 16px;
    border-inline-start: 3px solid var(--accent);
}
.hotd__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}
.hotd__kicker {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
}
.hotd__form {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--ink-3);
    background: var(--surface-sunk);
    border-radius: 999px;
    padding: 3px 10px;
}
.hotd__name { margin-bottom: 8px; }
.hotd__blurb {
    margin: 0 0 12px;
    font-size: 13.5px;
    line-height: 1.65;
    color: var(--ink-2);
    text-wrap: pretty;
}
.hotd__uses {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 14px;
}
.hotd__use {
    font-size: 12px;
    font-weight: 600;
    color: var(--accent-ink);
    background: var(--accent-tint);
    border-radius: 999px;
    padding: 3px 11px;
}
.hotd__cta {
    width: 100%;
    height: 44px;
}
</style>
