export interface FileBuilder {
  buildIndex: boolean,
  minifyPages: boolean,
  appendPageChunk: boolean,
  preLoadCSS: boolean,
  preLoadJS: boolean,
  preloadStartDelay: number,
}
