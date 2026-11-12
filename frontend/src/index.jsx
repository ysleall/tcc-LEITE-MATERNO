
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.scss';

import Home from './Pages/Home/Home.jsx';
import Login from './Pages/login/login.jsx';
import Cadastro from './Pages/Cadastro/Cadastro.jsx';
import Quiz from './Pages/Quiz/index.jsx';
import Detalhes from './Pages/Detalhes/Detalhes.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/detalhes" element={<Detalhes />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
