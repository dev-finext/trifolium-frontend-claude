<script setup>
// Secondary patient-path button ("מטופל חדש" / "ללא מטופל") — sits under the
// hero search, highlights with the accent tint when its option is active.
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    icon: { type: String, required: true },
    label: { type: String, required: true },
    sub: { type: String, default: '' },
    active: { type: Boolean, default: false },
    // Optional "חדש"-style flag. On phones it renders as a small pill tucked
    // into the card's top-inline-start (right, RTL) corner — clear of the icon
    // and the label. On desktop it's hidden here (a corner ribbon is used).
    badge: { type: String, default: '' },
});

const emit = defineEmits(['click']);
</script>

<template>
    <button
        type="button"
        class="relative flex items-center gap-[12px] flex-1 px-[16px] py-[13px] text-right [font-family:inherit] border rounded-card cursor-pointer transition-all duration-150"
        :class="active ? 'border-accent bg-accent-tint shadow-[inset_0_0_0_1px_var(--accent)]' : 'border-line bg-surface shadow-none'"
        @click="emit('click')"
    >
        <!-- "חדש" flag — tucked into the top-inline-start (right, RTL) corner,
             in the round icon's empty corner, clear of the label text. -->
        <span v-if="badge" class="tf-new-badge tf-new-badge--corner">{{ badge }}</span>
        <span
            class="flex items-center justify-center w-[34px] h-[34px] shrink-0 rounded-[50%]"
            :class="active ? 'bg-accent text-white' : 'bg-surface-sunk text-accent'"
        >
            <Icon :name="icon" :size="17" />
        </span>
        <span>
            <span
                class="block text-[13.5px] font-semibold leading-[1.3]"
                :class="active ? 'text-accent-ink' : 'text-ink'"
            >{{ label }}</span>
            <span class="block text-[11.5px] font-light text-ink-3">{{ sub }}</span>
        </span>
    </button>
</template>
