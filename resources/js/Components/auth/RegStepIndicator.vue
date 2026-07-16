<script setup>
// Progress bar — numbered circles joined by connectors, mirroring the
// formula-creation wizard. Completed steps show a check; the active step
// uses the accent. Completed steps are clickable to jump back.
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    sections: { type: Array, required: true }, // [{ id, title }]
    current: { type: Number, required: true }, // 1-based active step
    done: { type: Object, required: true },    // { [sectionId]: bool }
});

const emit = defineEmits(['jump']);
</script>

<template>
    <div class="sticky top-0 z-[30] bg-surface border-b border-line">
        <div class="relative flex items-start justify-between max-w-[600px] mx-auto my-0 py-[22px] px-[24px]">
            <template v-for="(s, i) in sections" :key="s.id">
                <div
                    class="relative z-[2] flex flex-col items-center gap-[9px] px-[12px] py-0 bg-surface"
                    :class="i + 1 < current ? 'cursor-pointer' : 'cursor-default'"
                    @click="i + 1 < current && emit('jump', s.id)"
                >
                    <div
                        class="flex items-center justify-center w-[32px] h-[32px] font-latin text-[14.5px] font-bold border-[1.5px] rounded-full transition-all duration-150"
                        :class="[
                            (i + 1 === current || ((done[s.id] || i + 1 < current) && i + 1 !== current)) ? 'border-accent' : 'border-line-strong',
                            i + 1 === current ? 'bg-accent' : 'bg-surface',
                            i + 1 === current ? 'text-[#fff]' : ((done[s.id] || i + 1 < current) ? 'text-accent' : 'text-ink-4'),
                        ]"
                    >
                        <Icon v-if="(done[s.id] || i + 1 < current) && i + 1 !== current" name="check" :size="16" color="var(--accent)" :stroke="2.6" />
                        <template v-else>{{ i + 1 }}</template>
                    </div>
                    <span
                        class="text-[14px] whitespace-nowrap"
                        :class="[
                            i + 1 === current ? 'font-bold' : 'font-medium',
                            i + 1 === current ? 'text-accent' : ((done[s.id] || i + 1 < current) ? 'text-ink-2' : 'text-ink-4'),
                        ]"
                    >{{ s.title }}</span>
                </div>
                <div
                    v-if="i < sections.length - 1"
                    class="relative z-[1] flex-1 h-[2px] mt-[15px] mx-[-4px] transition-[background] duration-150"
                    :class="i + 1 < current ? 'bg-accent' : 'bg-line-strong'"
                />
            </template>
        </div>
    </div>
</template>
