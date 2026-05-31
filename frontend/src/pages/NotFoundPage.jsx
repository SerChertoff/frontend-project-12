import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routes from '../routes';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <main className="page">
      <h1>{t('notFound.header')}</h1>
      <p>{t('notFound.message')}</p>
      <p>
        <Link to={routes.rootPage()}>{t('notFound.linkText')}</Link>
      </p>
    </main>
  );
};

export default NotFoundPage;
