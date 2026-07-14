<script setup>
// File / image dropzone. v-model holds `{ name, url }` (url only for image
// previews via createObjectURL) or null when empty.
// TODO(backend): actual upload happens on form submit once an endpoint exists;
// for now the file stays client-side only.
import { computed, ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

const props = defineProps({
    modelValue: { type: Object, default: null },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    kind: { type: String, default: 'file' }, // 'file' | 'image'
});

const emit = defineEmits(['update:modelValue']);

const inputRef = ref(null);
const drag = ref(false);

const accept = computed(() => (props.kind === 'image' ? 'image/*' : '.pdf,.jpg,.jpeg,.png'));

function pick(file) {
    if (!file) return;
    emit('update:modelValue', {
        name: file.name,
        url: props.kind === 'image' && file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    });
}

function onDrop(e) {
    drag.value = false;
    pick(e.dataTransfer.files[0]);
}

function openPicker() {
    if (inputRef.value) inputRef.value.click();
}
</script>

<template>
    <div>
        <label v-if="label" class="field-label">{{ label }}</label>
        <input
            ref="inputRef" type="file" :accept="accept" style="display: none"
            @change="pick($event.target.files[0])"
        />
        <!-- Picked-file chip -->
        <div
            v-if="modelValue"
            :style="{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                border: '1px solid var(--line)', borderRadius: 'var(--r-control)',
                background: 'var(--surface)',
            }"
        >
            <img
                v-if="modelValue.url"
                :src="modelValue.url" alt=""
                :style="{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }"
            />
            <span
                v-else
                :style="{
                    width: '36px', height: '36px', borderRadius: '6px', flexShrink: 0,
                    background: 'var(--accent-tint)', display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center',
                }"
            ><Icon :name="kind === 'image' ? 'image' : 'file_text'" :size="17" color="var(--accent)" /></span>
            <span :style="{ flex: 1, minWidth: 0, fontSize: '13.5px', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">
                {{ modelValue.name }}
            </span>
            <button
                type="button" class="btn--icon" aria-label="הסר קובץ"
                :style="{ width: '30px', height: '30px', border: '1px solid transparent', borderRadius: '6px', background: 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }"
                @click="emit('update:modelValue', null)"
            ><Icon name="x" :size="15" color="var(--ink-3)" /></button>
        </div>
        <!-- Empty dropzone -->
        <div
            v-else
            role="button" tabindex="0"
            :style="{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '8px', padding: kind === 'image' ? '26px 16px' : '22px 16px', textAlign: 'center',
                border: '1.5px dashed ' + (drag ? 'var(--accent)' : 'var(--line-strong)'),
                borderRadius: 'var(--r-control)',
                background: drag ? 'var(--accent-tint)' : 'var(--surface-sunk)',
                color: 'var(--ink-3)', cursor: 'pointer', transition: 'all .15s',
            }"
            @click="openPicker"
            @keydown.enter.prevent="openPicker"
            @keydown.space.prevent="openPicker"
            @dragover.prevent="drag = true"
            @dragleave="drag = false"
            @drop.prevent="onDrop"
        >
            <Icon :name="kind === 'image' ? 'image' : 'upload'" :size="22" :color="drag ? 'var(--accent)' : 'var(--ink-4)'" :stroke="1.6" />
            <span style="font-size: 13px">{{ placeholder }}</span>
            <span style="font-size: 11.5px; color: var(--ink-4)">
                {{ kind === 'image' ? 'PNG · JPG · עד 5MB' : 'PDF · JPG · PNG · עד 10MB' }}
            </span>
        </div>
    </div>
</template>
