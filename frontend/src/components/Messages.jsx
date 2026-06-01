import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-bootstrap';
import { messagesSelectors } from '../slices/messagesSlice';
import { channelsSelectors } from '../slices/channelsSlice';
import { selectCurrentChannelId, selectConnectionStatus } from '../slices/uiSlice';
import filterProfanity from '../filter';
import MessageForm from './MessageForm';

const Messages = () => {
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const connectionStatus = useSelector(selectConnectionStatus);
  const messages = useSelector(messagesSelectors.selectAll);
  const channels = useSelector(channelsSelectors.selectEntities);
  const currentChannel = channels[currentChannelId];

  const channelMessages = messages.filter(
    (message) => String(message.channelId) === String(currentChannelId),
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages]);

  return (
    <div className="messages-panel">
      {connectionStatus === 'connecting' && (
        <Alert variant="info" className="mb-3 py-2">
          {t('chat.connecting')}
        </Alert>
      )}
      {connectionStatus === 'disconnected' && (
        <Alert variant="warning" className="mb-3 py-2">
          {t('chat.disconnected')}
        </Alert>
      )}
      <div className="messages-panel__header">
        <h2 className="messages-panel__title text-truncate">
          #
          {' '}
          {currentChannel?.name ?? '...'}
        </h2>
        <span className="messages-panel__count">
          {t('chat.messageCount', { count: channelMessages.length })}
        </span>
      </div>
      <div className="messages-panel__list">
        {channelMessages.map(({ id, username, body }) => (
          <div key={id} className="messages-panel__message text-break">
            <strong>
              {username}
              :
            </strong>
            {' '}
            {filterProfanity(body)}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageForm />
    </div>
  );
};

export default Messages;
