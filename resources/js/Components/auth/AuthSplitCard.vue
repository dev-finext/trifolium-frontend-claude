<script setup>
// Shared split card (form side + brand panel) — matches Login chrome,
// reused by the password-recovery screens. Default slot fills the form side.
import AuthBg from '@/Components/auth/AuthBg.vue';
import Brandmark from '@/Components/auth/Brandmark.vue';

defineProps({
    maxWidth: { type: Number, default: 920 },
});
</script>

<template>
    <div
        :style="{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px', background: 'var(--bg)', position: 'relative',
        }"
    >
        <AuthBg />
        <div
            class="card"
            :style="{
                position: 'relative', zIndex: 1,
                width: '100%', maxWidth: `${maxWidth}px`, display: 'grid', gridTemplateColumns: '1.05fr 0.95fr',
                boxShadow: '0 1px 2px rgba(31,46,29,0.06), 0 24px 70px rgba(20,32,18,0.30)',
            }"
        >
            <div style="padding: 46px 48px 44px"><slot /></div>
            <div
                :style="{
                    background: 'var(--accent)', color: '#fff',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '18px', padding: '48px 36px', textAlign: 'center',
                }"
            >
                <Brandmark tone="light" :height="108" />
                <div :style="{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.3)' }" />
                <p :style="{ margin: 0, fontSize: '15px', fontWeight: 400, color: 'rgba(255,255,255,0.86)', letterSpacing: '0.02em' }">
                    בית מרקחת לצמחי מרפא
                </p>
            </div>
        </div>
    </div>
</template>
