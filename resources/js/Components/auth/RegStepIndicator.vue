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
    <div :style="{ position: 'sticky', top: '0', zIndex: 30, background: 'var(--surface)', borderBottom: '1px solid var(--line)' }">
        <div :style="{ maxWidth: '600px', margin: '0 auto', padding: '22px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }">
            <template v-for="(s, i) in sections" :key="s.id">
                <div
                    :style="{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '9px',
                        cursor: i + 1 < current ? 'pointer' : 'default', position: 'relative', zIndex: 2,
                        background: 'var(--surface)', padding: '0 12px',
                    }"
                    @click="i + 1 < current && emit('jump', s.id)"
                >
                    <div
                        :style="{
                            width: '32px', height: '32px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'var(--font-latin)', fontSize: '14.5px', fontWeight: 700,
                            border: '1.5px solid ' + (i + 1 === current || ((done[s.id] || i + 1 < current) && i + 1 !== current) ? 'var(--accent)' : 'var(--line-strong)'),
                            background: i + 1 === current ? 'var(--accent)' : 'var(--surface)',
                            color: i + 1 === current ? '#fff' : ((done[s.id] || i + 1 < current) ? 'var(--accent)' : 'var(--ink-4)'),
                            transition: 'all .15s',
                        }"
                    >
                        <Icon v-if="(done[s.id] || i + 1 < current) && i + 1 !== current" name="check" :size="16" color="var(--accent)" :stroke="2.6" />
                        <template v-else>{{ i + 1 }}</template>
                    </div>
                    <span
                        :style="{
                            fontSize: '14px', fontWeight: i + 1 === current ? 700 : 500,
                            color: i + 1 === current ? 'var(--accent)' : ((done[s.id] || i + 1 < current) ? 'var(--ink-2)' : 'var(--ink-4)'),
                            whiteSpace: 'nowrap',
                        }"
                    >{{ s.title }}</span>
                </div>
                <div
                    v-if="i < sections.length - 1"
                    :style="{
                        flex: 1, height: '2px', marginTop: '15px', marginInline: '-4px',
                        background: i + 1 < current ? 'var(--accent)' : 'var(--line-strong)',
                        position: 'relative', zIndex: 1, transition: 'background .15s',
                    }"
                />
            </template>
        </div>
    </div>
</template>
