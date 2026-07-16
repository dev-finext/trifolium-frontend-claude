<script setup>
// Preset-formula picker — modal over the wizard with four libraries:
// classic Chinese presets, my formulas, system formulas and free-pour shelf.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import Icon from '@/components/ui/Icon.vue';
import PresetFormulaRow from '@/components/shared/wizard/PresetFormulaRow.vue';
import PresetFormulaDetail from '@/components/shared/wizard/PresetFormulaDetail.vue';
import EditableFormulaRow from '@/components/shared/wizard/EditableFormulaRow.vue';
import EditableFormulaDetail from '@/components/shared/wizard/EditableFormulaDetail.vue';
import FreePourRow from '@/components/shared/wizard/FreePourRow.vue';
import FreePourDetail from '@/components/shared/wizard/FreePourDetail.vue';
import { useSavedFormulasStore } from '@/stores/savedFormulas';
import { PRESET_FORMULAS, SYSTEM_FORMULAS, FREEPOUR_FORMULAS } from '@/data/mock';
import { PICKER_TABS } from '@/components/shared/wizard/wizard-lib';

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
        class="preset-picker-overlay fixed inset-0 z-[100] flex items-center justify-center p-[24px] bg-[rgba(20,18,14,0.46)] backdrop-blur-[2px]"
        @click="emit('close')"
    >
        <div
            class="preset-picker-modal flex flex-col w-[min(940px,100%)] max-h-[88vh] bg-surface rounded-card shadow-[0_30px_80px_rgba(0,0,0,0.22)] overflow-hidden"
            @click.stop
        >
            <!-- Header -->
            <div class="flex items-start gap-[16px] pt-[20px] px-[24px] pb-[14px] border-b border-line">
                <div class="flex-1">
                    <div class="mb-[4px] text-[11px] tracking-[0.18em] uppercase font-semibold text-accent">
                        {{ tab.eyebrow }}
                    </div>
                    <h3 class="m-0 text-[18px] font-bold tracking-[-0.005em]">{{ tab.title }}</h3>
                    <p class="muted mt-[4px] mx-0 mb-0 text-[13px]">
                        {{ tab.sub }}
                    </p>
                </div>
                <button
                    class="btn--icon w-[32px] h-[32px] shrink-0 bg-surface text-ink-2 border border-line rounded-[50%]" aria-label="סגור"
                    @click="emit('close')"
                >
                    <Icon name="x" :size="14" />
                </button>
            </div>

            <!-- Tabs -->
            <div class="relative shrink-0 bg-surface-sunk border-b border-line">
                <div class="preset-picker-tabs flex gap-[4px] px-[16px] py-0">
                    <div
                        v-for="t in PICKER_TABS"
                        :key="t.id"
                        class="ppt-item flex items-center gap-[4px]"
                        :class="{ 'ppt-item--active': t.id === tabId }"
                    >
                        <button
                            class="ppt-tab appearance-none bg-transparent border-0 border-b-[2.5px] cursor-pointer pt-[13px] px-[4px] pb-[11px] text-[14px] [font-family:inherit] mb-[-1px] transition-[color] duration-[120ms]"
                            :class="t.id === tabId ? 'font-bold text-accent-ink border-b-accent' : 'font-medium text-ink-3 border-b-transparent'"
                            @click="switchTab(t.id)"
                        >{{ t.label }}</button>
                        <button
                            class="ppt-info appearance-none cursor-pointer inline-flex items-center justify-center w-[17px] h-[17px] rounded-[50%] shrink-0 text-[11px] font-bold leading-[1] font-latin border me-[8px] transition-all duration-[120ms] italic"
                            :class="infoTab === t.id ? 'border-accent bg-accent text-white' : 'border-line-strong bg-transparent text-ink-3'"
                            :aria-label="'מידע על ' + t.label"
                            title="הסבר"
                            @click.stop="infoTab = infoTab === t.id ? null : t.id"
                        >i</button>
                    </div>
                </div>

                <!-- Info popover -->
                <div
                    v-if="infoTabDef"
                    class="absolute top-[calc(100%+6px)] end-[16px] z-[5] w-[min(340px,calc(100%-32px))] bg-surface border border-line rounded-control shadow-[0_14px_38px_rgba(0,0,0,0.16)] px-[16px] py-[14px]"
                    @click.stop
                >
                    <div class="flex items-center justify-between mb-[6px]">
                        <strong class="text-[13.5px] text-ink">{{ infoTabDef.label }}</strong>
                        <button
                            aria-label="סגור"
                            class="appearance-none bg-transparent border-none cursor-pointer text-ink-3 p-[2px] leading-[0]"
                            @click="infoTab = null"
                        >
                            <Icon name="x" :size="13" />
                        </button>
                    </div>
                    <p class="m-0 text-[12.5px] leading-[1.6] text-ink-2">{{ infoTabDef.info }}</p>
                    <div
                        v-if="!infoTabDef.editable"
                        class="flex items-center gap-[6px] mt-[10px] px-[10px] py-[6px] text-[11.5px] font-semibold text-accent-ink bg-accent-tint border border-accent rounded-control"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
                            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        הפורמולה מוכנה — יחסי הבסיס נעולים ואינם ניתנים לשינוי.
                    </div>
                </div>
            </div>

            <!-- Body — two columns -->
            <div class="preset-picker-body flex flex-1 min-h-0 overflow-hidden">
                <!-- Left: formula list -->
                <div class="preset-picker-list w-[320px] shrink-0 overflow-y-auto border-e border-line">
                    <div v-if="list.length === 0" class="px-[20px] py-[40px] text-center text-ink-3 text-[13px]">
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
                <div class="flex-1 overflow-y-auto px-[28px] py-[24px]" :class="'preset-picker-detail' + (selected ? '' : ' preset-picker-detail--empty')">
                    <template v-if="selected">
                        <FreePourDetail v-if="tab.kind === 'freepour'" :f="selected" />
                        <EditableFormulaDetail v-else-if="tab.editable" :f="selected" />
                        <PresetFormulaDetail v-else :preset="selected" />
                    </template>
                    <div v-else class="h-full flex flex-col items-center justify-center gap-[10px] text-ink-3 text-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="opacity-30">
                            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                        <div class="font-semibold text-ink-2 text-[14px]">בחר פורמולה מהרשימה</div>
                        <div class="small">{{ tab.editable ? 'הרכיבים והמינונים יופיעו כאן לפני הטעינה' : 'הרכיבים והיחסים יופיעו כאן לפני הטעינה' }}</div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="preset-picker-footer flex items-center justify-between gap-[14px] px-[24px] py-[14px] bg-surface-sunk border-t border-line">
                <div class="small muted">
                    <template v-if="selected">
                        <template v-if="tab.kind === 'freepour'">
                            נבחר: <strong class="text-ink">{{ selected.name }}</strong> · {{ selected.ingredients.length }} רכיבים
                        </template>
                        <template v-else-if="tab.editable">
                            נבחר: <strong class="text-ink">{{ selected.name }}</strong> · {{ selected.ingredients.length }} רכיבים
                        </template>
                        <template v-else>
                            נבחר: <strong class="text-ink font-latin italic">{{ selected.nameEn }}</strong> · <span class="font-latin">{{ selected.namePinyin }}</span> · {{ selected.ingredients.length }} רכיבים
                        </template>
                    </template>
                    <template v-else>בחר פורמולה מהרשימה לצפייה בפרטים</template>
                </div>
                <div class="flex gap-[10px]">
                    <button class="btn btn--ghost" @click="emit('close')">ביטול</button>
                    <button
                        class="btn btn--primary px-[24px]"
                        :class="selected ? 'opacity-100 cursor-pointer' : 'opacity-40 cursor-not-allowed'"
                        :disabled="!selected"
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
