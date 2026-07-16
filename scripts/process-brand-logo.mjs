// Processes the official Trifolium logo (downloaded from trifolium.co.il,
// 2560×645 palette PNG: circular botanical mark + wordmark + tagline) into
// every asset the app needs — recolored from the site's teal to the app's
// herbal green (the colorway the company uses in print, per the brand file):
//
//   resources/img/trifolium-logo.png   full logo, height 240  (navbar, auth)
//   resources/img/trifolium-mark.png   circular mark, 512²    (mobile navbar)
//   resources/img/mark-green.png       same mark              (home hero)
//   public/icons/icon-{180,192,512}.png  PWA icons — mark on warm cream
//
// Pure Node (no image libs): palette-PNG decode → pixel ops → RGBA encode.
//
//   node scripts/process-brand-logo.mjs <source.png>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = process.argv[2];

if (!src || !fs.existsSync(src)) {
    console.error('usage: node scripts/process-brand-logo.mjs <source.png>');
    process.exit(1);
}

// ── PNG decode (8-bit palette or RGBA, non-interlaced) ──────────────────────
function decodePng(buf) {
    let off = 8;
    let w,
        h,
        colorType,
        palette = [],
        trns = [],
        idat = [];

    while (off < buf.length) {
        const len = buf.readUInt32BE(off);
        const type = buf.slice(off + 4, off + 8).toString();
        const data = buf.slice(off + 8, off + 8 + len);

        if (type === 'IHDR') {
            w = data.readUInt32BE(0);
            h = data.readUInt32BE(4);
            colorType = data[9];
        } else if (type === 'PLTE') {
            for (let i = 0; i < len; i += 3) {
                palette.push([data[i], data[i + 1], data[i + 2]]);
            }
        } else if (type === 'tRNS') {
            for (let i = 0; i < len; i++) {
                trns.push(data[i]);
            }
        } else if (type === 'IDAT') {
            idat.push(data);
        }

        off += 12 + len;

        if (type === 'IEND') {
            break;
        }
    }

    const bpp =
        colorType === 3 ? 1 : colorType === 6 ? 4 : colorType === 2 ? 3 : null;

    if (bpp === null) {
        throw new Error('unsupported color type ' + colorType);
    }

    const raw = zlib.inflateSync(Buffer.concat(idat));
    const stride = w * bpp;
    const out = Buffer.alloc(w * h * 4); // RGBA
    let prev = Buffer.alloc(stride);

    for (let y = 0; y < h; y++) {
        const f = raw[y * (stride + 1)];
        const row = raw.slice(y * (stride + 1) + 1, (y + 1) * (stride + 1));

        // un-filter in place
        for (let x = 0; x < stride; x++) {
            const a = x >= bpp ? row[x - bpp] : 0;
            const b = prev[x];
            const c = x >= bpp ? prev[x - bpp] : 0;
            let v = row[x];

            if (f === 1) {
                v = (v + a) & 255;
            } else if (f === 2) {
                v = (v + b) & 255;
            } else if (f === 3) {
                v = (v + ((a + b) >> 1)) & 255;
            } else if (f === 4) {
                const p = a + b - c,
                    pa = Math.abs(p - a),
                    pb = Math.abs(p - b),
                    pc = Math.abs(p - c);
                v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
            }

            row[x] = v;
        }

        prev = row;

        for (let x = 0; x < w; x++) {
            const o = (y * w + x) * 4;

            if (bpp === 1) {
                const idx = row[x];
                const [r, g, b] = palette[idx] || [0, 0, 0];
                out[o] = r;
                out[o + 1] = g;
                out[o + 2] = b;
                out[o + 3] = idx < trns.length ? trns[idx] : 255;
            } else if (bpp === 3) {
                out[o] = row[x * 3];
                out[o + 1] = row[x * 3 + 1];
                out[o + 2] = row[x * 3 + 2];
                out[o + 3] = 255;
            } else {
                out.set(row.slice(x * 4, x * 4 + 4), o);
            }
        }
    }

    return { w, h, px: out };
}

// ── RGBA PNG encode ──────────────────────────────────────────────────────────
const crcTable = (() => {
    const t = new Uint32Array(256);

    for (let n = 0; n < 256; n++) {
        let c = n;

        for (let k = 0; k < 8; k++) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }

        t[n] = c >>> 0;
    }

    return t;
})();
const crc32 = (b) => {
    let c = 0xffffffff;

    for (const x of b) {
        c = crcTable[(c ^ x) & 255] ^ (c >>> 8);
    }

    return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
    const l = Buffer.alloc(4);
    l.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));

    return Buffer.concat([l, body, crc]);
};
function encodePng({ w, h, px }) {
    const raw = Buffer.alloc(h * (1 + w * 4));

    for (let y = 0; y < h; y++) {
        const o = y * (1 + w * 4);
        raw[o] = 0;
        px.copy(raw, o + 1, y * w * 4, (y + 1) * w * 4);
    }

    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(w, 0);
    ihdr.writeUInt32BE(h, 4);
    ihdr[8] = 8;
    ihdr[9] = 6;

    return Buffer.concat([
        Buffer.from('89504e470d0a1a0a', 'hex'),
        chunk('IHDR', ihdr),
        chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
        chunk('IEND', Buffer.alloc(0)),
    ]);
}

