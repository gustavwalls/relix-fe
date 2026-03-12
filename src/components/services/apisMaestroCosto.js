import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";

const actualizarCosto = async (datos) => {
    console.log("entraste a actualizarCosto enviaste esta data", datos);
    try {
      const { data } = await clienteAxios.post("/productosCostoPromedio", datos);
      console.log("actualizarCosto", data);
      Swal.fire(
        "Buen trabajo",
        "Actualizacion exitosa",
        "success"
      );
      return data;
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `No se pudo cargar error en el excel`,
      });
    }
  };

  export { actualizarCosto};
