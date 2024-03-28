import {
  readFileSync,
  existsSync,
} from 'fs';

interface Sitemap {
  domain: string,
  build: boolean,
}
interface Routes {
  build: boolean,
  type: 'tsx'|'jsx',
  overridePathMappings: {
    [filesystemPath: string]: string,
  },
}
interface HTMLMinify {
  collapseBooleanAttributes: boolean,
  conservativeCollapse: boolean,
  collapseWhitespace: boolean,
  removeAttributeQuotes: boolean,
  removeComments: boolean,
}
interface FileBuilder {
  buildIndex: boolean,
  minifyPages: boolean,
  appendPageChunk: boolean,
  preLoadCSS: boolean,
  preLoadJS: boolean,
  preloadStartDelay: number,
}
interface FileFinder {
  fileName: string,
  pagesRoot: string,
  distJSRoot: string,
}
interface Runtime {
  reloadWaitMs: number,
}
export interface Configuration {
  runtime: Runtime,
  sitemap: Sitemap,
  routes: Routes,
  htmlMinify: HTMLMinify,
  fileBuilder: FileBuilder,
  fileFinder: FileFinder,
}

export default (cwd: string, cliArguments: string[]): Configuration => {
  const config: Configuration = {
    sitemap: {
      build: true,
      domain: '',
    },
    runtime: {
      reloadWaitMs: 0,
    },
    routes: {
      build: true,
      type: 'tsx',
      overridePathMappings: {
        home: '/',
        'not-found': '*',
      },
    },
    htmlMinify: {
      collapseBooleanAttributes: true,
      conservativeCollapse: false,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true,
    },
    fileFinder: {
      fileName: 'index.tsx',
      pagesRoot: 'src/pages',
      distJSRoot: 'dist/assets',
    },
    fileBuilder: {
      buildIndex: true,
      minifyPages: true,
      appendPageChunk: true,
      preLoadCSS: true,
      preLoadJS: true,
      preloadStartDelay: 5000,
    },
  };
  const configFile = cwd + '/.idrinth-react-file-based-routes.json';
  if (existsSync(configFile)) {
    const userconfig: Configuration = JSON.parse(readFileSync(configFile, 'utf-8'));
    if (typeof userconfig === 'object') {
      for (const prop of Object.keys(config) as [keyof Configuration]) {
        if (typeof userconfig[prop] === 'object' && typeof config[prop] === 'object') {
          for (const setting of Object.keys(config[prop]) as [keyof Configuration[typeof prop]]) {
            if (typeof config[prop][setting] === typeof userconfig[prop][setting]) {
              config[prop][setting] = userconfig[prop][setting];
            }
          }
        }
      }
    }
  }
  for (const param of cliArguments) {
    if (param.startsWith('--')) {
      const [setting, value,] = param.substring(2).split('=') as [string, undefined|string];
      const [group, detail,] = setting.split('.') as [keyof Configuration, keyof Runtime|keyof Sitemap|keyof Routes|keyof FileFinder|keyof FileBuilder|keyof HTMLMinify];
      if (group && typeof config[group] === 'object' && detail) {
        // @ts-ignore TS7053
        if (typeof config[group][detail] === 'boolean') {
          if (value === 'true') {
            // @ts-ignore TS7053
            config[group][detail] = true;
          } else if (value === 'false') {
            // @ts-ignore TS7053
            config[group][detail] = false;
          } else {
            // @ts-ignore TS7053
            config[group][detail] = !config[group][detail];
          }
        // @ts-ignore TS7053
        } else if (typeof config[group][detail] === 'string' && value) {
          // @ts-ignore TS7053
          config[group][detail] = value;
        }
      }
    }
  }
  if (config.sitemap.build && !config.sitemap.domain) {
    throw new Error('sitemap.domain must be set if a sitemap should be build.');
  }
  if (config.routes.type !== 'tsx' && config.routes.type !== 'jsx') {
    throw new Error('config.routes.type must be set to either tsx or jsx.');
  }
  if (config.runtime.reloadWaitMs < 0) {
    throw new Error('config.runtime.reloadWaitMs must be set to at least 0.');
  }
  return config;
}
