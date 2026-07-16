<script setup>
// System-formula card — Trifolium-team templates. Same horizontal layout as
// the saved-formula card (emblem · identity · side action rail) but with a
// blue accent to set it apart from the practitioner's own formulas.
import { computed } from 'vue';
import Icon from '@/components/ui/Icon.vue';
import { FORMULA_TYPES } from '@/data/mock';

const props = defineProps({
    formula: { type: Object, required: true },
});

const emit = defineEmits(['load']);

const count = computed(() => (props.formula.ingredients || []).length);
const ftype = computed(() => FORMULA_TYPES.find((t) => t.id === props.formula.typeId));
</script>

<template>
    <div class="card sf-card">
        <!-- leading side: blue type emblem + ingredient count -->
        <div class="sf-card__emblem" aria-hidden="true">
            <Icon name="flask" :size="24" color="var(--sf-blue)" :stroke="1.6" />
            <span class="sf-card__emblem-count"><span class="num">{{ count }}</span> רכיבים</span>
        </div>

        <!-- middle: identity -->
        <div class="sf-card__body">
            <span class="sf-card__type">{{ ftype?.heb || formula.typeId }}</span>
            <h3 class="sf-card__name">{{ formula.name }}</h3>
            <p class="sf-card__summary">{{ formula.description }}</p>
            <div class="sf-card__ingredients">
                <Icon name="leaf" :size="12" color="var(--ink-3)" />
                <span>{{ formula.summary }}</span>
            </div>
        </div>

        <!-- trailing side: load action -->
        <div class="sf-card__side">
            <button class="btn btn--sm sf-card__load" type="button" @click="emit('load')">
                <Icon name="flask" :size="15" color="#fff" /> טען למעבדה
            </button>
        </div>
    </div>
</template>

<style>
.sf-card {
    --sf-blue: oklch(0.54 0.10 240);
    --sf-blue-tint: oklch(0.95 0.03 240);
    --sf-blue-ink: oklch(0.34 0.09 240);
    display: flex;
    align-items: stretch;
    gap: 16px;
    padding: 16px 18px;
    transition: box-shadow .15s ease;
}
.sf-card:hover,
.sf-card:focus-within { box-shadow: 0 10px 28px rgba(20, 28, 24, 0.08); }

.sf-card__emblem {
    flex: none;
    width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: var(--sf-blue-tint);
    border-radius: var(--r-card);
    padding: 10px 6px;
}
.sf-card__emblem-count { font-size: 10.5px; font-weight: 600; color: var(--sf-blue-ink); text-align: center; line-height: 1.2; }

.sf-card__body { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; gap: 4px; }
.sf-card__type {
    align-self: flex-start;
    font-size: 11px; font-weight: 700; letter-spacing: 0.04em;
    color: var(--sf-blue-ink); background: var(--sf-blue-tint);
    padding: 3px 9px; border-radius: 999px;
}
.sf-card__name {
    margin: 2px 0 0; font-size: 16px; font-weight: 600; letter-spacing: -0.005em; color: var(--ink);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.sf-card__summary {
    margin: 0; font-size: 12.5px; line-height: 1.55; color: var(--ink-3);
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.sf-card__ingredients { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink-3); }

.sf-card__side {
    flex: none;
    width: 132px;
    display: flex;
    align-items: center;
    border-inline-start: 1px solid var(--line);
    padding-inline-start: 14px;
}
/* The load button keeps the standard .btn surface look — the blue accent
   lives in the emblem and type chip, not the action. */
.sf-card__load { width: 100%; }
.sf-card__load:hover { filter: brightness(0.94); }

html.tf-mobile .sf-card { flex-wrap: wrap; }
html.tf-mobile .sf-card__side {
    width: 100%;
    border-inline-start: none;
    border-top: 1px solid var(--line);
    padding-inline-start: 0;
    padding-top: 12px;
    margin-top: 2px;
}
</style>
