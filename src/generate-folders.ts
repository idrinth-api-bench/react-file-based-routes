import {
  readdirSync,
  readFileSync,
  mkdirSync,
  writeFileSync,
} from 'fs';
import minifier from 'html-minifier';

const minifierOptions = {
  collapseBooleanAttributes: true,
  conservativeCollapse: true,
  collapseWhitespace: true,
  removeAttributeQuotes: true,
  removeComments: true,
};

export default (cwd: string) => {
  const template = readFileSync(cwd + '/dist/index.html', 'utf8',);

  for (const file of readdirSync(cwd + '/dist/assets')) {
    if (file.endsWith('.js') && file.startsWith('index-')) {
      const content = readFileSync(cwd + '/dist/assets/' + file, 'utf8',);
      const res = content.match(/src\/pages\/(.*?)\/index.tsx/);
      if (res && res[1] && res[1] !== 'home' && res[1] !== 'not-found') {
        mkdirSync('./dist/' + res[1], {recursive: true},);
        writeFileSync(
            cwd + '/dist/' + res[1] + '/index.html',
            minifier.minify(
                template.replace(/<\/head>/, `<script src="/assets/${file}" type="module"></script></head>`),
                minifierOptions,
            ),
        );
      } else if (res && res[1] === 'home') {
        writeFileSync(
            cwd + '/dist/index.html',
            minifier.minify(
                template.replace(/<\/head>/, `<script src="/assets/${file}" type="module"></script></head>`),
                minifierOptions,
            ),
        );
      }
    }
  }
}
