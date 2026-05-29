const host = '/api/v1';

export default {
  login: () => [host, 'login'].join('/'),
  channels: () => [host, 'channels'].join('/'),
  channel: (id) => [host, 'channels', id].join('/'),
  messages: () => [host, 'messages'].join('/'),
  rootPage: () => '/',
  loginPage: () => '/login',
};