// ── pixel ops ────────────────────────────────────────────────────────────────
/** Recolor: keep each pixel's "ink ramp" (how far from white) and its alpha,
 *  swap the hue family for the brand green. Works on antialiased edges too. */
function recolor(img, [tr, tg, tb]) {
    const { px } = img;

    for (let o = 0; o < px.length; o += 4) {
        if (px[o + 3] === 0) {
            continue;
        }

        // ink = distance from white, normalized by the darkest brand pixel
        const ink = Math.min(
            1,
            (765 - (px[o] + px[o + 1] + px[o + 2])) / (765 - (77 + 165 + 160)),
        ); // site teal ≈ #4DA5A0
        px[o] = Math.round(255 + (tr - 255) * ink);
        px[o + 1] = Math.round(255 + (tg - 255) * ink);
        px[o + 2] = Math.round(255 + (tb - 255) * ink);
    }

    return img;
}

function crop(img, x0, y0, cw, ch) {
    const out = Buffer.alloc(cw * ch * 4);

    for (let y = 0; y < ch; y++) {
        img.px.copy(
            out,
            y * cw * 4,
            ((y0 + y) * img.w + x0) * 4,
            ((y0 + y) * img.w + x0 + cw) * 4,
        );
    }

    return { w: cw, h: ch, px: out };
}

/** Area-average resize (fine quality for downscales). */
function resize(img, nw, nh) {
    const out = Buffer.alloc(nw * nh * 4);
    const sx = img.w / nw,
        sy = img.h / nh;

    for (let y = 0; y < nh; y++) {
        for (let x = 0; x < nw; x++) {
            let r = 0,
                g = 0,
                b = 0,
                a = 0,
                n = 0;
            const x1 = Math.floor(x * sx),
                x2 = Math.min(img.w, Math.ceil((x + 1) * sx));
            const y1 = Math.floor(y * sy),
                y2 = Math.min(img.h, Math.ceil((y + 1) * sy));

            for (let yy = y1; yy < y2; yy++) {
                for (let xx = x1; xx < x2; xx++) {
                    const o = (yy * img.w + xx) * 4;
                    const al = img.px[o + 3];
                    r += img.px[o] * al;
                    g += img.px[o + 1] * al;
                    b += img.px[o + 2] * al;
                    a += al;
                    n++;
                }
            }

            const o = (y * nw + x) * 4;
            out[o] = a ? Math.round(r / a) : 255;
            out[o + 1] = a ? Math.round(g / a) : 255;
            out[o + 2] = a ? Math.round(b / a) : 255;
            out[o + 3] = Math.round(a / n);
        }
    }

    return { w: nw, h: nh, px: out };
}

/** Inverted app icon: deep-green vertical gradient, the mark re-inked in warm
 *  cream, centered at `scale`. A gentle gamma (0.7) on the ink ramp thickens
 *  the fine strokes so the botanical mark stays legible at 60px on a phone
 *  home screen. The circle sits inside the maskable safe zone (central 80%). */
function iconifyInverted(
    mark,
    size,
    [t1r, t1g, t1b],
    [t2r, t2g, t2b],
    [fr, fg, fb],
    scale = 0.78,
) {
    const target = Math.round(size * scale);
    const m = resize(mark, target, Math.round((target * mark.h) / mark.w));
    const px = Buffer.alloc(size * size * 4);

    for (let y = 0; y < size; y++) {
        const k = y / (size - 1);
        const br = Math.round(t1r + (t2r - t1r) * k),
            bgc = Math.round(t1g + (t2g - t1g) * k),
            bb = Math.round(t1b + (t2b - t1b) * k);

        for (let x = 0; x < size; x++) {
            const o = (y * size + x) * 4;
            px[o] = br;
            px[o + 1] = bgc;
            px[o + 2] = bb;
            px[o + 3] = 255;
        }
    }

    const ox = Math.round((size - m.w) / 2),
        oy = Math.round((size - m.h) / 2);
    // Darkest ink of the green-recolored mark (#3d5a3a) normalizes the ramp.
    const denom = 765 - (0x3d + 0x5a + 0x3a);

    for (let y = 0; y < m.h; y++) {
        for (let x = 0; x < m.w; x++) {
            const so = (y * m.w + x) * 4,
                a = m.px[so + 3] / 255;

            if (!a) {
                continue;
            }

            const ink = Math.min(
                1,
                (765 - (m.px[so] + m.px[so + 1] + m.px[so + 2])) / denom,
            );
            const t = a * Math.pow(Math.max(0, ink), 0.7);

            if (!t) {
                continue;
            }

            const dо = ((oy + y) * size + (ox + x)) * 4;
            px[dо] = Math.round(px[dо] + (fr - px[dо]) * t);
            px[dо + 1] = Math.round(px[dо + 1] + (fg - px[dо + 1]) * t);
            px[dо + 2] = Math.round(px[dо + 2] + (fb - px[dо + 2]) * t);
        }
    }

    return { w: size, h: size, px };
}

