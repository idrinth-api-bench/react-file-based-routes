import {Configuration} from './configuration.js';
import {mkdirSync, writeFileSync} from 'fs';

export default (cwd: string, jsFile: string, path: string, template: string, configuration: Configuration, preload: string) => {
  if (!configuration.fileBuilder.buildIndex) {
    return;
  }

  const target = cwd + '/dist' + path + 'index.html';
  mkdirSync('./dist' + path, {recursive: true},);
  if (! configuration.fileBuilder.appendPageChunk) {
    writeFileSync(
      target,
      template.replace(/<\/head>/, `${ preload }</head>`),
    );
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
