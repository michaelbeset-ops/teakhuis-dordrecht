// Structured data die op meerdere pagina's terugkomt.
import { absoluut, url } from './site';

export type Stap = [string, string?];

// Kruimelpad als BreadcrumbList; de laatste stap is de pagina zelf (hier = absolute URL).
export const kruimelSchema = (stappen: Stap[], hier: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [['Home', url('')] as Stap, ...stappen].map(([naam, href], i, a) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: naam,
    item: i === a.length - 1 ? hier : new URL(href!, absoluut('')).href,
  })),
});

// Veelgestelde vragen als FAQPage; dezelfde lijst wordt op de pagina getoond.
export const vragenSchema = (vragen: [string, string][]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: vragen.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});
