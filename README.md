# @idrinth/react-file-based-routes

This is a small library used to teach the default react routers file based routing and optimise the output as far as that is possible without server side rendering. It is meant for mostly static pages, where the overhead of nextjs of vike is not required.

## Defining a page

A page is by default any `ìndex.tsx` within the `src/pages` folder. The folder name will be taken as the page url, with two exceptions by default:

- home will be the root
- not-found will be the 404 page

## Configuration

All rules can be configured in an .idrinth-react-file-based-routes.json file, options are currently:

```ts
interface Configuration {
  sitemap?: {
    domain?: string,
    build?: boolean,
  },
  runtime?: {
    reloadWaitMs: number
  },
  routes?: {
    build?: boolean,
    type?: 'tsx'|'jsx',
    overridePathMappings?: {
      [filesystemPath: string]: string,
    },
  },
  htmlMinify?: {
    collapseBooleanAttributes?: boolean,
    conservativeCollapse?: boolean,
    collapseWhitespace?: boolean,
    removeAttributeQuotes?: boolean,
    removeComments?: boolean,
  },
  fileBuilder?: {
    buildIndex?: boolean,
    minifyPages?: boolean,
    appendPageChunk?: boolean,
    preLoadCSS?: boolean,
  },
  fileFinder?: {
    fileName?: string,
    pagesRoot?: string,
    distJSRoot?: string,
  },
}
```

If you prefer using a cli format, `--{group}.{setting}=abc` will set string settings to abc, while booleans can be flipped by just using `--{group}.{setting}`. For example for api-bench, that uses the defaults, you can set the domain by using `--sitemap.domain=idrinth-api-ben.ch`. The setting `fileFinder.overridePathMappings` can not be configured via the cli.

Default options are overwritten first by the file based settings and then by the command line settings.

# Setup

You will need to do three things for the complete package:

- Define a call to generate-routes(`irfbrgr` or `react-file-based-routes-generate-routes`) in you package.json as afterInstall and early in your build process to generate the routes.tsx and the sitemap
- Optionally define a call to generate-folders(`ìrfbrgf` or `react-file-based-routes-generate-folders`) in your package.json as a late build step to optimise the index.html files
- Default import the generated `src/routes.tsx`, so that you can use createBrowserRouter or similar functions to create your router. It requires getting a `Loader` element passed to it - any react element will do
