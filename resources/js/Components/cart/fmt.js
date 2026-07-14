// he-IL money formatting shared by the cart cards and the order summary.
export const fmt = (n) => n.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
