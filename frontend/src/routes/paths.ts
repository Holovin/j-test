export const Paths = {
  root: '/',
  images: 'images',
  docs: 'docs',
}

export const Routes = {
  root: () => Paths.root,
  images: () => Paths.root + Paths.images,
  docs: () => Paths.root + Paths.docs,
}
