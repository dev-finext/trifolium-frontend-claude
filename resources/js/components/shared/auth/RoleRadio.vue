<script setup>
// Radio pill group (role selector: student / therapist).
defineProps({
    modelValue: { type: String, default: null },
    options: { type: Array, required: true }, // [{ id, label }]
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <div class="flex flex-wrap gap-[12px]">
        <label
            v-for="option in options"
            :key="option.id"
            class="inline-flex cursor-pointer items-center gap-[10px] rounded-control border-[1.5px] px-[18px] py-[11px] transition-all duration-150 select-none"
            :class="
                modelValue === option.id
                    ? 'border-accent bg-accent-tint'
                    : 'border-line-strong bg-surface'
            "
            @click="emit('update:modelValue', option.id)"
        >
            <span
                class="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] bg-[#fff]"
                :class="
                    modelValue === option.id
                        ? 'border-accent'
                        : 'border-line-strong'
                "
            >
                <span
                    v-if="modelValue === option.id"
                    class="h-[9px] w-[9px] rounded-full bg-accent"
                />
            </span>
            <span
                class="text-[15.5px] text-ink"
                :class="
                    modelValue === option.id ? 'font-semibold' : 'font-medium'
                "
                >{{ option.label }}</span
            >
        </label>
    </div>
</template>
