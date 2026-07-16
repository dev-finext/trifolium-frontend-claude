<script setup>
// Wizard Step 5 — Confirmation. Two paths: Order (with patient) or Save (no
// patient). A local `submitted` flag swaps to the success screen (kept for
// parity with the prototype; neither path triggers it in this build).
import { ref } from 'vue';
import OrderPath from '@/components/shared/wizard/OrderPath.vue';
import SavePath from '@/components/shared/wizard/SavePath.vue';
import SuccessScreen from '@/components/shared/wizard/SuccessScreen.vue';

defineProps({
    formula: { type: Object, required: true },
    patientLabel: { type: String, default: null },
    noPatient: { type: Boolean, default: false },
    patientOnMeds: { type: Boolean, default: false },
    patientMeds: { type: String, default: '' },
});

// `patch` mirrors the prototype's setF; `back` mirrors onBack.
const emit = defineEmits(['patch', 'back']);

const submitted = ref(false);
const order = ref(null);

function onOrderSubmit(o) {
    order.value = o;
    submitted.value = true;
}
function onSaveSubmit() {
    submitted.value = true;
}
</script>

<template>
    <SuccessScreen
        v-if="submitted"
        :no-patient="noPatient"
        :patient-label="patientLabel"
        :formula-name="formula.name"
        :order="order"
    />

    <SavePath
        v-else-if="noPatient"
        :formula="formula"
        @back="emit('back')"
        @submit="onSaveSubmit"
    />

    <OrderPath
        v-else
        :formula="formula"
        :patient-label="patientLabel"
        :patient-on-meds="patientOnMeds"
        :patient-meds="patientMeds"
        @patch="emit('patch', $event)"
        @back="emit('back')"
        @submit="onOrderSubmit"
    />
</template>
