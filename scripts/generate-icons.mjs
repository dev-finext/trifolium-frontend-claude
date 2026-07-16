// Generates the PWA icon set — the Trifolium trefoil (three overlapping
// circles, as in the brand logo) drawn in white line-work on the brand green.
// Pure Node, no image libraries: pixels are computed directly and packed into
// PNGs. Sized for the maskable safe zone (motif within the inner ~60%).
//
//   node scripts/generate-icons.mjs   → public/icons/icon-{180,192,512}.png
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const outDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../public/icons',
);
fs.mkdirSync(outDir, { recursive: true });

// ── minimal PNG encoder (RGB, 8-bit) ────────────────────────────────────────
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
const crc32 = (buf) => {
    let c = 0xffffffff;

    for (const b of buf) {
        c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
    }

    return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));

    return Buffer.concat([len, body, crc]);
};
function png(size, pixelAt) {
    const raw = Buffer.alloc(size * (1 + size * 3));

    for (let y = 0; y < size; y++) {
        const o = y * (1 + size * 3);
        raw[o] = 0;

        for (let x = 0; x < size; x++) {
            const [r, g, b] = pixelAt(x, y);
            const p = o + 1 + x * 3;
            raw[p] = r;
            raw[p + 1] = g;
            raw[p + 2] = b;
        }
    }

    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(size, 0);
    ihdr.writeUInt32BE(size, 4);
    ihdr[8] = 8;
    ihdr[9] = 2;

    return Buffer.concat([
        Buffer.from('89504e470d0a1a0a', 'hex'),
        chunk('IHDR', ihdr),
        chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
        chunk('IEND', Buffer.alloc(0)),
    ]);
}

// ── the trefoil mark ─────────────────────────────────────────────────────────
const BG = [0x3d, 0x5a, 0x3a]; // brand accent green
const FG = [0xf6, 0xf8, 0xf5]; // near-white sage
const mix = (a, b, t) =>
    [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t));

function makeIcon(size) {
    // Brand-logo geometry (viewBox 32×20): circles at (10,8) (22,8) (16,14), r=6.
    const s = size / 34; // motif spans ~60% of the canvas
    const cx = size / 2,
        cy = size / 2;
    const circles = [
        [cx + (10 - 16) * s, cy + (8 - 11) * s],
        [cx + (22 - 16) * s, cy + (8 - 11) * s],
        [cx + (16 - 16) * s, cy + (14 - 11) * s],
    ];
    const R = 6 * s;
    const stroke = Math.max(1.6, size * 0.024);

    return png(size, (x, y) => {
        // distance to the nearest circle OUTLINE (ring), anti-aliased
        let d = Infinity;

        for (const [ox, oy] of circles) {
            const dist = Math.abs(Math.hypot(x + 0.5 - ox, y + 0.5 - oy) - R);

            if (dist < d) {
                d = dist;
            }
        }

        const half = stroke / 2;

        if (d <= half - 0.5) {
            return FG;
        }

        if (d >= half + 0.5) {
            return BG;
        }

        return mix(FG, BG, d - (half - 0.5)); // 1px soft edge
    });
}

for (const size of [180, 192, 512]) {
    const file = path.join(outDir, `icon-${size}.png`);
    fs.writeFileSync(file, makeIcon(size));
    console.log(`${file} (${fs.statSync(file).size} bytes)`);
}
