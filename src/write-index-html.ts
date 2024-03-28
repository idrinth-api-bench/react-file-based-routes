import {Configuration} from './configuration.js';
import {mkdirSync, writeFileSync} from 'fs';

export default (cwd: string, jsFile: string, path: string, template: string, configuration: Configuration, cssPreload: string[], jsPreload: string[]) => {
  if (!configuration.fileBuilder.buildIndex) {
    return;
  }
  let preload = '';
  for (const css of cssPreload) {
    preload += `<link rel="preload" href="/assets/${ css }" as="style" type="text/css"/>`
  }
  for (const js of jsPreload) {
    if (! configuration.fileBuilder.appendPageChunk || js !== jsFile) {
      preload += `<link rel="preload" href="/assets/${js}" as="script" type="text/javascript"/>`;
    }
  }
  const target = cwd + '/dist' + path + 'index.html';
  mkdirSync('./dist' + path, {recursive: true},);
  if (! configuration.fileBuilder.appendPageChunk) {
    if (preload.length > 0) {
      writeFileSync(
        target,
        template.replace(/<\/head>/, `${ preload }</head>`),
      );
      return;
    }
    writeFileSync(target, template,);
    return;
  }
  writeFileSync(
    target,
    template.replace(
      /<\/head>/,
      `<script src="/assets/${jsFile}" type="module"></script>${ preload }</head>`,
    ),
  );
}
