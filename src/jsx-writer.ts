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
      const LazyElement = lazy(async() => {
        try {
          return await import(
            './pages/${path}/index.tsx',
          );
        } catch (e) {
          if (OfflineLoader && ! window.navigator.onLine) {
            return {default: OfflineLoader};
          }
          if (RefreshLoader) {
            window.setTimeout(() => window.location.reload(), ${this.waitReloadMS},);
            return {default: RefreshLoader};
          }
          throw e;
        }
      },);
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
      'export default (' +
      '  Loader,' +
      '  RefreshLoader = undefined,' +
      '  OfflineLoader = undefined,' +
      ') => [\n  '
      + this.items.join('\n  ')
      + '\n];\n'
  }
}
