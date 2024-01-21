import {readFileSync, existsSync} from 'fs';

interface Configuration {
    sitemap?: {
        domain?: string,
        build?: boolean,
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
        fileName: 'index.tsx'|'+Page.tsx'|'*.tsx'|'page.tsx',
        overridePathMappings: {
            [filesystemPath: string]: string,
        },
        pagesRoot?: string,
    },
}

export default (cwd: string): Configuration => {
    const config = {};
    if (existsSync(cwd + '/.idrinth-react-file-based-routes.json')) {
        const userconfig: Configuration = JSON.parse(readFileSync(cwd + '/.idrinth-react-file-based-routes.json', 'utf-8'));
        if (typeof userconfig.htmlMinify === 'object') {

        }
        if (typeof userconfig.htmlMinify === 'object') {

        }
    }
    return config;
}
