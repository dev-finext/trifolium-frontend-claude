<script setup>
// תנועות הארנק שלי — the practitioner's credit-points wallet, presented like a
// bank statement: a balance hero on top, then a ledger of credits (צבירה) and
// debits (מימוש) with a running balance, newest first. Reached from the coin
// in the top bar.
import { Head } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import GoldCoin from '@/components/shared/navbar/GoldCoin.vue';
import Icon from '@/components/ui/Icon.vue';
import { WALLET_TX } from '@/data/mock';
import { visit } from '@/lib/routes';

// TODO(backend): the wallet endpoint returns the ledger + current balance.
const props = defineProps({
    transactions: { type: Array, default: () => WALLET_TX },
});

const goBack = () => visit('home');

const nf = new Intl.NumberFormat('en-US');

// Walk the ledger oldest→newest, stamping the balance after each row, then
// present newest first (like a statement).
const rows = computed(() => {
    let running = 0;
    const withBalance = props.transactions.map((tx) => {
        running += tx.kind === 'earn' ? tx.amount : -tx.amount;

        return { ...tx, balance: running };
    });

    return withBalance.reverse();
});

const balance = computed(() =>
    props.transactions.reduce(
        (s, tx) => s + (tx.kind === 'earn' ? tx.amount : -tx.amount),
        0,
    ),
);
const totalEarned = computed(() =>
    props.transactions
        .filter((tx) => tx.kind === 'earn')
        .reduce((s, tx) => s + tx.amount, 0),
);
const totalSpent = computed(() =>
    props.transactions
        .filter((tx) => tx.kind === 'spend')
        .reduce((s, tx) => s + tx.amount, 0),
);

const filter = ref('all'); // 'all' | 'earn' | 'spend'
const filters = computed(() => [
    { id: 'all', label: 'הכל', count: props.transactions.length },
    {
        id: 'earn',
        label: 'צבירה',
        count: props.transactions.filter((t) => t.kind === 'earn').length,
    },
    {
        id: 'spend',
        label: 'מימוש',
        count: props.transactions.filter((t) => t.kind === 'spend').length,
    },
]);
const visibleRows = computed(() =>
    filter.value === 'all'
        ? rows.value
        : rows.value.filter((r) => r.kind === filter.value),
);
</script>

