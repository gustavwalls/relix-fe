import clienteAxios from "../../config/axios";

const peticionRegistrarUsuario = async (datos) => {
  try {
    /* console.log("haber token", localStorage.getItem("token")); */
    const { data } = await clienteAxios.post("/api/usuarios", datos, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    console.log("haber data de registrarUsuario", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export { peticionRegistrarUsuario };
