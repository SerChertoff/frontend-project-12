import { Form, Button, InputGroup } from 'react-bootstrap';

const MessageForm = () => (
  <Form className="message-form">
    <InputGroup>
      <Form.Control
        name="body"
        placeholder="Введите сообщение..."
        aria-label="Новое сообщение"
      />
      <Button type="submit" variant="primary">
        Отправить
      </Button>
    </InputGroup>
  </Form>
);

export default MessageForm;
