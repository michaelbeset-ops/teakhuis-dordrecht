// Live voorbeeld in het beheer: naast het formulier zie je het product zoals het op de site komt (foto's, prijs,
// maten, houtkleuren, omschrijving). Sveltia CMS stelt h (React.createElement) en marked beschikbaar op window.
(() => {
  const { CMS, h, marked } = window;
  if (!CMS) return;

  const css = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..125,500..800&family=Mulish:wght@400..800&display=swap');
:root { --inkt:#17201b; --grijs:#55605a; --blad:#6aab35; --diep:#36641a; --papier:#fbfaf7; --zand:#f1eee7; --lijn:#e3ddd1; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--papier); color: var(--inkt); font: 16px/1.6 Mulish, system-ui, sans-serif; }
.balk { position: sticky; top: 0; z-index: 2; background: var(--inkt); color: #fff; font-size: 13px; font-weight: 700; padding: 9px 16px; display: flex; gap: 8px; align-items: center; }
.balk svg { flex: none; }
.p { max-width: 1100px; margin: 0 auto; padding: 24px 16px 48px; display: grid; gap: 28px; }
@media (min-width: 560px) { .p { grid-template-columns: 1fr 1fr; gap: 28px; padding: 28px 24px 56px; } }
.kruim { font-size: 13px; color: var(--grijs); grid-column: 1 / -1; margin-bottom: -12px; }
.hoofd { aspect-ratio: 1; background: #fff; border-radius: 6px; overflow: hidden; display: grid; place-items: center; }
.hoofd img { width: 100%; height: 100%; object-fit: contain; }
.leeg { color: var(--grijs); font-size: 14px; text-align: center; padding: 24px; }
.duim { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
.duim img { width: 64px; height: 64px; object-fit: contain; background: #fff; border-radius: 4px; border: 1px solid var(--lijn); }
.duim img:first-child { border-color: var(--inkt); }
.label { font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: var(--diep); margin: 0; }
h1 { font-family: Archivo, sans-serif; font-stretch: 85%; font-weight: 700; font-size: clamp(28px, 4vw, 40px); line-height: 1.05; margin: 6px 0 0; }
.prijs { font-size: 22px; font-weight: 800; margin: 14px 0 0; }
.prijs small { font-size: 14px; font-weight: 600; color: var(--grijs); }
.kop { font-weight: 800; font-size: 14px; margin: 24px 0 8px; }
.maten { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; }
.maat { border: 1px solid var(--lijn); background: #fff; border-radius: 6px; padding: 10px 12px; font-size: 14px; font-weight: 700; }
.maat span { display: block; font-weight: 600; color: var(--grijs); font-size: 13px; }
.maat:first-child { border-color: var(--inkt); box-shadow: inset 0 0 0 1px var(--inkt); }
.maat.anders { border-style: dashed; color: var(--grijs); }
.kleuren { display: flex; gap: 10px; flex-wrap: wrap; }
.kleur { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; }
.kleur i { width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--lijn); }
.knop { margin-top: 26px; display: block; width: 100%; background: var(--blad); color: #fff; text-align: center; font-weight: 800; padding: 15px; border-radius: 6px; }
.oms { grid-column: 1 / -1; border-top: 1px solid var(--lijn); padding-top: 24px; max-width: 720px; color: #2c3530; }
.oms h2 { font-family: Archivo, sans-serif; font-stretch: 85%; font-size: 26px; margin: 0 0 8px; color: var(--inkt); }
.verborgen { background: #fff3cd; color: #6b4e00; font-size: 14px; font-weight: 700; padding: 10px 16px; }
`;
  CMS.registerPreviewStyle(css, { raw: true });

  const lijstVan = (v) => (v && typeof v.toJS === 'function' ? v.toJS() : Array.isArray(v) ? v : []);
  const euro = (n) => `€ ${Math.round(Number(n)).toLocaleString('nl-NL')},-`;
  const oog = h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
    h('path', { d: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z' }), h('circle', { cx: 12, cy: 12, r: 3 }));
  const houtkleuren = [['Blank teak', '#c8955c'], ['Thee kleur', '#9a6a3c'], ['Koloniale kleur', '#5e3b22'], ['Wit', '#efece4']];

  const Product = ({ entry, getAsset, fieldsMetaData }) => {
    const d = (k) => entry.getIn(['data', k]);
    const fotos = lijstVan(d('fotos')).filter(Boolean).map((f) => getAsset(f)?.url || f);
    const maten = lijstVan(d('maten')).filter((m) => m && m.label);
    const uitvoeringen = lijstVan(d('uitvoeringen')).filter(Boolean);
    const cat = d('categorie');
    const catNaam = (cat && fieldsMetaData?.getIn(['categorie', 'categorieen', cat, 'naam'])) || (cat ? cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ') : 'Categorie');
    const prijzen = maten.map((m) => Number(m.prijs)).filter((n) => n > 0);
    const vanaf = Number(d('prijsVanaf')) > 0 ? Number(d('prijsVanaf')) : prijzen.length ? Math.min(...prijzen) : 0;
    const oms = d('omschrijving') || '';

    return h('div', {},
      h('div', { className: 'balk' }, oog, 'Voorbeeld: zo ziet het product eruit op de site'),
      d('zichtbaar') === false ? h('div', { className: 'verborgen' }, 'Let op: dit product staat op verborgen en is niet te zien op de site.') : null,
      h('div', { className: 'p' },
        h('div', { className: 'kruim' }, `Home › ${catNaam} › ${d('titel') || ''}`),
        h('div', {},
          h('div', { className: 'hoofd' }, fotos[0] ? h('img', { src: fotos[0], alt: '' }) : h('div', { className: 'leeg' }, 'Nog geen foto. Voeg links een foto toe.')),
          fotos.length > 1 ? h('div', { className: 'duim' }, fotos.slice(0, 6).map((src, i) => h('img', { key: i, src, alt: '' }))) : null),
        h('div', {},
          h('p', { className: 'label' }, catNaam),
          h('h1', {}, d('titel') || 'Naam van het product'),
          h('p', { className: 'prijs' }, vanaf ? [h('small', { key: 'a' }, 'v.a. '), euro(vanaf)] : 'Prijs op aanvraag'),
          maten.length ? h('p', { className: 'kop' }, 'Kies je maat') : null,
          maten.length ? h('div', { className: 'maten' },
            maten.slice(0, 6).map((m, i) => h('div', { key: i, className: 'maat' }, m.label, Number(m.prijs) > 0 ? h('span', {}, euro(m.prijs)) : null)),
            d('maatwerk') !== false ? h('div', { className: 'maat anders' }, 'Andere maat nodig?') : null) : null,
          d('houtkleuren') ? h('p', { className: 'kop' }, 'Houtkleur') : null,
          d('houtkleuren') ? h('div', { className: 'kleuren' }, houtkleuren.map(([n, c]) => h('span', { key: n, className: 'kleur' }, h('i', { style: { background: c } }), n))) : null,
          uitvoeringen.length ? h('p', { className: 'kop' }, 'Uitvoering') : null,
          uitvoeringen.length ? h('div', { className: 'maten' }, uitvoeringen.map((u, i) => h('div', { key: i, className: 'maat' }, u))) : null,
          h('div', { className: 'knop' }, 'Zet in offerteaanvraag')),
        oms ? h('div', { className: 'oms' }, h('h2', {}, 'Over dit meubel'), h('div', { dangerouslySetInnerHTML: { __html: marked.parse(oms, { breaks: true }) } })) : null));
  };

  CMS.registerPreviewTemplate('producten', Product);
})();
