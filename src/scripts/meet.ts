// Bezoekersstatistiek zonder cookies (Plausible of GoatCounter, in te stellen in src/data/instellingen.json).
// Telt alleen acties die ertoe doen: iets in de offerte zetten, versturen, appen en bellen. Zonder instelling doet dit niets.
type Plausible = (naam: string) => void;
type GoatCounter = { count?: (o: { path: string; title: string; event: boolean }) => void };

export function meet(naam: string) {
  try {
    const w = window as unknown as { plausible?: Plausible; goatcounter?: GoatCounter };
    w.plausible?.(naam);
    w.goatcounter?.count?.({ path: naam, title: naam, event: true });
  } catch { /* statistiek mag de site nooit hinderen */ }
}
