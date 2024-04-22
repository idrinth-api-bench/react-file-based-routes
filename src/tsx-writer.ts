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
      const LazyElement = buildLazyElement(OfflineLoader, RefreshLoader, import('./pages/${path}/index.tsx',),);
      return buildRoute(LazyElement, Loader, '${ url }');;
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
      'const buildLazyElement = (\n' +
      '  OfflineLoader: ComponentType|undefined,\n' +
      '  RefreshLoader: ComponentType|undefined,\n' +
      '  imp: Promise<{default: ComponentType<any>}>,\n' +
      ') => lazy(async() => {\n' +
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
      'const buildRoute = (' +
      '  LazyElement: ComponentType|ElementType,' +
      '  Loader: ElementType,' +
      '  url: string,' +
      ') => {\n' +
      '  return {\n' +
      '    path: url,\n' +
      '    exact: true,\n' +
      '    element: <Suspense fallback={<Loader/>}><LazyElement/></Suspense>,\n' +
      '  };\n' +
      '};\n\n' +
      'export default (\n' +
      '  Loader: ElementType,\n' +
      '  RefreshLoader: ComponentType|undefined = undefined,\n' +
      '  OfflineLoader: ComponentType|undefined = undefined,\n' +
      ') => [\n  '
      + this.items.join('\n  ')
      + '\n];\n'
  }
}
