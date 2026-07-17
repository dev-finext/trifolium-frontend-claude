<script setup>
// TutorialVideo — the short feature-explainer control chosen from the
// icon+popup document:
//   • Trigger = "Play עם פעימה" (icon 7): a green play button with a pulsing
//     attention ring that stops once the clip has been opened (per-video,
//     remembered in localStorage).
//   • Popup = the 3+4 hybrid: on desktop a floating mini-player in the corner
//     (never blocks the screen) carrying option 3's content — the title and a
//     "מה תראו בסרטון" step list — on a white surface under the video. On
//     phones it always opens as a full, centered modal instead.
// The video area is a placeholder until real clips are supplied; pass `src`
// (an MP4 URL) or an embed later.
import { computed, onMounted, ref } from 'vue';
import { useIsMobile } from '@/composables/useIsMobile';
import { useModal } from '@/composables/useModal';

const props = defineProps({
    /** Stable id — drives the "already viewed" (pulse-off) memory. */
    videoId: { type: String, required: true },
    title: { type: String, required: true },
    /** "מה תראו בסרטון" — array of short step strings. */
    steps: { type: Array, default: () => [] },
    duration: { type: String, default: '' },
    /** Optional MP4 URL; omitted → placeholder surface. */
    src: { type: String, default: '' },
    /** Accessible label for the trigger button. */
    label: { type: String, default: 'סרטון הדרכה' },
});

const isMobile = useIsMobile();
const open = ref(false);
const expanded = ref(false); // desktop: maximised from mini → full modal

const STORAGE_KEY = 'tf:tutorial-viewed';
const viewed = ref(false);
onMounted(() => {
    try {
        const seen = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        viewed.value = !!seen[props.videoId];
    } catch {
        /* private mode — pulse simply keeps showing */
    }
});

// Modal form: always on phones; on desktop only when the user maximises.
const asModal = computed(
    () => open.value && (isMobile.value || expanded.value),
);
const asMini = computed(() => open.value && !isMobile.value && !expanded.value);

// useModal gives the phone/expanded modal Escape + focus-trap semantics.
const { dialogRef } = useModal(() => close());

function markViewed() {
    if (viewed.value) {
        return;
    }

    viewed.value = true;

    try {
        const seen = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        seen[props.videoId] = 1;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
    } catch {
        /* ignore */
    }
}

function openVideo() {
    open.value = true;
    markViewed();
}

function close() {
    open.value = false;
    expanded.value = false;
}
</script>

<template>
    <!-- Single root so a consumer's fallthrough `class` lands on a real node
         (the Teleport renders elsewhere) and the trigger stays a compact
         inline item, immune to row rules that target a bare `> button`. -->
    <span class="tv-root inline-flex align-middle">
        <!-- Trigger — icon 7 (pulsing play). The ring only shows until first view. -->
        <button
            type="button"
            class="tv-trigger relative inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[50%] border-none bg-accent p-0 text-white"
            :class="{ 'tv-trigger--new': !viewed }"
            :aria-label="label"
            @click.stop="openVideo"
        >
            <svg
                width="9"
                height="9"
                viewBox="0 0 10 12"
                fill="currentColor"
                aria-hidden="true"
            >
                <path
                    d="M1 1.2v9.6c0 .8.9 1.3 1.6.9l7-4.8c.6-.4.6-1.4 0-1.8l-7-4.8C1.9-.1 1 .4 1 1.2z"
                />
            </svg>
        </button>

        <!-- ── Desktop: floating mini-player (no scrim; never blocks the screen) ── -->
        <Teleport to="body">
            <div
                v-if="asMini"
                role="dialog"
                :aria-label="label"
                class="fixed start-[18px] bottom-[18px] z-[100] w-[320px] overflow-hidden rounded-[12px] border border-line bg-surface shadow-[0_18px_44px_-12px_rgba(20,28,24,0.4)]"
            >
                <div class="relative">
                    <video
                        v-if="src"
                        :src="src"
                        class="bg-black block aspect-video w-full object-cover"
                        controls
                        autoplay
                    />
                    <div v-else class="tv-vid">
                        <span class="tv-vid__play">
                            <svg
                                width="17"
                                height="17"
                                viewBox="0 0 10 12"
                                fill="currentColor"
                                class="ms-[2px]"
                            >
                                <path
                                    d="M1 1.2v9.6c0 .8.9 1.3 1.6.9l7-4.8c.6-.4.6-1.4 0-1.8l-7-4.8C1.9-.1 1 .4 1 1.2z"
                                />
                            </svg>
                        </span>
                        <span v-if="duration" class="tv-vid__dur num">{{
                            duration
                        }}</span>
                        <div class="tv-vid__bar"></div>
                    </div>
                    <!-- overlay controls -->
                    <div class="absolute end-[8px] top-[8px] flex gap-[4px]">
                        <button
                            type="button"
                            aria-label="הגדלה"
                            title="הגדלה"
                            class="tv-ov-btn"
                            @click="expanded = true"
                        >
                            <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.8"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path
                                    d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
                                />
                            </svg>
                        </button>
                        <button
                            type="button"
                            aria-label="סגירה"
                            class="tv-ov-btn"
                            @click="close"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <!-- option-3 content, on the white player surface -->
                <div class="p-[14px]">
                    <div class="text-[13.5px] font-bold text-ink">
                        {{ title }}
                    </div>
                    <template v-if="steps.length">
                        <div class="field-label mt-[10px] mb-[8px]">
                            מה תראו בסרטון
                        </div>
                        <ol class="tv-steps">
                            <li v-for="(s, i) in steps" :key="i">
                                <span class="tv-steps__n num">{{ i + 1 }}</span>
                                <span>{{ s }}</span>
                            </li>
                        </ol>
                    </template>
                </div>
            </div>

            <!-- ── Phones (and desktop "maximise"): full centered modal ── -->
            <div
                v-if="asModal"
                class="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(20,28,24,0.5)] p-[20px]"
                @click.self="close"
            >
                <div
                    ref="dialogRef"
                    role="dialog"
                    aria-modal="true"
                    :aria-label="label"
                    tabindex="-1"
                    class="w-[min(520px,100%)] overflow-hidden rounded-[12px] bg-surface shadow-[0_30px_80px_-20px_rgba(20,28,24,0.55)]"
                >
                    <div
                        class="flex items-center justify-between gap-[12px] border-b border-b-line px-[18px] py-[14px]"
                    >
                        <span
                            class="flex items-center gap-[9px] text-[15.5px] font-bold text-ink"
                        >
                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--accent)"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                aria-hidden="true"
                            >
                                <rect
                                    x="2"
                                    y="6"
                                    width="13"
                                    height="12"
                                    rx="2.5"
                                />
                                <path d="M15 10.5 21 7v10l-6-3.5" />
                            </svg>
                            {{ title }}
                        </span>
                        <button
                            type="button"
                            aria-label="סגירה"
                            class="inline-flex h-[32px] w-[32px] items-center justify-center rounded-[6px] border-none bg-transparent text-[16px] text-ink-3 hover:bg-surface-sunk"
                            @click="close"
                        >
                            ✕
                        </button>
                    </div>

                    <div class="p-[16px_18px]">
                        <video
                            v-if="src"
                            :src="src"
                            class="bg-black block aspect-video w-full rounded-[8px] object-cover"
                            controls
                            autoplay
                        />
                        <div v-else class="tv-vid rounded-[8px]">
                            <span class="tv-vid__play tv-vid__play--lg">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 10 12"
                                    fill="currentColor"
                                    class="ms-[2px]"
                                >
                                    <path
                                        d="M1 1.2v9.6c0 .8.9 1.3 1.6.9l7-4.8c.6-.4.6-1.4 0-1.8l-7-4.8C1.9-.1 1 .4 1 1.2z"
                                    />
                                </svg>
                            </span>
                            <span v-if="duration" class="tv-vid__dur num">{{
                                duration
                            }}</span>
                            <div class="tv-vid__bar"></div>
                        </div>

                        <template v-if="steps.length">
                            <div class="field-label mt-[16px] mb-[8px]">
                                מה תראו בסרטון
                            </div>
                            <ol class="tv-steps">
                                <li v-for="(s, i) in steps" :key="i">
                                    <span class="tv-steps__n num">{{
                                        i + 1
                                    }}</span>
                                    <span>{{ s }}</span>
                                </li>
                            </ol>
                        </template>
                    </div>
                </div>
            </div>
        </Teleport>
    </span>
