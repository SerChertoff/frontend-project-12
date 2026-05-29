import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import axios from 'axios';
import {
  Modal, Form, Button,
} from 'react-bootstrap';
import { addChannel } from '../../slices/channelsSlice';
import { selectAuth } from '../../slices/authSlice';
import {
  selectModalAddChannel,
  closeAddChannelModal,
  setCurrentChannelId,
} from '../../slices/uiSlice';
import { channelsSelectors } from '../../slices/channelsSlice';
import { getChannelSchema } from '../../validation/channels';
import routes from '../../routes';

const AddChannelModal = () => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const show = useSelector(selectModalAddChannel);
  const { token } = useSelector(selectAuth);
  const channels = useSelector(channelsSelectors.selectAll);
  const channelNames = channels.map(({ name }) => name);

  useEffect(() => {
    if (show) {
      inputRef.current?.focus();
    }
  }, [show]);

  const handleClose = (resetForm) => {
    dispatch(closeAddChannelModal());
    resetForm();
  };

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema: getChannelSchema(channelNames),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          routes.channels(),
          { name: values.name.trim() },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        dispatch(addChannel(response.data));
        dispatch(setCurrentChannelId(response.data.id));
        handleClose(resetForm);
      } catch {
        // ошибка сети — модальное окно остаётся открытым
      }
    },
  });

  return (
    <Modal
      show={show}
      onHide={() => handleClose(formik.resetForm)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="addChannelName">
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

export default AddChannelModal;
