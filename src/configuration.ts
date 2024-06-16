import {Configuration} from './configuration/configuration.js';
import cli from './configuration/cli.js';
import file from './configuration/file.js';

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
      useOutput: false,
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
  file(cwd, config,)
  cli(cliArguments, config,);
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
