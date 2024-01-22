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
  const matcher = new RegExp(`${configuration.fileFinder.distJSRoot}/(.*?)${configuration.fileFinder.fileName}`);
  const fileName = configuration.fileFinder.fileName.replace(/\.tsx$/, '-');

  for (const file of readdirSync(cwd + '/' + configuration.fileFinder.distJSRoot, {encoding: 'utf8', recursive: true})) {
    if (file.endsWith('.js') && file.startsWith(fileName)) {
      const content = readFileSync(cwd + '/' + configuration.fileFinder.distJSRoot + '/' + file, 'utf8',);
      const res = matcher.exec(content);
      if (res && res[1]) {
        if (typeof configuration.routes.overridePathMappings[res[1]] === 'string') {
          if (configuration.routes.overridePathMappings[res[1]] !== '*') {
            writeIndexHtml(cwd, file, configuration.routes.overridePathMappings[res[1]], template, configuration);
          }
        } else {
          writeIndexHtml(cwd, file, `/${ res[1] }/`, template, configuration);
        }
      }
    }
  }
}
