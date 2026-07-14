<script setup>
// Video lightbox modal — dark scrim, simulated 16:9 player, meta below.
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    video: { type: Object, required: true },
});
const emit = defineEmits(['close']);
</script>

<template>
    <div
        :style="{
            position: 'fixed', inset: 0,
            background: 'rgba(10,9,7,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200,
            padding: '24px',
            animation: 'tf-fade-in .2s ease',
        }"
        @click="emit('close')"
    >
        <div
            :style="{
                width: '100%',
                maxWidth: '1000px',
                background: '#0e0e0c',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
            }"
            @click.stop
        >
            <!-- Close -->
            <button
                title="סגור (Esc)"
                :style="{
                    position: 'absolute', top: '16px', left: '16px',
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    backdropFilter: 'blur(8px)',
                }"
                @click="emit('close')"
            >
                <Icon name="x" :size="18" color="#fff" />
            </button>

            <!-- "Video" — simulated player -->
            <div
                :style="{
                    aspectRatio: '16 / 9',
                    background: 'linear-gradient(135deg, #2a3a3e 0%, #4a5d52 100%)',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }"
            >
                <div
                    :style="{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'repeating-linear-gradient(115deg, transparent 0, transparent 16px, rgba(255,255,255,0.04) 16px, rgba(255,255,255,0.04) 17px)',
                    }"
                />
                <div
                    :style="{
                        width: '72px', height: '72px',
                        borderRadius: '50%',
                        background: '#fff',
                        color: 'var(--ink)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingRight: '6px',
                        cursor: 'pointer',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 4l14 8-14 8V4z" />
                    </svg>
                </div>

                <!-- Progress bar -->
                <div
                    :style="{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        padding: '16px 20px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                    }"
                >
                    <div style="height: 3px; background: rgba(255,255,255,0.2); border-radius: 999px; overflow: hidden">
                        <div style="width: 0%; height: 100%; background: #fff" />
                    </div>
                    <div
                        :style="{
                            display: 'flex', justifyContent: 'space-between',
                            color: 'rgba(255,255,255,0.85)',
                            fontFamily: 'var(--font-latin)',
                            fontSize: '12px', marginTop: '8px',
                        }"
                    >
                        <span>0:00</span>
                        <span>{{ video.duration }}</span>
                    </div>
                </div>
            </div>

            <!-- Meta below -->
            <div style="padding: 24px; color: #e8e6e0; direction: rtl">
                <div
                    :style="{
                        fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
                        color: '#a8c79e', fontWeight: 600, marginBottom: '8px',
                        fontFamily: 'var(--font-latin)',
                    }"
                >{{ video.chapter }}</div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 6px">{{ video.title }}</div>
                <div style="font-size: 13px; color: #a8a89c; line-height: 1.5">{{ video.desc }}</div>
            </div>
        </div>
    </div>
</template>

<style>
@keyframes tf-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
