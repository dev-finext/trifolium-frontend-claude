<script setup>
// Sidebar — radio row.
defineProps({
    label: { type: String, required: true },
    checked: { type: Boolean, default: false },
});
const emit = defineEmits(['change']);
</script>

<template>
    <label class="flex items-center gap-[10px] px-0 py-[4px] cursor-pointer" @click="emit('change')">
        <span
            class="inline-flex items-center justify-center w-[18px] h-[18px] shrink-0 bg-white border-[1.5px] rounded-[50%] transition-[border-color] duration-150"
            :class="checked ? 'border-accent' : 'border-line-strong'"
        >
            <span v-if="checked" class="w-[9px] h-[9px] bg-accent rounded-[50%]" />
        </span>
        <span class="text-[14px]" :class="checked ? 'font-semibold text-ink' : 'font-normal text-ink-2'">{{ label }}</span>
    </label>
</template>
