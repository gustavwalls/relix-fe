import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";

const peticionObtenerEstadosProducto = async () => {
  try {
    const { data } = await clienteAxios.get("/estadoProductos");
    //console.log("obtenerEstados", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const peticionObtenerSubPartidasProducto = async (idPartida = "") => {
  console.log("entraste a obtenerSubPartidas");
  try {
    const { data } = await clienteAxios.get(`/subpartidas/${idPartida}`);
    console.log("obtenerSubPartidas =>", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const peticionObtenerProductosProducto = async (codigo) => {
  try {
    const { data } = await clienteAxios.get(`/productos/${codigo}`);
    console.log("obtenerProductos", data);
    return data;
  } catch (error) {
    console.log(error.response.data.messages.error);
    alert(`${error.response.data.messages.error}`)
  }
};

const peticionAgregarProducto = async (datos) => {
  try {
    const { data } = await clienteAxios.post(
      `/productoDetalleFichaTecnica`,
      datos
    );
    console.log("agregarProducto", data);
   // alert('Producto agregado')
   alert("Producto agregado");
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
const peticionAgregarProductoModuloIngeniero = async (datos) => {
  try {
    const { data } = await clienteAxios.post(
      `/RegistrarProductoUnitarioModuloIngeniero`,
      datos
    );
    console.log("agregarProducto", data);
   // alert('Producto agregado')
   alert("Producto agregado");
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

const peticionObtenerPartidasProducto = async () => {
  try {
    const { data } = await clienteAxios.get("/partidas");
  //  console.log("GET peticionObtenerPartidasProducto =>", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
const peticionObtenerProductosGlobales = async (id) => {
  try {
    const { data } = await clienteAxios.get(`/api/ListarGlobalDetallePedido/${id}`);
  //  console.log("GET peticionObtenerProductosGlobales =>", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
const peticionObtenerProductosNoGlobales = async (id) => {
  try {
    const { data } = await clienteAxios.get(`/api/ListarCodigoNueveDetallePedido/${id}`);
  //  console.log("GET peticionObtenerProductosGlobales =>", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const anularProducto = async (datos) => {
  //  console.log("entraste a anularProducto enviaste esta data", datos);
    try {
      const { data } = await clienteAxios.post("/anularProductoDetalle", datos);
      // console.log("anularProducto", data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  
const registrarObservacionPedido = async (id,datos) => {
  /*   console.log("entraste a registrarObservacionPedido enviaste esta data", datos);
    console.log('haber id ==>',id); */
  
    try {
      const  {data}  = await clienteAxios.put(`api/ActualizarDescripcionDetallePedido/${id}`, datos);
   //    console.log("registrarObservacionPedido ==>", data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
const actualizarCostosRealesOrdenesServicios = async (datos) => {
    try {
      const  {data}  = await clienteAxios.post(`api/actualizaciones-costos-reales-ordenes-servicios`, datos);
       //console.log("actualizarCostosRealesOrdenesServicios ==>", data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

const registrarRqPedido = async (datos) => {
 //   console.log("entraste a registrarRqPedido enviaste esta data", datos);
 
    try {
      const  {resultado}  = await clienteAxios.post('api/registrarRequerimientoPedido', datos);

   //   console.log("registrarRqPedido ==>", resultado);
     await descargarExcelAlRegistrar(datos.reqPedido.numRequerimiento)
     Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Registro exitoso',
      showConfirmButton: false,
      timer: 1500
    })
      return resultado;
    } catch (error) {
      console.log('HAY UN ERROR AL REGISTRAR RQPEDIDO');
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `error`,
      });
    }
  };

  const descargarExcelAlRegistrar = async (codigorequerimiento) => {
    console.log("codigorequerimiento", codigorequerimiento);
    console.log("entraste a reportePresupuesto");
    const fecha = new Date();
    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;
    const anoActual = fecha.getFullYear();
    try {
      var config = {
        responseType: "arraybuffer",
      };
      const resultado = await clienteAxios.get(
        `/api/exportarPlantillaCargaPedido/${codigorequerimiento}`,
        config
      );
      console.log("respuesta de descargarExcel", resultado.data);

      const url = URL.createObjectURL(
        new Blob([resultado.data], {
          type: "application/vnd.ms-excel",
        })
      );

      const link = document.createElement("a");
      link.href = url;
      const cdParts = resultado.headers["content-disposition"] ? resultado.headers["content-disposition"].split("filename=") : [];
      const filename = cdParts.length > 1 ? cdParts[1].replace(/"/g, "").trim() : "archivo.xlsx";
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error.response.data.messages.error);
    }
  };

  const descargarExcelGuiaValorizada = async (codigorequerimiento) => {
    console.log("codigorequerimiento", codigorequerimiento);
    console.log("entraste a reportePresupuesto");
    const fecha = new Date();
    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;
    const anoActual = fecha.getFullYear();
    try {
      var config = {
        responseType: "arraybuffer",
      };
      const resultado = await clienteAxios.get(
        `/api/exportarPlantillaCargaPedido/${codigorequerimiento}`,
        config
      );
      console.log("respuesta de descargarExcel", resultado.data);

      const url = URL.createObjectURL(
        new Blob([resultado.data], {
          type: "application/vnd.ms-excel",
        })
      );

      const link = document.createElement("a");
      link.href = url;
      const cdParts = resultado.headers["content-disposition"] ? resultado.headers["content-disposition"].split("filename=") : [];
      const filename = cdParts.length > 1 ? cdParts[1].replace(/"/g, "").trim() : "archivo.xlsx";
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error.response.data.messages.error);
    }
  };


  const descargarExcelMaterialesProcesos= async (id,fichaTecnica) => {
    console.log("id", id);
    console.log("entraste a reportePresupuesto");
    const fecha = new Date();
    try {
      var config = {
        responseType: "arraybuffer",
      };
      const resultado = await clienteAxios.get(
        `/api/ExportarReporteMaterialesProcesadosPendientes/${id}`,config
      );
      console.log("respuesta de descargarExcelMaterialesProcesos", resultado.data);

      const url = URL.createObjectURL(
        new Blob([resultado.data], {
          type: "application/vnd.ms-excel",
        })
      );

      const link = document.createElement("a");
      link.href = url;
      const cdParts = resultado.headers["content-disposition"] ? resultado.headers["content-disposition"].split("filename=") : [];
      const filename = cdParts.length > 1 ? cdParts[1].replace(/"/g, "").trim() : "archivo.xlsx";
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error.response.data.messages.error);
    }
  };

export {
  peticionObtenerSubPartidasProducto,
  peticionObtenerEstadosProducto,
  peticionAgregarProducto,
  peticionObtenerPartidasProducto,
  peticionObtenerProductosProducto,
  anularProducto,
  peticionObtenerProductosGlobales,
  registrarObservacionPedido,
  registrarRqPedido,
  descargarExcelAlRegistrar,
  descargarExcelMaterialesProcesos,
  peticionObtenerProductosNoGlobales,
  peticionAgregarProductoModuloIngeniero,
  descargarExcelGuiaValorizada,
  actualizarCostosRealesOrdenesServicios
};
