import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { RecordsProvider } from "./context/RecordsContext";
import { ToastProvider } from "./context/ToastContext";
import { DashboardPage } from "./pages/DashboardPage";
import { GestionPage } from "./pages/GestionPage";
import { CorrespondenciaPage } from "./pages/CorrespondenciaPage";
import { ModulePage } from "./pages/ModulePage";
import { NotFoundPage } from "./pages/NotFoundPage";

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <RecordsProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="gestion/:gestion" element={<GestionPage />} />
              <Route
                path="gestion/:gestion/correspondencia"
                element={<CorrespondenciaPage />}
              />
              <Route
                path="gestion/:gestion/correspondencia/:tipo"
                element={<ModulePage />}
              />
              <Route path="gestion/:gestion/:moduleKey" element={<ModulePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </RecordsProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
