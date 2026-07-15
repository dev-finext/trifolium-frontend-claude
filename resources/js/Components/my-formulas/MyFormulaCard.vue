<script setup>
// Saved-formula card — horizontal layout: a type emblem on the leading side,
// the formula's identity in the middle, and the actions ("טען למעבדה", edit,
// delete) as a rail on the trailing side. Hover/focus lift is CSS-driven so
// keyboard focus gets the same affordance; the delete rail swaps to an inline
// confirmation.
import { ref, computed, watch, onMounted } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import { FORMULA_TYPES } from '@/data/mock';

const props = defineProps({
    saved: { type: Object, required: true },
    /** Freshly-saved arrival glow (drives .formula-just-saved). */
    highlighted: { type: Boolean, default: false },
    /** The inline delete-confirm rail is showing for this card. */
    confirming: { type: Boolean, default: false },
});

const emit = defineEmits(['load', 'delete', 'request-delete', 'cancel-delete']);

const cardEl = ref(null);

const count = computed(() => (props.saved.ingredients || []).length);
const typeHeb = computed(() => {
    const t = FORMULA_TYPES.find((x) => x.id === props.saved.typeId);
    return t ? t.heb : 'פורמולה';
});

// Bring the freshly-saved card into view when it lights up.
function scrollIntoViewIfHighlighted() {
    if (props.highlighted && cardEl.value) {
        const top = cardEl.value.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
}
onMounted(scrollIntoViewIfHighlighted);
watch(() => props.highlighted, scrollIntoViewIfHighlighted);
</script>

<template>
    <div
        ref="cardEl"
        :class="['card', 'mf-card', { 'formula-just-saved': highlighted }]"
    >
        <!-- leading side: type emblem + ingredient count -->
        <div class="mf-card__emblem" aria-hidden="true">
            <Icon name="flask" :size="24" color="var(--accent)" :stroke="1.6" />
            <span class="mf-card__emblem-count"><span class="num">{{ count }}</span> רכיבים</span>
        </div>

        <!-- middle: identity -->
        <div class="mf-card__body">
            <div class="mf-card__meta">
                <span class="mf-card__type">{{ typeHeb }}</span>
                <span v-if="highlighted" class="mf-card__saved">
                    <Icon name="check" :size="12" color="var(--on-accent)" :stroke="2.4" /> נשמרה כעת
                </span>
            </div>
            <h3 class="mf-card__name">{{ saved.name }}</h3>
            <p class="mf-card__summary">{{ saved.summary }}</p>
        </div>

        <!-- trailing side: the action rail (loads / edits / deletes) -->
        <div class="mf-card__side">
            <template v-if="confirming">
                <span class="mf-card__confirm-q">למחוק?</span>
                <button class="btn btn--sm mf-card__confirm-yes" type="button" @click="emit('delete')">מחק</button>
                <button class="btn btn--ghost btn--sm" type="button" @click="emit('cancel-delete')">ביטול</button>
            </template>
            <template v-else>
                <button class="btn btn--primary btn--sm mf-card__load" type="button" @click="emit('load')">
                    <Icon name="flask" :size="15" color="var(--on-accent)" /> טען למעבדה
                </button>
                <div class="mf-card__icons">
                    <button class="btn--icon" type="button" aria-label="ערוך פורמולה" @click="emit('load')"><Icon name="edit" :size="16" /></button>
                    <button class="btn--icon" type="button" aria-label="מחק פורמולה" @click="emit('request-delete')"><Icon name="trash" :size="16" /></button>
                </div>
            </template>
        </div>
    </div>
</template>

<style>
.mf-card {
    display: flex;
    align-items: stretch;
    gap: 16px;
    padding: 16px 18px;
    transition: border-color .15s ease, box-shadow .15s ease, transform .15s ease;
}
.mf-card:hover,
.mf-card:focus-within {
    border-color: var(--line-strong);
    box-shadow: 0 10px 28px rgba(20, 28, 24, 0.08);
}

/* leading emblem */
.mf-card__emblem {
    flex: none;
    width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: var(--accent-tint);
    border-radius: var(--r-card);
    padding: 10px 6px;
}
.mf-card__emblem-count {
    font-size: 10.5px;
    font-weight: 600;
    color: var(--accent-ink);
    text-align: center;
    line-height: 1.2;
}

/* middle body */
.mf-card__body { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }
.mf-card__meta { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
.mf-card__type {
    font-size: 11px; font-weight: 700; letter-spacing: 0.04em;
    color: var(--accent-ink); background: var(--accent-tint);
    padding: 3px 9px; border-radius: 999px;
}
.mf-card__saved {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10.5px; font-weight: 700;
    color: var(--on-accent); background: var(--accent);
    padding: 3px 9px; border-radius: 999px; white-space: nowrap;
}
.mf-card__name {
    margin: 0; font-size: 16px; font-weight: 600; letter-spacing: -0.005em;
    color: var(--ink);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.mf-card__summary {
    margin: 4px 0 0; font-size: 12.5px; line-height: 1.55; color: var(--ink-3);
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

/* trailing action rail */
.mf-card__side {
    flex: none;
    width: 132px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    border-inline-start: 1px solid var(--line);
    padding-inline-start: 14px;
}
.mf-card__load { width: 100%; }
.mf-card__icons { display: flex; gap: 6px; justify-content: center; }
.mf-card__confirm-q { font-size: 12.5px; font-weight: 700; color: var(--danger); text-align: center; }
.mf-card__confirm-yes { background: var(--danger); color: #fff; border-color: var(--danger); }
.mf-card__confirm-yes:hover { filter: brightness(0.94); }

/* phones: the side rail drops under the content so nothing is cramped */
html.tf-mobile .mf-card { flex-wrap: wrap; }
html.tf-mobile .mf-card__side {
    width: 100%;
    flex-direction: row;
    align-items: center;
    border-inline-start: none;
    border-top: 1px solid var(--line);
    padding-inline-start: 0;
    padding-top: 12px;
    margin-top: 2px;
}
html.tf-mobile .mf-card__load { flex: 1; }
</style>
