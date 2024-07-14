import {Runtime} from './runtime.js';
import {Sitemap} from './sitemap.js';
import {Routes} from './routes.js';
import {HTMLMinify} from './html-minify.js';
import {FileBuilder} from './file-builder.js';
import {FileFinder} from './file-finder.js';

export interface Configuration {
  runtime: Runtime,
  sitemap: Sitemap,
  routes: Routes,
  htmlMinify: HTMLMinify,
  fileBuilder: FileBuilder,
  fileFinder: FileFinder,
}
