# @idrinth/react-file-based-routing

This is a small library used to teach the default react routers file based routing and optimise the output as far as that is possible without server side rendering. It is meant for mostly static pages, where the overhead of nextjs of vike is not required.

## Defining a page

A page is by default any ìndex.tsx within the src/pages folder. The folder name will be taken as the page url, with two exceptions:

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
  routes?: {
    build?: true,
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
  },
  fileFinder?: {
    fileName?: string,
    overridePathMappings?: {
      [filesystemPath: string]: string,
    },
    pagesRoot?: string,
    distJSRoot?: string,
  },
}
```

# Setup

You will need to do three things for the complete package:

- Define a call to generate-routes in you package.json as afterInstall and early in your build process to generate the routes.tsx and the sitemap
- Optionally define a call to generate-folders in your package.json as a late build step to optimise the index.html files
- Import the generated src/routes.tsx, so that you can use createBrowserRouter or similar functions to create your router
