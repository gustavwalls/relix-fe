import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";

function AdministracionCorreosDetalle() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const nombreModulo = state && state.nombreModulo ? state.nombreModulo : "Detalle";

  const [receptores, setReceptores] = useState([]);
  const [tiposReceptor, setTiposReceptor] = useState([]);
  const [selecciones, setSelecciones] = useState({});

  const obtenerReceptores = async () => {
    try {
      const { data } = await clienteAxios.get(
        "/api/v1/modulos-sistemas/" + id + "/modulos-sistemas-usuarios-tipos-receptores"
      );
      setReceptores(data);
      const inicial = {};
      data.forEach((item) => {
        inicial[item.idModuloSistemaUsuarioTipoReceptor] = item.idTipoReceptor;
      });
      setSelecciones(inicial);
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerTiposReceptor = async () => {
    try {
      const { data } = await clienteAxios.get("/api/v1/tipos-receptores");
      setTiposReceptor(data);
    } catch (error) {
      console.log(error);
    }
  };

  const guardar = async (idModuloSistemaUsuarioTipoReceptor) => {
    try {
      await clienteAxios.put(
        "/api/v1/modulos-sistemas-usuarios-tipos-receptores/" + idModuloSistemaUsuarioTipoReceptor,
        { idTipoReceptor: selecciones[idModuloSistemaUsuarioTipoReceptor] }
      );
      Swal.fire({ position: "top-end", icon: "success", title: "Guardado correctamente", showConfirmButton: false, timer: 2500 });
      obtenerReceptores();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error && error.response && error.response.data && error.response.data.messages ? error.response.data.messages.error : "Error al guardar" });
    }
  };

  useEffect(() => {
    obtenerReceptores();
    obtenerTiposReceptor();
  }, [id]);

  return (
    <div className="container pt-4">
      <div className="my-4 text-center container">
        <h4 className="fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
          {nombreModulo}
        </h4>
        <div className="text-start mt-2">
          <button
            className="btn btn-secondary d-flex align-items-center gap-2"
            onClick={() => navigate("/administracion-correos")}
          >
            <i className="bx bx-arrow-back" style={{ fontSize: "1.2rem" }}></i>
            Regresar
          </button>
        </div>
      </div>

      <div className="container">
        <table className="table table-bordered w-100">
          <thead className="table-light">
            <tr>
              <th>Nombre completo</th>
              <th>{nombreModulo}</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {receptores.map((item, i) => (
              <tr key={i}>
                <td>{item.nombreUsuario} {item.apellidoUsuario}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={selecciones[item.idModuloSistemaUsuarioTipoReceptor] || ""}
                    onChange={(e) =>
                      setSelecciones({ ...selecciones, [item.idModuloSistemaUsuarioTipoReceptor]: e.target.value })
                    }
                  >
                    {tiposReceptor.map((tipo) => (
                      <option key={tipo.idTipoReceptor} value={tipo.idTipoReceptor}>
                        {tipo.desTipoReceptor}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => guardar(item.idModuloSistemaUsuarioTipoReceptor)}
                  >
                    Guardar
                  </button>
                </td>
              </tr>
            ))}
            {receptores.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-muted">
                  No hay receptores registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdministracionCorreosDetalle;
