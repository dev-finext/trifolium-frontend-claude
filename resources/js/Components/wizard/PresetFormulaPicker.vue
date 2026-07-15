<script setup>
// Preset-formula picker — modal over the wizard with four libraries:
// classic Chinese presets, my formulas, system formulas and free-pour shelf.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import PresetFormulaRow from '@/Components/wizard/PresetFormulaRow.vue';
import PresetFormulaDetail from '@/Components/wizard/PresetFormulaDetail.vue';
import EditableFormulaRow from '@/Components/wizard/EditableFormulaRow.vue';
import EditableFormulaDetail from '@/Components/wizard/EditableFormulaDetail.vue';
import FreePourRow from '@/Components/wizard/FreePourRow.vue';
import FreePourDetail from '@/Components/wizard/FreePourDetail.vue';
import { useSavedFormulasStore } from '@/stores/saved-formulas';
import { PRESET_FORMULAS, SYSTEM_FORMULAS, FREEPOUR_FORMULAS } from '@/data/mock';
import { PICKER_TABS } from '@/Components/wizard/wizard-lib';

const emit = defineEmits(['close', 'pick', 'pickEditable']);

const savedStore = useSavedFormulasStore();

const tabId = ref('preset');
const selectedId = ref(null);
const infoTab = ref(null);

function dataFor(id) {
    if (id === 'preset') return PRESET_FORMULAS || [];
    if (id === 'mine') return savedStore.state.list || [];
    if (id === 'freepour') return FREEPOUR_FORMULAS || [];
    return SYSTEM_FORMULAS || [];
}

const tab = computed(() => PICKER_TABS.find((t) => t.id === tabId.value));
const list = computed(() => dataFor(tabId.value));
const selected = computed(() => list.value.find((p) => p.id === selectedId.value));
const infoTabDef = computed(() => (infoTab.value ? PICKER_TABS.find((t) => t.id === infoTab.value) : null));

function switchTab(id) { tabId.value = id; selectedId.value = null; infoTab.value = null; }
function handleLoad() {
    if (!selected.value) return;
    if (tab.value.editable) emit('pickEditable', selected.value);
    else emit('pick', selected.value);
}