<template>
    <Head title="תנועות הארנק שלי" />
    <div class="page" data-screen-label="תנועות הארנק שלי">
        <div class="page__inner">
            <!-- Breadcrumb -->
            <a
                class="mb-[18px] inline-flex cursor-pointer items-center gap-[6px] text-[13px] text-ink-3"
                @click="goBack"
            >
                <Icon name="arrow_right" :size="15" /> חזרה ללוח הבקרה
            </a>

            <!-- Head -->
            <div class="mb-[20px]">
                <div
                    class="mb-[8px] text-[11px] font-bold tracking-[0.16em] text-accent uppercase"
                >
                    האזור האישי שלי
                </div>
                <h1 class="page-title m-0">תנועות הארנק שלי</h1>
                <p class="page-sub mt-[6px]">
                    כל צבירה וכל מימוש של נקודות הזכות שלך, במקום אחד — כמו
                    עו״ש.
                </p>
            </div>

            <!-- Balance hero -->
            <div
                class="wallet-hero mb-[22px] flex flex-wrap items-center justify-between gap-[20px] rounded-card border border-accent-tint-strong bg-accent-tint px-[24px] py-[22px]"
            >
                <div class="flex items-center gap-[16px]">
                    <div
                        class="flex h-[56px] w-[56px] items-center justify-center rounded-[50%] bg-surface shadow-[0_4px_14px_-6px_rgba(31,46,29,0.3)]"
                    >
                        <GoldCoin :size="34" />
                    </div>
                    <div>
                        <div class="text-[13px] font-medium text-accent-ink">
                            יתרת נקודות זכות
                        </div>
                        <div
                            class="num text-[34px] leading-[1.1] font-bold text-ink"
                        >
                            {{ nf.format(balance) }}
                        </div>
                        <div class="mt-[2px] text-[12px] text-ink-3">
                            נקודות זמינות למימוש בהזמנה הבאה
                        </div>
                    </div>
                </div>

                <!-- Earned / spent summary -->
                <div class="flex gap-[14px]">
                    <div
                        class="rounded-[10px] border border-line bg-surface px-[16px] py-[10px] text-center"
                    >
                        <div class="text-[11px] font-medium text-ink-3">
                            סה״כ נצבר
                        </div>
                        <div class="num text-[19px] font-bold text-accent">
                            +{{ nf.format(totalEarned) }}
                        </div>
                    </div>
                    <div
                        class="rounded-[10px] border border-line bg-surface px-[16px] py-[10px] text-center"
                    >
                        <div class="text-[11px] font-medium text-ink-3">
                            סה״כ מומש
                        </div>
                        <div class="num text-[19px] font-bold text-(--danger)">
                            −{{ nf.format(totalSpent) }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filter chips -->
            <div class="mb-[14px] flex items-center gap-[8px]">
                <button
                    v-for="f in filters"
                    :key="f.id"
                    class="wallet-chip inline-flex items-center gap-[6px] rounded-[999px] border px-[14px] py-[7px] text-[13px] font-semibold transition-colors"
                    :class="
                        filter === f.id
                            ? 'border-accent bg-accent text-white'
                            : 'border-line bg-surface text-ink-2'
                    "
                    @click="filter = f.id"
                >
                    {{ f.label }}
                    <span
                        class="num text-[11px]"
                        :class="
                            filter === f.id ? 'text-white/80' : 'text-ink-3'
                        "
                        >{{ f.count }}</span
                    >
                </button>
            </div>

            <!-- Ledger -->
            <div class="card overflow-hidden p-0">
                <!-- Column header (desktop/tablet) -->
                <div
                    class="wallet-ledger-head flex items-center gap-[12px] border-b border-line bg-surface-sunk px-[18px] py-[10px] text-[11px] font-semibold tracking-[0.06em] text-ink-3 uppercase"
                >
                    <span class="w-[92px] shrink-0">תאריך</span>
                    <span class="flex-1">תנועה</span>
                    <span class="w-[100px] shrink-0 text-start">שינוי</span>
                    <span class="w-[92px] shrink-0 text-start">יתרה</span>
                </div>

                <div
                    v-for="(r, i) in visibleRows"
                    :key="r.id"
                    class="wallet-row flex items-center gap-[12px] px-[18px] py-[14px]"
                    :class="
                        i < visibleRows.length - 1 ? 'border-b border-line' : ''
                    "
                >
                    <span
                        class="num wallet-row__date w-[92px] shrink-0 text-[12px] text-ink-3"
                        >{{ r.date }}</span
                    >

                    <div class="flex flex-1 items-center gap-[12px]">
                        <span
                            class="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[50%] text-[17px] leading-none font-bold"
                            :class="
                                r.kind === 'earn'
                                    ? 'bg-accent-tint text-accent'
                                    : 'bg-(--danger-tint) text-(--danger)'
                            "
                            aria-hidden="true"
                            >{{ r.kind === 'earn' ? '+' : '−' }}</span
                        >
                        <div class="min-w-0">
                            <div
                                class="truncate text-[14px] font-medium text-ink"
                            >
                                {{ r.title }}
                            </div>
                            <div class="truncate text-[12px] text-ink-3">
                                {{ r.sub }}
                            </div>
                        </div>
                    </div>

                    <span
                        class="num wallet-row__amount w-[100px] shrink-0 text-start text-[15px] font-bold"
                        :class="
                            r.kind === 'earn'
                                ? 'text-accent'
                                : 'text-(--danger)'
                        "
                    >
                        {{ r.kind === 'earn' ? '+' : '−'
                        }}{{ nf.format(r.amount) }}
                    </span>

                    <span
                        class="num wallet-row__balance w-[92px] shrink-0 text-start text-[13px] font-semibold text-ink-2"
                        >{{ nf.format(r.balance) }}</span
                    >
                </div>
            </div>

            <p class="small muted mt-[16px] text-center">
                נקודות זכות נצברות מהזמנות וניתנות למימוש כהנחה בתשלום. פירוט
                מלא בתקנון המועדון.
            </p>
        </div>
    </div>
</template>

<style>
/* Statement rows read as a ledger; on phones the date hops above the title
   line and the running-balance column folds away to keep the row legible. */
.wallet-row__date {
    font-variant-numeric: tabular-nums;
}
html.tf-mobile .wallet-ledger-head {
    display: none;
}
html.tf-mobile .wallet-row {
    flex-wrap: wrap;
    row-gap: 4px;
}
html.tf-mobile .wallet-row__date {
    order: -1;
    width: 100%;
}
html.tf-mobile .wallet-row__balance {
    width: auto;
    margin-inline-start: auto;
    color: var(--ink-3);
}
html.tf-mobile .wallet-row__balance::before {
    content: 'יתרה ';
    font-weight: 400;
}
</style>
