import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import io from 'socket.io-client';
import {
  fetchChannels,
  addChannel,
  removeChannel,
  renameChannel,
} from '../slices/channelsSlice';
import { fetchMessages, addMessage } from '../slices/messagesSlice';
import { selectAuth } from '../slices/authSlice';
import { setConnectionStatus } from '../slices/uiSlice';
import Channels from '../components/Channels';
import Messages from '../components/Messages';
import AddChannelModal from '../components/modals/AddChannelModal';
import RemoveChannelModal from '../components/modals/RemoveChannelModal';
import RenameChannelModal from '../components/modals/RenameChannelModal';

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

  useEffect(() => {
    const socket = io();

    const handleConnect = () => {
      dispatch(setConnectionStatus('connected'));
    };

    const handleDisconnect = () => {
      dispatch(setConnectionStatus('disconnected'));
    };

    const handleNewMessage = (payload) => {
      dispatch(addMessage(payload));
    };

    const handleNewChannel = (payload) => {
      dispatch(addChannel(payload));
    };

    const handleRemoveChannel = (payload) => {
      dispatch(removeChannel(payload.id));
    };

    const handleRenameChannel = (payload) => {
      dispatch(renameChannel({
        id: payload.id,
        changes: { name: payload.name },
      }));
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('newMessage', handleNewMessage);
    socket.on('newChannel', handleNewChannel);
    socket.on('removeChannel', handleRemoveChannel);
    socket.on('renameChannel', handleRenameChannel);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('newMessage', handleNewMessage);
      socket.off('newChannel', handleNewChannel);
      socket.off('removeChannel', handleRemoveChannel);
      socket.off('renameChannel', handleRenameChannel);
      socket.disconnect();
    };
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
      <AddChannelModal />
      <RemoveChannelModal />
      <RenameChannelModal />
    </Container>
  );
};

export default HomePage;