// ── run ──────────────────────────────────────────────────────────────────────
const GREEN = [0x3d, 0x5a, 0x3a]; // brand herbal green (design tokens)

const full = recolor(decodePng(fs.readFileSync(src)), GREEN);

// find the circular mark's bounding box — scan only left of the wordmark
// (the circle ends ≈x625 at this resolution; the "T" begins ≈x690)
let minX = full.w,
    maxX = 0,
    minY = full.h,
    maxY = 0;

for (let y = 0; y < full.h; y++) {
    for (let x = 0; x < Math.min(full.w, 660); x++) {
        if (full.px[(y * full.w + x) * 4 + 3] > 40) {
            if (x < minX) {
                minX = x;
            }

            if (x > maxX) {
                maxX = x;
            }

            if (y < minY) {
                minY = y;
            }

            if (y > maxY) {
                maxY = y;
            }
        }
    }
}

const side = Math.max(maxX - minX, maxY - minY) + 2;
const cx = Math.max(0, Math.round((minX + maxX) / 2 - side / 2));
const cy = Math.max(0, Math.round((minY + maxY) / 2 - side / 2));
const mark = crop(
    full,
    cx,
    cy,
    Math.min(side, full.w - cx),
    Math.min(side, full.h - cy),
);

const write = (p, img) => {
    fs.writeFileSync(path.join(root, p), encodePng(img));
    console.log(
        p,
        `${img.w}x${img.h}`,
        fs.statSync(path.join(root, p)).size + 'B',
    );
};

write(
    'resources/img/trifolium-logo.png',
    resize(full, Math.round((240 * full.w) / full.h), 240),
);
write('resources/img/trifolium-mark.png', resize(mark, 512, 512));
// Strong variant for the mobile home hero: deeper green + a steeper ink ramp
// (gamma boost sharpens the antialiased edges → reads bolder at small sizes).
const strong = resize(mark, 512, 512);

for (let o = 0; o < strong.px.length; o += 4) {
    if (strong.px[o + 3] === 0) {
        continue;
    }

    const ink = Math.min(
        1,
        (765 - (strong.px[o] + strong.px[o + 1] + strong.px[o + 2])) /
            (765 - (0x2b + 0x45 + 0x28)),
    );
    const t = Math.pow(ink, 0.72); // steepen
    strong.px[o] = Math.round(255 + (0x2b - 255) * t);
    strong.px[o + 1] = Math.round(255 + (0x45 - 255) * t);
    strong.px[o + 2] = Math.round(255 + (0x28 - 255) * t);
}

write('resources/img/trifolium-mark-strong.png', strong);
// Cream variant for dark surfaces (the mobile app header): ink → warm cream,
// with the ink ramp folded into alpha so it composites onto any deep green.
const creamMark = resize(mark, 512, 512);

for (let o = 0; o < creamMark.px.length; o += 4) {
    const a = creamMark.px[o + 3] / 255;

    if (!a) {
        continue;
    }

    const ink = Math.min(
        1,
        (765 - (creamMark.px[o] + creamMark.px[o + 1] + creamMark.px[o + 2])) /
            (765 - (0x3d + 0x5a + 0x3a)),
    );
    creamMark.px[o] = 0xf6;
    creamMark.px[o + 1] = 0xf2;
    creamMark.px[o + 2] = 0xe4;
    creamMark.px[o + 3] = Math.round(255 * a * Math.pow(Math.max(0, ink), 0.8));
}

write('resources/img/trifolium-mark-cream.png', creamMark);
write('resources/img/mark-green.png', resize(mark, 512, 512));
// PWA icons — inverted for punch on a phone home screen: deep herbal-green
// gradient, mark in warm cream. (The old cream-on-cream icon washed out.)
const ICON_TOP = [0x40, 0x5e, 0x3c]; // lighter herbal green
const ICON_BOTTOM = [0x24, 0x3a, 0x22]; // deep forest
const ICON_INK = [0xf6, 0xf2, 0xe4]; // warm cream mark
write(
    'public/icons/icon-512.png',
    iconifyInverted(mark, 512, ICON_TOP, ICON_BOTTOM, ICON_INK),
);
write(
    'public/icons/icon-192.png',
    iconifyInverted(mark, 192, ICON_TOP, ICON_BOTTOM, ICON_INK),
);
write(
    'public/icons/icon-180.png',
    iconifyInverted(mark, 180, ICON_TOP, ICON_BOTTOM, ICON_INK),
);
// Maskable variant: the mark at 56% of the canvas so it survives Android's
// adaptive-icon crop (the safe zone is the central ~80% circle).
write(
    'public/icons/icon-maskable-512.png',
    iconifyInverted(mark, 512, ICON_TOP, ICON_BOTTOM, ICON_INK, 0.56),
);
