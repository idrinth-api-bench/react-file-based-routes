import {
  readdirSync,
  readFileSync,
  mkdirSync,
  writeFileSync,
} from 'fs';
import minifier from 'html-minifier';
import {Configuration} from './configuration.ts';

export default (cwd: string, configuration: Configuration) => {
  const template = readFileSync(cwd + '/dist/index.html', 'utf8',);

  for (const file of readdirSync(cwd + configuration.fileFinder.distJSRoot, {encoding: 'utf8', recursive: true})) {
    if (file.endsWith('.js')) {
      const content = readFileSync(cwd + configuration.fileFinder.distJSRoot + '/' + file, 'utf8',);
      const res = content.match(/src\/pages\/(.*?)\/index.tsx/);
      if (res && res[1] && res[1] !== 'home' && res[1] !== 'not-found') {
        mkdirSync('./dist/' + res[1], {recursive: true},);
        writeFileSync(
          cwd + '/dist/' + res[1] + '/index.html',
          minifier.minify(
            template.replace(/<\/head>/, `<script src="/assets/${file}" type="module"></script></head>`),
            configuration.htmlMinify,
          ),
        );
      } else if (res && res[1] === 'home') {
        writeFileSync(
          cwd + '/dist/index.html',
          minifier.minify(
            template.replace(/<\/head>/, `<script src="/assets/${file}" type="module"></script></head>`),
            configuration.htmlMinify,
          ),
        );
      }
    }
  }
}
