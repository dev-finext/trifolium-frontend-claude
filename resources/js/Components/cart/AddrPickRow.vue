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
        class="flex items-start gap-[11px] px-[13px] py-[11px] cursor-pointer border rounded-control transition-[border-color,background] duration-150"
        :class="selected ? 'border-accent bg-accent-tint' : 'border-line bg-surface'"
        @click="emit('select')"
    >
        <span
            class="inline-flex items-center justify-center w-[18px] h-[18px] shrink-0 mt-[1px] bg-white border-[1.5px] rounded-[50%]"
            :class="selected ? 'border-accent' : 'border-line-strong'"
        >
            <span v-if="selected" class="w-[9px] h-[9px] bg-accent rounded-[50%]" />
        </span>
        <span class="min-w-0 flex-1">
            <span class="flex items-center gap-[8px] flex-wrap">
                <span class="text-[13.5px] font-semibold text-ink">{{ addr.label || addr.name || 'כתובת' }}</span>
                <span
                    v-if="addr.primary"
                    class="px-[8px] py-[1px] text-[10.5px] font-bold text-white bg-accent rounded-[999px]"
                >ברירת מחדל</span>
            </span>
            <span class="small muted block mt-[3px] text-[12px] leading-[1.45]">
                {{ [addr.street, addr.city].filter(Boolean).join(', ') }}
            </span>
        </span>
    </label>
</template>
