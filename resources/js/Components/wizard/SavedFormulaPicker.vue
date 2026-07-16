<script setup>
// Saved-formula popup — modal picker over the wizard. Lists the practitioner's
// saved formulas; picking one loads it into the lab.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import SearchInput from '@/Components/ui/SearchInput.vue';
import SavedFormulaRow from '@/Components/wizard/SavedFormulaRow.vue';
import { useSavedFormulasStore } from '@/stores/saved-formulas';

const emit = defineEmits(['close', 'pick']);

const savedStore = useSavedFormulasStore();

const search = ref('');
const selectedId = ref(null);
const pendingDeleteId = ref(null);

const filtered = computed(() => savedStore.state.list.filter((f) =>
    !search.value || f.name.includes(search.value) || f.summary.includes(search.value)
));
const selected = computed(() => filtered.value.find((f) => f.id === selectedId.value));

function handleDelete(id) {
    savedStore.remove(id);
    if (selectedId.value === id) selectedId.value = null;
    pendingDeleteId.value = null;
}

function onKey(e) { if (e.key === 'Escape') emit('close'); }
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-[24px] bg-[rgba(20,18,14,0.46)] backdrop-blur-[2px]"
        @click="emit('close')"
    >
        <div
            class="flex flex-col w-[min(880px,100%)] max-h-[86vh] bg-surface rounded-card overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
            @click.stop
        >
            <!-- Header -->
            <div class="flex items-center gap-[16px] px-[24px] pt-[20px] pb-[16px] border-b border-b-line">
                <div class="flex-1">
                    <div class="mb-[4px] text-[11px] tracking-[0.18em] uppercase font-semibold text-accent">הפורמולות שלי</div>
                    <h3 class="m-0 text-[18px] font-semibold tracking-[-0.005em]">בחר פורמולה לטעינה</h3>
                    <p class="muted m-0 mt-[4px] text-[13px]">
                        התכולה תטען למעבדה — שם, סוג, נפח ורכיבים. תוכל לערוך אותה בהמשך.
                    </p>
                </div>
                <button
                    class="btn--icon w-[32px] h-[32px] shrink-0 text-ink-2 bg-surface border border-line rounded-full" aria-label="סגור"
                    @click="emit('close')"
                >
                    <Icon name="x" :size="14" />
                </button>
            </div>

            <!-- Search -->
            <div class="px-[24px] py-[14px] border-b border-b-line">
                <SearchInput v-model="search" placeholder="חפש לפי שם פורמולה או רכיב …" />
            </div>

            <!-- List -->
            <div class="flex-1 overflow-y-auto px-[16px] py-[12px]">
                <div v-if="filtered.length === 0" class="muted small p-[40px] text-center">
                    לא נמצאו תוצאות מתאימות.
                </div>
                <div v-else class="col gap-[8px]">
                    <SavedFormulaRow
                        v-for="f in filtered" :key="f.id"
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
            <div class="flex items-center justify-between gap-[14px] px-[24px] py-[14px] bg-surface-sunk border-t border-t-line">
                <div class="small muted">
                    <template v-if="selected">נבחר: <strong class="text-ink">{{ selected.name }}</strong> · טעינתה תחליף את הפורמולה הנוכחית</template>
                    <template v-else>בחר פורמולה מהרשימה מעל.</template>
                </div>
                <div class="flex gap-[10px]">
                    <button class="btn btn--ghost" @click="emit('close')">בטל</button>
                    <button
                        class="btn btn--primary px-[24px]"
                        :class="selected ? 'opacity-100 cursor-pointer' : 'opacity-40 cursor-not-allowed'"
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
