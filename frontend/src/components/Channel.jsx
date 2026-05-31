import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Dropdown, Button, ButtonGroup, Nav,
} from 'react-bootstrap';
import {
  setChannelToRemove,
  setChannelToRename,
} from '../slices/channelsSlice';
import {
  selectCurrentChannelId,
  setCurrentChannelId,
  openRemoveChannelModal,
  openRenameChannelModal,
} from '../slices/uiSlice';

const Channel = ({ channel: { id, name, removable } }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentChannelId = useSelector(selectCurrentChannelId);

  const handleSelect = () => {
    dispatch(setCurrentChannelId(id));
  };

  const handleRemove = () => {
    dispatch(setChannelToRemove(id));
    dispatch(openRemoveChannelModal());
  };

  const handleRename = () => {
    dispatch(setChannelToRename(id));
    dispatch(openRenameChannelModal());
  };

  return (
    <Nav.Item className="w-100 channel-item">
      <ButtonGroup className="w-100">
        <Button
          variant={id === currentChannelId ? 'primary' : 'light'}
          className="channel-item__name text-truncate"
          onClick={handleSelect}
        >
          #
          {' '}
          {name}
        </Button>
        {removable && (
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle
              split
              variant={id === currentChannelId ? 'primary' : 'light'}
              id={`channel-dropdown-${id}`}
              aria-label={t('channels.menu')}
            />
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleRename}>
                {t('channels.rename')}
              </Dropdown.Item>
              <Dropdown.Item onClick={handleRemove}>
                {t('channels.remove')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </ButtonGroup>
    </Nav.Item>
  );
};

export default Channel;
