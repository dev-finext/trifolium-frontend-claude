<script setup>
// Checkbox row — custom square check with label slot.
import Icon from '@/components/ui/Icon.vue';

const props = defineProps({
    modelValue: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <label
        class="flex items-center gap-[11px] cursor-pointer select-none"
        @click="emit('update:modelValue', !modelValue)"
    >
        <span
            class="inline-flex items-center justify-center w-[20px] h-[20px] shrink-0 border-[1.5px] rounded-[5px] transition-all duration-[120ms]"
            :class="modelValue ? 'border-accent bg-accent' : 'border-line-strong bg-[#fff]'"
        >
            <Icon v-if="modelValue" name="check" :size="13" color="#fff" :stroke="3" />
        </span>
        <span class="text-[15px] text-ink"><slot /></span>
    </label>
</template>
