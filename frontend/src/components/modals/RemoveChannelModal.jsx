import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  removeChannel,
  selectChannelToRemove,
  setChannelToRemove,
  DEFAULT_CHANNEL_ID,
} from '../../slices/channelsSlice';
import {
  selectModalRemoveChannel,
  closeRemoveChannelModal,
  setCurrentChannelId,
} from '../../slices/uiSlice';
import showApiError from '../../utils/errorHandler';
import api from '../../api';
import routes from '../../routes';

const RemoveChannelModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const show = useSelector(selectModalRemoveChannel);
  const channelId = useSelector(selectChannelToRemove);

  const handleClose = () => {
    dispatch(closeRemoveChannelModal());
    dispatch(setChannelToRemove(null));
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.delete(routes.channel(channelId));
      dispatch(removeChannel(response.data.id));
      dispatch(setCurrentChannelId(DEFAULT_CHANNEL_ID));
      handleClose();
      toast.success(t('channels.removed'));
    } catch (error) {
      showApiError(error, t);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.remove')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('modals.confirmation')}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
          {t('modals.cancel')}
        </Button>
        <Button variant="danger" onClick={handleConfirm} disabled={isSubmitting}>
          {t('modals.confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannelModal;
