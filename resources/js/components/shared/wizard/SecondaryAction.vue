<script setup>
// Secondary patient-path button ("מטופל חדש" / "ללא מטופל") — sits under the
// hero search, highlights with the accent tint when its option is active.
// The card frame is a <div> so extras (the tutorial-video play trigger) can
// sit INSIDE the button's frame as legal siblings of the main action.
import Icon from '@/components/ui/Icon.vue';

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
    <div
        class="relative flex flex-1 items-center rounded-card border transition-all duration-150"
        :class="[
            active
                ? 'border-accent bg-accent-tint shadow-[inset_0_0_0_1px_var(--accent)]'
                : 'border-line bg-surface shadow-none',
            $slots.extra ? 'pb-[30px]' : '',
        ]"
    >
        <!-- "חדש" flag — tucked into the top-inline-start (right, RTL) corner,
             in the round icon's empty corner, clear of the label text. -->
        <span v-if="badge" class="tf-new-badge tf-new-badge--corner">{{
            badge
        }}</span>

        <button
            type="button"
            class="flex flex-1 cursor-pointer items-center gap-[12px] rounded-card border-none bg-transparent px-[16px] py-[13px] text-right [font-family:inherit]"
            @click="emit('click')"
        >
            <span
                class="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[50%]"
                :class="
                    active
                        ? 'bg-accent text-white'
                        : 'bg-surface-sunk text-accent'
                "
            >
                <Icon :name="icon" :size="17" />
            </span>
            <span>
                <span
                    class="block text-[13.5px] leading-[1.3] font-semibold"
                    :class="active ? 'text-accent-ink' : 'text-ink'"
                    >{{ label }}</span
                >
                <span class="block text-[11.5px] font-light text-ink-3">{{
                    sub
                }}</span>
            </span>
        </button>

        <!-- Extras (e.g. the tutorial play trigger) live in a dedicated bottom
             band created by the card's pb — below all content, so the play
             never overlaps the icon/label, nor the top-corner "חדש" ribbon
             (desktop) / pill (mobile), at any width. -->
        <span
            v-if="$slots.extra"
            class="absolute bottom-[5px] left-[12px] z-[7] inline-flex"
        >
            <slot name="extra" />
        </span>
    </div>
</template>
