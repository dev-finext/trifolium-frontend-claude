<script setup>
// One saved-address radio row inside the "משלוח אליי" picker.
defineProps({
    addr: { type: Object, required: true },
    selected: { type: Boolean, default: false },
});
const emit = defineEmits(['select']);
</script>

<template>
    <label
        class="flex cursor-pointer items-start gap-[11px] rounded-control border px-[13px] py-[11px] transition-[border-color,background] duration-150"
        :class="
            selected ? 'border-accent bg-accent-tint' : 'border-line bg-surface'
        "
        @click="emit('select')"
    >
        <span
            class="mt-[1px] inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[50%] border-[1.5px] bg-white"
            :class="selected ? 'border-accent' : 'border-line-strong'"
        >
            <span
                v-if="selected"
                class="h-[9px] w-[9px] rounded-[50%] bg-accent"
            />
        </span>
        <span class="min-w-0 flex-1">
            <span class="flex flex-wrap items-center gap-[8px]">
                <span class="text-[13.5px] font-semibold text-ink">{{
                    addr.label || addr.name || 'כתובת'
                }}</span>
                <span
                    v-if="addr.primary"
                    class="rounded-[999px] bg-accent px-[8px] py-[1px] text-[10.5px] font-bold text-white"
                    >ברירת מחדל</span
                >
            </span>
            <span class="small muted mt-[3px] block text-[12px] leading-[1.45]">
                {{ [addr.street, addr.city].filter(Boolean).join(', ') }}
            </span>
        </span>
    </label>
</template>
