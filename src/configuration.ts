import {
  readFileSync,
  existsSync,
} from 'fs';

export interface Configuration {
  sitemap: {
    domain: string,
    build: boolean,
  },
  routes: {
    build: boolean,
    type: 'tsx'|'jsx',
    overridePathMappings: {
      [filesystemPath: string]: string,
    },
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
    pagesRoot: string,
    distJSRoot: string,
  },
}

export default (cwd: string, cliArguments: string[]): Configuration => {
  const config: Configuration = {
    sitemap: {
      build: true,
      domain: '',
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
    },
  };
  const configFile = cwd + '/.idrinth-react-file-based-routes.json';
  if (existsSync(configFile)) {
    const userconfig: Partial<Configuration> = JSON.parse(readFileSync(configFile, 'utf-8'));
    if (typeof userconfig === 'object') {
      for (const prop of Object.keys(config)) {
        if (typeof userconfig[prop] === 'object' && typeof config[prop] === 'object') {
          for (const setting of Object.keys(config[prop])) {
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
      const [setting, value,] = param.substring(2).split('=');
      const [group, detail,] = setting.split('.');
      if (group && typeof config[group] === 'object' && detail) {
        if (typeof config[group][detail] === 'boolean') {
          config[group][detail] = !config[group][detail];
        } else if(typeof config[group][detail] === 'string' && value) {
          config[group][detail] = value;
        }
      }
    }
  }
  if (config.sitemap.build && !config.sitemap.domain) {
    throw new Error('sitemap.domain must be set if a sitemap should be build.');
  }
  return config;
}
