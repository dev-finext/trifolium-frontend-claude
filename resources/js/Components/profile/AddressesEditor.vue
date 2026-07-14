<script>
// Unique-enough id generator for newly added address cards (module scope so
// the sequence survives re-renders and multiple editor instances).
let TF_ADDR_SEQ = 0;
const tfNewAddrId = () => `addr-${Date.now()}-${TF_ADDR_SEQ++}`;
</script>

<script setup>
// Multi-address editor — the practitioner can keep several shipping
// addresses (clinic, home, …). One is marked primary (ברירת מחדל),
// which is what the cart pre-selects for "משלוח אליי".
// Emits `update:list` with the full next list (usable as v-model:list).
import Icon from '@/Components/ui/Icon.vue';
import AddressCardEditor from '@/Components/profile/AddressCardEditor.vue';

const props = defineProps({
    list: { type: Array, required: true },
});

const emit = defineEmits(['update:list']);

const update = (id, next) => emit('update:list', props.list.map(a => (a.id === id ? next : a)));
const makePrimary = (id) => emit('update:list', props.list.map(a => ({ ...a, primary: a.id === id })));
const remove = (id) => {
    const removingPrimary = props.list.find(a => a.id === id)?.primary;
    const next = props.list.filter(a => a.id !== id);
    if (removingPrimary && next.length && !next.some(a => a.primary)) next[0] = { ...next[0], primary: true };
    emit('update:list', next);
};
const add = () => emit('update:list', [...props.list, {
    id: tfNewAddrId(), label: '', name: '', street: '', city: '', zip: '', phone: '',
    primary: props.list.length === 0,
}]);
</script>

<template>
    <div style="display: flex; flex-direction: column; gap: 14px">
        <AddressCardEditor
            v-for="(a, i) in list"
            :key="a.id"
            :addr="a"
            :index="i"
            :is-primary="!!a.primary"
            :can-delete="list.length > 1"
            @change="(next) => update(a.id, next)"
            @make-primary="makePrimary(a.id)"
            @delete="remove(a.id)"
        />
        <button class="btn btn--ghost" style="align-self: flex-start" @click="add">
            <Icon name="plus" :size="16" /> הוסף כתובת
        </button>
    </div>
</template>
