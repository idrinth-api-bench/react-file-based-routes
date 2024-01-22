import {readFileSync, existsSync} from 'fs';

export interface Configuration {
  sitemap: {
    domain: string,
    build: boolean,
  },
  routes: {
    build: boolean
  },
  htmlMinify: {
    collapseBooleanAttributes: boolean,
    conservativeCollapse: boolean,
    collapseWhitespace: boolean,
    removeAttributeQuotes: boolean,
    removeComments: boolean,
  },
  fileBuilder: {
    buildIndex: boolean,
    minifyPages: boolean,
    appendPageChunk: boolean,
  },
  fileFinder: {
    fileName: string,
    overridePathMappings: {
      [filesystemPath: string]: string,
    },
    pagesRoot: string,
    distJSRoot: string,
  },
}

export default (cwd: string): Configuration => {
  const config = {
    sitemap: {
      build: true,
      domain: '',
    },
    routes: {
      build: true,
    },
    htmlMinify: {
      collapseBooleanAttributes: true,
      conservativeCollapse: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true,
    },
    fileFinder: {
      fileName: 'index.tsx',
      overridePathMappings: {
        home: '/',
        'not-found': '*',
      },
      pagesRoot: 'src/pages',
      distJSRoot: 'dist/assets',
    },
    fileBuilder: {
      buildIndex: true,
      minifyPages: true,
      appendPageChunk: true,
    },
  };
  const configFile = cwd + '/.idrinth-react-file-based-routes.json';
  if (existsSync(configFile)) {
    const userconfig = JSON.parse(readFileSync(configFile, 'utf-8'));
    if (typeof userconfig === 'object') {
      for (const prop of Object.keys(config)) {
        if (typeof userconfig[prop] === 'object') {
          for (const setting of Object.keys(config[prop])) {
            if (typeof config[prop][setting] === typeof userconfig[prop][setting]) {
              config[prop][setting] = userconfig[prop][setting];
            }
          }
        }
      }
    }
  }
  if (config.sitemap.build && !config.sitemap.domain) {
    throw new Error('sitemap.domain must be set if a sitemap should be build.');
  }
  return config;
}
