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
            ref="inputRef" type="file" :accept="accept" class="hidden"
            @change="pick($event.target.files[0])"
        />
        <!-- Picked-file chip -->
        <div
            v-if="modelValue"
            class="flex items-center gap-[12px] px-[12px] py-[10px] bg-surface border border-line rounded-control"
        >
            <img
                v-if="modelValue.url"
                :src="modelValue.url" alt=""
                class="w-[40px] h-[40px] shrink-0 object-cover rounded-[6px]"
            />
            <span
                v-else
                class="inline-flex items-center justify-center w-[36px] h-[36px] shrink-0 bg-accent-tint rounded-[6px]"
            ><Icon :name="kind === 'image' ? 'image' : 'file_text'" :size="17" color="var(--accent)" /></span>
            <span class="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[13.5px] text-ink">
                {{ modelValue.name }}
            </span>
            <button
                type="button" class="btn--icon inline-flex items-center justify-center w-[30px] h-[30px] cursor-pointer bg-transparent border border-transparent rounded-[6px]" aria-label="הסר קובץ"
                @click="emit('update:modelValue', null)"
            ><Icon name="x" :size="15" color="var(--ink-3)" /></button>
        </div>
        <!-- Empty dropzone -->
        <div
            v-else
            role="button" tabindex="0"
            class="flex flex-col items-center justify-center gap-[8px] px-[16px] text-center text-ink-3 border-[1.5px] border-dashed rounded-control cursor-pointer transition-all duration-150"
            :class="[
                kind === 'image' ? 'py-[26px]' : 'py-[22px]',
                drag ? 'border-accent bg-accent-tint' : 'border-line-strong bg-surface-sunk',
            ]"
            @click="openPicker"
            @keydown.enter.prevent="openPicker"
            @keydown.space.prevent="openPicker"
            @dragover.prevent="drag = true"
            @dragleave="drag = false"
            @drop.prevent="onDrop"
        >
            <Icon :name="kind === 'image' ? 'image' : 'upload'" :size="22" :color="drag ? 'var(--accent)' : 'var(--ink-4)'" :stroke="1.6" />
            <span class="text-[13px]">{{ placeholder }}</span>
            <span class="text-[11.5px] text-ink-4">
                {{ kind === 'image' ? 'PNG · JPG · עד 5MB' : 'PDF · JPG · PNG · עד 10MB' }}
            </span>
        </div>
    </div>
</template>
