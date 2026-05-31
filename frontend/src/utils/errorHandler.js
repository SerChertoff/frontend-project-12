import { toast } from 'react-toastify';

const isNetworkError = (error) => (
  error?.message === 'Network Error'
  || error?.code === 'ERR_NETWORK'
  || !error?.response
);

export const showApiError = (error, t) => {
  if (isNetworkError(error)) {
    toast.error(t('errors.network'));
    return;
  }

  toast.error(t('errors.unknown'));
};

export default showApiError;
