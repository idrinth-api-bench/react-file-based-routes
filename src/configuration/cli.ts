import {Configuration} from './configuration.js';
import {Runtime} from './runtime.js';
import {Sitemap} from './sitemap.js';
import {Routes} from './routes.js';
import {FileFinder} from './file-finder.js';
import {FileBuilder} from './file-builder.js';
import {HTMLMinify} from './html-minify.js';

export default (cliArguments:  string[], config: Configuration) => {
  for (const param of cliArguments) {
    if (param.startsWith('--')) {
      const [setting, value,] = param.substring(2).split('=') as [string, undefined|string];
      const [group, detail,] = setting.split('.') as [keyof Configuration, keyof Runtime|keyof Sitemap|keyof Routes|keyof FileFinder|keyof FileBuilder|keyof HTMLMinify];
      if (group && typeof config[group] === 'object' && detail) {
        // @ts-ignore TS7053
        if (typeof config[group][detail] === 'boolean') {
          if (value === 'true') {
            // @ts-ignore TS7053
            config[group][detail] = true;
          } else if (value === 'false') {
            // @ts-ignore TS7053
            config[group][detail] = false;
          } else {
            // @ts-ignore TS7053
            config[group][detail] = !config[group][detail];
          }
          // @ts-ignore TS7053
        } else if (typeof config[group][detail] === 'string' && value) {
          // @ts-ignore TS7053
          config[group][detail] = value;
        }
      }
    }
  }
}
