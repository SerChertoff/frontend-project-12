import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import axios from 'axios';
import {
  Modal, Form, Button,
} from 'react-bootstrap';
import {
  renameChannel,
  channelsSelectors,
  selectChannelToRename,
  setChannelToRename,
} from '../../slices/channelsSlice';
import { selectAuth } from '../../slices/authSlice';
import {
  selectModalRenameChannel,
  closeRenameChannelModal,
} from '../../slices/uiSlice';
import { getChannelSchema } from '../../validation/channels';
import routes from '../../routes';

const RenameChannelModal = () => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const show = useSelector(selectModalRenameChannel);
  const channelId = useSelector(selectChannelToRename);
  const { token } = useSelector(selectAuth);
  const channels = useSelector(channelsSelectors.selectAll);
  const channel = useSelector((state) => (
    channelId ? channelsSelectors.selectById(state, channelId) : null
  ));
  const channelNames = channels.map(({ name }) => name);

  const handleClose = (resetForm) => {
    dispatch(closeRenameChannelModal());
    dispatch(setChannelToRename(null));
    resetForm();
  };

  const formik = useFormik({
    initialValues: { name: channel?.name ?? '' },
    enableReinitialize: true,
    validationSchema: getChannelSchema(channelNames, channel?.name),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.patch(
          routes.channel(channelId),
          { name: values.name.trim() },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        dispatch(renameChannel({
          id: response.data.id,
          changes: { name: response.data.name },
        }));
        handleClose(resetForm);
      } catch {
        // ошибка сети
      }
    },
  });

  useEffect(() => {
    if (show) {
      setTimeout(() => inputRef.current?.select(), 0);
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={() => handleClose(formik.resetForm)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="renameChannelName">
            <Form.Label>Имя канала</Form.Label>
            <Form.Control
              ref={inputRef}
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(formik.errors.name && formik.touched.name)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => handleClose(formik.resetForm)}
            disabled={formik.isSubmitting}
          >
            Отменить
          </Button>
          <Button type="submit" variant="primary" disabled={formik.isSubmitting}>
            Отправить
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RenameChannelModal;
