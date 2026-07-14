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
        :style="{
            position: 'fixed', inset: 0,
            background: 'rgba(20, 18, 14, 0.46)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(2px)',
        }"
        @click="emit('close')"
    >
        <div
            :style="{
                background: 'var(--surface)',
                borderRadius: 'var(--r-card)',
                width: 'min(880px, 100%)',
                maxHeight: '86vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 30px 80px rgba(0,0,0,0.22)',
                overflow: 'hidden',
            }"
            @click.stop
        >
            <!-- Header -->
            <div style="padding: 20px 24px 16px; border-bottom: 1px solid var(--line); display: flex; align-items: center; gap: 16px">
                <div style="flex: 1">
                    <div style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); font-weight: 600; margin-bottom: 4px">הפורמולות שלי</div>
                    <h3 style="margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -0.005em">בחר פורמולה לטעינה</h3>
                    <p class="muted" style="margin: 4px 0 0; font-size: 13px">
                        התכולה תטען למעבדה — שם, סוג, נפח ורכיבים. תוכל לערוך אותה בהמשך.
                    </p>
                </div>
                <button
                    class="btn--icon" aria-label="סגור"
                    style="width: 32px; height: 32px; border: 1px solid var(--line); border-radius: 50%; background: var(--surface); color: var(--ink-2); flex-shrink: 0"
                    @click="emit('close')"
                >
                    <Icon name="x" :size="14" />
                </button>
            </div>

            <!-- Search -->
            <div style="padding: 14px 24px; border-bottom: 1px solid var(--line)">
                <SearchInput v-model="search" placeholder="חפש לפי שם פורמולה או רכיב …" />
            </div>

            <!-- List -->
            <div style="flex: 1; overflow-y: auto; padding: 12px 16px">
                <div v-if="filtered.length === 0" class="muted small" style="padding: 40px; text-align: center">
                    לא נמצאו תוצאות מתאימות.
                </div>
                <div v-else class="col gap-8">
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
            <div style="padding: 14px 24px; border-top: 1px solid var(--line); background: var(--surface-sunk); display: flex; align-items: center; justify-content: space-between; gap: 14px">
                <div class="small muted">
                    <template v-if="selected">נבחר: <strong style="color: var(--ink)">{{ selected.name }}</strong> · טעינתה תחליף את הפורמולה הנוכחית</template>
                    <template v-else>בחר פורמולה מהרשימה מעל.</template>
                </div>
                <div style="display: flex; gap: 10px">
                    <button class="btn btn--ghost" @click="emit('close')">בטל</button>
                    <button
                        class="btn btn--primary"
                        :disabled="!selected"
                        :style="{ opacity: selected ? 1 : 0.4, cursor: selected ? 'pointer' : 'not-allowed', paddingInline: '24px' }"
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
