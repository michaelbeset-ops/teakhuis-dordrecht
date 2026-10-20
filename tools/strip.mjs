// Zet de stukken van een full-screenshot naast elkaar (overzicht mobiel).
import sharp from 'sharp';
const [src, uit, W = 390, H = 2400] = process.argv.slice(2); const w = +W, hh = +H;
const m = await sharp(src).metadata(); const comp = []; let x = 0;
for (let y = 0; y < m.height; y += hh) { const h = Math.min(hh, m.height - y); comp.push({ input: await sharp(src).extract({ left: 0, top: y, width: w, height: h }).toBuffer(), left: x, top: 0 }); x += w + 20; }
await sharp({ create: { width: x, height: hh, channels: 3, background: '#777' } }).composite(comp).jpeg({ quality: 80 }).toFile(uit);
