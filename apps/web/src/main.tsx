import { StrictMode, Suspense, lazy, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import { api, basePath } from './lib/api';
import { AppProvider, useApp } from './lib/app';
import { Spinner } from './components/ui';
import { PublicLayout } from './public/PublicLayout';
import { Home } from './public/Home';
import { CmsPage, NewsDetail, NewsList, NotFound } from './public/pages';
import { LoginPage, ProfilePage, RegisterPage } from './public/account';
import { LeaderboardPage, PlayerPage } from './features/public';
import { applyTheme, type ThemeSettings } from './features/theme';

// Chargés à la demande : l'assistant ne sert qu'une fois, le panel admin qu'à l'équipe,
// et la carte (Leaflet) seulement quand on l'ouvre.
const SetupWizard = lazy(() => import('./setup/SetupWizard').then((m) => ({ default: m.SetupWizard })));
const AdminApp = lazy(() => import('./admin/AdminApp'));
const MapPage = lazy(() => import('./features/mapPages').then((m) => ({ default: m.MapPage })));

/** Applique le thème avancé (police, fond, CSS personnalisé) choisi dans le panel. */
function ThemeLoader() {
  const { boot } = useApp();
  useEffect(() => {
    if (!boot.setupDone) return;
    api
      .get<ThemeSettings>('features/theme')
      .then(applyTheme)
      .catch(() => {});
  }, [boot.setupDone]);
  return null;
}

function AppRoutes() {
  const { boot } = useApp();
  // Tant que l'installation n'est pas terminée, tout le site affiche l'assistant.
  if (!boot.setupDone) {
    return (
      <Suspense fallback={<Spinner />}>
        <SetupWizard />
      </Suspense>
    );
  }
  const m = boot.modules;
  return (
    <>
      <ThemeLoader />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          {m.news && <Route path="actualites" element={<NewsList />} />}
          {m.news && <Route path="actualites/:slug" element={<NewsDetail />} />}
          {m.leaderboard && <Route path="classement" element={<LeaderboardPage />} />}
          <Route
            path="carte"
            element={
              <Suspense fallback={<Spinner />}>
                <MapPage />
              </Suspense>
            }
          />
          <Route path="joueurs/:id" element={<PlayerPage />} />
          <Route path="p/:slug" element={<CmsPage />} />
          <Route path="connexion" element={<LoginPage />} />
          <Route path="inscription" element={<RegisterPage />} />
          <Route path="profil" element={<ProfilePage />} />
          <Route path="setup" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route
          path="admin/*"
          element={
            <Suspense fallback={<Spinner />}>
              <AdminApp />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basePath.replace(/\/$/, '') || '/'}>
      <AppProvider fallback={<Spinner />}>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
