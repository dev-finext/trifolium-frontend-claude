// Herb naming helpers.

/**
 * Pinyin extractor — a herb's `cn` field is "汉字 · Pīnyīn" (hanzi · romanization).
 * In Chinese mode we drop the hanzi and keep only the romanized name.
 */
export function herbPinyin(herb) {
    const cn = herb && herb.cn ? herb.cn : '';
    if (cn.includes('·')) return cn.split('·').pop().trim();
    // Fallback: strip CJK ranges if no separator present
    return cn.replace(/[　-〿㐀-䶿一-鿿豈-﫿]/g, '').trim();
}
