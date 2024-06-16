import Writer from './writer.js';

export default class JsxWriter implements Writer {
  fileName(): string {
    return 'src/routes.jsx';
  }
  protected items: string[] = [];
  constructor(private readonly waitReloadMS: number, private readonly useOutput: boolean,) {
  }
  // @ts-ignore TS6133
  add(path: string, url: string, changed: string): void
  {
    this.items.push(`  (() => {
      const LazyElement = buildLazyElement(OfflineLoader, RefreshLoader, import('./pages/${path}/index.tsx',),);
      return buildRoute(LazyElement, Loader, '${ url }',);
    })(),`
    );
  }
  toString(): string {
    return 'import React, {\n' +
      '  lazy,\n' +
      '  Suspense,\n' +
      '} from \'react\';\n' +
      (this.useOutput ? 'import {\n  Outlet,\n} from \'react-router-dom\';\n' : '' ) +
      '\n' +
      'const buildLazyElement = (OfflineLoader, RefreshLoader, imp,) => lazy(async() => {\n' +
      '  try {\n' +
      '    return await imp;\n' +
      '  } catch (e) {\n' +
      '    if (OfflineLoader && ! window.navigator.onLine) {\n' +
      '      return {default: OfflineLoader};\n' +
      '    }\n' +
      '    if (RefreshLoader) {\n' +
      `      window.setTimeout(() => window.location.reload(), ${this.waitReloadMS},);\n` +
      '      return {default: RefreshLoader};\n' +
      '    }\n' +
      '    throw e;\n' +
      '  }\n' +
      '},);\n\n' +
      'const buildRoute = (LazyElement, Loader, url) => {\n' +
      '  return {\n' +
      '    path: url,\n' +
      '    exact: true,\n' +
      '    element: <Suspense fallback={<Loader/>}><LazyElement/></Suspense>,\n' +
      '  }\n' +
      '};\n\n' +
      'export default (' +
      '  Loader,' +
      (this.useOutput ? '  Layout,' : '' ) +
      '  RefreshLoader = undefined,' +
      '  OfflineLoader = undefined,' +
      ') => [\n  '
      + (this.useOutput ? '{element: <Layout><Outlet/></Layout>, children: [\n' : '')
      + this.items.join('\n  ')
      + (this.useOutput ? '\n]}' : '')
      + '\n];\n'
  }
}
