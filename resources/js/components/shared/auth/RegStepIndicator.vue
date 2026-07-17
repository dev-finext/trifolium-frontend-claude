<script setup>
// Progress bar — numbered circles joined by connectors, mirroring the
// formula-creation wizard. Completed steps show a check; the active step
// uses the accent. Completed steps are clickable to jump back.
import Icon from '@/components/ui/Icon.vue';

defineProps({
    sections: { type: Array, required: true }, // [{ id, title }]
    current: { type: Number, required: true }, // 1-based active step
    done: { type: Object, required: true }, // { [sectionId]: bool }
});

const emit = defineEmits(['jump']);
</script>

<template>
    <div class="sticky top-0 z-[30] border-b border-line bg-surface">
        <div
            class="relative mx-auto my-0 flex max-w-[600px] items-start justify-between px-[24px] py-[22px]"
        >
            <template
                v-for="(section, index) in sections"
                :key="section.id"
            >
                <div
                    class="relative z-[2] flex flex-col items-center gap-[9px] bg-surface px-[12px] py-0"
                    :class="
                        index + 1 < current ? 'cursor-pointer' : 'cursor-default'
                    "
                    @click="index + 1 < current && emit('jump', section.id)"
                >
                    <div
                        class="flex h-[32px] w-[32px] items-center justify-center rounded-full border-[1.5px] font-latin text-[14.5px] font-bold transition-all duration-150"
                        :class="[
                            index + 1 === current ||
                            ((done[section.id] || index + 1 < current) &&
                                index + 1 !== current)
                                ? 'border-accent'
                                : 'border-line-strong',
                            index + 1 === current ? 'bg-accent' : 'bg-surface',
                            index + 1 === current
                                ? 'text-[#fff]'
                                : done[section.id] || index + 1 < current
                                  ? 'text-accent'
                                  : 'text-ink-4',
                        ]"
                    >
                        <Icon
                            v-if="
                                (done[section.id] || index + 1 < current) &&
                                index + 1 !== current
                            "
                            name="check"
                            :size="16"
                            color="var(--accent)"
                            :stroke="2.6"
                        />
                        <template v-else>{{ index + 1 }}</template>
                    </div>
                    <span
                        class="text-[14px] whitespace-nowrap"
                        :class="[
                            index + 1 === current ? 'font-bold' : 'font-medium',
                            index + 1 === current
                                ? 'text-accent'
                                : done[section.id] || index + 1 < current
                                  ? 'text-ink-2'
                                  : 'text-ink-4',
                        ]"
                        >{{ section.title }}</span
                    >
                </div>
                <div
                    v-if="index < sections.length - 1"
                    class="relative z-[1] mx-[-4px] mt-[15px] h-[2px] flex-1 transition-[background] duration-150"
                    :class="index + 1 < current ? 'bg-accent' : 'bg-line-strong'"
                />
            </template>
        </div>
    </div>
</template>
