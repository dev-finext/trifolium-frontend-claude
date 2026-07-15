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
    <div style="background: var(--bg); padding-bottom: 56px">
        <div style="max-width: 900px; margin: 0 auto; padding: 24px 24px 0">

            <!-- Breadcrumb -->
            <nav style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink-3); margin-bottom: 18px">
                <a :style="crumbLink" @click="visit('home')">ראשי</a>
                <Icon name="arrow_left" :size="13" color="var(--ink-4)" />
                <a :style="crumbLink" @click="visit('articles')">מאמרים</a>
                <Icon name="arrow_left" :size="13" color="var(--ink-4)" />
                <span style="color: var(--ink-2)">{{ article.cat }}</span>
            </nav>

            <!-- HERO BANNER -->
            <div
                :style="{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    minHeight: '320px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    boxShadow: '0 18px 48px -24px rgba(31,46,29,0.5)',
                }"
            >
                <div style="position: absolute; inset: 0">
                    <ItemCover kind="article" :item="article" />
                </div>
                <div
                    :style="{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(180deg, rgba(20,30,18,0.18) 0%, rgba(20,30,18,0.62) 62%, rgba(15,24,14,0.86) 100%)',
                    }"
                />
                <div class="article-hero" style="position: relative; padding: 40px 44px; color: #fff; width: 100%">
                    <span
                        :style="{
                            display: 'inline-block',
                            background: 'rgba(255,255,255,0.16)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            backdropFilter: 'blur(4px)',
                            padding: '4px 12px', borderRadius: '999px',
                            fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em',
                            marginBottom: '16px',
                            whiteSpace: 'nowrap',
                        }"
                    >{{ article.cat }}</span>

                    <h1
                        :style="{
                            margin: '0 0 16px',
                            fontSize: '34px',
                            fontWeight: 700,
                            lineHeight: 1.2,
                            letterSpacing: '-0.01em',
                            textWrap: 'balance',
                            maxWidth: '720px',
                            textShadow: '0 2px 18px rgba(0,0,0,0.35)',
                        }"
                    >{{ article.title }}</h1>

                    <div style="display: flex; align-items: center; gap: 16px; font-size: 14px; color: rgba(255,255,255,0.92); flex-wrap: wrap">
                        <span style="display: inline-flex; align-items: center; gap: 8px">
                            <span
                                :style="{
                                    width: '30px', height: '30px', borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.2)',
                                    border: '1px solid rgba(255,255,255,0.35)',
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '11px', fontWeight: 700,
                                }"
                            >{{ article.initials }}</span>
                            <span>מאת: <strong style="font-weight: 600">{{ article.author }}</strong></span>
                            <span
                                v-if="article.credential"
                                style="font-family: var(--font-latin); font-size: 12px; opacity: 0.85"
                                dir="ltr"
                            >{{ article.credential }}</span>
                        </span>
                        <span style="opacity: 0.55">•</span>
                        <span class="num">{{ article.date }}</span>
                        <span style="opacity: 0.55">•</span>
                        <span><span class="num">{{ article.readMin }}</span> דק׳ קריאה</span>
                    </div>
                </div>
            </div>

            <!-- Disclaimer pill -->
            <div
                :style="{
                    margin: '26px auto 0',
                    maxWidth: '760px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    background: '#fbeceb',
                    border: '1px solid #e7b9b4',
                    color: '#9a352a',
                    borderRadius: '10px',
                    padding: '11px 18px',
                    fontSize: '13px',
                    fontWeight: 500,
                    textAlign: 'center',
                }"
            >
                <Icon name="alert" :size="16" color="#9a352a" />
                <span>{{ ARTICLE_DISCLAIMER }}</span>
            </div>

            <!-- BODY (.article-body keeps the global typography hooks) -->
            <article class="article-body" style="max-width: 760px; margin: 36px auto 0">
                <p style="font-size: 18px; line-height: 1.7; color: var(--ink); font-weight: 400; margin: 0 0 30px">{{ article.lead }}</p>

                <section v-for="(s, i) in article.sections" :key="i" style="margin-bottom: 30px">
                    <h2
                        v-if="s.h"
                        :style="{
                            fontSize: '21px',
                            fontWeight: 700,
                            color: 'var(--ink)',
                            letterSpacing: '-0.01em',
                            margin: '0 0 14px',
                            paddingBottom: '8px',
                            borderBottom: '2px solid var(--accent-tint-strong)',
                            display: 'inline-block',
                        }"
                    >{{ s.h }}</h2>
                    <template v-if="s.p">
                        <p
                            v-for="(para, j) in s.p"
                            :key="j"
                            style="font-size: 16px; line-height: 1.78; color: var(--ink-2); margin: 0 0 14px"
                        >{{ para }}</p>
                    </template>
                    <ul v-if="s.list" style="margin: 8px 0 0; padding-inline-start: 0; list-style: none">
                        <li
                            v-for="(li, j) in s.list"
                            :key="j"
                            style="display: flex; gap: 12px; font-size: 16px; line-height: 1.7; color: var(--ink-2); margin-bottom: 11px"
                        >
                            <span
                                :style="{
                                    flex: '0 0 auto',
                                    marginTop: '9px',
                                    width: '7px', height: '7px', borderRadius: '50%',
                                    background: 'var(--accent)',
                                }"
                            />
                            <span>{{ li }}</span>
                        </li>
                    </ul>
                </section>

                <!-- Author byline card -->
                <div
                    :style="{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        background: 'var(--surface)',
                        border: '1px solid var(--line)',
                        borderRadius: '12px',
                        padding: '20px',
                        marginTop: '40px',
                    }"
                >
                    <span
                        :style="{
                            width: '52px', height: '52px', borderRadius: '50%',
                            background: 'var(--accent-tint-strong)',
                            color: 'var(--accent-ink)',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '17px', fontWeight: 700, flex: '0 0 auto',
                        }"
                    >{{ article.initials }}</span>
                    <div>
                        <div style="font-size: 15px; font-weight: 700; color: var(--ink)">{{ article.author }}</div>
                        <div
                            v-if="article.credential"
                            style="font-size: 13px; color: var(--ink-3); font-family: var(--font-latin)"
                            dir="ltr"
                        >{{ article.credential }}</div>
                    </div>
                    <button
                        class="btn btn--ghost btn--sm"
                        style="margin-inline-start: auto"
                        @click="visit('articles')"
                    >
                        <Icon name="arrow_right" :size="15" /> חזרה למאמרים
                    </button>
                </div>
            </article>
        </div>

        <!-- MORE ARTICLES — back to the articles area -->
        <div style="max-width: 1100px; margin: 64px auto 0; padding: 0 24px">
            <SectionHeader
                title="מאמרים נוספים"
                link-label="לכל המאמרים"
                @link-click="visit('articles')"
            />
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px">
                <ArticleCard v-for="a in others" :key="a.id" :article="a" />
            </div>
        </div>
    </div>
</template>
