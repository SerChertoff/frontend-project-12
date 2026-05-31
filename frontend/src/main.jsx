import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import init from './init.jsx';

const bootstrap = async () => {
  const app = await init();
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      {app}
    </StrictMode>,
  );
};

bootstrap();
