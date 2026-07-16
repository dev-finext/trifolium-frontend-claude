<script setup>
// Courier-authorization checkbox row + "form signed" confirmation strip.
import Icon from '@/components/ui/Icon.vue';

defineProps({
    checked: { type: Boolean, default: false },
    signedName: { type: String, default: '' },
});
const emit = defineEmits(['toggle', 'view']);
</script>

<template>
    <div class="mb-[16px]">
        <label
            class="flex cursor-pointer items-start gap-[10px]"
            @click="emit('toggle')"
        >
            <span
                class="mt-[1px] inline-flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[6px] border-[1.5px] transition-all duration-[120ms]"
                :class="
                    checked
                        ? 'border-accent bg-accent'
                        : 'border-line-strong bg-white'
                "
            >
                <Icon
                    v-if="checked"
                    name="check"
                    :size="13"
                    color="#fff"
                    :stroke="2.6"
                />
            </span>
            <span class="text-[13.5px] leading-[1.5] text-ink">
                אני מאשר/ת קבלת תכשירים באמצעות שליח
            </span>
        </label>
        <div
            v-if="checked"
            class="ms-[30px] mt-[8px] flex items-center justify-between gap-[10px] rounded-control bg-accent-tint px-[11px] py-[8px] text-[12px] text-accent-ink"
        >
            <span class="inline-flex items-center gap-[6px]">
                <Icon name="check" :size="13" color="var(--accent)" /> טופס
                ייפוי הכוח נחתם{{ signedName ? ' · ' + signedName : '' }}
            </span>
            <a
                href="#"
                class="font-semibold text-accent-ink underline"
                @click.prevent="emit('view')"
                >צפייה</a
            >
        </div>
    </div>
</template>
