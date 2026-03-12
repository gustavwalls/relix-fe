import { React, useReducer } from "react";

import fichaTecnicaContext from "./fichaTecnicaContext";
import fichaTecnicaReducer from "./fichaTecnicaReducer";

import {
  TODAS_LAS_FICHAS_TECNICAS,
  REGISTRO_FICHATECNICA_EXITOSA,
  REGISTRO_FICHATECNICA_ERROR,
  FICHATECNICA_ACTUAL,
  FICHA_EDICION,
  ACTUALIZAR_FICHA,
  ENVIAR_GUARDAR_COTIZACION,
  EXCEL_REPORTE_DOS,
} from "../../types";
import clienteAxios from "../../config/axios";

const FichaTecnicaStateProvider = (props) => {
  const initialState = {
    todasLasFichasTecnica: [],
    fichaTecnica: null, //es un array solo con 1 objeto
    fichaEdicion: null,
    prueba: null,
  };

  const [state, dispatch] = useReducer(fichaTecnicaReducer, initialState);
  ////registrar ficha tecnica
  const registroDeFichaTecnica = async (datos) => {
    console.log("ENVIASTE a registroDeFichaTecnica =>", datos);
    try {
      const respuesta = await clienteAxios.post("/api/fichatecnica", datos);
      console.log("POST de registroDeFichaTecnica =>", respuesta);
      console.log(respuesta.data);
      alert(`${respuesta.data}`);
      dispatch({
        type: REGISTRO_FICHATECNICA_EXITOSA,
        payload: respuesta.data,
      });
    } catch (error) {
      console.log(error);
      console.log(error.response.data.messages.error);
      alert(`${error.response.data.messages.error}`);
    }
  };

  const obtenerTodasLasFichasTecnicas = async () => {
    try {
      const respuesta = await clienteAxios.get("/api/fichatecnica");
      //console.log("respuesta de obtenerTodasLasFichasTecnicas", respuesta.data);
      dispatch({
        type: TODAS_LAS_FICHAS_TECNICAS,
        payload: respuesta.data,
      });
    } catch (error) {
      console.log(error.response.data.messages.error);
    }
  };

  //selecciona el proyecto que el usuario dio click en VER TABLA
  const fichaTecnicaActual = (fichaTecnicaId) => {
    dispatch({
      type: FICHATECNICA_ACTUAL,
      payload: fichaTecnicaId,
    });
  };

  /////////////////////////////////////////EXTRAER UNA TAREA PARA EDICION
  const guardarFichaActual = (ficha) => {
    console.log("estas en guardarFichaActual es para editar", ficha);
    dispatch({
      type: FICHA_EDICION,
      payload: ficha,
    });
  };
  //////////////////////////////////////////
  const actualizarFicha = async (ficha) => {
    console.log("estamos en actualizarFicha y te estoy mandando  ", ficha);
    try {
      const resultado = await clienteAxios.put(
        `/api/fichatecnica/${ficha.idFichatecnica}`,
        ficha
      );
      console.log("resultado de actualizarFicha", resultado);
      console.log(resultado.data);
      dispatch({
        type: ACTUALIZAR_FICHA,
        payload: resultado.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  //////////////////guardar cotizacion
  const guardarCotizacion = async (idFichaTecnica) => {
    console.log("en guardarCotizacion el id es", idFichaTecnica);
    try {
      console.log("entraste al try");
      const resultado = await clienteAxios.put(
        "/detallefichatecnica",
        idFichaTecnica
      );
      // console.log("resultado de guardarCotizacion", resultado);
      console.log("resultado de guardarCotizacion", resultado.data); //me regresa objeto de ficha tecnica con valores cambiados
      dispatch({
        type: ENVIAR_GUARDAR_COTIZACION,
        payload: resultado.data,
      });
    } catch (error) {
      console.log(error);
      console.log(error.response.data.messages.error);
    }
  };

  const excelReporteDos = async (id) => {
    console.log("esto es lo enviado", id);
    try {
      const resultado = await clienteAxios.get(`/ExcelReporteDos/${id}`);
      //console.log("respuesta de excelReporteDos", resultado.data);

      const nombreDescargaArchivo = "Reporte Cotización";

      const link = document.createElement("a");
      link.href = `${process.env.REACT_APP_BACKEND_URL}/ExcelReporteDos/${id}`;
      link.setAttribute("download", nombreDescargaArchivo);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error.response.data.messages.error);
    }
  };

  /* const reportePepiline = async () => {
    console.log("entraste a reportePepiline");
    const fecha = new Date();
    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;
    const anoActual = fecha.getFullYear();
    try {
      var config = {
        responseType: "arraybuffer",
      };
      const resultado = await clienteAxios.get(
        `/api/exportarFichasTecnicas`,
        config
      );
      console.log("respuesta de excelReporteDos", resultado.data);

      const url = URL.createObjectURL(
        new Blob([resultado.data], {
          type: "application/vnd.ms-excel",
        })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `reportePipeLine ${hoy}_${mesActual}_${anoActual}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error.response.data.messages.error);
    }
  };
 */
  return (
    <fichaTecnicaContext.Provider
      value={{
        todasLasFichasTecnica: state.todasLasFichasTecnica,
        fichaTecnica: state.fichaTecnica,
        fichaEdicion: state.fichaEdicion,
        prueba: state.prueba,
        registroDeFichaTecnica,
        obtenerTodasLasFichasTecnicas,
        fichaTecnicaActual,
        guardarFichaActual,
        actualizarFicha,
        guardarCotizacion,
        excelReporteDos,
        //reportePepiline,
      }}
    >
      {props.children}
    </fichaTecnicaContext.Provider>
  );
};

export default FichaTecnicaStateProvider;
