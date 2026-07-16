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
            <div class="articles-head flex items-center gap-[14px] mb-[8px]">
                <span
                    class="inline-flex items-center justify-center w-[44px] h-[44px] bg-accent-tint rounded-[12px]"
                >
                    <Icon name="file_text" :size="22" color="var(--accent)" />
                </span>
                <div>
                    <h1 class="page-title m-0">מאמרים מקצועיים</h1>
                    <p class="page-sub">ספריית ידע קלינית ברפואת צמחים — מחקר, מונוגרפיות וטיפים מהשטח</p>
                </div>
                <!-- Style switch — reorders the library by the chosen approach -->
                <div class="flex items-center gap-[10px] ms-auto">
                    <span class="text-[12.5px] font-medium whitespace-nowrap text-ink-3">
                        סדר תצוגה לפי סגנון
                    </span>
                    <ModeSwitch :mode="mode" @request="requestMode" />
                </div>
            </div>

            <!-- Category filter -->
            <div
                class="flex flex-wrap gap-[8px] mt-[24px] mx-0 mb-[28px] pb-[24px] border-b border-b-line"
            >
                <button
                    v-for="c in cats"
                    :key="c"
                    :class="'tag' + (activeCat === c ? ' tag--selected' : '')"
                    @click="activeCat = c"
                >{{ c }}</button>
                <span class="ms-auto self-center text-[13px] text-ink-3">
                    <span class="num">{{ list.length }}</span> מאמרים
                </span>
            </div>

            <!-- Grouped grids — current style first, divider, then the other -->
            <template v-for="(g, gi) in groups" :key="g.key">
                <div
                    v-if="gi > 0"
                    class="flex items-center gap-[14px] mt-[44px] mx-0 mb-[30px]"
                >
                    <span class="flex-1 h-[1px] bg-(--line)" />
                    <span class="text-[12.5px] font-semibold tracking-[0.04em] whitespace-nowrap text-ink-4">סגנון נוסף</span>
                    <span class="flex-1 h-[1px] bg-(--line)" />
                </div>
                <div class="flex items-center gap-[10px] mb-[18px]">
                    <ModeGlyph :mode="g.key" :size="16" />
                    <h2 class="m-0 text-[17px] font-bold text-ink">{{ g.label }}</h2>
                    <span class="text-[12.5px] text-ink-3">
                        <span class="num">{{ g.items.length }}</span> מאמרים
                    </span>
                </div>
                <div
                    class="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] items-stretch gap-[22px]"
                >
                    <ArticleCard v-for="a in g.items" :key="a.id" :article="a" />
                </div>
            </template>
        </div>
    </div>
</template>
