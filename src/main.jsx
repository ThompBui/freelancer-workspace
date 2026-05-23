import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import ThompBui from './ThompBui.jsx';
import { AppPreferencesProvider } from './context/AppPreferencesContext.jsx';
import { applyThemeToDocument, applyLocaleToDocument, loadAppPreferences } from './utils/appPreferencesStorage.js';

const prefs = loadAppPreferences();
applyThemeToDocument(prefs.theme);
applyLocaleToDocument(prefs.locale);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppPreferencesProvider>
      <ThompBui />
    </AppPreferencesProvider>
  </StrictMode>,
);
