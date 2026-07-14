<script setup>
// Pharmaceutical-preparation confirmation modal (step 5, order path).
// Legal declaration text is copied verbatim from the prototype.
import Icon from '@/Components/ui/Icon.vue';

const emit = defineEmits(['confirm', 'close']);
</script>

<template>
    <div
        style="position: fixed; inset: 0; z-index: 200; background: rgba(20, 28, 24, 0.55); display: flex; align-items: center; justify-content: center; padding: 24px"
        @click="emit('close')"
    >
        <div
            class="card"
            style="width: min(620px, 100%); max-height: 88vh; display: flex; flex-direction: column; background: var(--surface); box-shadow: 0 24px 64px rgba(0,0,0,0.28); overflow: hidden"
            @click.stop
        >
            <!-- Header -->
            <div style="padding: 20px 24px; border-bottom: 1px solid var(--line); display: flex; align-items: center; justify-content: space-between; gap: 12px">
                <h3 style="margin: 0; font-size: 18px; font-weight: 700">אישור הכנה רוקחית</h3>
                <button
                    class="btn btn--ghost"
                    style="width: 34px; height: 34px; padding: 0; border-radius: 50%"
                    aria-label="סגור"
                    @click="emit('close')"
                >
                    <Icon name="x" :size="18" />
                </button>
            </div>

            <!-- Body -->
            <div style="padding: 24px; overflow-y: auto; font-size: 14px; line-height: 1.65; color: var(--ink-2)">
                <p style="margin: 0 0 18px; font-size: 15px; font-weight: 700; color: var(--ink); padding-inline-start: 14px; border-inline-start: 3px solid var(--accent)">
                    הכנות רוקחיות הן אישיות ואינן ניתנות להעברה מאדם לאדם ומשכך אינן ניתנות להחזרה!
                </p>
                <p style="margin: 0 0 14px">
                    בהסכמה לסעיף זה אני מוותר/ת על הזכות להחזיר את המוצר בכל תנאי שהוא מתוך הבנה למהות המוצר ורגישותו. אני מתחייב בזאת ליידע את המטופל/ת בנוגע להסכמה לסעיף זה.
                </p>
                <p style="margin: 0 0 14px">
                    אני מאשר/ת שכל הפרטים שנמסרו בנוגע למטופל/ת הינם נכונים ומלאים, לא ידוע לי על כל בעיה בריאותית של המטופל/ת או טיפול אחר שהמטופל/ת נוטל/ת או מקבל/ת, הרלבנטיים ועלולים לסתור או לגרום לנזק למטופל/ת, ואני לוקח/ת אחריות מלאה על המטופל/ת והשימוש של המטופל/ת במוצר/ים המוזמנים על ידי למטופלי.
                </p>
                <p style="margin: 0 0 14px">
                    אחריות אספקת התכשיר הינה של הרוקח האחראי בבית המרקחת וההובלה בפועל תעשה בעזרת שליח. עליי ליידע את המטופל/ת שעליו לחתום על טופס יפוי כח וויתור על ייעוץ רוקחי.
                </p>
                <p style="margin: 0">
                    קראתי את תקנון האתר ואני מסכים לתנאי השימוש.
                </p>
            </div>

            <!-- Footer -->
            <div style="padding: 16px 24px; border-top: 1px solid var(--line); display: flex; justify-content: flex-end">
                <button
                    class="btn btn--accent"
                    style="height: 44px; padding-inline: 32px; font-size: 15px; font-weight: 600"
                    @click="emit('confirm')"
                >
                    אני מאשר/ת
                </button>
            </div>
        </div>
    </div>
</template>
