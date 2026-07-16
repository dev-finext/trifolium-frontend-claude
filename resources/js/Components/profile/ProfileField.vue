<script>
// Module-scoped sequence for auto-generated ids (label↔input association).
let TF_PF_SEQ = 0;
</script>

<script setup>
// Labeled text input for the profile editor. Extra attributes (dir, style,
// autocomplete, inputmode…) fall through to the <input>, mirroring the
// prototype's `...rest` spread.
import { computed } from 'vue';
import FieldLabel from '@/Components/ui/FieldLabel.vue';
import ErrMsg from '@/Components/auth/ErrMsg.vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
    label: { type: String, required: true },
    modelValue: { type: String, default: '' },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    hint: { type: String, default: '' },
    required: { type: Boolean, default: false },
    error: { type: String, default: '' },
    id: { type: String, default: '' },
});

defineEmits(['update:modelValue']);

// Stable id per instance (setup runs once) for for/id + aria wiring.
const uid = props.id || `profile-field-${TF_PF_SEQ++}`;
const errorId = `${uid}-error`;
const describedBy = computed(() => (props.error ? errorId : undefined));
</script>

<template>
    <div>
        <FieldLabel :for="uid">
            {{ label }}<span v-if="required" aria-hidden="true" class="ms-[3px] text-danger">*</span>
        </FieldLabel>
        <input
            :id="uid"
            class="input"
            :type="type"
            :value="modelValue"
            :placeholder="placeholder"
            :required="required || undefined"
            :aria-required="required || undefined"
            :aria-invalid="error ? 'true' : undefined"
            :aria-describedby="describedBy"
            :class="error ? 'border-danger' : ''"
            v-bind="$attrs"
            @input="$emit('update:modelValue', $event.target.value)"
        />
        <ErrMsg v-if="error" :id="errorId" role="alert">{{ error }}</ErrMsg>
        <div v-if="hint && !error" class="small muted mt-[6px]">{{ hint }}</div>
    </div>
</template>
