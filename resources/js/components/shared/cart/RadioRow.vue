<script setup>
// Sidebar — radio row.
defineProps({
    label: { type: String, required: true },
    checked: { type: Boolean, default: false },
});
const emit = defineEmits(['change']);
</script>

<template>
    <label
        class="flex cursor-pointer items-center gap-[10px] px-0 py-[4px]"
        @click="emit('change')"
    >
        <span
            class="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[50%] border-[1.5px] bg-white transition-[border-color] duration-150"
            :class="checked ? 'border-accent' : 'border-line-strong'"
        >
            <span
                v-if="checked"
                class="h-[9px] w-[9px] rounded-[50%] bg-accent"
            />
        </span>
        <span
            class="text-[14px]"
            :class="
                checked ? 'font-semibold text-ink' : 'font-normal text-ink-2'
            "
            >{{ label }}</span
        >
    </label>
</template>
