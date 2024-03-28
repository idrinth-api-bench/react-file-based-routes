import {
  readdirSync,
  readFileSync,
} from 'fs';
import minifier from 'html-minifier';
import {Configuration} from './configuration.js';
import writeIndexHtml from "./write-index-html.js";

export default (cwd: string, configuration: Configuration) => {
  const template = (() => {
    const data = readFileSync(cwd + '/dist/index.html', 'utf8',);
    if (configuration.fileBuilder.minifyPages) {
      return minifier.minify(data, configuration.htmlMinify);
    }
    return data;
  })();
  const matcher = new RegExp(`="${cwd}/${configuration.fileFinder.pagesRoot}/([^"]*?)${configuration.fileFinder.fileName}"`, 'u');
  const fileName = configuration.fileFinder.fileName.replace(/\.tsx$/, '-');
  const cssFiles = [];
  const jsFiles = [];
  const files = readdirSync(cwd + '/' + configuration.fileFinder.distJSRoot, {encoding: 'utf8', recursive: true});
  if (configuration.fileBuilder.preLoadCSS) {
    for (const file of files) {
      if (file.endsWith('.css',) && ! file.startsWith('index-',)) {
        cssFiles.push(file,);
      }
    }
  }
  if (configuration.fileBuilder.preLoadJS) {
    for (const file of files) {
      if (file.endsWith('.js',)) {
        jsFiles.push(file,);
      }
    }
  }
  for (const file of files) {
    if (file.endsWith('.js') && file.startsWith(fileName)) {
      const content = readFileSync(cwd + '/' + configuration.fileFinder.distJSRoot + '/' + file, 'utf8',);
      const res = matcher.exec(content);
      if (res && res[1]) {
        if (typeof configuration.routes.overridePathMappings[res[1]] === 'string') {
          if (configuration.routes.overridePathMappings[res[1]] !== '*') {
            writeIndexHtml(cwd, file, configuration.routes.overridePathMappings[res[1]], template, configuration, cssFiles, jsFiles);
          }
        } else {
          writeIndexHtml(cwd, file, `/${ res[1] }/`, template, configuration, cssFiles, jsFiles);
        }
      }
    }
  }
}
