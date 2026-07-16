<script setup>
// One filter option line — custom-drawn radio/checkbox glyph, label and a
// count badge. The real input is visually hidden but keeps the row
// keyboard/screen-reader accessible.
import { ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    label: { type: String, required: true },
    count: { type: Number, default: 0 },
    checked: { type: Boolean, default: false },
    radio: { type: Boolean, default: false },
});

const emit = defineEmits(['change']);

const hover = ref(false);
</script>

<template>
    <label
        class="flex items-center gap-[9px] py-[5px] px-[6px] my-0 mx-[-6px] rounded-[4px] cursor-pointer transition-[background] duration-120"
        :class="hover ? 'bg-accent-tint' : 'bg-transparent'"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <span
            class="inline-flex items-center justify-center w-[14px] h-[14px] shrink-0 border-[1.5px] transition-all duration-150"
            :class="[
                checked ? 'border-accent bg-accent' : 'border-line-strong bg-surface',
                radio ? 'rounded-[50%]' : 'rounded-[3px]',
            ]"
        >
            <template v-if="checked">
                <span v-if="radio" class="w-[6px] h-[6px] rounded-[50%] bg-[#fff]" />
                <Icon v-else name="check" :size="10" color="#fff" :stroke="2.5" />
            </template>
        </span>
        <input
            :type="radio ? 'radio' : 'checkbox'"
            :checked="checked"
            class="absolute opacity-0 pointer-events-none"
            @change="emit('change')"
        />
        <span
            class="flex-1 text-[13px]"
            :class="checked ? 'text-ink font-semibold' : 'text-ink-2 font-normal'"
        >{{ label }}</span>
        <span class="num text-[11px] text-ink-4">{{ count }}</span>
    </label>
</template>
