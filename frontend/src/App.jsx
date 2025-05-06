import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Registro from './pages/Registro';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registro" element={<Registro />} />
    </Routes>
  </BrowserRouter>
);

export default App;