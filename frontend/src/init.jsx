import { Provider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import App from './App.jsx';
import ErrorFallback from './components/ErrorFallback.jsx';
import store from './slices/index.js';
import resources from './locales/index.js';
import rollbarConfig from './rollbar.js';

const init = async () => {
  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'ru',
      fallbackLng: 'ru',
      interpolation: {
        escapeValue: false,
      },
    });

  return (
    <RollbarProvider config={rollbarConfig}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ErrorBoundary fallbackUI={ErrorFallback}>
            <App />
          </ErrorBoundary>
        </I18nextProvider>
      </Provider>
    </RollbarProvider>
  );
};

export default init;
