<script setup>
// One filter option line — custom-drawn radio/checkbox glyph, label and a
// count badge. The real input is visually hidden but keeps the row
// keyboard/screen-reader accessible.
import { ref } from 'vue';
import Icon from '@/components/ui/Icon.vue';

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
        class="mx-[-6px] my-0 flex cursor-pointer items-center gap-[9px] rounded-[4px] px-[6px] py-[5px] transition-[background] duration-120"
        :class="hover ? 'bg-accent-tint' : 'bg-transparent'"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <span
            class="inline-flex h-[14px] w-[14px] shrink-0 items-center justify-center border-[1.5px] transition-all duration-150"
            :class="[
                checked
                    ? 'border-accent bg-accent'
                    : 'border-line-strong bg-surface',
                radio ? 'rounded-[50%]' : 'rounded-[3px]',
            ]"
        >
            <template v-if="checked">
                <span
                    v-if="radio"
                    class="h-[6px] w-[6px] rounded-[50%] bg-[#fff]"
                />
                <Icon
                    v-else
                    name="check"
                    :size="10"
                    color="#fff"
                    :stroke="2.5"
                />
            </template>
        </span>
        <input
            :type="radio ? 'radio' : 'checkbox'"
            :checked="checked"
            class="pointer-events-none absolute opacity-0"
            @change="emit('change')"
        />
        <span
            class="flex-1 text-[13px]"
            :class="
                checked ? 'font-semibold text-ink' : 'font-normal text-ink-2'
            "
            >{{ label }}</span
        >
        <span class="num text-[11px] text-ink-4">{{ count }}</span>
    </label>
</template>
