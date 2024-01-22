import {readdirSync, statSync, writeFileSync,} from 'fs';
import paddedDate from './padded-date.js';
import {Configuration} from "./configuration.js";

export default (cwd: string, configuration: Configuration) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  let jsx = 'import React, {\n' +
    '  lazy,\n' +
    '  Suspense,\n' +
    '} from \'react\';\n' +
    'export default (Loader) => [';
  let tsx = 'import React, {\n' +
    '  lazy,\n' +
    '  Suspense,\n' +
    '  ElementType,\n' +
    '} from \'react\';\n' +
    'export default (Loader: ElementType) => [';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  for (const file of readdirSync(cwd + '/' + configuration.fileFinder.pagesRoot, {encoding: 'utf8', recursive: true})) {
    if (file.endsWith('/' + configuration.fileFinder.fileName) || file.endsWith('\\' + configuration.fileFinder.fileName)) {
      const mtime = statSync(cwd + '/' + configuration.fileFinder.pagesRoot + '/' + file).mtime;
      const changed = paddedDate(mtime);
      const path = file.replace(/\\/ug, '/').substring(0, file.length - configuration.fileFinder.fileName.length - 1);
      if (typeof configuration.routes.overridePathMappings[path] === 'string') {
        if (configuration.routes.overridePathMappings[path] !== '*') {
          xml += `<url><loc>https://${ configuration.sitemap.domain }${configuration.routes.overridePathMappings[path]}/</loc>`;
          xml += `<lastmod>${changed}</lastmod></url>`;
        }
        jsx += '\n  ' + `(() => {
    const LazyElement = lazy(() => import(
      \`./pages/${path}/index.tsx\`,
    ),);
    return {
      path: '${ configuration.routes.overridePathMappings[path] }',
      exact: true,
      element: <Suspense fallback={<Loader/>}><LazyElement/></Suspense>,
    };
    })(),`;
        tsx += `(() => {
    const LazyElement = lazy(() => import(
      \`./pages/${path}/index.tsx\`,
    ),);
    return {
      path: '${ configuration.routes.overridePathMappings[path] }',
      exact: true,
      element: <Suspense fallback={<Loader/>}><LazyElement/></Suspense>,
    };
    })(),`;
      } else {
        xml += `<url><loc>https://${configuration.sitemap.domain}/${path}/</loc>`;
        xml += `<lastmod>${changed}</lastmod></url>`;
        jsx += '\n  ' + `(() => {
    const LazyElement = lazy(() => import(
      \`./pages/${path}/index.tsx\`,
    ),);
    return {
      path: '/${path}/',
      exact: true,
      element: <Suspense fallback={<Loader/>}><LazyElement/></Suspense>,
    };
    })(),`;
        tsx += '\n  ' + `(() => {
    const LazyElement = lazy(() => import(
      \'./pages/${ path }/index.tsx\',
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
  jsx += '\n];'
  tsx += '\n];'

  if (configuration.routes.build && configuration.routes.type === 'jsx') {
    writeFileSync(cwd + '/src/routes.jsx', jsx);
  }
  if (configuration.routes.build && configuration.routes.type === 'tsx') {
    writeFileSync(cwd + '/src/routes.tsx', tsx);
  }
  if (configuration.sitemap.build) {
    writeFileSync(cwd + '/public/sitemap.xml', xml);
  }
};
