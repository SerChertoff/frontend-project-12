import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import {
  removeChannel,
  selectChannelToRemove,
  setChannelToRemove,
  DEFAULT_CHANNEL_ID,
} from '../../slices/channelsSlice';
import { selectAuth } from '../../slices/authSlice';
import {
  selectModalRemoveChannel,
  closeRemoveChannelModal,
  setCurrentChannelId,
} from '../../slices/uiSlice';
import routes from '../../routes';

const RemoveChannelModal = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const show = useSelector(selectModalRemoveChannel);
  const channelId = useSelector(selectChannelToRemove);
  const { token } = useSelector(selectAuth);

  const handleClose = () => {
    dispatch(closeRemoveChannelModal());
    dispatch(setChannelToRemove(null));
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.delete(routes.channel(channelId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(removeChannel(response.data.id));
      dispatch(setCurrentChannelId(DEFAULT_CHANNEL_ID));
      handleClose();
    } catch {
      // ошибка сети
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>Вы уверены?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
          Отменить
        </Button>
        <Button variant="danger" onClick={handleConfirm} disabled={isSubmitting}>
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannelModal;
