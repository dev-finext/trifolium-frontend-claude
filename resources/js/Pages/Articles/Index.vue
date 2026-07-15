<script setup>
// מאמרים — Articles index page: all articles, filterable by category,
// grouped by treatment style (the practitioner's current style first).
import { computed, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import Icon from '@/Components/ui/Icon.vue';
import ModeSwitch from '@/Components/mode/ModeSwitch.vue';
import ModeGlyph from '@/Components/mode/ModeGlyph.vue';
import ArticleCard from '@/Components/home/ArticleCard.vue';
import { useModeStore } from '@/stores/mode';
import { ARTICLES } from '@/data/mock';

// TODO(backend): a Laravel controller passing real `articles` wins over the mock.
const props = defineProps({
    articles: { type: Array, default: () => ARTICLES },
});

const { mode, requestMode } = useModeStore();

const sysOf = (a) => (a.system === 'chinese' ? 'chinese' : 'western');

const cats = computed(() => ['הכל', ...Array.from(new Set(props.articles.map(a => a.cat)))]);
const activeCat = ref('הכל');

const list = computed(() => (
    activeCat.value === 'הכל'
        ? props.articles
        : props.articles.filter(a => a.cat === activeCat.value)
));

// Two groups — the practitioner's current style first, the other after a divider.
const groups = computed(() => {
    const western = list.value.filter(a => sysOf(a) === 'western');
    const chinese = list.value.filter(a => sysOf(a) === 'chinese');
    return (mode.value === 'chinese'
        ? [{ key: 'chinese', label: 'רפואה סינית', items: chinese },
           { key: 'western', label: 'רפואת צמחים מערבית', items: western }]
        : [{ key: 'western', label: 'רפואת צמחים מערבית', items: western },
           { key: 'chinese', label: 'רפואה סינית', items: chinese }]
    ).filter(g => g.items.length > 0);
});
</script>

<template>
    <Head title="מאמרים" />
    <div class="page">
        <div class="page__inner">
            <!-- Header -->
            <div class="articles-head" style="display: flex; align-items: center; gap: 14px; margin-bottom: 8px">
                <span
                    :style="{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'var(--accent-tint)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }"
                >
                    <Icon name="file_text" :size="22" color="var(--accent)" />
                </span>
                <div>
                    <h1 class="page-title" style="margin: 0">מאמרים מקצועיים</h1>
                    <p class="page-sub">ספריית ידע קלינית ברפואת צמחים — מחקר, מונוגרפיות וטיפים מהשטח</p>
                </div>
                <!-- Style switch — reorders the library by the chosen approach -->
                <div style="margin-inline-start: auto; display: flex; align-items: center; gap: 10px">
                    <span style="font-size: 12.5px; color: var(--ink-3); font-weight: 500; white-space: nowrap">
                        סדר תצוגה לפי סגנון
                    </span>
                    <ModeSwitch :mode="mode" @request="requestMode" />
                </div>
            </div>

            <!-- Category filter -->
            <div
                :style="{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    margin: '24px 0 28px',
                    paddingBottom: '24px',
                    borderBottom: '1px solid var(--line)',
                }"
            >
                <button
                    v-for="c in cats"
                    :key="c"
                    :class="'tag' + (activeCat === c ? ' tag--selected' : '')"
                    @click="activeCat = c"
                >{{ c }}</button>
                <span style="margin-inline-start: auto; align-self: center; font-size: 13px; color: var(--ink-3)">
                    <span class="num">{{ list.length }}</span> מאמרים
                </span>
            </div>

            <!-- Grouped grids — current style first, divider, then the other -->
            <template v-for="(g, gi) in groups" :key="g.key">
                <div
                    v-if="gi > 0"
                    style="display: flex; align-items: center; gap: 14px; margin: 44px 0 30px"
                >
                    <span style="flex: 1; height: 1px; background: var(--line)" />
                    <span style="font-size: 12.5px; font-weight: 600; letter-spacing: 0.04em; color: var(--ink-4); white-space: nowrap">סגנון נוסף</span>
                    <span style="flex: 1; height: 1px; background: var(--line)" />
                </div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 18px">
                    <ModeGlyph :mode="g.key" :size="16" />
                    <h2 style="margin: 0; font-size: 17px; font-weight: 700; color: var(--ink)">{{ g.label }}</h2>
                    <span style="font-size: 12.5px; color: var(--ink-3)">
                        <span class="num">{{ g.items.length }}</span> מאמרים
                    </span>
                </div>
                <div
                    :style="{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                        gap: '22px',
                        alignItems: 'stretch',
                    }"
                >
                    <ArticleCard v-for="a in g.items" :key="a.id" :article="a" />
                </div>
            </template>
        </div>
    </div>
</template>
