export const environment = {
  production: true,
  APIEndpoint: 'https://ebcapi.nec-digicard.com/api/',

  defaultLangCode: 'en',
  language: [
    { code: 'en', key: 'english', value: 'English' },
    { code: 'ja', key: 'Japanese', value: '日本' },
    { code: 'chi', key: 'Chinese', value: '中國人' },
  ],
  defaultPageLimit: 10,
  pageLimit: [5, 10, 15, 20, 25],
  frontEndURL: 'https://dev.nec-digicard.com/'

};
