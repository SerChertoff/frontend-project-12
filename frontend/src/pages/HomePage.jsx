import { Link } from 'react-router-dom';

const HomePage = () => (
  <main className="page">
    <h1>Hexlet Chat</h1>
    <p>
      <Link to="/login">Войти</Link>
    </p>
  </main>
);

export default HomePage;
