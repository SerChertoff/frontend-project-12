import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <main className="page">
    <h1>404</h1>
    <p>Страница не найдена</p>
    <p>
      <Link to="/">Вернуться на главную</Link>
    </p>
  </main>
);

export default NotFoundPage;
