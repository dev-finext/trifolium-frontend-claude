<script setup>
// Tutorial Videos section + lightbox modal.
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import SectionHeader from '@/components/shared/home/SectionHeader.vue';
import VideoCard from '@/components/shared/home/VideoCard.vue';
import VideoLightbox from '@/components/shared/home/VideoLightbox.vue';
import { VIDEOS } from '@/data/mock';

const props = defineProps({
    videos: { type: Array, default: () => VIDEOS },
});

const open = ref(null);

// Show 3 cards (per spec — "3 video cards"). Use first 3.
const cards = computed(() => props.videos.slice(0, 3));

// Escape closes the lightbox — listener bound only while it is open,
// mirroring the prototype's effect.
const onKey = (e) => {
    if (e.key === 'Escape') {
        open.value = null;
    }
};
watch(open, (v) => {
    if (v) {
        window.addEventListener('keydown', onKey);
    } else {
        window.removeEventListener('keydown', onKey);
    }
});
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
    <section
        class="border-t border-t-line bg-surface-sunk px-[24px] pt-[56px] pb-[72px]"
    >
        <div class="mx-auto my-0 max-w-[1200px]">
            <SectionHeader
                title="סרטוני הדרכה"
                subtitle="למד כיצד להשתמש במערכת בצעדים פשוטים"
                link-label="לכל הסרטונים"
            />
            <div class="grid grid-cols-3 gap-[20px]">
                <VideoCard
                    v-for="(v, i) in cards"
                    :key="v.id"
                    :video="v"
                    :index="i"
                    @play="open = v"
                />
            </div>
        </div>
        <VideoLightbox v-if="open" :video="open" @close="open = null" />
    </section>
</template>
