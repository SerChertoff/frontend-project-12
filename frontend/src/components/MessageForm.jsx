import { useFormik } from 'formik';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { addMessage } from '../slices/messagesSlice';
import { selectAuth } from '../slices/authSlice';
import { selectCurrentChannelId, selectConnectionStatus } from '../slices/uiSlice';
import routes from '../routes';

const MessageForm = () => {
  const dispatch = useDispatch();
  const { username, token } = useSelector(selectAuth);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const connectionStatus = useSelector(selectConnectionStatus);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const newMessage = {
          body: values.body.trim(),
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
      } catch {
        // Ошибка сети — сообщение остаётся в поле ввода
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isDisabled = connectionStatus !== 'connected' || formik.isSubmitting;

  return (
    <Form className="message-form" onSubmit={formik.handleSubmit}>
      <InputGroup>
        <Form.Control
          name="body"
          placeholder={
            connectionStatus === 'connected'
              ? 'Введите сообщение...'
              : 'Ожидание соединения...'
          }
          aria-label="Новое сообщение"
          value={formik.values.body}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isDisabled}
        />
        <Button type="submit" variant="primary" disabled={isDisabled}>
          {formik.isSubmitting ? '...' : 'Отправить'}
        </Button>
      </InputGroup>
    </Form>
  );
};

export default MessageForm;
