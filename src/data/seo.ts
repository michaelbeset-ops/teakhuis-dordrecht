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
