<script setup>
// Radio pill group (role selector: student / therapist).
defineProps({
    modelValue: { type: String, default: null },
    options: { type: Array, required: true }, // [{ id, label }]
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <div class="flex gap-[12px] flex-wrap">
        <label
            v-for="o in options" :key="o.id"
            class="inline-flex items-center gap-[10px] px-[18px] py-[11px] border-[1.5px] rounded-control cursor-pointer select-none transition-all duration-150"
            :class="modelValue === o.id ? 'border-accent bg-accent-tint' : 'border-line-strong bg-surface'"
            @click="emit('update:modelValue', o.id)"
        >
            <span
                class="inline-flex items-center justify-center w-[18px] h-[18px] shrink-0 bg-[#fff] border-[1.5px] rounded-full"
                :class="modelValue === o.id ? 'border-accent' : 'border-line-strong'"
            >
                <span
                    v-if="modelValue === o.id"
                    class="w-[9px] h-[9px] rounded-full bg-accent"
                />
            </span>
            <span class="text-[15.5px] text-ink" :class="modelValue === o.id ? 'font-semibold' : 'font-medium'">{{ o.label }}</span>
        </label>
    </div>
</template>
