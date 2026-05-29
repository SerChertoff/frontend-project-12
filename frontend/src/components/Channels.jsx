import { useSelector, useDispatch } from 'react-redux';
import { Nav, Button } from 'react-bootstrap';
import { channelsSelectors } from '../slices/channelsSlice';
import { selectCurrentChannelId, setCurrentChannelId } from '../slices/uiSlice';

const Channels = () => {
  const dispatch = useDispatch();
  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannelId = useSelector(selectCurrentChannelId);

  return (
    <div className="channels-panel">
      <h2 className="channels-panel__title">Каналы</h2>
      <Nav className="flex-column channels-panel__list">
        {channels.map(({ id, name }) => (
          <Nav.Item key={id}>
            <Button
              variant={id === currentChannelId ? 'primary' : 'light'}
              className="channels-panel__item w-100 text-start"
              onClick={() => dispatch(setCurrentChannelId(id))}
            >
              #
              {name}
            </Button>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default Channels;
