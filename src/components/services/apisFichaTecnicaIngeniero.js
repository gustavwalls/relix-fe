import clienteAxios from "../../config/axios";

const peticionObtenerModulos = async (idFichaTecnica) => {
  try {
    const { data } = await clienteAxios.get(
      `/modulosDetalleFichaTecnicaIngeniero/${idFichaTecnica}`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
const peticionObtenerPartidas = async (idFichaTecnica, nombreModulo) => {
  try {
    const datos = {
      modulo: nombreModulo,
    };
    console.log("ver datos =>", datos);
    const { data } = await clienteAxios.post(
      `/partidasDetalleFichaTecnicaIngeniero/${idFichaTecnica}`,
      datos
    );
    console.log("haber result =>", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
const peticionObtenerSubPartidas = async (idFichaTecnica, datos) => {
  try {
    const { data } = await clienteAxios.post(
      `/subpartidasDetalleFichaTecnicaIngeniero/${idFichaTecnica}`,
      datos
    );
    console.log("data", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export {
  peticionObtenerModulos,
  peticionObtenerPartidas,
  peticionObtenerSubPartidas,
};
