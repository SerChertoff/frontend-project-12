import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  Modal, Form, Button,
} from 'react-bootstrap';
import { addChannel, channelsSelectors } from '../../slices/channelsSlice';
import {
  selectModalAddChannel,
  closeAddChannelModal,
  setCurrentChannelId,
} from '../../slices/uiSlice';
import { setLocale, getChannelSchema } from '../../validation/validation';
import showApiError from '../../utils/errorHandler';
import filterProfanity from '../../filter';
import api from '../../api';
import routes from '../../routes';

const closeAddModal = (dispatch, resetForm) => {
  dispatch(closeAddChannelModal());
  resetForm();
};

const createAddChannelSubmit = ({ dispatch, t }) => async (values, { resetForm }) => {
  try {
    const response = await api.post(
      routes.channels(),
      { name: filterProfanity(values.name.trim()) },
    );
    dispatch(addChannel(response.data));
    dispatch(setCurrentChannelId(response.data.id));
    closeAddModal(dispatch, resetForm);
    toast.success(t('channels.created'));
  } catch (error) {
    showApiError(error, t);
  }
};

const AddChannelModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const show = useSelector(selectModalAddChannel);
  const channels = useSelector(channelsSelectors.selectAll);
  const channelNames = channels.map(({ name }) => name);

  setLocale(t);

  useEffect(() => {
    if (show) {
      inputRef.current?.focus();
    }
  }, [show]);

  const handleSubmit = useMemo(
    () => createAddChannelSubmit({ dispatch, t }),
    [dispatch, t],
  );

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema: getChannelSchema(channelNames),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: handleSubmit,
  });

  return (
    <Modal
      show={show}
      onHide={() => closeAddModal(dispatch, formik.resetForm)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.add')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="addChannelName">
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
            onClick={() => closeAddModal(dispatch, formik.resetForm)}
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

export default AddChannelModal;
