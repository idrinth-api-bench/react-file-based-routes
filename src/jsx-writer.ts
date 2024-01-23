import Writer from './writer.js';

export default class JsxWriter implements Writer {
  fileName(): string {
    return 'src/routes.jsx';
  }
  private items: string[] = [];
  add(path: string, url: string, domain: string, changed: string): void
  {
    this.items.push('  ' + `(() => {
    const LazyElement = lazy(() => import(
      \'./pages/${path}/index.tsx\',
    ),);
    return {
      path: \'${url}\',
      exact: true,
      element: <Suspense fallback={<Loader/>}><LazyElement/></Suspense>,
    };
    })(),`);
  }
  toString(): string {
    return 'import React, {\n' +
      '  lazy,\n' +
      '  Suspense,\n' +
      '} from \'react\';\n' +
      'export default (Loader) => [\n  '
      + this.items.join('\n  ')
      + '\n];'
  }
}
