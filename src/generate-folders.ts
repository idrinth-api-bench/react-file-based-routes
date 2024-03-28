import {
  readdirSync,
  readFileSync, writeFileSync,
} from 'fs';
import minifier from 'html-minifier';
import {Configuration} from './configuration.js';
import writeIndexHtml from "./write-index-html.js";
import {
  minify,
} from '@putout/minify';
import {
  createHash,
} from 'crypto';

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
      if (file.endsWith('.css',) && ! file.startsWith('index-',) && ! file.startsWith('irfbr-',)) {
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
  const preload = (() => {
    const func = `const header = document.getElementsByTagName('header')[0];
        const append = (type, as, file) => {
          const prefetch = document.createElement('link');
          prefetch.setAttribute('href', '/assets/' + file);
          prefetch.setAttribute('type', type);
          prefetch.setAttribute('rel', 'preload');
          prefetch.setAttribute('as', as);
          header.appendChild(prefetch);
        };`;
    const name = createHash('sha256')
      .update(JSON.stringify(jsFiles) + JSON.stringify(cssFiles))
      .digest('hex');
    const loader = minify(`setTimeout(() => {
      const d = document;
      const s = d.createElement('script');
      const a = (t, v) => s.setAttribute(t, v);
      a('type', 'application/javascript');
      a('src', '/assets/irfbr-${name}.js');
      d.getElementsByTagName('header')[0].appendChild(s);
    }, ${ configuration.fileBuilder.preloadStartDelay });`);
    const tag = `<script type="text/javascript">${ loader }</script>`;
    if (jsFiles.length > 0 && cssFiles.length > 0) {
      const script = `(() => {
        ${ func }
        for (const css of ${JSON.stringify(cssFiles)}) {
          append('text/css', 'style', css);
        }
        for (const js of ${JSON.stringify(jsFiles)}) {
          append('application/javascript', 'script', js);
        }
      })();`;
      writeFileSync(
        `${cwd}/${configuration.fileFinder.distJSRoot}/irfbr-${name}.js`,
        minify(script),
        'utf8'
      );
      return tag;
    }
    if (cssFiles.length > 0) {
      const script = `(() => {
        ${ func }
        for (const css of ${JSON.stringify(cssFiles)}) {
          append('text/css', 'style', css);
        }
      })();`;
      writeFileSync(
        `${cwd}/${configuration.fileFinder.distJSRoot}/irfbr-${name}.js`,
        minify(script),
        'utf8'
      );
      return tag;
    }
    if (jsFiles.length > 0) {
      const script = `(() => {
        ${ func }
        for (const js of ${JSON.stringify(jsFiles)}) {
          append('application/javascript', 'script', js);
        }
      })();`;
      writeFileSync(
        `${cwd}/${configuration.fileFinder.distJSRoot}/irfbr-${name}.js`,
        minify(script),
        'utf8'
      );
      return tag;
    }
    return '';
  })();
  for (const file of files) {
    if (file.endsWith('.js') && file.startsWith(fileName)) {
      const content = readFileSync(cwd + '/' + configuration.fileFinder.distJSRoot + '/' + file, 'utf8',);
      const res = matcher.exec(content);
      if (res && res[1]) {
        const pageName = res[1].replace(/\/$/u, '');
        if (typeof configuration.routes.overridePathMappings[pageName] === 'string') {
          if (configuration.routes.overridePathMappings[pageName] !== '*') {
            writeIndexHtml(cwd, file, configuration.routes.overridePathMappings[pageName], template, configuration, preload);
          } else {
            writeIndexHtml(cwd, file, '/', template, configuration, preload);
          }
        } else {
          writeIndexHtml(cwd, file, `/${ pageName }/`, template, configuration, preload);
        }
      }
    }
  }
}
