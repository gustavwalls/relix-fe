import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import authContext from "../context/autenticacion/authContext";
import Logo from "../img/relixsinfondo.png";
import Swal from "sweetalert2";
import clienteAxios from "../config/axios";

function SideBarMenu({ activarSideBar, setActivarSideBar, usuario }) {
  const { rutas } = usuario;
  let navigate = useNavigate();

  const autentificaciones = useContext(authContext);
  const { cerrarSesion } = autentificaciones;

  const btnCerrarSesion = async () => {
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

  const reportePipeline = async () => {
    const fecha = new Date();
    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;
    const anoActual = fecha.getFullYear();
    try {
      const resultado = await clienteAxios.get(`/api/exportarFichasTecnicas`, {
        responseType: "arraybuffer",
      });
      const url = URL.createObjectURL(
        new Blob([resultado.data], { type: "application/vnd.ms-excel" })
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

  const handleLinkClick = (item) => {
    setActivarSideBar(!activarSideBar);
    if (item.nombreModulo === "Reporte Pipeline") {
      reportePipeline();
    }
  };

  const toTitleCase = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Agrupa rutas por moduloGlobal respetando el orden de aparición
  const modulos = rutas.reduce((acc, item) => {
    const existing = acc.find((m) => m.moduloGlobal === item.moduloGlobal);
    if (existing) {
      existing.items.push(item);
    } else {
      acc.push({ moduloGlobal: item.moduloGlobal, icon: item.icon, items: [item] });
    }
    return acc;
  }, []);

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

              {modulos.map(({ moduloGlobal, icon, items }) => (
                <div className="navDesign__dropdown" key={moduloGlobal}>
                  <a href="#" className="navDesign__link">
                    <i className={`${icon} navDesign__icon`}></i>
                    <span className="navDesign__name">{toTitleCase(moduloGlobal)}</span>
                    <i className="bx bxs-chevron-down navDesign__icon navDesign__dropdown-icon"></i>
                  </a>

                  <div className="navDesign__dropdown-collapse">
                    <div className="navDesign__dropdown-content">
                      {items.map((item, i) => (
                        <Link
                          to={`/${item.rutaModulo}`}
                          className="navDesign_dropdown-item"
                          key={i}
                          onClick={() => handleLinkClick(item)}
                        >
                          <span className="navDesign__name">{item.nombreModulo}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Link
          to=""
          className="navDesign__link navDesign__logout"
          onClick={btnCerrarSesion}
        >
          <i className="bx bxs-log-out navDesign__icon"></i>
          <span className="navDesign__name">Cerrar Sesion</span>
        </Link>
      </nav>
    </div>
  );
}

export default SideBarMenu;
