
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.scss';

import Home from './Pages/Home/Home.jsx';
import Login from './Pages/login/login.jsx';
import Cadastro from './Pages/Cadastro/Cadastro.jsx';
import Quiz from './Pages/Quiz/index.jsx';
import Detalhes from './Pages/Detalhes/Detalhes.jsx';
import AdminLogin from './Pages/adminlogin/adminLogin.jsx';
import AdminGestao from './Pages/admingestao/adminGestao.jsx';
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

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/gestao-doadoras" element={<AdminGestao />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