function onKey(e) {
    if (e.key === 'Escape') {
        if (infoTab.value) infoTab.value = null;
        else emit('close');
    }
}
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
    <div
        class="preset-picker-overlay"
        :style="{
            position: 'fixed', inset: 0,
            background: 'rgba(20, 18, 14, 0.46)',
            zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(2px)',
        }"
        @click="emit('close')"
    >
        <div
            class="preset-picker-modal"
            :style="{
                background: 'var(--surface)',
                borderRadius: 'var(--r-card)',
                width: 'min(940px, 100%)',
                maxHeight: '88vh',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 30px 80px rgba(0,0,0,0.22)',
                overflow: 'hidden',
            }"
            @click.stop
        >
            <!-- Header -->
            <div style="padding: 20px 24px 14px; border-bottom: 1px solid var(--line); display: flex; align-items: flex-start; gap: 16px">
                <div style="flex: 1">
                    <div style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); font-weight: 600; margin-bottom: 4px">
                        {{ tab.eyebrow }}
                    </div>
                    <h3 style="margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -0.005em">{{ tab.title }}</h3>
                    <p class="muted" style="margin: 4px 0 0; font-size: 13px">
                        {{ tab.sub }}
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

            <!-- Tabs -->
            <div style="position: relative; border-bottom: 1px solid var(--line); background: var(--surface-sunk); flex-shrink: 0">
                <div class="preset-picker-tabs" style="display: flex; gap: 4px; padding: 0 16px">
                    <div
                        v-for="t in PICKER_TABS"
                        :key="t.id"
                        class="ppt-item"
                        :class="{ 'ppt-item--active': t.id === tabId }"
                        style="display: flex; align-items: center; gap: 4px"
                    >
                        <button
                            class="ppt-tab"
                            :style="{
                                appearance: 'none', background: 'none', border: 'none', cursor: 'pointer',
                                padding: '13px 4px 11px', fontSize: '14px',
                                fontWeight: t.id === tabId ? 700 : 500,
                                fontFamily: 'inherit',
                                color: t.id === tabId ? 'var(--accent-ink)' : 'var(--ink-3)',
                                borderBottom: '2.5px solid ' + (t.id === tabId ? 'var(--accent)' : 'transparent'),
                                marginBottom: '-1px', transition: 'color .12s',
                            }"
                            @click="switchTab(t.id)"
                        >{{ t.label }}</button>
                        <button
                            class="ppt-info"
                            :aria-label="'מידע על ' + t.label"
                            title="הסבר"
                            :style="{
                                appearance: 'none', cursor: 'pointer',
                                width: '17px', height: '17px', borderRadius: '50%', flexShrink: 0,
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '11px', fontWeight: 700, lineHeight: 1,
                                fontFamily: 'var(--font-latin)',
                                border: '1px solid ' + (infoTab === t.id ? 'var(--accent)' : 'var(--line-strong)'),
                                background: infoTab === t.id ? 'var(--accent)' : 'transparent',
                                color: infoTab === t.id ? '#fff' : 'var(--ink-3)',
                                marginInlineEnd: '8px', transition: 'all .12s',
                                fontStyle: 'italic',
                            }"
                            @click.stop="infoTab = infoTab === t.id ? null : t.id"
                        >i</button>
                    </div>
                </div>

                <!-- Info popover -->
                <div
                    v-if="infoTabDef"
                    style="position: absolute; top: calc(100% + 6px); inset-inline-end: 16px; z-index: 5; width: min(340px, calc(100% - 32px)); background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-control); box-shadow: 0 14px 38px rgba(0,0,0,0.16); padding: 14px 16px"
                    @click.stop
                >
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px">
                        <strong style="font-size: 13.5px; color: var(--ink)">{{ infoTabDef.label }}</strong>
                        <button
                            aria-label="סגור"
                            style="appearance: none; background: none; border: none; cursor: pointer; color: var(--ink-3); padding: 2px; line-height: 0"
                            @click="infoTab = null"
                        >
                            <Icon name="x" :size="13" />
                        </button>
                    </div>
                    <p style="margin: 0; font-size: 12.5px; line-height: 1.6; color: var(--ink-2)">{{ infoTabDef.info }}</p>
                    <div
                        v-if="!infoTabDef.editable"
                        style="margin-top: 10px; display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 600; color: var(--accent-ink); background: var(--accent-tint); border: 1px solid var(--accent); border-radius: var(--r-control); padding: 6px 10px"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0">
                            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        הפורמולה מוכנה — יחסי הבסיס נעולים ואינם ניתנים לשינוי.
                    </div>
                </div>
            </div>

            <!-- Body — two columns -->
            <div class="preset-picker-body" style="flex: 1; overflow: hidden; display: flex; min-height: 0">
                <!-- Left: formula list -->
                <div class="preset-picker-list" style="width: 320px; border-inline-end: 1px solid var(--line); overflow-y: auto; flex-shrink: 0">
                    <div v-if="list.length === 0" style="padding: 40px 20px; text-align: center; color: var(--ink-3); font-size: 13px">
                        אין פורמולות להצגה בלשונית זו.
                    </div>
                    <template v-else>
                        <template v-for="item in list" :key="item.id">
                            <FreePourRow
                                v-if="tab.kind === 'freepour'"
                                :f="item"
                                :selected="selectedId === item.id"
                                @select="selectedId = item.id"
                            />
                            <EditableFormulaRow
                                v-else-if="tab.editable"
                                :f="item"
                                :selected="selectedId === item.id"
                                @select="selectedId = item.id"
                            />
                            <PresetFormulaRow
                                v-else
                                :preset="item"
                                :selected="selectedId === item.id"
                                @select="selectedId = item.id"
                            />
                        </template>
                    </template>
                </div>
                <!-- Right: detail panel -->
                <div :class="'preset-picker-detail' + (selected ? '' : ' preset-picker-detail--empty')" style="flex: 1; overflow-y: auto; padding: 24px 28px">
                    <template v-if="selected">
                        <FreePourDetail v-if="tab.kind === 'freepour'" :f="selected" />
                        <EditableFormulaDetail v-else-if="tab.editable" :f="selected" />
                        <PresetFormulaDetail v-else :preset="selected" />
                    </template>
                    <div v-else style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: var(--ink-3); text-align: center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.3">
                            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                        <div style="font-weight: 600; color: var(--ink-2); font-size: 14px">בחר פורמולה מהרשימה</div>
                        <div class="small">{{ tab.editable ? 'הרכיבים והמינונים יופיעו כאן לפני הטעינה' : 'הרכיבים והיחסים יופיעו כאן לפני הטעינה' }}</div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="preset-picker-footer" style="padding: 14px 24px; border-top: 1px solid var(--line); background: var(--surface-sunk); display: flex; align-items: center; justify-content: space-between; gap: 14px">
                <div class="small muted">
                    <template v-if="selected">
                        <template v-if="tab.kind === 'freepour'">
                            נבחר: <strong style="color: var(--ink)">{{ selected.name }}</strong> · {{ selected.ingredients.length }} רכיבים
                        </template>
                        <template v-else-if="tab.editable">
                            נבחר: <strong style="color: var(--ink)">{{ selected.name }}</strong> · {{ selected.ingredients.length }} רכיבים
                        </template>
                        <template v-else>
                            נבחר: <strong style="color: var(--ink); font-family: var(--font-latin); font-style: italic">{{ selected.nameEn }}</strong> · <span style="font-family: var(--font-latin)">{{ selected.namePinyin }}</span> · {{ selected.ingredients.length }} רכיבים
                        </template>
                    </template>
                    <template v-else>בחר פורמולה מהרשימה לצפייה בפרטים</template>
                </div>
                <div style="display: flex; gap: 10px">
                    <button class="btn btn--ghost" @click="emit('close')">ביטול</button>
                    <button
                        class="btn btn--primary"
                        :disabled="!selected"
                        :style="{ opacity: selected ? 1 : 0.4, cursor: selected ? 'pointer' : 'not-allowed', paddingInline: '24px' }"
                        @click="handleLoad"
                    >
                        טען פורמולה
                        <Icon name="arrow_left" :size="15" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
