import React from "react";
import Swal from "sweetalert2";
import clienteAxios from "../../../config/axios";
import { peticionObtenerListadoDeRq } from "../../services/apisRqPedidos";

function AnularRequerimientoPedido({
  rqSeleccionado,
  fichaTecnica,
  btnVerTabla,
}) {
  const anularPedido = async () => {
    console.log("a ver", rqSeleccionado);

    try {
      const { data } = await clienteAxios.put(
        `/api/AnularRequerimientoPedido/${rqSeleccionado}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${data}`,
        showConfirmButton: false,
        timer: 2700,
      });
      await btnVerTabla(fichaTecnica);
      return data;
    } catch (error) {
      console.log(error);
      alert(error.response.data.messages.error);
    }
  };
  return (
    <button className="btn btn-danger btn-sm" onClick={() => anularPedido()}>
      Anular
    </button>
  );
}

export default AnularRequerimientoPedido;
