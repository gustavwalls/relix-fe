import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import LayoutPrincipal from "../Layout/LayoutPrincipal";

// Rutas privadas accesibles para cualquier usuario autenticado (no dependen de rol)
const RUTAS_LIBRES = ["sesioniniciada", "fichaTecnica", "guia-valorizacion", "consultar-costos-reales"];

function PrivateRoute({ children, requiredRoles }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  // Validación por rol específico
  if (requiredRoles && requiredRoles.length > 0) {
    const nombreRol = localStorage.getItem("nombreRol");
    if (!requiredRoles.includes(nombreRol)) {
      return <Navigate to="/sesioniniciada" />;
    }
  }

  const rutasGuardadas = localStorage.getItem("rutas");

  // Si no hay rutas guardadas aún (ej: reload antes de que se persistan), dejar pasar
  if (!rutasGuardadas) {
    return <LayoutPrincipal>{children}</LayoutPrincipal>;
  }

  const rutasPermitidas = JSON.parse(rutasGuardadas);
  // Tomar el primer segmento del path actual (ignora params dinámicos)
  const segmentoActual = location.pathname.split("/").filter(Boolean)[0];

  if (
    RUTAS_LIBRES.includes(segmentoActual) ||
    rutasPermitidas.some((r) => r.rutaModulo === segmentoActual)
  ) {
    return <LayoutPrincipal>{children}</LayoutPrincipal>;
  }

  return <Navigate to="/sesioniniciada" />;
}

export default PrivateRoute;
