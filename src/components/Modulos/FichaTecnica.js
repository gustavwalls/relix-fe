import React, { useState } from "react";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import { MdPageview } from "react-icons/md";
import { AiOutlineSave } from "react-icons/ai";
function FichaTecnica({
  fichaTecnica,
  i,
  setObtenerDatosTabla,
  setFichaTecnica,
  setExisteFichaTecnica,
  setErroresExcel,
}) {
  //////////////////////////////
  //Obtener detalle ficha dise;ador
  const obtenerDetalleFichaTecnicaDisenador = async (id) => {
    try {
      const respuesta = await clienteAxios.get(`/detallefichatecnica/${id}`);
      console.log(
        "respuesta de obtenerDetalleFichaTecnicaDisenador",
        respuesta.data
      );
      setObtenerDatosTabla(respuesta.data);
      return respuesta.data;
    } catch (error) {
      console.log(error.response.data.messages.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
    }
  };

  const btnVerTabla = async (fichaAceptada, indice) => {
    try {
      console.log(
        "diste click en btnVerTabla",
        fichaAceptada,
        "id es",
        fichaAceptada.idFichatecnica
      );
      setFichaTecnica(fichaAceptada);
      setExisteFichaTecnica(true);
      obtenerDetalleFichaTecnicaDisenador(fichaAceptada.idFichatecnica);
      setErroresExcel([]);
      let lista = document.querySelectorAll(".cambiarcolores");
      lista.forEach((item, i) => {
        if (i === indice) {
          item.classList.add("bg-primary");
          item.classList.add("text-black");
        } else {
          item.classList.remove("bg-primary");
          item.classList.remove("text-black");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <li className="border border-secondary rounded p-3 shadow mb-3 cambiarcolores">
      <div>
        <p className="fw-bolder  text-uppercase my-0 py-0 mb-2">
          {fichaTecnica.nombreFichatecnica} - {fichaTecnica.numFichatecnica}
        </p>
        <p
          className="my-0 py-0  fw-bold text-center text-uppercase estado"
          style={{ border: "2px solid #F18721", borderRadius: "25px" }}
        >
          {fichaTecnica.estadoFichaproyecto}
        </p>
      </div>
      <div className="d-flex my-2">
        {/*  <NavLink
          to={`/reporte/${fichaAceptada.idFichatecnica}`}
          className="btn btn-primary my-auto"
        >
          Reportes
        </NavLink> */}

        <button
          className="btn btn-success text-uppercase btn btn-sm me-2"
          onClick={() => btnVerTabla(fichaTecnica, i)}
        >
          <MdPageview className="h3 m-0 p-0 pe-1" />
          Ver Lista de Materiales
        </button>
        {fichaTecnica.enviodiseniadorFichatecnica == "0" ? (
          <span className="bg-warning text-dark p-1 rounded text-uppercase">
            Sin guardar
          </span>
        ) : (
          <span className="bg-primary text-light p-1 rounded text-uppercase">
            <AiOutlineSave className="h3 m-0 p-0 pe-1 " />
            Guardado
          </span>
        )}
      </div>
    </li>
  );
}

export default FichaTecnica;
