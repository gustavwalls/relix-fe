import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
//context
import AuthStateProvider from "./context/autenticacion/authState";
import AlertaStateProvider from "./context/alertas/alertaState";
//////////////////////////////////////////////////////////////////////////////////////
import tokenAuth from "./config/token";
import PrivateRoute from "./components/rutas/PrivateRoute";
//MODULOS
import Registrar from "./components/AdministrarUsuarios/Registrar";
import Bienvenido from "./components/Modulos/Bienvenido";
import CrearFichaTecnica from "./components/Modulos/CrearFichaTecnica";
import VerFichasTecnicasDiseñador from "./components/Modulos/VerFichasTecnicasDiseñador";
import VerFichasTecnicasIngeniero from "./components/Modulos/VerFichasTecnicasIngeniero";
import VerFichasTecnicasBackoffice from "./components/Modulos/VerFichasTecnicasBackoffice";
import FichasTecnicas from "./components/Modulos/FichasTecnicas";
import VerFichasTecnicasGerente from "./components/Modulos/VerFichasTecnicasGerente";
import ReporteAnalisis from "./components/Modulos/ReporteAnalisis";
import RegistrarVendedor from "./components/Modulos/RegistrarVendedor";
import ReporteDeCotizacionDisenador from "./components/Modulos/ReporteDeCotizacionDisenador";
import FichaDeGastosDeGestion from "./components/Modulos/FichaDeGastosDeGestion";
import EdicionesFichasTecnicas from "./components/Modulos/EdicionesFichasTecnicas";
import VerFichasTecnicasGerenteDeAdministracion from "./components/Modulos/VerFichasTecnicasGerenteDeAdministracion";
import ModuloAgregarMargen from "./components/Modulos/ModuloAgregarMargen";
import RegistrarPartidasySubpartidas from "./components/Modulos/RegistrarPartidasySubpartidas";
import MaestroProducto from "./components/Modulos/MaestroProducto";
import MaestroCosto from "./components/Modulos/MaestroCosto";
import VerRequerimientosPedidos from "./components/Modulos/VerRequerimientosPedidos";
import ReporteFichaProyecto from "./components/Modulos/ReporteFichaProyecto";
import Guias from "./components/Modulos/Guias";
import ModuloDescargaDeArchivos from "./components/Modulos/ModuloDescargaDeArchivos";
import VerDescargaDeArchivos from "./components/Modulos/VerDescargaDeArchivos";
// fin MODULOS 
import OlvidastePassword from "./components/auth/OlvidastePassword";
import RecuperarPassword from "./components/auth/RecuperarPassword";
import RegistrarGuiasVsPedido from "./components/Modulos/RegistrarGuiasVsPedido";
import GuiaValorizacion from "./components/Modulos/Modulo-Guias/GuiaValorizacion";
import VerFichasTecnicasGerenteProyecto from "./components/Modulos/VerFichasTecnicasGerenteProyecto";
import FichaTecnica from "./components/Modulos/Modulo-Comercial/FichaTecnica/FichaTecnica";
import ConsultarCostosReales from "./components/Modulos/ConsultarCostosReales";
import FormasDePago from "./components/Modulos/FormasDePago";
import AdministracionCorreos from "./components/Modulos/AdministracionCorreos";
import AdministracionCorreosDetalle from "./components/Modulos/AdministracionCorreosDetalle";


