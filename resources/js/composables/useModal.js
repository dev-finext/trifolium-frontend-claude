// Accessible-dialog behaviour for overlays (A3/A4): moves focus into the
// dialog on open, traps Tab within it, closes on Escape, and restores focus to
// the element that opened it on close. Attach the returned `dialogRef` to the
// dialog element and give that element role="dialog" aria-modal="true" plus a
// label (aria-label or aria-labelledby) and tabindex="-1".
//
//   const { dialogRef } = useModal(() => emit('close'));
//
// Pass the same close handler the overlay already uses. Safe to combine with an
// existing close button; the composable only ADDS keyboard + focus semantics.
import { onBeforeUnmount, onMounted, nextTick, ref } from 'vue';

const FOCUSABLE =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useModal(onClose) {
    const dialogRef = ref(null);
    let prevFocus = null;

    function focusables() {
        if (!dialogRef.value) {
            return [];
        }

        // visible focusable descendants (offsetParent is null for display:none)
        return Array.from(dialogRef.value.querySelectorAll(FOCUSABLE)).filter(
            (el) => el.offsetParent !== null || el === document.activeElement,
        );
    }

    function onKeydown(e) {
        if (!dialogRef.value) {
            return;
        }

        if (e.key === 'Escape') {
            e.stopPropagation();
            onClose?.();

            return;
        }

        if (e.key !== 'Tab') {
            return;
        }

        const f = focusables();

        if (f.length === 0) {
            e.preventDefault();
            dialogRef.value.focus();

            return;
        }

        const first = f[0];
        const last = f[f.length - 1];
        const active = document.activeElement;

        // wrap, and pull focus back inside if it has escaped the dialog
        if (
            e.shiftKey &&
            (active === first || !dialogRef.value.contains(active))
        ) {
            e.preventDefault();
            last.focus();
        } else if (
            !e.shiftKey &&
            (active === last || !dialogRef.value.contains(active))
        ) {
            e.preventDefault();
            first.focus();
        }
    }

    onMounted(async () => {
        prevFocus = document.activeElement;
        document.addEventListener('keydown', onKeydown, true);
        await nextTick();
        (focusables()[0] || dialogRef.value)?.focus();
    });

    onBeforeUnmount(() => {
        document.removeEventListener('keydown', onKeydown, true);

        // restore focus to the opener (guard: it may have been removed)
        if (
            prevFocus &&
            typeof prevFocus.focus === 'function' &&
            document.contains(prevFocus)
        ) {
            prevFocus.focus();
        }
    });

    return { dialogRef };
}
