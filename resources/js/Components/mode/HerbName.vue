<script setup>
// Herb-name renderer — primary/secondary order flips by treatment style.
// Western mode: Latin primary (italic), Hebrew secondary.
// Chinese mode: pinyin primary (no hanzi), Latin secondary (small, italic, below).
import { computed } from 'vue';
import { useModeStore } from '@/stores/mode';
import { herbPinyin } from '@/lib/herbs';

const props = defineProps({
    herb: { type: Object, required: true },
    primarySize: { type: Number, default: 15 },
    secondarySize: { type: Number, default: 13 },
    primaryWeight: { type: Number, default: 600 },
    primaryColor: { type: String, default: 'var(--ink)' },
    secondaryColor: { type: String, default: 'var(--ink-3)' },
    /** When true, renders horizontally (primary · secondary). */
    inline: { type: Boolean, default: false },
    /** When true, renders only the primary (Latin) name — no Hebrew/secondary line. */
    hideSecondary: { type: Boolean, default: false },
    /**
     * When true, the secondary line is the OTHER system's name (cross-reference):
     * Western primary (Latin) → Chinese name below; Chinese primary (pinyin) → Latin below.
     */
    parallel: { type: Boolean, default: false },
});

const { isChinese } = useModeStore();

// Chinese mode: pinyin (hanzi stripped) is primary, Latin botanical is secondary.
const primary = computed(() => (isChinese.value ? herbPinyin(props.herb) : props.herb.lat));
// Secondary line. In `parallel` mode the Western secondary becomes the Chinese
// name shown as pinyin only (hanzi stripped) instead of the Hebrew name.
const secondary = computed(() =>
    isChinese.value ? props.herb.lat : props.parallel ? herbPinyin(props.herb) : props.herb.heb
);
// The Latin botanical name is always italic (primary in Western, secondary in Chinese).
const secondaryIsItalic = computed(() => isChinese.value);

const primaryStyle = computed(() => ({
    fontSize: `${props.primarySize}px`,
    fontWeight: props.primaryWeight,
    color: props.primaryColor,
    lineHeight: 1.25,
    // Both the Latin botanical (Western) and the pinyin (Chinese) are Latin-script → use the Latin face.
    fontFamily: 'var(--font-latin)',
    fontStyle: isChinese.value ? 'normal' : 'italic', // pinyin upright; Latin botanical italic
    letterSpacing: isChinese.value ? '0.02em' : '0',
}));

const secondaryStyle = computed(() => ({
    fontSize: `${props.secondarySize}px`,
    color: props.secondaryColor,
    fontWeight: 400, // always light — the counterpart name is a quiet reference, never bold
    fontFamily: secondaryIsItalic.value ? 'var(--font-latin)' : 'inherit',
    fontStyle: secondaryIsItalic.value ? 'italic' : 'normal',
    lineHeight: 1.3,
}));
</script>

<template>
    <span
        v-if="inline"
        class="inline-flex items-baseline gap-[8px] flex-wrap"
    >
        <span :style="primaryStyle">{{ primary }}</span>
        <span v-if="!hideSecondary" :style="secondaryStyle">{{ secondary }}</span>
    </span>
    <template v-else>
        <!-- Block variant pins the primary to Inter 600/15px (design decision from the handoff). -->
        <div :style="{ ...primaryStyle, fontFamily: 'Inter', fontWeight: '600', fontSize: '15px' }">{{ primary }}</div>
        <div v-if="!hideSecondary" class="mt-[1px]" :style="secondaryStyle">{{ secondary }}</div>
    </template>
</template>
