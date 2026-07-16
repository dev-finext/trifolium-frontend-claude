<script setup>
// Pharmaceutical-preparation confirmation modal (step 5, order path).
// Legal declaration text is copied verbatim from the prototype.
import Icon from '@/components/ui/Icon.vue';

const emit = defineEmits(['confirm', 'close']);
</script>

<template>
    <div
        class="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(20,28,24,0.55)] p-[24px]"
        @click="emit('close')"
    >
        <div
            class="card flex max-h-[88vh] w-[min(620px,100%)] flex-col overflow-hidden bg-surface shadow-[0_24px_64px_rgba(0,0,0,0.28)]"
            @click.stop
        >
            <!-- Header -->
            <div
                class="flex items-center justify-between gap-[12px] border-b border-b-line px-[24px] py-[20px]"
            >
                <h3 class="m-0 text-[18px] font-bold">אישור הכנה רוקחית</h3>
                <button
                    class="btn btn--ghost h-[34px] w-[34px] rounded-full p-0"
                    aria-label="סגור"
                    @click="emit('close')"
                >
                    <Icon name="x" :size="18" />
                </button>
            </div>

            <!-- Body -->
            <div
                class="overflow-y-auto p-[24px] text-[14px] leading-[1.65] text-ink-2"
            >
                <p
                    class="m-0 mb-[18px] border-s-[3px] border-s-accent ps-[14px] text-[15px] font-bold text-ink"
                >
                    הכנות רוקחיות הן אישיות ואינן ניתנות להעברה מאדם לאדם ומשכך
                    אינן ניתנות להחזרה!
                </p>
                <p class="m-0 mb-[14px]">
                    בהסכמה לסעיף זה אני מוותר/ת על הזכות להחזיר את המוצר בכל
                    תנאי שהוא מתוך הבנה למהות המוצר ורגישותו. אני מתחייב בזאת
                    ליידע את המטופל/ת בנוגע להסכמה לסעיף זה.
                </p>
                <p class="m-0 mb-[14px]">
                    אני מאשר/ת שכל הפרטים שנמסרו בנוגע למטופל/ת הינם נכונים
                    ומלאים, לא ידוע לי על כל בעיה בריאותית של המטופל/ת או טיפול
                    אחר שהמטופל/ת נוטל/ת או מקבל/ת, הרלבנטיים ועלולים לסתור או
                    לגרום לנזק למטופל/ת, ואני לוקח/ת אחריות מלאה על המטופל/ת
                    והשימוש של המטופל/ת במוצר/ים המוזמנים על ידי למטופלי.
                </p>
                <p class="m-0 mb-[14px]">
                    אחריות אספקת התכשיר הינה של הרוקח האחראי בבית המרקחת וההובלה
                    בפועל תעשה בעזרת שליח. עליי ליידע את המטופל/ת שעליו לחתום על
                    טופס יפוי כח וויתור על ייעוץ רוקחי.
                </p>
                <p class="m-0">קראתי את תקנון האתר ואני מסכים לתנאי השימוש.</p>
            </div>

            <!-- Footer -->
            <div
                class="flex justify-end border-t border-t-line px-[24px] py-[16px]"
            >
                <button
                    class="btn btn--accent h-[44px] px-[32px] text-[15px] font-semibold"
                    @click="emit('confirm')"
                >
                    אני מאשר/ת
                </button>
            </div>
        </div>
    </div>
</template>
