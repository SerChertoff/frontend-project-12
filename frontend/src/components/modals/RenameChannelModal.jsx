import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
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
import { setLocale, getChannelSchema } from '../../validation/validation';
import showApiError from '../../utils/errorHandler';
import filterProfanity from '../../filter';
import routes from '../../routes';

const RenameChannelModal = () => {
  const { t } = useTranslation();
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

  setLocale(t);

  const handleClose = useCallback((resetForm) => {
    dispatch(closeRenameChannelModal());
    dispatch(setChannelToRename(null));
    resetForm();
  }, [dispatch]);

  const handleSubmit = useCallback(async (values, { resetForm }) => {
    try {
      const response = await axios.patch(
        routes.channel(channelId),
        { name: filterProfanity(values.name.trim()) },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      dispatch(renameChannel({
        id: response.data.id,
        changes: { name: response.data.name },
      }));
      handleClose(resetForm);
      toast.success(t('channels.renamed'));
    } catch (error) {
      showApiError(error, t);
    }
  }, [dispatch, t, token, channelId, handleClose]);

  const formik = useFormik({
    initialValues: { name: channel?.name ?? '' },
    enableReinitialize: true,
    validationSchema: getChannelSchema(channelNames, channel?.name),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: handleSubmit,
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
        <Modal.Title>{t('modals.rename')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="renameChannelName">
            <Form.Label>{t('modals.channelName')}</Form.Label>
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
            {t('modals.cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={formik.isSubmitting}>
            {t('modals.submit')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RenameChannelModal;
