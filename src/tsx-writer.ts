import Writer from './writer.js';

export default class TsxWriter implements Writer {
  fileName(): string {
      return 'src/routes.tsx';
  }
  protected items: string[] = [];
  constructor(private readonly waitReloadMS: number) {
  }
  // @ts-ignore TS6133
  add(path: string, url: string, changed: string): void
  {
    this.items.push(`  (() => {
      const LazyElement = lazy(async(): Promise\<{default: ComponentType<any>;}\> => {
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
      '  ElementType,\n' +
      '  ComponentType,\n' +
      '} from \'react\';\n\n' +
      'export default (\n' +
      '  Loader: ElementType,\n' +
      '  RefreshLoader: ComponentType|undefined = undefined,\n' +
      '  OfflineLoader: ComponentType|undefined = undefined,\n' +
      ') => [\n  '
      + this.items.join('\n  ')
      + '\n];\n'
  }
}
