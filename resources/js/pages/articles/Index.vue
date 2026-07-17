<script setup>
// מאמרים — Articles index page: all articles, filterable by category,
// grouped by treatment style (the practitioner's current style first).
import { Head } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import ArticleCard from '@/components/shared/home/ArticleCard.vue';
import ModeGlyph from '@/components/shared/mode/ModeGlyph.vue';
import ModeSwitch from '@/components/shared/mode/ModeSwitch.vue';
import Icon from '@/components/ui/Icon.vue';
import { ARTICLES } from '@/data/mock';
import { useModeStore } from '@/stores/mode';

// TODO(backend): a Laravel controller passing real `articles` wins over the mock.
const props = defineProps({
    articles: { type: Array, default: () => ARTICLES },
});

const { mode, requestMode } = useModeStore();

const sysOf = (a) => (a.system === 'chinese' ? 'chinese' : 'western');

const cats = computed(() => [
    'הכל',
    ...Array.from(new Set(props.articles.map((a) => a.cat))),
]);
const activeCat = ref('הכל');

const list = computed(() =>
    activeCat.value === 'הכל'
        ? props.articles
        : props.articles.filter((a) => a.cat === activeCat.value),
);

// Two groups — the practitioner's current style first, the other after a divider.
const groups = computed(() => {
    const western = list.value.filter((a) => sysOf(a) === 'western');
    const chinese = list.value.filter((a) => sysOf(a) === 'chinese');

    return (
        mode.value === 'chinese'
            ? [
                  { key: 'chinese', label: 'רפואה סינית', items: chinese },
                  {
                      key: 'western',
                      label: 'רפואת צמחים מערבית',
                      items: western,
                  },
              ]
            : [
                  {
                      key: 'western',
                      label: 'רפואת צמחים מערבית',
                      items: western,
                  },
                  { key: 'chinese', label: 'רפואה סינית', items: chinese },
              ]
    ).filter((g) => g.items.length > 0);
});
</script>

<template>
    <Head title="מאמרים" />
    <div class="page">
        <div class="page__inner">
            <!-- Header -->
            <div class="articles-head mb-[8px] flex items-center gap-[14px]">
                <span
                    class="inline-flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-accent-tint"
                >
                    <Icon name="file_text" :size="22" color="var(--accent)" />
                </span>
                <div>
                    <h1 class="page-title m-0">מאמרים מקצועיים</h1>
                    <p class="page-sub">
                        ספריית ידע קלינית ברפואת צמחים — מחקר, מונוגרפיות וטיפים
                        מהשטח
                    </p>
                </div>
                <!-- Style switch — reorders the library by the chosen approach -->
                <div class="ms-auto flex items-center gap-[10px]">
                    <span
                        class="text-[12.5px] font-medium whitespace-nowrap text-ink-3"
                    >
                        סדר תצוגה לפי סגנון
                    </span>
                    <ModeSwitch :mode="mode" @request="requestMode" />
                </div>
            </div>

            <!-- Category filter -->
            <div
                class="mx-0 mt-[24px] mb-[28px] flex flex-wrap gap-[8px] border-b border-b-line pb-[24px]"
            >
                <button
                    v-for="category in cats"
                    :key="category"
                    :class="
                        'tag' + (activeCat === category ? ' tag--selected' : '')
                    "
                    @click="activeCat = category"
                >
                    {{ category }}
                </button>
                <span class="ms-auto self-center text-[13px] text-ink-3">
                    <span class="num">{{ list.length }}</span> מאמרים
                </span>
            </div>

            <!-- Grouped grids — current style first, divider, then the other -->
            <template
                v-for="(group, groupIndex) in groups"
                :key="group.key"
            >
                <div
                    v-if="groupIndex > 0"
                    class="mx-0 mt-[44px] mb-[30px] flex items-center gap-[14px]"
                >
                    <span class="h-[1px] flex-1 bg-(--line)" />
                    <span
                        class="text-[12.5px] font-semibold tracking-[0.04em] whitespace-nowrap text-ink-4"
                        >סגנון נוסף</span
                    >
                    <span class="h-[1px] flex-1 bg-(--line)" />
                </div>
                <div class="mb-[18px] flex items-center gap-[10px]">
                    <ModeGlyph :mode="group.key" :size="16" />
                    <h2 class="m-0 text-[17px] font-bold text-ink">
                        {{ group.label }}
                    </h2>
                    <span class="text-[12.5px] text-ink-3">
                        <span class="num">{{ group.items.length }}</span> מאמרים
                    </span>
                </div>
                <div
                    class="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] items-stretch gap-[22px]"
                >
                    <ArticleCard
                        v-for="article in group.items"
                        :key="article.id"
                        :article="article"
                    />
                </div>
            </template>
        </div>
    </div>
</template>
