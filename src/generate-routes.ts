import {readdirSync, statSync, writeFileSync,} from 'fs';
import paddedDate from './padded-date.js';

const overrides = {
  home: '/',
  'not-found': '*',
}

export default (cwd: string, domain: string|undefined) => {
  if (!domain) {
    console.error('Domain needs to be provided as the first argument');
    return;
  }
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  let jsx = 'import React, {\n' +
      '  lazy,\n' +
      '  ReactElement,\n' +
      '  Suspense,\n' +
      '  ElementType,\n' +
      '} from \'react\';\n' +
      'export default const routes = (Loader) => [';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  for (const file of readdirSync(cwd + '/src/pages', {encoding: 'utf8', recursive: true})) {
    if (file.endsWith('/index.tsx') || file.endsWith('\\index.tsx')) {
      const mtime = statSync('./src/pages/' + file).mtime;
      const changed = paddedDate(mtime);
      const path = file.replace(/\\/ug, '/').replace(/\/index\.tsx$/, '');
      if (typeof overrides[path] === 'string') {
        if (overrides[path] !== '*') {
          xml += `<url><loc>https://${domain}${overrides[path]}/</loc>`;
          xml += `<lastmod>${changed}</lastmod></url>`;
        }
        jsx += `(() => {
  const LazyElement = lazy(() => import(
      \`./pages/${path}/index.tsx\`,
    ),);
    return {
      path: '${ overrides[path] }',
      exact: true,
      element: <Suspense fallback={<Loader/>}><LazyElement/></Suspense>,
    };
    })(),`;
      } else {
        xml += `<url><loc>https://${domain}/${ path }/</loc>`;
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

  writeFileSync(cwd + '/src/routes.jsx', jsx);
  writeFileSync(cwd + '/public/sitemap.xml', xml);
};
