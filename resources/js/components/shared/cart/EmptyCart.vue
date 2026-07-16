<script setup>
// Empty-cart state — nudges toward the catalog or the compounding wizard.
import Icon from '@/components/ui/Icon.vue';
import { visit } from '@/lib/routes';
</script>

<template>
    <div
        class="card mx-auto my-0 max-w-[520px] px-[24px] py-[72px] text-center"
    >
        <div
            class="mx-auto mt-0 mb-[18px] inline-flex h-[64px] w-[64px] items-center justify-center rounded-[50%] bg-surface-sunk text-ink-3"
        >
            <Icon name="cart" :size="28" />
        </div>
        <div class="mb-[6px] text-[18px] font-semibold">הסל ריק</div>
        <p class="small muted mx-auto mt-0 mb-[22px] max-w-[320px]">
            הוסף מוצרי מדף מוכנים או רקח פורמולה אישית כדי להתחיל הזמנה.
        </p>
        <div class="flex flex-wrap justify-center gap-[10px]">
            <button class="btn btn--ghost" @click="visit('catalog')">
                <Icon name="package" :size="16" /> מוצרי מדף
            </button>
            <button class="btn btn--accent" @click="visit('compounding')">
                <Icon name="flask" :size="16" color="#fff" /> הכן פורמולה
            </button>
        </div>
    </div>
</template>
