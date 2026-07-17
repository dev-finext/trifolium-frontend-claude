<script setup>
// מאמר בודד — single article reader: breadcrumb, hero banner, disclaimer,
// long-form body, author byline card and a "more articles" strip.
// All articles share one cover image (rendered via ItemCover).
import { Head } from '@inertiajs/vue3';
import { computed } from 'vue';
import { ItemCover } from '@/components/shared/art';
import ArticleCard from '@/components/shared/home/ArticleCard.vue';
import SectionHeader from '@/components/shared/home/SectionHeader.vue';
import Icon from '@/components/ui/Icon.vue';
import { ARTICLES } from '@/data/mock';
import { visit } from '@/lib/routes';

const ARTICLE_DISCLAIMER =
    'מאמר זה אינו מהווה התוויות רפואיות ואינו מחליף ייעוץ רוקחי ו/או הוראות רופא';

// TODO(backend): a Laravel controller passing real `articles` wins over the mock.
const props = defineProps({
    id: { type: String, required: true },
    articles: { type: Array, default: () => ARTICLES },
});

// Fallback to the first article, exactly like the prototype.
const article = computed(
    () => props.articles.find((a) => a.id === props.id) || props.articles[0],
);
const others = computed(() =>
    props.articles.filter((a) => a.id !== article.value.id).slice(0, 3),
);

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
    <div class="bg-bg pb-[56px]">
        <div class="mx-auto my-0 max-w-[900px] px-[24px] pt-[24px] pb-0">
            <!-- Breadcrumb -->
            <nav
                class="mb-[18px] flex items-center gap-[8px] text-[13px] text-ink-3"
            >
                <a :style="crumbLink" @click="visit('home')">ראשי</a>
                <Icon name="arrow_left" :size="13" color="var(--ink-4)" />
                <a :style="crumbLink" @click="visit('articles')">מאמרים</a>
                <Icon name="arrow_left" :size="13" color="var(--ink-4)" />
                <span class="text-ink-2">{{ article.cat }}</span>
            </nav>

            <!-- HERO BANNER -->
            <div
                class="relative flex min-h-[320px] items-end overflow-hidden rounded-[16px] shadow-[0_18px_48px_-24px_rgba(31,46,29,0.5)]"
            >
                <div class="absolute inset-0">
                    <ItemCover kind="article" :item="article" />
                </div>
                <div
                    class="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,30,18,0.18)_0%,rgba(20,30,18,0.62)_62%,rgba(15,24,14,0.86)_100%)]"
                />
                <div
                    class="article-hero relative w-full px-[44px] py-[40px] text-white"
                >
                    <span
                        class="mb-[16px] inline-block rounded-[999px] border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.16)] px-[12px] py-[4px] text-[12px] font-semibold tracking-[0.04em] whitespace-nowrap backdrop-blur-[4px]"
                        >{{ article.cat }}</span
                    >

                    <h1
                        class="m-0 mb-[16px] max-w-[720px] text-[34px] leading-[1.2] font-bold tracking-[-0.01em] text-balance [text-shadow:0_2px_18px_rgba(0,0,0,0.35)]"
                    >
                        {{ article.title }}
                    </h1>

                    <div
                        class="flex flex-wrap items-center gap-[16px] text-[14px] text-[rgba(255,255,255,0.92)]"
                    >
                        <span class="inline-flex items-center gap-[8px]">
                            <span
                                class="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[50%] border border-[rgba(255,255,255,0.35)] bg-[rgba(255,255,255,0.2)] text-[11px] font-bold"
                                >{{ article.initials }}</span
                            >
                            <span
                                >מאת:
                                <strong class="font-semibold">{{
                                    article.author
                                }}</strong></span
                            >
                            <span
                                v-if="article.credential"
                                class="font-latin text-[12px] opacity-85"
                                dir="ltr"
                                >{{ article.credential }}</span
                            >
                        </span>
                        <span class="opacity-55">•</span>
                        <span class="num">{{ article.date }}</span>
                        <span class="opacity-55">•</span>
                        <span
                            ><span class="num">{{ article.readMin }}</span> דק׳
                            קריאה</span
                        >
                    </div>
                </div>
            </div>

            <!-- Disclaimer pill -->
            <div
                class="mx-auto mt-[26px] mb-0 flex max-w-[760px] items-center justify-center gap-[10px] rounded-[10px] border border-[#e7b9b4] bg-[#fbeceb] px-[18px] py-[11px] text-center text-[13px] font-medium text-[#9a352a]"
            >
                <Icon name="alert" :size="16" color="#9a352a" />
                <span>{{ ARTICLE_DISCLAIMER }}</span>
            </div>

            <!-- BODY (.article-body keeps the global typography hooks) -->
            <article class="article-body mx-auto mt-[36px] mb-0 max-w-[760px]">
                <p
                    class="m-0 mb-[30px] text-[18px] leading-[1.7] font-normal text-ink"
                >
                    {{ article.lead }}
                </p>

                <section
                    v-for="(section, index) in article.sections"
                    :key="index"
                    class="mb-[30px]"
                >
                    <h2
                        v-if="section.h"
                        class="m-0 mb-[14px] inline-block border-b-2 border-b-accent-tint-strong pb-[8px] text-[21px] font-bold tracking-[-0.01em] text-ink"
                    >
                        {{ section.h }}
                    </h2>
                    <template v-if="section.p">
                        <p
                            v-for="(para, paraIndex) in section.p"
                            :key="paraIndex"
                            class="m-0 mb-[14px] text-[16px] leading-[1.78] text-ink-2"
                        >
                            {{ para }}
                        </p>
                    </template>
                    <ul
                        v-if="section.list"
                        class="mx-0 mt-[8px] mb-0 list-none ps-0"
                    >
                        <li
                            v-for="(item, itemIndex) in section.list"
                            :key="itemIndex"
                            class="mb-[11px] flex gap-[12px] text-[16px] leading-[1.7] text-ink-2"
                        >
                            <span
                                class="mt-[9px] h-[7px] w-[7px] flex-[0_0_auto] rounded-[50%] bg-accent"
                            />
                            <span>{{ item }}</span>
                        </li>
                    </ul>
                </section>

                <!-- Author byline card -->
                <div
                    class="mt-[40px] flex items-center gap-[16px] rounded-[12px] border border-line bg-surface p-[20px]"
                >
                    <span
                        class="inline-flex h-[52px] w-[52px] flex-[0_0_auto] items-center justify-center rounded-[50%] bg-accent-tint-strong text-[17px] font-bold text-accent-ink"
                        >{{ article.initials }}</span
                    >
                    <div>
                        <div class="text-[15px] font-bold text-ink">
                            {{ article.author }}
                        </div>
                        <div
                            v-if="article.credential"
                            class="font-latin text-[13px] text-ink-3"
                            dir="ltr"
                        >
                            {{ article.credential }}
                        </div>
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
        <div class="mx-auto mt-[64px] mb-0 max-w-[1100px] px-[24px] py-0">
            <SectionHeader
                title="מאמרים נוספים"
                link-label="לכל המאמרים"
                @link-click="visit('articles')"
            />
            <div class="grid grid-cols-3 gap-[22px]">
                <ArticleCard
                    v-for="article in others"
                    :key="article.id"
                    :article="article"
                />
            </div>
        </div>
    </div>
</template>
