/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['es', 'en'],
  sourceLocale: 'en',
  catalogs: [
    {
      path: 'src/locale/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: 'po',
  compileNamespace: 'cjs',
};
