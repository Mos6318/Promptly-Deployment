import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import WorkspacePage from './pages/app/WorkspacePage';
import LibraryPage from './pages/app/LibraryPage';
import MixerPage from './pages/app/MixerPage';
import TemplatesPage from './pages/app/TemplatesPage';
import SettingsPage from './pages/app/SettingsPage';
import ApiKeysPage from './pages/app/ApiKeysPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignUpPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/mixer" element={<MixerPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/api-keys" element={<ApiKeysPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
