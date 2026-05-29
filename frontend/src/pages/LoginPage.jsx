import { Formik, Form, Field } from 'formik';

const LoginPage = () => (
  <main className="page">
    <h1>Войти</h1>
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      onSubmit={() => {}}
    >
      <Form className="auth-form">
        <label className="auth-form__field" htmlFor="username">
          Имя пользователя
          <Field
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
          />
        </label>
        <label className="auth-form__field" htmlFor="password">
          Пароль
          <Field
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        <button type="submit" className="auth-form__submit">
          Войти
        </button>
      </Form>
    </Formik>
  </main>
);

export default LoginPage;
