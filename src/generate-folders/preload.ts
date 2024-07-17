import {createHash} from "crypto";
import {minify} from "@putout/minify";
import {writeFileSync} from "fs";
import {Configuration} from "../configuration/configuration.js";

export default (configuration: Configuration, files: string[], cwd: string)  => {
  const cssFiles = [];
  const jsFiles = [];
  if (configuration.fileBuilder.preLoadCSS) {
    for (const file of files) {
      if (file.endsWith('.css',) && ! file.startsWith('index-',) && ! file.startsWith('iabrfbr-',)) {
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
  return (() => {
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
      a('src', '/assets/iabrfbr-${name}.js');
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
        `${cwd}/${configuration.fileFinder.distJSRoot}/iabrfbr-${name}.js`,
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
        `${cwd}/${configuration.fileFinder.distJSRoot}/iabrfbr-${name}.js`,
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
        `${cwd}/${configuration.fileFinder.distJSRoot}/iabrfbr-${name}.js`,
        minify(script),
        'utf8'
      );
      return tag;
    }
    return '';
  })();
}
