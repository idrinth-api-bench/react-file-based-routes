export interface Routes {
  build: boolean,
  type: 'tsx' | 'jsx',
  overridePathMappings: {
    [filesystemPath: string]: string,
  },
  useOutput: boolean,
}
