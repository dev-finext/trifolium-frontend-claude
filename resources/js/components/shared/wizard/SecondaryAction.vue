<script setup>
// Secondary patient-path button ("מטופל חדש" / "ללא מטופל") — sits under the
// hero search, highlights with the accent tint when its option is active.
// The clickable surface is a role="button" div (not a <button>) so an optional
// tutorial-play trigger can sit INLINE beside the label title as a legal
// nested button, without breaking to a new line or overrunning the text.
import Icon from '@/components/ui/Icon.vue';

defineProps({
    icon: { type: String, required: true },
    label: { type: String, required: true },
    sub: { type: String, default: '' },
    active: { type: Boolean, default: false },
    // Optional "חדש"-style flag (mobile pill; desktop uses a corner ribbon).
    badge: { type: String, default: '' },
});

const emit = defineEmits(['click']);

function onKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        emit('click');
    }
}
</script>

<template>
    <div
        role="button"
        tabindex="0"
        class="relative flex flex-1 cursor-pointer items-center gap-[12px] rounded-card border px-[16px] py-[13px] text-right transition-all duration-150"
        :class="
            active
                ? 'border-accent bg-accent-tint shadow-[inset_0_0_0_1px_var(--accent)]'
                : 'border-line bg-surface shadow-none'
        "
        @click="emit('click')"
        @keydown="onKey"
    >
        <!-- "חדש" flag — tucked into the top-inline-start (right, RTL) corner,
             in the round icon's empty corner, clear of the label text. -->
        <span v-if="badge" class="tf-new-badge tf-new-badge--corner">{{
            badge
        }}</span>

        <span
            class="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[50%]"
            :class="
                active ? 'bg-accent text-white' : 'bg-surface-sunk text-accent'
            "
        >
            <Icon :name="icon" :size="17" />
        </span>

        <span class="flex min-w-0 flex-col">
            <!-- Title row: the label, with the tutorial play inline beside it. -->
            <span class="flex items-center gap-[7px]">
                <span
                    class="text-[13.5px] leading-[1.3] font-semibold"
                    :class="active ? 'text-accent-ink' : 'text-ink'"
                    >{{ label }}</span
                >
                <slot name="extra" />
            </span>
            <span class="text-[11.5px] font-light text-ink-3">{{ sub }}</span>
        </span>
    </div>
</template>
