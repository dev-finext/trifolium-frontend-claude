<script setup>
// מאמר בודד — single article reader: breadcrumb, hero banner, disclaimer,
// long-form body, author byline card and a "more articles" strip.
// All articles share one cover image (rendered via ItemCover).
import { computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import Icon from '@/Components/ui/Icon.vue';
import SectionHeader from '@/Components/home/SectionHeader.vue';
import ArticleCard from '@/Components/home/ArticleCard.vue';
import { ItemCover } from '@/Components/art';
import { visit } from '@/lib/routes';
import { ARTICLES } from '@/data/mock';

const ARTICLE_DISCLAIMER =
    'מאמר זה אינו מהווה התוויות רפואיות ואינו מחליף ייעוץ רוקחי ו/או הוראות רופא';

// TODO(backend): a Laravel controller passing real `articles` wins over the mock.
const props = defineProps({
    id: { type: String, required: true },
    articles: { type: Array, default: () => ARTICLES },
});

// Fallback to the first article, exactly like the prototype.
const article = computed(() => props.articles.find(a => a.id === props.id) || props.articles[0]);
const others = computed(() => props.articles.filter(a => a.id !== article.value.id).slice(0, 3));

// The prototype scrolled to top on id change; Inertia's visit() already
// resets scroll on navigation, so no explicit effect is needed here.

const crumbLink = {
    color: 'var(--ink-3)',
    cursor: 'pointer',
    transition: 'color .15s',
};
</script>

<template>
    <Head :title="article.title" />
    <div class="pb-[56px] bg-bg">
        <div class="max-w-[900px] my-0 mx-auto pt-[24px] px-[24px] pb-0">

            <!-- Breadcrumb -->
            <nav class="flex items-center gap-[8px] mb-[18px] text-[13px] text-ink-3">
                <a :style="crumbLink" @click="visit('home')">ראשי</a>
                <Icon name="arrow_left" :size="13" color="var(--ink-4)" />
                <a :style="crumbLink" @click="visit('articles')">מאמרים</a>
                <Icon name="arrow_left" :size="13" color="var(--ink-4)" />
                <span class="text-ink-2">{{ article.cat }}</span>
            </nav>

            <!-- HERO BANNER -->
            <div
                class="relative flex items-end min-h-[320px] overflow-hidden rounded-[16px] shadow-[0_18px_48px_-24px_rgba(31,46,29,0.5)]"
            >
                <div class="absolute inset-0">
                    <ItemCover kind="article" :item="article" />
                </div>
                <div
                    class="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,30,18,0.18)_0%,rgba(20,30,18,0.62)_62%,rgba(15,24,14,0.86)_100%)]"
                />
                <div class="article-hero relative w-full py-[40px] px-[44px] text-white">
                    <span
                        class="inline-block py-[4px] px-[12px] mb-[16px] text-[12px] font-semibold tracking-[0.04em] whitespace-nowrap bg-[rgba(255,255,255,0.16)] border border-[rgba(255,255,255,0.3)] rounded-[999px] backdrop-blur-[4px]"
                    >{{ article.cat }}</span>

                    <h1
                        class="max-w-[720px] m-0 mb-[16px] text-[34px] font-bold leading-[1.2] tracking-[-0.01em] text-balance [text-shadow:0_2px_18px_rgba(0,0,0,0.35)]"
                    >{{ article.title }}</h1>

                    <div class="flex items-center flex-wrap gap-[16px] text-[14px] text-[rgba(255,255,255,0.92)]">
                        <span class="inline-flex items-center gap-[8px]">
                            <span
                                class="inline-flex items-center justify-center w-[30px] h-[30px] text-[11px] font-bold bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.35)] rounded-[50%]"
                            >{{ article.initials }}</span>
                            <span>מאת: <strong class="font-semibold">{{ article.author }}</strong></span>
                            <span
                                v-if="article.credential"
                                class="font-latin text-[12px] opacity-85"
                                dir="ltr"
                            >{{ article.credential }}</span>
                        </span>
                        <span class="opacity-55">•</span>
                        <span class="num">{{ article.date }}</span>
                        <span class="opacity-55">•</span>
                        <span><span class="num">{{ article.readMin }}</span> דק׳ קריאה</span>
                    </div>
                </div>
            </div>

            <!-- Disclaimer pill -->
            <div
                class="flex items-center justify-center gap-[10px] max-w-[760px] mt-[26px] mx-auto mb-0 py-[11px] px-[18px] text-[13px] font-medium text-center text-[#9a352a] bg-[#fbeceb] border border-[#e7b9b4] rounded-[10px]"
            >
                <Icon name="alert" :size="16" color="#9a352a" />
                <span>{{ ARTICLE_DISCLAIMER }}</span>
            </div>

            <!-- BODY (.article-body keeps the global typography hooks) -->
            <article class="article-body max-w-[760px] mt-[36px] mx-auto mb-0">
                <p class="m-0 mb-[30px] text-[18px] leading-[1.7] font-normal text-ink">{{ article.lead }}</p>

                <section v-for="(s, i) in article.sections" :key="i" class="mb-[30px]">
                    <h2
                        v-if="s.h"
                        class="inline-block m-0 mb-[14px] pb-[8px] text-[21px] font-bold tracking-[-0.01em] text-ink border-b-2 border-b-accent-tint-strong"
                    >{{ s.h }}</h2>
                    <template v-if="s.p">
                        <p
                            v-for="(para, j) in s.p"
                            :key="j"
                            class="m-0 mb-[14px] text-[16px] leading-[1.78] text-ink-2"
                        >{{ para }}</p>
                    </template>
                    <ul v-if="s.list" class="mt-[8px] mx-0 mb-0 ps-0 list-none">
                        <li
                            v-for="(li, j) in s.list"
                            :key="j"
                            class="flex gap-[12px] mb-[11px] text-[16px] leading-[1.7] text-ink-2"
                        >
                            <span
                                class="flex-[0_0_auto] w-[7px] h-[7px] mt-[9px] bg-accent rounded-[50%]"
                            />
                            <span>{{ li }}</span>
                        </li>
                    </ul>
                </section>

                <!-- Author byline card -->
                <div
                    class="flex items-center gap-[16px] mt-[40px] p-[20px] bg-surface border border-line rounded-[12px]"
                >
                    <span
                        class="inline-flex items-center justify-center flex-[0_0_auto] w-[52px] h-[52px] text-[17px] font-bold text-accent-ink bg-accent-tint-strong rounded-[50%]"
                    >{{ article.initials }}</span>
                    <div>
                        <div class="text-[15px] font-bold text-ink">{{ article.author }}</div>
                        <div
                            v-if="article.credential"
                            class="font-latin text-[13px] text-ink-3"
                            dir="ltr"
                        >{{ article.credential }}</div>
                    </div>
                    <button
                        class="btn btn--ghost btn--sm ms-auto"
                        @click="visit('articles')"
                    >
                        <Icon name="arrow_right" :size="15" /> חזרה למאמרים
                    </button>
                </div>
            </article>
        </div>

        <!-- MORE ARTICLES — back to the articles area -->
        <div class="max-w-[1100px] mt-[64px] mx-auto mb-0 py-0 px-[24px]">
            <SectionHeader
                title="מאמרים נוספים"
                link-label="לכל המאמרים"
                @link-click="visit('articles')"
            />
            <div class="grid grid-cols-3 gap-[22px]">
                <ArticleCard v-for="a in others" :key="a.id" :article="a" />
            </div>
        </div>
    </div>
</template>
