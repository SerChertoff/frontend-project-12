import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { setCredentials } from '../slices/authSlice';
import { setLocale, getSignupSchema } from '../validation/validation';
import api from '../api';
import routes from '../routes';

const createSignupSubmit = ({
  dispatch, navigate, setSignupFailed,
}) => async (values, { setSubmitting }) => {
  setSignupFailed(false);

  try {
    const response = await api.post(routes.signup(), {
      username: values.username,
      password: values.password,
    });
    dispatch(setCredentials(response.data));
    navigate(routes.rootPage());
  } catch (error) {
    if (error.response?.status === 409) {
      setSignupFailed(true);
    }
  } finally {
    setSubmitting(false);
  }
};

const SignupPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [signupFailed, setSignupFailed] = useState(false);

  setLocale(t);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (signupFailed) {
      inputRef.current?.focus();
    }
  }, [signupFailed]);

  const handleSubmit = useMemo(
    () => createSignupSubmit({ dispatch, navigate, setSignupFailed }),
    [dispatch, navigate],
  );

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: getSignupSchema(),
    onSubmit: handleSubmit,
  });

  return (
    <main className="page">
      <Card className="auth-card">
        <Card.Body className="p-4">
          <Card.Title as="h1" className="text-center mb-4">
            {t('signup.header')}
          </Card.Title>
          <Form onSubmit={formik.handleSubmit} noValidate>
            {signupFailed && (
              <div className="text-danger small mb-3">
                {t('signup.alreadyExists')}
              </div>
            )}
            <Form.Group className="mb-3" controlId="signupUsername">
              <Form.Label>{t('signup.username')}</Form.Label>
              <Form.Control
                ref={inputRef}
                name="username"
                type="text"
                autoComplete="off"
                onChange={(event) => {
                  setSignupFailed(false);
                  formik.handleChange(event);
                }}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                isInvalid={formik.touched.username && Boolean(formik.errors.username)}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.username}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="signupPassword">
              <Form.Label>{t('signup.password')}</Form.Label>
              <Form.Control
                name="password"
                type="password"
                autoComplete="off"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                isInvalid={formik.touched.password && Boolean(formik.errors.password)}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="signupConfirmPassword">
              <Form.Label>{t('signup.confirm')}</Form.Label>
              <Form.Control
                name="confirmPassword"
                type="password"
                autoComplete="off"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                isInvalid={
                  formik.touched.confirmPassword
                  && Boolean(formik.errors.confirmPassword)
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <Button
              type="submit"
              variant="outline-primary"
              className="w-100 mb-3"
              disabled={formik.isSubmitting}
            >
              {t('signup.submit')}
            </Button>
            <div className="text-center">
              {t('signup.hasAccount')}
              <Link to={routes.loginPage()}>{t('signup.login')}</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </main>
  );
};

export default SignupPage;
