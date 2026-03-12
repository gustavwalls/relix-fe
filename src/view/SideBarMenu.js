import React, { useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import authContext from "../context/autenticacion/authContext";
import Logo from "../img/relixsinfondo.png";
import Swal from "sweetalert2";
import clienteAxios from "../config/axios";
function SideBarMenu({ activarSideBar, setActivarSideBar, usuario }) {
  const { rutas } = usuario;
  //console.log('ver rutas',rutas)
  let navigate = useNavigate();
  /////////////////////////////////
  const autentificaciones = useContext(authContext);
  const { cerrarSesion } = autentificaciones;
  const btnCerrarSesion = async () => {
    // console.log("se cierra");
    const accionUsuario = await Swal.fire({
      icon: "warning",
      title: "¿Esta seguro de cerrar sesion?",
      showConfirmButton: true,
      showCancelButton: true,
    });

    if (accionUsuario.isConfirmed) {
      cerrarSesion();
      navigate(`/`);
    }
  };
  const reportePepiline = async () => {
    console.log("entraste a reportePepiline");
    const fecha = new Date();
    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;
    const anoActual = fecha.getFullYear();
    try {
      var config = {
        responseType: "arraybuffer",
      };
      const resultado = await clienteAxios.get(
        `/api/exportarFichasTecnicas`,
        config
      );
      console.log("respuesta de excelReporteDos", resultado.data);

      const url = URL.createObjectURL(
        new Blob([resultado.data], {
          type: "application/vnd.ms-excel",
        })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `reportePipeLine ${hoy}_${mesActual}_${anoActual}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error.response.data.messages.error);
    }
  };
  const btnReportePipeLine = (accion) => {
    console.log("haber link", accion);
    if (accion.nombreModulo == "Reporte Pipeline") {
      console.log("descargar reporte");
      reportePepiline();
      return;
    }

    return;
  };
  //console.log("ver rutas =>", rutas);
  const moduloSistemas = rutas.filter(
    (item) => item.moduloGlobal == "MODULO SISTEMAS"
  );
  const moduloComercial = rutas.filter(
    (item) => item.moduloGlobal == "MODULO COMERCIAL"
  );
  const moduloPedido = rutas.filter(
    (item) => item.moduloGlobal == "MODULO PEDIDO"
  );
  const moduloMaestro = rutas.filter(
    (item) => item.moduloGlobal == "MODULO MAESTRO"
  );
  const moduloReporte = rutas.filter(
    (item) => item.moduloGlobal == "MODULO REPORTE"
  );
  const moduloGuias = rutas.filter(
    (item) => item.moduloGlobal == "MODULO GUIAS"
  );
  const moduloDescargaArchivos = rutas.filter(
    (item) => item.moduloGlobal == "MODULO GESTION DE DOCUMENTOS"
  );
  return (
    <div className={!activarSideBar ? "navDesign" : "navDesign show-menu"}>
      <nav className="navDesign__container">
        <div>
          <Link to="/sesioniniciada" className="navDesign__link navDesign__logo">
            <img src={Logo} alt="logo relix" className="header__img" />
          </Link>

          <div className="navDesign__list">
            <div className="navDesign__items">
              <h3 className="navDesign__subtitle">Perfil</h3>

              <Link to="/sesioniniciada" className="navDesign__link active">
                <i className="bx bx-home navDesign__icon"></i>
                <span className="navDesign__name">Inicio</span>
              </Link>
              {moduloSistemas.length > 0 &&
                moduloSistemas.map((item, i) => (
                  <Link
                    to={`/${item.rutaModulo}`}
                    className="navDesign__link "
                    key={i}
                    onClick={() => setActivarSideBar(!activarSideBar)}
                  >
                    <i className="bx bxs-user-check navDesign__icon"></i>
                    <span className="navDesign__name">{item.nombreModulo}</span>
                  </Link>
                ))}

              {/*     DROPDOWN */}
              {moduloComercial.length > 0 && (
                <>
                  <div className="navDesign__dropdown">
                    <a href="#" className="navDesign__link">
                      <i className="bx bxs-bar-chart-alt-2 navDesign__icon"></i>
                      <span className="navDesign__name">Modulo comercial</span>
                      <i className="bx bxs-chevron-down navDesign__icon navDesign__dropdown-icon"></i>
                    </a>

                    <div className="navDesign__dropdown-collapse">
                      <div className="navDesign__dropdown-content">
                        {moduloComercial.map((item, i) => (
                          <Link
                            to={`/${item.rutaModulo}`}
                            className="navDesign_dropdown-item"
                            key={i}
                            onClick={() => setActivarSideBar(!activarSideBar)}
                          >
                            <span className="navDesign__name">
                              {item.nombreModulo}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {moduloPedido.length > 0 && (
                <>
                  <div className="navDesign__dropdown">
                    <a href="#" className="navDesign__link">
                      <i className="bx bxs-book navDesign__icon"></i>
                      <span className="navDesign__name">Modulo Pedido</span>
                      <i className="bx bxs-chevron-down navDesign__icon navDesign__dropdown-icon"></i>
                    </a>

                    <div className="navDesign__dropdown-collapse">
                      <div className="navDesign__dropdown-content">
                        {moduloPedido.map((item, i) => (
                          <Link
                            to={`/${item.rutaModulo}`}
                            className="navDesign_dropdown-item"
                            key={i}
                            onClick={() => setActivarSideBar(!activarSideBar)}
                          >
                            <span className="navDesign__name">
                              {item.nombreModulo}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {moduloMaestro.length > 0 && (
                <>
                  <div className="navDesign__dropdown">
                    <a href="#" className="navDesign__link">
                      <i className="bx bxs-calculator navDesign__icon"></i>
                      <span className="navDesign__name">Modulo Maestro</span>
                      <i className="bx bxs-chevron-down navDesign__icon navDesign__dropdown-icon"></i>
                    </a>

                    <div className="navDesign__dropdown-collapse">
                      <div className="navDesign__dropdown-content">
                        {moduloMaestro.map((item, i) => (
                          <Link
                            to={`/${item.rutaModulo}`}
                            className="navDesign_dropdown-item"
                            key={i}
                            onClick={() => setActivarSideBar(!activarSideBar)}
                          >
                            <span className="navDesign__name">
                              {item.nombreModulo}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
              {moduloReporte.length > 0 && (
                <>
                  <div className="navDesign__dropdown">
                    <a href="#" className="navDesign__link">
                      <i className="bx bxs-report navDesign__icon"></i>
                      <span className="navDesign__name">Modulo Reporte</span>
                      <i className="bx bxs-chevron-down navDesign__icon navDesign__dropdown-icon"></i>
                    </a>

                    <div className="navDesign__dropdown-collapse">
                      <div className="navDesign__dropdown-content">
                        {moduloReporte.map((item, i) => (
                          <Link
                            to={`/${item.rutaModulo}`}
                            className="navDesign_dropdown-item"
                            key={i}
                            onClick={() => {
                              setActivarSideBar(!activarSideBar);
                              btnReportePipeLine(item);
                            }}
                          >
                            <span className="navDesign__name">
                              {item.nombreModulo}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {moduloGuias.length > 0 && (
                <>
                  <div className="navDesign__dropdown">
                    <a href="#" className="navDesign__link">
                      <i className="bx bxs-report navDesign__icon"></i>
                      <span className="navDesign__name">Modulo Guias</span>
                      <i className="bx bxs-chevron-down navDesign__icon navDesign__dropdown-icon"></i>
                    </a>

                    <div className="navDesign__dropdown-collapse">
                      <div className="navDesign__dropdown-content">
                        {moduloGuias.map((item, i) => (
                          <Link
                            to={`/${item.rutaModulo}`}
                            className="navDesign_dropdown-item"
                            key={i}
                            onClick={() => {
                              setActivarSideBar(!activarSideBar);
                            }}
                          >
                            <span className="navDesign__name">
                              {item.nombreModulo}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {moduloDescargaArchivos.length > 0 && (
                <>
                  <div className="navDesign__dropdown">
                    <a href="#" className="navDesign__link">
                      <i className='bx bxs-download navDesign__icon'></i>
                      <span className="navDesign__name">Modulo gestion de documentos</span>
                      <i className="bx bxs-chevron-down navDesign__icon navDesign__dropdown-icon"></i>
                    </a>

                    <div className="navDesign__dropdown-collapse">
                      <div className="navDesign__dropdown-content">
                        {moduloDescargaArchivos.map((item, i) => (
                          <Link
                            to={`/${item.rutaModulo}`}
                            className="navDesign_dropdown-item"
                            key={i}
                            onClick={() => {
                              setActivarSideBar(!activarSideBar);
                            }}
                          >
                            <span className="navDesign__name">
                              {item.nombreModulo}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>

        <Link to="" className="navDesign__link navDesign__logout" onClick={btnCerrarSesion}>
          <i className="bx bxs-log-out navDesign__icon"></i>
          <span className="navDesign__name">Cerrar Sesion</span>
        </Link>
      </nav>
    </div>
  );
}

export default SideBarMenu;
