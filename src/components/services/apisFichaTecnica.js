import clienteAxios from "../../config/axios";

const obtenerTiposDeProyectos = async () => {
  try {
    const { data } = await clienteAxios.get("/tiposproyecto");
    return data;
  } catch (error) {
    console.log(error);
  }
};

const obtenerVendedores = async () => {
  try {
    const { data } = await clienteAxios.get("/vendedor");
    return data;
  } catch (error) {
    console.log(error);
  }
};

const obtenerDepartamentos = async () => {
  try {
    const { data } = await clienteAxios.get("/departamento");
    return data;
  } catch (error) {
    console.log(error);
  }
};
const obtenerProvincias = async (idDepartamento = "") => {
  try {
    const { data } = await clienteAxios.get(`/provincia/${idDepartamento}`);
    return data;
  } catch (error) {
    console.log("error en obtenerProvincias", error);
  }
};
const obtenerDistritos = async (idProvincia = "") => {
  try {
    const { data } = await clienteAxios.get(`/distrito/${idProvincia}`);
    return data;
  } catch (error) {
    console.log("error en obtenerProvincias", error);
  }
};

const obtenerEstados = async () => {
  try {
    const { data } = await clienteAxios.get("/estadosfichaproyecto");
    return data;
  } catch (error) {
    console.log(error);
  }
};

const obtenerCodigoFichaTenica = async (id) => {
  try {
    const { data } = await clienteAxios.get(`/api/codigoficha/${id}`);
    //console.log('obtenerCodigoFichaTenica =>',data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const obtenerFormasDePago = async () => {
  try {
    const { data } = await clienteAxios.get(`/formaspago`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export {
  obtenerTiposDeProyectos,
  obtenerVendedores,
  obtenerDepartamentos,
  obtenerEstados,
  obtenerProvincias,
  obtenerDistritos,
  obtenerCodigoFichaTenica,
  obtenerFormasDePago,
};
