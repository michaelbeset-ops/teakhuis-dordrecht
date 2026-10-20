// node tools/sheet.mjs <map> <uit.jpg> [kolommen] [tegel]: contactsheet met nummers
import sharp from 'sharp'; import fs from 'node:fs'; import path from 'node:path';
const [dir, uit, kol = 4, t = 300] = process.argv.slice(2); const K = +kol, T = +t;
const fs_ = fs.readdirSync(dir).filter(f => /\.(jpe?g|png|webp)$/i.test(f)).sort();
const rows = Math.ceil(fs_.length / K); const comp = [];
for (let i = 0; i < fs_.length; i++) {
  const buf = await sharp(path.join(dir, fs_[i])).resize(T, T, { fit: 'contain', background: '#222' }).toBuffer();
  const lab = Buffer.from(`<svg width="${T}" height="24"><rect width="${T}" height="24" fill="#000a"/><text x="6" y="17" font-size="15" fill="#fff" font-family="Arial">${fs_[i]}</text></svg>`);
  comp.push({ input: buf, left: (i % K) * T, top: Math.floor(i / K) * T }, { input: lab, left: (i % K) * T, top: Math.floor(i / K) * T });
}
await sharp({ create: { width: K * T, height: rows * T, channels: 3, background: '#111' } }).composite(comp).jpeg({ quality: 82 }).toFile(uit);
console.log(fs_.length);
