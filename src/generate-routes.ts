import {readdirSync, statSync, writeFileSync,} from 'fs';
import paddedDate from './padded-date.js';
import {Configuration} from "./configuration.ts";

export default (cwd: string, configuration: Configuration) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  let jsx = 'import React, {\n' +
      '  lazy,\n' +
      '  ReactElement,\n' +
      '  Suspense,\n' +
      '  ElementType,\n' +
      '} from \'react\';\n' +
      'export default const routes = (Loader) => [';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  for (const file of readdirSync(cwd +  configuration.fileFinder.pagesRoot, {encoding: 'utf8', recursive: true})) {
    if (file.endsWith('/' + configuration.fileFinder.fileName) || file.endsWith('\\' + configuration.fileFinder.fileName)) {
      const mtime = statSync(cwd + configuration.fileFinder.pagesRoot + file).mtime;
      const changed = paddedDate(mtime);
      const path = file.replace(/\\/ug, '/').substring(0, file.length - configuration.fileFinder.fileName.length - 1);
      if (typeof configuration.fileFinder.overridePathMappings[path] === 'string') {
        if (configuration.fileFinder.overridePathMappings[path] !== '*') {
          xml += `<url><loc>https://${ configuration.sitemap.domain }${configuration.fileFinder.overridePathMappings[path]}/</loc>`;
          xml += `<lastmod>${changed}</lastmod></url>`;
        }
        jsx += `(() => {
  const LazyElement = lazy(() => import(
      \`./pages/${path}/index.tsx\`,
    ),);
    return {
      path: '${ configuration.fileFinder.overridePathMappings[path] }',
      exact: true,
      element: <Suspense fallback={<Loader/>}><LazyElement/></Suspense>,
    };
    })(),`;
      } else {
        xml += `<url><loc>https://${ configuration.sitemap.domain }/${ path }/</loc>`;
        xml += `<lastmod>${ changed }</lastmod></url>`;
        jsx += `(() => {
  const LazyElement = lazy(() => import(
      \`./pages/${ path }/index.tsx\`,
    ),);
    return {
      path: '/${ path }/',
      exact: true,
      element: <Suspense fallback={<Loader/>}><LazyElement/></Suspense>,
    };
    })(),`;
      }
    }
  }
  xml += '</urlset>';
  jsx += '];'

  if (configuration.routes.build) {
    writeFileSync(cwd + '/src/routes.jsx', jsx);
  }
  if (configuration.sitemap.build) {
    writeFileSync(cwd + '/public/sitemap.xml', xml);
  }
};
