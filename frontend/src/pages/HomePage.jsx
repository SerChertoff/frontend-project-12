import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import io from 'socket.io-client';
import {
  fetchChannels,
  addChannel,
  removeChannel,
  renameChannel,
} from '../slices/channelsSlice';
import { fetchMessages, addMessage } from '../slices/messagesSlice';
import { setConnectionStatus } from '../slices/uiSlice';
import showApiError from '../utils/errorHandler';
import Channels from '../components/Channels';
import Messages from '../components/Messages';
import AddChannelModal from '../components/modals/AddChannelModal';
import RemoveChannelModal from '../components/modals/RemoveChannelModal';
import RenameChannelModal from '../components/modals/RenameChannelModal';

const HomePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channelsLoading = useSelector(
    (state) => state.channels.loadingStatus === 'loading',
  );
  const messagesLoading = useSelector(
    (state) => state.messages.loadingStatus === 'loading',
  );
  const isLoading = channelsLoading || messagesLoading;

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchChannels()).unwrap();
        await dispatch(fetchMessages()).unwrap();
      } catch (error) {
        showApiError(error, t);
      }
    };

    loadData();
  }, [dispatch, t]);

  useEffect(() => {
    const socket = io();

    const handleConnect = () => {
      dispatch(setConnectionStatus('connected'));
    };

    const handleDisconnect = () => {
      dispatch(setConnectionStatus('disconnected'));
      toast.error(t('errors.network'));
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
  }, [dispatch, t]);

  if (isLoading) {
    return (
      <main className="page">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">{t('loading')}</span>
        </Spinner>
      </main>
    );
  }

  return (
    <Container fluid className="chat-page">
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
