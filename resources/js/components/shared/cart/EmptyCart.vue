<script setup>
// Empty-cart state — nudges toward the catalog or the compounding wizard.
import Icon from '@/components/ui/Icon.vue';
import { visit } from '@/lib/routes';
</script>

<template>
    <div class="card max-w-[520px] my-0 mx-auto px-[24px] py-[72px] text-center">
        <div
            class="inline-flex items-center justify-center w-[64px] h-[64px] mt-0 mx-auto mb-[18px] text-ink-3 bg-surface-sunk rounded-[50%]"
        >
            <Icon name="cart" :size="28" />
        </div>
        <div class="mb-[6px] text-[18px] font-semibold">הסל ריק</div>
        <p class="small muted max-w-[320px] mt-0 mx-auto mb-[22px]">
            הוסף מוצרי מדף מוכנים או רקח פורמולה אישית כדי להתחיל הזמנה.
        </p>
        <div class="flex gap-[10px] justify-center flex-wrap">
            <button class="btn btn--ghost" @click="visit('catalog')">
                <Icon name="package" :size="16" /> מוצרי מדף
            </button>
            <button class="btn btn--accent" @click="visit('compounding')">
                <Icon name="flask" :size="16" color="#fff" /> הכן פורמולה
            </button>
        </div>
    </div>
</template>
