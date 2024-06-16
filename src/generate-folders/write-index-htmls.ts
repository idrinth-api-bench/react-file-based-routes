import {readFileSync} from "fs";
import writeIndexHtml from "./write-index-html.js";
import {Configuration} from "../configuration/configuration.js";

export default (files: string[], configuration: Configuration, fileName: string, cwd: string, template: string, preload: string, matcher: RegExp) => {
  for (const file of files) {
    if (file.endsWith('.js') && file.startsWith(fileName)) {
      const content = readFileSync(cwd + '/' + configuration.fileFinder.distJSRoot + '/' + file, 'utf8',);
      const res = matcher.exec(content);
      if (res?.[1]) {
        const pageName = res[1].replace(/[\\/]$/u, '');
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
