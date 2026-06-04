import { useMemo } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { addMessage } from '../slices/messagesSlice';
import { selectAuth } from '../slices/authSlice';
import { selectCurrentChannelId, selectConnectionStatus } from '../slices/uiSlice';
import showApiError from '../utils/errorHandler';
import filterProfanity from '../filter';
import routes from '../routes';

const createMessageSubmit = ({
  dispatch, t, username, token, currentChannelId,
}) => async (values, { resetForm, setSubmitting }) => {
  try {
    const newMessage = {
      body: filterProfanity(values.body.trim()),
      channelId: currentChannelId,
      username,
    };

    if (!newMessage.body) {
      return;
    }

    const response = await axios.post(routes.messages(), newMessage, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(addMessage(response.data));
    resetForm();
  } catch (error) {
    showApiError(error, t);
  } finally {
    setSubmitting(false);
  }
};

const MessageForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { username, token } = useSelector(selectAuth);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const connectionStatus = useSelector(selectConnectionStatus);

  const handleSubmit = useMemo(
    () => createMessageSubmit({
      dispatch, t, username, token, currentChannelId,
    }),
    [dispatch, t, username, token, currentChannelId],
  );

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: handleSubmit,
  });

  const isDisabled = connectionStatus !== 'connected' || formik.isSubmitting;

  return (
    <Form className="message-form" onSubmit={formik.handleSubmit}>
      <InputGroup>
        <Form.Control
          name="body"
          placeholder={
            connectionStatus === 'connected'
              ? t('chat.inputMessage')
              : t('chat.waitingConnection')
          }
          aria-label={t('chat.newMessage')}
          value={formik.values.body}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isDisabled}
        />
        <Button type="submit" variant="primary" disabled={isDisabled}>
          {formik.isSubmitting ? '...' : t('chat.send')}
        </Button>
      </InputGroup>
    </Form>
  );
};

export default MessageForm;
