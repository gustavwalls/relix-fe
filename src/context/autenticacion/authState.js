import React from "react";
import authContext from "./authContext";
import authReducer from "./authReducer";
import {
  OBTENER_USUARIO,
  LOGIN_EXITOSO,
  LOGIN_ERROR,
  CERRAR_SESION,
  ACTUALIZAR_PASSWORD,
  ENVIAR_PASSWORD,
} from "../../types";
import { useReducer } from "react";
import clienteAxios from "../../config/axios"; //obtengo la bd urlS
import tokenAuth from "../../config/token";
const AuthStateProvider = (props) => {

  const initialState = {
    token: localStorage.getItem("token"),
    autenticado: null,
    usuario: null,
    mensaje: null,
    cargando: true,
    todosLosUsuarios: [],
    //cambioClave: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  //retorna el usuario autenticado
  const usuarioAutenticado = async () => {
    //console.log('ENTRASTE A usuarioAutenticado');
    const token = localStorage.getItem("token");
    if (token) {
      //todo:funcion para enviar el token por headers
      tokenAuth(token);
      /*   console.log("entraste al if del token"); */
    }

    try {
     // console.log('ENTRASTE AL TRY DE usuarioAutenticado ');
      const respuesta = await clienteAxios.get("/auth/login");
     // console.log("esta es la respuesta en usuarioAutenticado  -->", respuesta.data);
      dispatch({
        type: OBTENER_USUARIO,
        payload: respuesta.data,
      });
    } catch (error) {
      console.log(
        "error en usuarioAutenticado",
        error.response.data.messages.error
      );
      dispatch({
        type: LOGIN_ERROR,
      });
    }
  };

  const iniciarSesion = async (datos) => {
   // console.log("entraste a iniciarSesion", datos);
    try {
      console.log("entraste al try de iniciarSesion");
      const respuesta = await clienteAxios.post("/auth/login", datos); //envio correo y clave
   //   console.log("respuesta de iniciarSesion ", respuesta);
      ////
      dispatch({
        type: LOGIN_EXITOSO,
        payload: respuesta.data,
      });
      
    } catch (error) {
      console.log("HUBO UN ERROR PES ", error);
      console.log("HUBO UN ERROR PES ", error.response.data.messages.error);
      alert(`${error.response.data.messages.error}`);
      const alerta = {
        msg: error.response.data.messages.error,
        categoria: "alert alert-danger",
      };
      dispatch({
        type: LOGIN_ERROR,
        payload: alerta,
      });
    }
  };

  //cerrar sesion

  const cerrarSesion = () => {
    dispatch({
      type: CERRAR_SESION,
    });
  };

  //enviar password
  const enviarCorreoPassword = async (dato) => {
    console.log("enviarPassword se envio", dato);
    try {
      const resultado = await clienteAxios.put(`/generarclave`, dato);
      console.log(resultado);
      console.log(resultado.data);
      alert('Envio exitoso ! , revisar correo , muchas gracias!');
      dispatch({
        type: ENVIAR_PASSWORD,
        payload: resultado.data,
      });
    } catch (error) {
      console.log(error.response.data.messages.error);
      alert(`${error.response.data.messages.error}`);
    }
  };

  //actualizar password
  const actualizarPassword = async (datos) => {
    console.log("actualizarpassword se envio", datos);
    try {
      const resultado = await clienteAxios.put(
        `/actualizarClavedefault`,
        datos
      );
      console.log(resultado);
      console.log(resultado.data);
      alert(`${resultado.data}`);
      dispatch({
        type: ACTUALIZAR_PASSWORD,
        payload: resultado.data,
      });
    } catch (error) {
      console.log(error.response.data.messages.error);
      alert(`${error.response.data.messages.error}`);
    }
  };

  return (
    <authContext.Provider
      value={{
        token: state.token,
        autenticado: state.autenticado,
        usuario: state.usuario,
        mensaje: state.mensaje,
        cargando: state.cargando,
        todosLosUsuarios: state.todosLosUsuarios,
        cambioClave: state.cambioClave,
        iniciarSesion,
        usuarioAutenticado,
        cerrarSesion,
        enviarCorreoPassword,
        actualizarPassword,
      }}
    >
      {props.children}
    </authContext.Provider>
  );
};
export default AuthStateProvider;
