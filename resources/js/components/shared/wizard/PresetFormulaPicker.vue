<script setup>
// Preset-formula picker — modal over the wizard with four libraries:
// classic Chinese presets, my formulas, system formulas and free-pour shelf.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import EditableFormulaDetail from '@/components/shared/wizard/EditableFormulaDetail.vue';
import EditableFormulaRow from '@/components/shared/wizard/EditableFormulaRow.vue';
import FreePourDetail from '@/components/shared/wizard/FreePourDetail.vue';
import FreePourRow from '@/components/shared/wizard/FreePourRow.vue';
import PresetFormulaDetail from '@/components/shared/wizard/PresetFormulaDetail.vue';
import PresetFormulaRow from '@/components/shared/wizard/PresetFormulaRow.vue';
import { PICKER_TABS } from '@/components/shared/wizard/wizard-lib';
import Icon from '@/components/ui/Icon.vue';
import {
    PRESET_FORMULAS,
    SYSTEM_FORMULAS,
    FREEPOUR_FORMULAS,
} from '@/data/mock';
import { useSavedFormulasStore } from '@/stores/savedFormulas';

const emit = defineEmits(['close', 'pick', 'pickEditable']);

const savedStore = useSavedFormulasStore();

const tabId = ref('preset');
const selectedId = ref(null);
const infoTab = ref(null);

function dataFor(id) {
    if (id === 'preset') {
        return PRESET_FORMULAS || [];
    }

    if (id === 'mine') {
        return savedStore.state.list || [];
    }

    if (id === 'freepour') {
        return FREEPOUR_FORMULAS || [];
    }

    return SYSTEM_FORMULAS || [];
}

const tab = computed(() => PICKER_TABS.find((t) => t.id === tabId.value));
const list = computed(() => dataFor(tabId.value));
const selected = computed(() =>
    list.value.find((p) => p.id === selectedId.value),
);
const infoTabDef = computed(() =>
    infoTab.value ? PICKER_TABS.find((t) => t.id === infoTab.value) : null,
);

function switchTab(id) {
    tabId.value = id;
    selectedId.value = null;
    infoTab.value = null;
}
function handleLoad() {
    if (!selected.value) {
        return;
    }

    if (tab.value.editable) {
        emit('pickEditable', selected.value);
    } else {
        emit('pick', selected.value);
    }
}

