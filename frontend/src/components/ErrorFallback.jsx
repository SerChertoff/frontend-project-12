import { useTranslation } from 'react-i18next';
import { Alert } from 'react-bootstrap';

const ErrorFallback = () => {
  const { t } = useTranslation();

  return (
    <Alert variant="danger" className="m-3">
      {t('errors.boundary')}
    </Alert>
  );
};

export default ErrorFallback;
