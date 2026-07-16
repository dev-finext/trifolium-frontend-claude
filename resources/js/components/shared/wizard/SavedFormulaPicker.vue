<script setup>
// Saved-formula popup — modal picker over the wizard. Lists the practitioner's
// saved formulas; picking one loads it into the lab.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import SavedFormulaRow from '@/components/shared/wizard/SavedFormulaRow.vue';
import Icon from '@/components/ui/Icon.vue';
import SearchInput from '@/components/ui/SearchInput.vue';
import { useSavedFormulasStore } from '@/stores/savedFormulas';

const emit = defineEmits(['close', 'pick']);

const savedStore = useSavedFormulasStore();

const search = ref('');
const selectedId = ref(null);
const pendingDeleteId = ref(null);

const filtered = computed(() =>
    savedStore.state.list.filter(
        (f) =>
            !search.value ||
            f.name.includes(search.value) ||
            f.summary.includes(search.value),
    ),
);
const selected = computed(() =>
    filtered.value.find((f) => f.id === selectedId.value),
);

function handleDelete(id) {
    savedStore.remove(id);

    if (selectedId.value === id) {
        selectedId.value = null;
    }

    pendingDeleteId.value = null;
}

function onKey(e) {
    if (e.key === 'Escape') {
        emit('close');
    }
}
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(20,18,14,0.46)] p-[24px] backdrop-blur-[2px]"
        @click="emit('close')"
    >
        <div
            class="flex max-h-[86vh] w-[min(880px,100%)] flex-col overflow-hidden rounded-card bg-surface shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
            @click.stop
        >
            <!-- Header -->
            <div
                class="flex items-center gap-[16px] border-b border-b-line px-[24px] pt-[20px] pb-[16px]"
            >
                <div class="flex-1">
                    <div
                        class="mb-[4px] text-[11px] font-semibold tracking-[0.18em] text-accent uppercase"
                    >
                        הפורמולות שלי
                    </div>
                    <h3
                        class="m-0 text-[18px] font-semibold tracking-[-0.005em]"
                    >
                        בחר פורמולה לטעינה
                    </h3>
                    <p class="muted m-0 mt-[4px] text-[13px]">
                        התכולה תטען למעבדה — שם, סוג, נפח ורכיבים. תוכל לערוך
                        אותה בהמשך.
                    </p>
                </div>
                <button
                    class="btn--icon h-[32px] w-[32px] shrink-0 rounded-full border border-line bg-surface text-ink-2"
                    aria-label="סגור"
                    @click="emit('close')"
                >
                    <Icon name="x" :size="14" />
                </button>
            </div>

            <!-- Search -->
            <div class="border-b border-b-line px-[24px] py-[14px]">
                <SearchInput
                    v-model="search"
                    placeholder="חפש לפי שם פורמולה או רכיב …"
                />
            </div>

            <!-- List -->
            <div class="flex-1 overflow-y-auto px-[16px] py-[12px]">
                <div
                    v-if="filtered.length === 0"
                    class="muted small p-[40px] text-center"
                >
                    לא נמצאו תוצאות מתאימות.
                </div>
                <div v-else class="col gap-[8px]">
                    <SavedFormulaRow
                        v-for="f in filtered"
                        :key="f.id"
                        :saved="f"
                        :selected="selectedId === f.id"
                        :confirming-delete="pendingDeleteId === f.id"
                        @select="selectedId = f.id"
                        @double-pick="emit('pick', f)"
                        @request-delete="pendingDeleteId = f.id"
                        @cancel-delete="pendingDeleteId = null"
                        @confirm-delete="handleDelete(f.id)"
                    />
                </div>
            </div>

            <!-- Footer -->
            <div
                class="flex items-center justify-between gap-[14px] border-t border-t-line bg-surface-sunk px-[24px] py-[14px]"
            >
                <div class="small muted">
                    <template v-if="selected"
                        >נבחר:
                        <strong class="text-ink">{{ selected.name }}</strong> ·
                        טעינתה תחליף את הפורמולה הנוכחית</template
                    >
                    <template v-else>בחר פורמולה מהרשימה מעל.</template>
                </div>
                <div class="flex gap-[10px]">
                    <button class="btn btn--ghost" @click="emit('close')">
                        בטל
                    </button>
                    <button
                        class="btn btn--primary px-[24px]"
                        :class="
                            selected
                                ? 'cursor-pointer opacity-100'
                                : 'cursor-not-allowed opacity-40'
                        "
                        :disabled="!selected"
                        @click="selected && emit('pick', selected)"
                    >
                        טען את הפורמולה
                        <Icon name="arrow_left" :size="15" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
