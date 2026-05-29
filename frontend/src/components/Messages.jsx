import { useSelector } from 'react-redux';
import { messagesSelectors } from '../slices/messagesSlice';
import { channelsSelectors } from '../slices/channelsSlice';
import { selectCurrentChannelId } from '../slices/uiSlice';
import MessageForm from './MessageForm';

const Messages = () => {
  const currentChannelId = useSelector(selectCurrentChannelId);
  const messages = useSelector(messagesSelectors.selectAll);
  const channels = useSelector(channelsSelectors.selectEntities);
  const currentChannel = channels[currentChannelId];

  const channelMessages = messages.filter(
    (message) => String(message.channelId) === String(currentChannelId),
  );

  return (
    <div className="messages-panel">
      <div className="messages-panel__header">
        <h2 className="messages-panel__title">
          #
          {currentChannel?.name ?? '...'}
        </h2>
        <span className="messages-panel__count">
          {channelMessages.length}
          {' '}
          сообщений
        </span>
      </div>
      <div className="messages-panel__list">
        {channelMessages.map(({ id, username, body }) => (
          <div key={id} className="messages-panel__message">
            <strong>
              {username}
              :
            </strong>
            {' '}
            {body}
          </div>
        ))}
      </div>
      <MessageForm />
    </div>
  );
};

export default Messages;
