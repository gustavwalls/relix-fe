import {
  REGISTRO_EXITOSO,
  REGISTRO_ERROR,
  OBTENER_USUARIO,
  LOGIN_EXITOSO,
  LOGIN_ERROR,
  CERRAR_SESION,
  ACTUALIZAR_PASSWORD,
  ENVIAR_PASSWORD,
} from "../../types";

export default (state, action) => {
  switch (action.type) {
    case REGISTRO_EXITOSO:
      // localStorage.setItem("token", "Bearer " + action.payload.Token);
      return {
        ...state,
        //autenticado: true,
        mensaje: null,
      };
    case LOGIN_EXITOSO:
      //INICIO DE SESION
      localStorage.setItem("user","" + action.payload.user.idUsuario);
      localStorage.setItem("nombreRol","" + action.payload.user.nombreRol);
      localStorage.setItem("token", "Bearer " + action.payload.Token);
      localStorage.setItem("rutas", JSON.stringify(action.payload.user.rutas || []));
      
      return {
        ...state,
        //token: localStorage.getItem("token"),
        autenticado: true,
        usuario: action.payload.user,
        mensaje: null,
        cargando: false,
        cambioClave: false,
      };

    case LOGIN_ERROR:
    case REGISTRO_ERROR:
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("nombreRol");
      localStorage.removeItem("rutas");
      return {
        ...state,
        token: null,
        mensaje: action.payload,
        cargando: false,
      };
    case OBTENER_USUARIO:
      return {
        ...state,
        usuario: action.payload.sub,
        autenticado: true,
        cargando: false,
      };
    /*  case OBTENER_TODOS_LOS_USUARIOS:
      return {
        ...state,
        todosLosUsuarios: action.payload,
        autenticado: true,
        cargando: false,
      }; */
    /*  case ACTUALIZAR_USUARIO:
      return {
        ...state,
        todosLosUsuarios: state.todosLosUsuarios.map((usuario) =>
          usuario.idUsuario === action.payload.idUsuario
            ? action.payload
            : usuario
        ),
        autenticado: true,
        cargando: false,
      }; */
    case ACTUALIZAR_PASSWORD:
      return {
        ...state,
        //cambioClave: true,
        //mensaje: true,
      };
    case ENVIAR_PASSWORD:
      return {
        ...state,
        //cambioClave: true,
        //mensaje: true,
      };

    case CERRAR_SESION:
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("nombreRol");
      localStorage.removeItem("rutas");
      return {
        ...state,
        autenticado: null,
        mensaje: null,
        usuario: null,
        // cambioClave: false,
      };
    default:
      return state;
  }
};
