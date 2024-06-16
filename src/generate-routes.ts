import {readdirSync, statSync, writeFileSync,} from 'fs';
import paddedDate from './generate-routes/padded-date.js';
import TsxWriter from './generate-routes/tsx-writer.js';
import JsxWriter from './generate-routes/jsx-writer.js';
import SitemapWriter from './generate-routes/sitemap-writer.js';
import Writer from './generate-routes/writer.js';
import {Configuration} from './configuration/configuration.js';

export default (cwd: string, configuration: Configuration) => {
  const writers: Writer[] = [];
  if (configuration.routes.build && configuration.routes.type === 'tsx') {
    writers.push(new TsxWriter(configuration.runtime.reloadWaitMs, configuration.routes.useOutput,))
  }
  if (configuration.routes.build && configuration.routes.type === 'jsx') {
    writers.push(new JsxWriter(configuration.runtime.reloadWaitMs, configuration.routes.useOutput,))
  }
  if (configuration.sitemap.build) {
    writers.push(new SitemapWriter(configuration.sitemap.domain));
  }
  for (const file of readdirSync(cwd + '/' + configuration.fileFinder.pagesRoot, {encoding: 'utf8', recursive: true})) {
    if (file.endsWith('/' + configuration.fileFinder.fileName) || file.endsWith('\\' + configuration.fileFinder.fileName)) {
      const mtime = statSync(cwd + '/' + configuration.fileFinder.pagesRoot + '/' + file).mtime;
      const changed = paddedDate(mtime);
      const path = file.replace(/\\/ug, '/').substring(0, file.length - configuration.fileFinder.fileName.length - 1);
      const url = typeof configuration.routes.overridePathMappings[path] === 'string' ? configuration.routes.overridePathMappings[path] : `/${path}/`;
      for (const writer of writers) {
        writer.add(path, url, changed);
      }
    }
  }
  for (const writer of writers) {
    writeFileSync(cwd + '/' + writer.fileName(), writer.toString());
  }
};
