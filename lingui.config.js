/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['es', 'en'],
  sourceLocale: 'es',
  catalogs: [
    {
      path: 'src/locale/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: 'po',
};
