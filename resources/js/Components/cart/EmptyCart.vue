<script setup>
// Empty-cart state — nudges toward the catalog or the compounding wizard.
import Icon from '@/Components/ui/Icon.vue';
import { visit } from '@/lib/routes';
</script>

<template>
    <div class="card" style="padding: 72px 24px; text-align: center; max-width: 520px; margin: 0 auto">
        <div
            :style="{
                width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 18px',
                background: 'var(--surface-sunk)', color: 'var(--ink-3)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }"
        >
            <Icon name="cart" :size="28" />
        </div>
        <div style="font-size: 18px; font-weight: 600; margin-bottom: 6px">הסל ריק</div>
        <p class="small muted" style="margin: 0 auto 22px; max-width: 320px">
            הוסף מוצרי מדף מוכנים או רקח פורמולה אישית כדי להתחיל הזמנה.
        </p>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap">
            <button class="btn btn--ghost" @click="visit('catalog')">
                <Icon name="package" :size="16" /> מוצרי מדף
            </button>
            <button class="btn btn--accent" @click="visit('compounding')">
                <Icon name="flask" :size="16" color="#fff" /> הכן פורמולה
            </button>
        </div>
    </div>
</template>
