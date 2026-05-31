import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setCredentials } from '../slices/authSlice';
import routes from '../routes';

const LoginPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [authFailed, setAuthFailed] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      setAuthFailed(false);

      try {
        const response = await axios.post(routes.login(), values);
        dispatch(setCredentials(response.data));
        navigate(routes.rootPage());
      } catch (error) {
        if (error.response?.status === 401) {
          setAuthFailed(true);
          inputRef.current?.focus();
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <main className="page">
      <Card className="auth-card">
        <Card.Body className="p-4">
          <Card.Title as="h1" className="text-center mb-4">
            {t('login.header')}
          </Card.Title>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>{t('login.username')}</Form.Label>
              <Form.Control
                ref={inputRef}
                name="username"
                type="text"
                autoComplete="username"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                isInvalid={authFailed}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>{t('login.password')}</Form.Label>
              <Form.Control
                name="password"
                type="password"
                autoComplete="current-password"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                isInvalid={authFailed}
              />
              {authFailed && (
                <Form.Control.Feedback type="invalid">
                  {t('login.authFailed')}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Button
              type="submit"
              variant="outline-primary"
              className="w-100 mb-3"
              disabled={formik.isSubmitting}
            >
              {t('login.submit')}
            </Button>
            <div className="text-center">
              {t('login.newToChat')}
              <Link to={routes.signupPage()}>{t('login.signup')}</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </main>
  );
};

export default LoginPage;
