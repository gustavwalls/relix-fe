import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";

const peticionObtenerRqPedidos= async () => {
    try {
      const { data } = await clienteAxios.get("/api/requerimientoPedido");
      //console.log("obtenerEstados", data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

const peticionObtenerListadoDeRq= async (id) => {
    try {
      const { data } = await clienteAxios.get(`/api/ListarCodigosRequerimientoPedido/${id}`);
     // console.log("peticionObtenerListadoDeRq", data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
const peticionActualizarCodRq= async (datos) => {
    try {
      const { data } = await clienteAxios.put(`api/ActualizarCodigoPedido`,datos);
      //console.log("obtenerEstados", data);
      alert('Todo correcto')
      return data;
    } catch (error) {
      console.log(error);
      //alert(error)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
    }
  };

  export {
    peticionObtenerRqPedidos,
    peticionObtenerListadoDeRq,
    peticionActualizarCodRq
  };
  