function App() {
  const token = localStorage.getItem("token");
  if (token) {
    tokenAuth(token);
  }

  return (
    <div>
      <AlertaStateProvider>
        <AuthStateProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route
                path="/recuperar-password"
                element={<OlvidastePassword />}
              />
              <Route
                path="/sesioniniciada"
                element={
                  <PrivateRoute>
                    <Bienvenido />
                  </PrivateRoute>
                }
              />
              <Route path="/cambiar-password" element={<RecuperarPassword />} />
              <Route
                path="/registrar-usuario"
                element={
                  <PrivateRoute>
                    <Registrar />
                  </PrivateRoute>
                }
              />

              <Route
                path="/registrar-ficha-tecnica"
                element={
                  <PrivateRoute>
                <FichaTecnica />
                  </PrivateRoute>
                }
              />
              <Route
                path="/fichaTecnica"
                element={
                  <PrivateRoute>
                    <FichaTecnica />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ver-fichas-tecnicas-disenador"
                element={
                  <PrivateRoute>
                    <VerFichasTecnicasDiseñador />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ver-fichas-tecnicas-ingeniero"
                element={
                  <PrivateRoute>
                    <VerFichasTecnicasIngeniero />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ver-fichas-tecnicas-backoffice"
                element={
                  <PrivateRoute>
                    <VerFichasTecnicasBackoffice />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reporte-presupuesto"
                element={
                  <PrivateRoute>
                    <FichasTecnicas />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ver-fichas-tecnicas-gerente-general"
                element={
                  <PrivateRoute>
                    <VerFichasTecnicasGerente />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ver-fichas-tecnicas-gerente-administacion"
                element={
                  <PrivateRoute>
                    <VerFichasTecnicasGerenteDeAdministracion />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reporte-analisis"
                element={
                  <PrivateRoute>
                    <ReporteAnalisis />
                  </PrivateRoute>
                }
              />
              <Route
                path="/registrar-vendedor"
                element={
                  <PrivateRoute>
                    <RegistrarVendedor />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reporte-cotizacion"
                element={
                  <PrivateRoute>
                    <ReporteDeCotizacionDisenador />
                  </PrivateRoute>
                }
              />
              <Route
                path="/fichas-gastos-gestion"
                element={
                  <PrivateRoute>
                    <FichaDeGastosDeGestion />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edicion-fichas-tecnicas"
                element={
                  <PrivateRoute>
                    <EdicionesFichasTecnicas />
                  </PrivateRoute>
                }
              />
              <Route
                path="/actualizar-margen"
                element={
                  <PrivateRoute>
                    <ModuloAgregarMargen />
                  </PrivateRoute>
                }
              />
              <Route
                path="/registro-partidas-subpartidas"
                element={
                  <PrivateRoute>
                    <RegistrarPartidasySubpartidas />
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/maestro-producto"
                element={
                  <PrivateRoute>
                    <MaestroProducto />
                  </PrivateRoute>
                }
              />
              <Route
                path="/maestro-costo"
                element={
                  <PrivateRoute>
                    <MaestroCosto />
                  </PrivateRoute>
                }
              />
              <Route
                path="/requerimientos-pedidos"
                element={
                  <PrivateRoute>
                    <VerRequerimientosPedidos />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reporte-ficha-proyecto"
                element={
                  <PrivateRoute>
                    <ReporteFichaProyecto />
                  </PrivateRoute>
                }
              />
              <Route
                path="/guia-traslado"
                element={
                  <PrivateRoute>
                    <Guias />
                  </PrivateRoute>
                }
              />
              <Route
                path="/guia-valorizacion"
                element={
                  <PrivateRoute>
                    <GuiaValorizacion />
                  </PrivateRoute>
                }
              />
              <Route
                path="/guia-vs-pedido"
                element={
                  <PrivateRoute>
                    <RegistrarGuiasVsPedido />
                  </PrivateRoute>
                }
              />
              <Route
                path="/gestor-archivos"
                element={
                  <PrivateRoute>
                    <VerDescargaDeArchivos />
                  </PrivateRoute>
                }
              />
              <Route
                path="ver-fichas-tecnicas-gerente-administacion/:id"
                element={
                  <PrivateRoute>
                    <ModuloDescargaDeArchivos />
                  </PrivateRoute>
                }
              />
              <Route
                path="/fichas-tecnicas-gerente-proyecto"
                element={
                  <PrivateRoute>
                    <VerFichasTecnicasGerenteProyecto />
                  </PrivateRoute>
                }
              />
              <Route
                path="/consultar-costos-reales"
                element={
                  <PrivateRoute requiredRoles={["Backoffice", "Gerente General"]}>
                    <ConsultarCostosReales />
                  </PrivateRoute>
                }
              />
              <Route
                path="/formas-de-pago"
                element={
                  <PrivateRoute>
                    <FormasDePago />
                  </PrivateRoute>
                }
              />
              <Route
                path="/administracion-correos"
                element={
                  <PrivateRoute>
                    <AdministracionCorreos />
                  </PrivateRoute>
                }
              />
              <Route
                path="/administracion-correos/:id"
                element={
                  <PrivateRoute>
                    <AdministracionCorreosDetalle />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Router>
        </AuthStateProvider>
      </AlertaStateProvider>
    </div>
  );
}

export default App;
