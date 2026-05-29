import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import { selectAuth } from './slices/authSlice';
import routes from './routes';

const App = () => {
  const { token } = useSelector(selectAuth);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={routes.rootPage()}
          element={token ? <HomePage /> : <Navigate to={routes.loginPage()} replace />}
        />
        <Route
          path={routes.loginPage()}
          element={token ? <Navigate to={routes.rootPage()} replace /> : <LoginPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
