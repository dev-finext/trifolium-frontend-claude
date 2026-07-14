<script setup>
// Saved-formula card in the practitioner's library. Shows the preparation-type
// chip, ingredient count (or the "just saved" chip while highlighted), and an
// action footer that swaps to an inline delete confirmation.
import { ref, computed, watch, onMounted } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import { FORMULA_TYPES } from '@/data/mock';

const props = defineProps({
    saved: { type: Object, required: true },
    /** Freshly-saved arrival glow (drives .formula-just-saved). */
    highlighted: { type: Boolean, default: false },
    /** The inline delete-confirm footer is showing for this card. */
    confirming: { type: Boolean, default: false },
});

const emit = defineEmits(['load', 'delete', 'request-delete', 'cancel-delete']);

const hover = ref(false);
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
        :class="['card', { 'formula-just-saved': highlighted }]"
        :style="{
            padding: 0, display: 'flex', flexDirection: 'column',
            borderColor: hover ? 'var(--line-strong)' : 'var(--line)',
            transition: 'border-color .15s, box-shadow .15s',
            boxShadow: hover ? '0 10px 28px rgba(20,28,24,0.07)' : 'none',
        }"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <div style="padding: 18px 20px 16px; flex: 1">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 10px">
                <span
                    :style="{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em',
                        color: 'var(--accent-ink)', background: 'var(--accent-tint)',
                        padding: '4px 10px', borderRadius: '999px',
                    }"
                >
                    <Icon name="flask" :size="13" color="var(--accent)" />
                    {{ typeHeb }}
                </span>
                <span
                    v-if="highlighted"
                    class="formula-saved-chip"
                    :style="{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        fontSize: '11px', fontWeight: 700, letterSpacing: '0.03em',
                        color: '#fff', background: 'var(--accent)',
                        padding: '4px 10px', borderRadius: '999px', whiteSpace: 'nowrap',
                    }"
                >
                    <Icon name="check" :size="12" color="#fff" :stroke="2.4" /> נשמרה כעת
                </span>
                <span v-else class="small muted" style="display: inline-flex; align-items: center; gap: 5px; white-space: nowrap">
                    <Icon name="leaf" :size="13" /> <span class="num">{{ count }}</span> רכיבים
                </span>
            </div>

            <h3 style="margin: 0; font-size: 16.5px; font-weight: 600; letter-spacing: -0.005em">{{ saved.name }}</h3>
            <p class="small muted" style="margin: 7px 0 0; line-height: 1.6">{{ saved.summary }}</p>
        </div>

        <!-- Action footer: inline delete confirmation, or load/edit/delete -->
        <div
            v-if="confirming"
            :style="{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
                borderTop: '1px solid var(--line)', background: '#fdf2f2',
            }"
        >
            <span style="flex: 1; font-size: 13px; font-weight: 600; color: #9a2f2f">למחוק את הפורמולה?</span>
            <button class="btn btn--ghost btn--sm" @click="emit('cancel-delete')">ביטול</button>
            <button
                class="btn btn--sm"
                style="background: #c0392b; color: #fff; border-color: #c0392b"
                @click="emit('delete')"
            >מחק</button>
        </div>
        <div
            v-else
            :style="{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px',
                borderTop: '1px solid var(--line)',
            }"
        >
            <button class="btn btn--primary btn--sm" style="flex: 1" @click="emit('load')">
                <Icon name="flask" :size="15" /> טען למעבדה
            </button>
            <button class="btn--icon" aria-label="ערוך" @click="emit('load')"><Icon name="edit" :size="16" /></button>
            <button class="btn--icon" aria-label="מחק" @click="emit('request-delete')"><Icon name="trash" :size="16" /></button>
        </div>
    </div>
</template>
