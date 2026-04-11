import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import ScenePage from './pages/scene';
import './styles/global.css';

const elem = document.getElementById('root')!;

const app = (
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:sceneId" element={<ScenePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

createRoot(elem).render(app);
