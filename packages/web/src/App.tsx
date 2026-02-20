import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Schemas } from './pages/Schemas';
import { SchemaEditor } from './pages/SchemaEditor';
import { Settings } from './pages/Settings';
import { HttpClientPage } from './pages/HttpClientPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schemas" element={<Schemas />} />
        <Route path="/schemas/:id" element={<SchemaEditor />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/http-client" element={<HttpClientPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