function onKey(e) {
    if (e.key === 'Escape') {
        if (infoTab.value) {
            infoTab.value = null;
        } else {
            emit('close');
        }
    }
}
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
    <div
        class="preset-picker-overlay fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(20,18,14,0.46)] p-[24px] backdrop-blur-[2px]"
        @click="emit('close')"
    >
        <div
            class="preset-picker-modal flex max-h-[88vh] w-[min(940px,100%)] flex-col overflow-hidden rounded-card bg-surface shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
            @click.stop
        >
            <!-- Header -->
            <div
                class="flex items-start gap-[16px] border-b border-line px-[24px] pt-[20px] pb-[14px]"
            >
                <div class="flex-1">
                    <div
                        class="mb-[4px] text-[11px] font-semibold tracking-[0.18em] text-accent uppercase"
                    >
                        {{ tab.eyebrow }}
                    </div>
                    <h3 class="m-0 text-[18px] font-bold tracking-[-0.005em]">
                        {{ tab.title }}
                    </h3>
                    <p class="muted mx-0 mt-[4px] mb-0 text-[13px]">
                        {{ tab.sub }}
                    </p>
                </div>
                <button
                    class="btn--icon h-[32px] w-[32px] shrink-0 rounded-[50%] border border-line bg-surface text-ink-2"
                    aria-label="סגור"
                    @click="emit('close')"
                >
                    <Icon name="x" :size="14" />
                </button>
            </div>

            <!-- Tabs -->
            <div class="relative shrink-0 border-b border-line bg-surface-sunk">
                <div class="preset-picker-tabs flex gap-[4px] px-[16px] py-0">
                    <div
                        v-for="t in PICKER_TABS"
                        :key="t.id"
                        class="ppt-item flex items-center gap-[4px]"
                        :class="{ 'ppt-item--active': t.id === tabId }"
                    >
                        <button
                            class="ppt-tab mb-[-1px] cursor-pointer appearance-none border-0 border-b-[2.5px] bg-transparent px-[4px] pt-[13px] pb-[11px] [font-family:inherit] text-[14px] transition-[color] duration-[120ms]"
                            :class="
                                t.id === tabId
                                    ? 'border-b-accent font-bold text-accent-ink'
                                    : 'border-b-transparent font-medium text-ink-3'
                            "
                            @click="switchTab(t.id)"
                        >
                            {{ t.label }}
                        </button>
                        <button
                            class="ppt-info me-[8px] inline-flex h-[17px] w-[17px] shrink-0 cursor-pointer appearance-none items-center justify-center rounded-[50%] border font-latin text-[11px] leading-[1] font-bold italic transition-all duration-[120ms]"
                            :class="
                                infoTab === t.id
                                    ? 'border-accent bg-accent text-white'
                                    : 'border-line-strong bg-transparent text-ink-3'
                            "
                            :aria-label="'מידע על ' + t.label"
                            title="הסבר"
                            @click.stop="
                                infoTab = infoTab === t.id ? null : t.id
                            "
                        >
                            i
                        </button>
                    </div>
                </div>

                <!-- Info popover -->
                <div
                    v-if="infoTabDef"
                    class="absolute end-[16px] top-[calc(100%+6px)] z-[5] w-[min(340px,calc(100%-32px))] rounded-control border border-line bg-surface px-[16px] py-[14px] shadow-[0_14px_38px_rgba(0,0,0,0.16)]"
                    @click.stop
                >
                    <div class="mb-[6px] flex items-center justify-between">
                        <strong class="text-[13.5px] text-ink">{{
                            infoTabDef.label
                        }}</strong>
                        <button
                            aria-label="סגור"
                            class="cursor-pointer appearance-none border-none bg-transparent p-[2px] leading-[0] text-ink-3"
                            @click="infoTab = null"
                        >
                            <Icon name="x" :size="13" />
                        </button>
                    </div>
                    <p class="m-0 text-[12.5px] leading-[1.6] text-ink-2">
                        {{ infoTabDef.info }}
                    </p>
                    <div
                        v-if="!infoTabDef.editable"
                        class="mt-[10px] flex items-center gap-[6px] rounded-control border border-accent bg-accent-tint px-[10px] py-[6px] text-[11.5px] font-semibold text-accent-ink"
                    >
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="shrink-0"
                        >
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        הפורמולה מוכנה — יחסי הבסיס נעולים ואינם ניתנים לשינוי.
                    </div>
                </div>
            </div>

            <!-- Body — two columns -->
            <div class="preset-picker-body flex min-h-0 flex-1 overflow-hidden">
                <!-- Left: formula list -->
                <div
                    class="preset-picker-list w-[320px] shrink-0 overflow-y-auto border-e border-line"
                >
                    <div
                        v-if="list.length === 0"
                        class="px-[20px] py-[40px] text-center text-[13px] text-ink-3"
                    >
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
                <div
                    class="flex-1 overflow-y-auto px-[28px] py-[24px]"
                    :class="
                        'preset-picker-detail' +
                        (selected ? '' : ' preset-picker-detail--empty')
                    "
                >
                    <template v-if="selected">
                        <FreePourDetail
                            v-if="tab.kind === 'freepour'"
                            :f="selected"
                        />
                        <EditableFormulaDetail
                            v-else-if="tab.editable"
                            :f="selected"
                        />
                        <PresetFormulaDetail v-else :preset="selected" />
                    </template>
                    <div
                        v-else
                        class="flex h-full flex-col items-center justify-center gap-[10px] text-center text-ink-3"
                    >
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="opacity-30"
                        >
                            <path d="M9 11l3 3L22 4" />
                            <path
                                d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
                            />
                        </svg>
                        <div class="text-[14px] font-semibold text-ink-2">
                            בחר פורמולה מהרשימה
                        </div>
                        <div class="small">
                            {{
                                tab.editable
                                    ? 'הרכיבים והמינונים יופיעו כאן לפני הטעינה'
                                    : 'הרכיבים והיחסים יופיעו כאן לפני הטעינה'
                            }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div
                class="preset-picker-footer flex items-center justify-between gap-[14px] border-t border-line bg-surface-sunk px-[24px] py-[14px]"
            >
                <div class="small muted">
                    <template v-if="selected">
                        <template v-if="tab.kind === 'freepour'">
                            נבחר:
                            <strong class="text-ink">{{
                                selected.name
                            }}</strong>
                            · {{ selected.ingredients.length }} רכיבים
                        </template>
                        <template v-else-if="tab.editable">
                            נבחר:
                            <strong class="text-ink">{{
                                selected.name
                            }}</strong>
                            · {{ selected.ingredients.length }} רכיבים
                        </template>
                        <template v-else>
                            נבחר:
                            <strong class="font-latin text-ink italic">{{
                                selected.nameEn
                            }}</strong>
                            ·
                            <span class="font-latin">{{
                                selected.namePinyin
                            }}</span>
                            · {{ selected.ingredients.length }} רכיבים
                        </template>
                    </template>
                    <template v-else
                        >בחר פורמולה מהרשימה לצפייה בפרטים</template
                    >
                </div>
                <div class="flex gap-[10px]">
                    <button class="btn btn--ghost" @click="emit('close')">
                        ביטול
                    </button>
                    <button
                        class="btn btn--primary px-[24px]"
                        :class="
                            selected
                                ? 'cursor-pointer opacity-100'
                                : 'cursor-not-allowed opacity-40'
                        "
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
