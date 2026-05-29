import { useSelector } from 'react-redux';
import { selectAuth } from '../slices/authSlice';

const HomePage = () => {
  const { username } = useSelector(selectAuth);

  return (
    <main className="page">
      <h1>Hexlet Chat</h1>
      <p>{username ? `Привет, ${username}!` : 'Добро пожаловать!'}</p>
    </main>
  );
};

export default HomePage;
