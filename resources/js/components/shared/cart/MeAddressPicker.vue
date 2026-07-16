<script setup>
// "משלוח אליי" address picker — reads the practitioner's saved
// addresses (source of truth = profile / פרטים אישיים). Pre-selects
// the primary one; when more than one exists the practitioner can
// switch between them. The chosen address is shown read-only.
import { computed } from 'vue';
import AddressBlock from '@/components/shared/cart/AddressBlock.vue';
import AddrPickRow from '@/components/shared/cart/AddrPickRow.vue';
import FieldGroupLabel from '@/components/shared/cart/FieldGroupLabel.vue';
import Icon from '@/components/ui/Icon.vue';
import { tfPrimaryAddress } from '@/composables/useAddresses';
import { visit } from '@/lib/routes';

const props = defineProps({
    addresses: { type: Array, required: true },
    selectedId: { type: [String, Number], default: null },
});
const emit = defineEmits(['select']);

const selected = computed(
    () =>
        props.addresses.find((a) => a.id === props.selectedId) ||
        tfPrimaryAddress(props.addresses),
);
</script>

<template>
    <div>
        <div v-if="addresses.length > 1" class="mb-[14px]">
            <FieldGroupLabel>בחר/י כתובת למשלוח:</FieldGroupLabel>
            <div class="flex flex-col gap-[8px]">
                <AddrPickRow
                    v-for="a in addresses"
                    :key="a.id"
                    :addr="a"
                    :selected="!!selected && a.id === selected.id"
                    @select="emit('select', a.id)"
                />
            </div>
        </div>
        <AddressBlock v-if="selected" :addr="selected" read-only />
        <div
            class="mt-[10px] flex items-center gap-[8px] rounded-control bg-surface-sunk px-[12px] py-[9px] text-[12.5px] leading-[1.5] text-ink-3"
        >
            <Icon
                name="info"
                :size="14"
                color="var(--ink-4)"
                class="shrink-0"
            />
            <span>
                {{
                    addresses.length > 1
                        ? 'לעריכה או להוספת כתובות יש '
                        : 'לשינוי או להוספת כתובות יש '
                }}
                <a
                    href="#"
                    class="font-semibold text-accent-ink underline"
                    @click.prevent="visit('profile')"
                    >לערוך פרטים אישיים</a
                >.
            </span>
        </div>
    </div>
</template>
