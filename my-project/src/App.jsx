import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginView from './login/login';
import UploadView from './upload/upload';
import AutoRepairDetail from './detail/detail_view';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/detail" element={<AutoRepairDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
