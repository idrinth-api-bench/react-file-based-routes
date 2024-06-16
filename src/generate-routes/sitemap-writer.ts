import Writer from './writer.js';

export default class SitemapWriter implements Writer {
  fileName(): string {
    return 'public/sitemap.xml';
  }
  private items: string[] = [];
  constructor(private readonly domain: string) {
  }
  // @ts-ignore TS6133
  add(path: string, url: string, changed: string): void
  {
    if (url === '*') {
      return;
    }
    this.items.push(`<url><loc>https://${this.domain}${url}</loc><lastmod>${changed}</lastmod></url>`);
  }
  toString(): string {
    return '<?xml version="1.0" encoding="UTF-8"?>' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
      + this.items.join('')
      + '</urlset>'

  }
}
