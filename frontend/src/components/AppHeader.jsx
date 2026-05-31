import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Navbar, Container, Button } from 'react-bootstrap';
import { selectAuth, removeCredentials } from '../slices/authSlice';
import routes from '../routes';

const AppHeader = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector(selectAuth);

  const handleLogout = () => {
    dispatch(removeCredentials());
    navigate(routes.loginPage());
  };

  return (
    <Navbar bg="light" expand="md" className="app-header border-bottom">
      <Container fluid>
        <Navbar.Brand as={Link} to={routes.rootPage()}>
          {t('hexletChat')}
        </Navbar.Brand>
        {token && (
          <Button variant="outline-primary" size="sm" onClick={handleLogout}>
            {t('logout')}
          </Button>
        )}
      </Container>
    </Navbar>
  );
};

export default AppHeader;
