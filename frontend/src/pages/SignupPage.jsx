import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setCredentials } from '../slices/authSlice';
import signupSchema from '../validation/signup';
import routes from '../routes';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [signupFailed, setSignupFailed] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signupSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSignupFailed(false);

      try {
        const response = await axios.post(routes.signup(), {
          username: values.username,
          password: values.password,
        });
        dispatch(setCredentials(response.data));
        navigate(routes.rootPage());
      } catch (error) {
        if (error.response?.status === 409) {
          setSignupFailed(true);
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
            Регистрация
          </Card.Title>
          <Form onSubmit={formik.handleSubmit} noValidate>
            {signupFailed && (
              <div className="text-danger small mb-3">
                Такой пользователь уже существует
              </div>
            )}
            <Form.Group className="mb-3" controlId="signupUsername">
              <Form.Label>Имя пользователя</Form.Label>
              <Form.Control
                ref={inputRef}
                name="username"
                type="text"
                autoComplete="username"
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
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                name="password"
                type="password"
                autoComplete="new-password"
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
              <Form.Label>Подтверждение пароля</Form.Label>
              <Form.Control
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
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
              Зарегистрироваться
            </Button>
            <div className="text-center">
              <Link to={routes.loginPage()}>Уже есть аккаунт? Войти</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </main>
  );
};

export default SignupPage;
