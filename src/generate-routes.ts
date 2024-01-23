import {readdirSync, statSync, writeFileSync,} from 'fs';
import paddedDate from './padded-date.js';
import {Configuration} from "./configuration.js";
import TsxWriter from "./tsx-writer";
import JsxWriter from "./jsx-writer";
import SitemapWriter from "./sitemap-writer";
import Writer from "./writer";

export default (cwd: string, configuration: Configuration) => {
  const writers: Writer[] = [];
  if (configuration.routes.build && configuration.routes.type === 'tsx') {
    writers.push(new TsxWriter())
  }
  if (configuration.routes.build && configuration.routes.type === 'jsx') {
    writers.push(new JsxWriter())
  }
  if (configuration.sitemap.build) {
    writers.push(new SitemapWriter());
  }
  for (const file of readdirSync(cwd + '/' + configuration.fileFinder.pagesRoot, {encoding: 'utf8', recursive: true})) {
    if (file.endsWith('/' + configuration.fileFinder.fileName) || file.endsWith('\\' + configuration.fileFinder.fileName)) {
      const mtime = statSync(cwd + '/' + configuration.fileFinder.pagesRoot + '/' + file).mtime;
      const changed = paddedDate(mtime);
      const path = file.replace(/\\/ug, '/').substring(0, file.length - configuration.fileFinder.fileName.length - 1);
      const url = typeof configuration.routes.overridePathMappings[path] === 'string' ? configuration.routes.overridePathMappings[path] : `/${path}/`;
      for (const writer of writers) {
        writer.add(path, url, configuration.sitemap.domain, changed);
      }
    }
  }
  for (const writer of writers) {
    writeFileSync(cwd + '/' + writer.fileName(), writer.toString());
  }
};
