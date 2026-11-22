import { Link } from "react-router-dom";
import { ArrowLeft, FileQuestion } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="page not-found-page">
      <div className="not-found-card">
        <span className="not-found-card__icon">
          <FileQuestion size={34} />
        </span>
        <span className="not-found-card__code">404</span>
        <h1>Página no encontrada</h1>
        <p>
          La dirección que intentas abrir no existe o el recurso ya no está disponible.
        </p>
        <Link to="/" className="btn btn--primary">
          <ArrowLeft size={17} />
          Volver al panel de control
        </Link>
      </div>
    </div>
  );
}
