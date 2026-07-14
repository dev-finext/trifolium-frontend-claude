<script setup>
// A3 בקשה נשלחה — registration submitted / pending manual review.
import { Head } from '@inertiajs/vue3';
import Icon from '@/Components/ui/Icon.vue';
import AuthBg from '@/Components/auth/AuthBg.vue';
import { visit } from '@/lib/routes';
</script>

<template>
    <Head title="בקשה נשלחה" />
    <div
        data-screen-label="A3 בקשה נשלחה"
        :style="{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px', background: 'var(--bg)', position: 'relative',
        }"
    >
        <AuthBg />
        <div
            class="card"
            :style="{
                position: 'relative', zIndex: 1, width: '100%', maxWidth: '460px',
                padding: '44px 40px 40px', textAlign: 'center',
                boxShadow: '0 1px 2px rgba(31,46,29,0.06), 0 24px 70px rgba(20,32,18,0.30)',
            }"
        >
            <div
                :style="{
                    width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 22px',
                    background: 'var(--accent-tint)', border: '1px solid var(--accent-tint-strong)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }"
            >
                <Icon name="check" :size="34" color="var(--accent)" :stroke="2.4" />
            </div>
            <h1 :style="{ margin: '0 0 12px', fontSize: '22px', fontWeight: 600 }">הבקשה נשלחה לאישור</h1>
            <p :style="{ margin: '0 0 28px', fontSize: '14.5px', lineHeight: 1.7, color: 'var(--ink-3)', textWrap: 'pretty' }">
                פרטיך התקבלו ועוברים בדיקה ידנית של צוות בית המרקחת. נעדכן אותך במייל ברגע שהחשבון יאושר, או אם נצטרך פרטים נוספים.
            </p>
            <button class="btn btn--ghost" style="min-width: 160px" @click="visit('login')">
                חזרה לכניסה
            </button>
        </div>
    </div>
</template>