</template>

<style scoped>
/* icon 7 — the pulsing "new feature" ring; drops once viewed / reduced-motion */
.tv-trigger {
    box-shadow: 0 2px 6px -2px rgba(42, 64, 40, 0.5);
    cursor: pointer;
}
.tv-trigger:hover {
    background: var(--accent-ink);
}
.tv-trigger--new::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid var(--accent);
    opacity: 0;
    animation: tv-ping 2.2s ease-out infinite;
}
@keyframes tv-ping {
    0% {
        transform: scale(0.7);
        opacity: 0.55;
    }
    70%,
    100% {
        transform: scale(1.25);
        opacity: 0;
    }
}
@media (prefers-reduced-motion: reduce) {
    .tv-trigger--new::after {
        animation: none;
    }
}

/* placeholder video surface (real clips replace it later) */
.tv-vid {
    position: relative;
    aspect-ratio: 16 / 9;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
        radial-gradient(
            90% 120% at 70% 20%,
            #dfe6d2 0%,
            rgba(223, 230, 210, 0) 60%
        ),
        linear-gradient(150deg, #eef2eb 0%, #dde6d9 55%, #cdd8c6 100%);
}
.tv-vid__play {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(61, 90, 58, 0.92);
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 26px -8px rgba(31, 46, 29, 0.5);
}
.tv-vid__play--lg {
    width: 58px;
    height: 58px;
}
.tv-vid__dur {
    position: absolute;
    bottom: 10px;
    inset-inline-end: 10px;
    background: rgba(31, 46, 29, 0.82);
    color: #f4f6ef;
    font-size: 11.5px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 999px;
}
.tv-vid__bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(31, 46, 29, 0.15);
}
.tv-vid__bar::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    inset-inline-start: 0;
    width: 34%;
    background: var(--accent);
}

/* overlay buttons on the mini-player video */
.tv-ov-btn {
    width: 26px;
    height: 26px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(31, 46, 29, 0.55);
    color: #f4f6ef;
    font-size: 13px;
}
.tv-ov-btn:hover {
    background: rgba(31, 46, 29, 0.78);
}

/* "מה תראו בסרטון" steps */
.tv-steps {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.tv-steps li {
    display: flex;
    gap: 10px;
    font-size: 13.5px;
    line-height: 1.5;
    color: var(--ink-2);
}
.tv-steps__n {
    flex: none;
    width: 21px;
    height: 21px;
    border-radius: 50%;
    background: var(--accent-tint);
    color: var(--accent-ink);
    font-size: 11.5px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
}
</style>
