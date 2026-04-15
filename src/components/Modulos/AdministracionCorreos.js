import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";

function AdministracionCorreos() {
  const [modulos, setModulos] = useState([]);
  const navigate = useNavigate();

  const obtenerModulos = async () => {
    try {
      const { data } = await clienteAxios.get("/api/v1/modulos-sistemas");
      const filtrados = data.filter(
        (m) =>
          m.nombreModulo &&
          m.nombreModulo.includes("Ficha Técnica de Proyecto -") &&
          (m.nombreModulo.includes("Gerente") || m.nombreModulo.includes("Ingeniero"))
      );
      setModulos(filtrados);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerModulos();
  }, []);

  return (
    <div className="container pt-4">
      <div className="my-4 text-center container">
        <h4 className="fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
          Administración de Correos
        </h4>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-12">
            <table className="table table-bordered w-100">
              <thead className="table-light">
                <tr>
                  <th>Nombre módulo</th>
                  <th>Módulo global</th>
                </tr>
              </thead>
              <tbody>
                {modulos.map((item, i) => (
                  <tr
                    key={i}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/administracion-correos/" + item.idModulosistema, { state: { nombreModulo: item.nombreModulo } })}
                  >
                    <td>{item.nombreModulo}</td>
                    <td>{item.moduloGlobal}</td>
                  </tr>
                ))}
                {modulos.length === 0 && (
                  <tr>
                    <td colSpan={2} className="text-center text-muted">
                      No hay módulos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdministracionCorreos;
