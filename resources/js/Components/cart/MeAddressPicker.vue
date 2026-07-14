<script setup>
// "משלוח אליי" address picker — reads the practitioner's saved
// addresses (source of truth = profile / פרטים אישיים). Pre-selects
// the primary one; when more than one exists the practitioner can
// switch between them. The chosen address is shown read-only.
import { computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import { tfPrimaryAddress } from '@/composables/useAddresses';
import { visit } from '@/lib/routes';
import AddrPickRow from '@/Components/cart/AddrPickRow.vue';
import AddressBlock from '@/Components/cart/AddressBlock.vue';
import FieldGroupLabel from '@/Components/cart/FieldGroupLabel.vue';

const props = defineProps({
    addresses: { type: Array, required: true },
    selectedId: { type: [String, Number], default: null },
});
const emit = defineEmits(['select']);

const selected = computed(() => (
    props.addresses.find((a) => a.id === props.selectedId) || tfPrimaryAddress(props.addresses)
));
</script>

<template>
    <div>
        <div v-if="addresses.length > 1" style="margin-bottom: 14px">
            <FieldGroupLabel>בחר/י כתובת למשלוח:</FieldGroupLabel>
            <div style="display: flex; flex-direction: column; gap: 8px">
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
            :style="{
                marginTop: '10px', padding: '9px 12px', borderRadius: 'var(--r-control)',
                background: 'var(--surface-sunk)', display: 'flex', alignItems: 'center',
                gap: '8px', fontSize: '12.5px', lineHeight: 1.5, color: 'var(--ink-3)',
            }"
        >
            <Icon name="info" :size="14" color="var(--ink-4)" :style="{ flexShrink: 0 }" />
            <span>
                {{ addresses.length > 1 ? 'לעריכה או להוספת כתובות יש ' : 'לשינוי או להוספת כתובות יש ' }}
                <a
                    href="#"
                    style="color: var(--accent-ink); font-weight: 600; text-decoration: underline"
                    @click.prevent="visit('profile')"
                >לערוך פרטים אישיים</a>.
            </span>
        </div>
    </div>
</template>
