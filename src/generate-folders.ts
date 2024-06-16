import {
  readdirSync,
  readFileSync,
} from 'fs';
import minifier from 'html-minifier';
import {Configuration} from './configuration/configuration.js';
import generatePreload from "./generate-folders/preload.js";
import writeIndexHtmls from "./generate-folders/write-index-htmls.js";

export default (cwd: string, configuration: Configuration) => {
  const template = (() => {
    const data = readFileSync(cwd + '/dist/index.html', 'utf8',);
    if (configuration.fileBuilder.minifyPages) {
      return minifier.minify(data, configuration.htmlMinify);
    }
    return data;
  })();
  const matcher = cwd.includes('\\')
    ? new RegExp(`="${cwd.replace(/\\/ug, '\\\\')}\\\\${configuration.fileFinder.pagesRoot.replace(/\//, '\\\\')}\\\\([^"]*?)${configuration.fileFinder.fileName}"`, 'u')
    : new RegExp(`="${cwd}/${configuration.fileFinder.pagesRoot}/([^"]*?)${configuration.fileFinder.fileName}"`, 'u');
  const fileName = configuration.fileFinder.fileName.replace(/\.tsx$/, '-');
  const files = readdirSync(cwd + '/' + configuration.fileFinder.distJSRoot, {encoding: 'utf8', recursive: true});
  const preload = generatePreload(configuration, files, cwd);
  writeIndexHtmls(files, configuration, fileName, cwd, template, preload, matcher);
}
