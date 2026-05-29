import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { fetchChannels } from '../slices/channelsSlice';
import { fetchMessages } from '../slices/messagesSlice';
import { selectAuth } from '../slices/authSlice';
import Channels from '../components/Channels';
import Messages from '../components/Messages';

const HomePage = () => {
  const dispatch = useDispatch();
  const { username } = useSelector(selectAuth);
  const channelsLoading = useSelector(
    (state) => state.channels.loadingStatus === 'loading',
  );
  const messagesLoading = useSelector(
    (state) => state.messages.loadingStatus === 'loading',
  );
  const isLoading = channelsLoading || messagesLoading;

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch]);

  if (isLoading) {
    return (
      <main className="page">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </Spinner>
      </main>
    );
  }

  return (
    <Container fluid className="chat-page">
      <header className="chat-page__header">
        <h1 className="chat-page__title">Hexlet Chat</h1>
        <span className="chat-page__user">{username}</span>
      </header>
      <Row className="chat-page__body">
        <Col md={4} lg={3} className="chat-page__sidebar">
          <Channels />
        </Col>
        <Col md={8} lg={9} className="chat-page__content">
          <Messages />
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
