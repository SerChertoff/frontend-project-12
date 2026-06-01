import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Nav, Button } from 'react-bootstrap';
import { channelsSelectors } from '../slices/channelsSlice';
import { openAddChannelModal } from '../slices/uiSlice';
import Channel from './Channel';

const Channels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector(channelsSelectors.selectAll);

  return (
    <div className="channels-panel">
      <div className="channels-panel__header">
        <h2 className="channels-panel__title">{t('channels.title')}</h2>
        <Button
          variant="outline-primary"
          size="sm"
          className="channels-panel__add"
          onClick={() => dispatch(openAddChannelModal())}
          aria-label={t('channels.add')}
        >
          {t('channels.add')}
        </Button>
      </div>
      <Nav className="flex-column channels-panel__list">
        {channels.map((channel) => (
          <Channel key={channel.id} channel={channel} />
        ))}
      </Nav>
    </div>
  );
};

export default Channels;
