import React from "react";
import { Navigate } from "react-router-dom";
import LayoutPrincipal from "../Layout/LayoutPrincipal";

function PrivateRoute(props) {
  /*   const autentificaciones = useContext(authContext);
  const { autenticado, usuarioAutenticado, cargando } = autentificaciones;
  console.log(
    "estas en PrivateRoute y haber el token",
    localStorage.getItem("token")
  );
  useEffect(() => {
    usuarioAutenticado();
  }, []); */
  const isAuthenticated = localStorage.getItem("token");
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  /*  return !autenticado && !cargando ? <Navigate to="/" /> : props.children; */
  return <LayoutPrincipal>{props.children}</LayoutPrincipal>;
}

export default PrivateRoute;
