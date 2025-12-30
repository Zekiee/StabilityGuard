import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import IncidentLog from './pages/IncidentLog';
import Rules from './pages/Rules';

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="incidents" element={<IncidentLog />} />
            <Route path="rules" element={<Rules />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;