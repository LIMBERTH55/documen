import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sidebarOpen]);

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <button
        type="button"
        className={`sidebar-backdrop ${sidebarOpen ? "is-visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-label="Cerrar menú de navegación"
        tabIndex={sidebarOpen ? 0 : -1}
      />
      <div className="app-main">
        <Topbar onOpenMenu={() => setSidebarOpen(true)} />
        <main className="page-container">
          <Outlet />
        </main>
        <footer className="app-footer">
          <span>SGD Académico · Sistema de Gestión Documental</span>
          <span>Los datos se almacenan en este navegador.</span>
        </footer>
      </div>
    </div>
  );
}
