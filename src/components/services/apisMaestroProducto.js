
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";

const registroProductos = async (datos) => {
  console.log("entraste a registroProductos enviaste esta data", datos);
  try {
    const { data } = await clienteAxios.post("/productos", datos);
    console.log("registroProductos", data);
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
const registroProducto = async (dato) => {
  console.log("entraste a registroProducto enviaste esta data", dato);
  try {
    const { data } = await clienteAxios.post("/productosUnidad", dato);
    console.log("registroProducto", data);
    Swal.fire(
      "Buen trabajo",
      "Actualizacion exitosa, revise por favor",
      "success"
    );
    return data;
  } catch (error) {
    //console.log(error);
    console.log(error.response.data.messages.error);
     Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
  }
};

export { registroProductos, registroProducto };
