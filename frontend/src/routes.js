const host = '/api/v1';

export default {
  login: () => [host, 'login'].join('/'),
  rootPage: () => '/',
  loginPage: () => '/login',
};
