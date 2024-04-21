import Writer from './writer.js';

export default class JsxWriter implements Writer {
  fileName(): string {
    return 'src/routes.jsx';
  }
  protected items: string[] = [];
  constructor(private readonly waitReloadMS: number) {
  }
  // @ts-ignore TS6133
  add(path: string, url: string, changed: string): void
  {
    this.items.push(`  (() => {
      const LazyElement = buildLazyElement(OfflineLoader, RefreshLoader, './pages/${path}/index.tsx',);
      return {
        path: '${url}',
        exact: true,
        element: <Suspense fallback={<Loader/>}><LazyElement/></Suspense>,
      };
      })(),`
    );
  }
  toString(): string {
    return 'import React, {\n' +
      '  lazy,\n' +
      '  Suspense,\n' +
      '} from \'react\';\n\n' +
      'const buildLazyElement = (OfflineLoader, RefreshLoader, path,) => lazy(async() => {\n' +
      '  try {\n' +
      '    return await import(path);\n' +
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
      'export default (' +
      '  Loader,' +
      '  RefreshLoader = undefined,' +
      '  OfflineLoader = undefined,' +
      ') => [\n  '
      + this.items.join('\n  ')
      + '\n];\n'
  }
}
