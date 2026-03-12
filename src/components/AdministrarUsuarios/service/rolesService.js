import Swal from "sweetalert2";
import clienteAxios from "../../../config/axios";


const peticionObtenerRoles = async () => {
    try {
      const { data } = await clienteAxios.get("/roles");
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const peticionObtenerAcciones= async () => {
    try {
      const { data } = await clienteAxios.get("api/ModuloSistema");
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  export {
    peticionObtenerRoles,
    peticionObtenerAcciones
  };