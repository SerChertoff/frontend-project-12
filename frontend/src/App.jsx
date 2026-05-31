import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppHeader from './components/AppHeader';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';
import { selectAuth } from './slices/authSlice';
import routes from './routes';

const App = () => {
  const { token } = useSelector(selectAuth);

  return (
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route
          path={routes.rootPage()}
          element={token ? <HomePage /> : <Navigate to={routes.loginPage()} replace />}
        />
        <Route
          path={routes.loginPage()}
          element={token ? <Navigate to={routes.rootPage()} replace /> : <LoginPage />}
        />
        <Route
          path={routes.signupPage()}
          element={token ? <Navigate to={routes.rootPage()} replace /> : <SignupPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
