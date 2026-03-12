import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";


const cargarArchivo = async (datos) => {
  console.log('datos =>',datos)
    try {
      const { data } = await clienteAxios.post(
        `/api/UploadFile`,
        datos
      );
      console.log("cargarArchivo", data);
     // alert('Producto agregado')
     alert("Archivo agregado");
      return data;
    } catch (error) {
      console.log(error.response.data.messages.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
    }
  };

const peticionAsignarArchivos = async (datos) => {
  console.log('datos =>',datos)
    try {
      const { data } = await clienteAxios.post(
        `/api/AsignacionPermiso`,
        datos
      );
      console.log("peticionAsignarArchivos", data);
     // alert('Producto agregado')
     alert("Archivo Asignado");
      return data;
    } catch (error) {
      console.log(error.response.data.messages.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
    }
  };

const peticionEliminarArchivos = async (datos) => {
  console.log('datos =>',datos)
    try {
      const { data } = await clienteAxios.put(
        `/api/EliminarPermiso`,
        datos
      );
      console.log("peticionAsignarArchivos", data);
     // alert('Producto agregado')
     alert("Permiso eliminado");
      return data;
    } catch (error) {
      console.log(error.response.data.messages.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
    }
  };

const peticionBorrarArchivo = async (datos) => {
  console.log('datos =>',datos)
    try {
      const { data } = await clienteAxios.put(
        `/api/EliminarArchivo`,
        datos
      );
      console.log("peticionBorrarArchivo", data);
     // alert('Producto agregado')
      return data;
    } catch (error) {
      console.log(error.response.data.messages.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
    }
  };

  const peticionObtenerArchivos = async (idusuario,idficha) => {
    try {
      const { data } = await clienteAxios.get(`api/ListarArchivoUsuario/${idusuario}/${idficha}/2`);
   //   console.log("peticionObtenerArchivos", data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const peticionObtenerArchivos2 = async (idusuario,idficha) => {
    try {
      const { data } = await clienteAxios.get(`api/ListarArchivoUsuario/${idusuario}/${idficha}/1`);
   //   console.log("peticionObtenerArchivos", data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };



  export {
    cargarArchivo,
    peticionObtenerArchivos,
    peticionAsignarArchivos,
    peticionEliminarArchivos,
    peticionObtenerArchivos2,
    peticionBorrarArchivo
  };