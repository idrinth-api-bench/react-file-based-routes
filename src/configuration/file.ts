import {existsSync, readFileSync} from 'fs';
import {Configuration} from './configuration.js';

export default (cwd: string, config:  Configuration) => {
  const configFile = cwd + '/.idrinth-react-file-based-routes.json';
  if (existsSync(configFile)) {
    const userconfig: Configuration = JSON.parse(readFileSync(configFile, 'utf-8'));
    if (typeof userconfig === 'object') {
      for (const prop of Object.keys(config) as [keyof Configuration]) {
        if (typeof userconfig[prop] === 'object' && typeof config[prop] === 'object') {
          for (const setting of Object.keys(config[prop]) as [keyof Configuration[typeof prop]]) {
            if (typeof config[prop][setting] === typeof userconfig[prop][setting]) {
              config[prop][setting] = userconfig[prop][setting];
            }
          }
        }
      }
    }
  }
}
