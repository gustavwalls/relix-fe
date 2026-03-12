import React from "react";
import { useReducer } from "react";
import alertContext from "./alertaContext";
import alertaReducer from "./alertaReducer";
import { MOSTRAR_ALERTA, OCULTAR_ALERTA } from "../../types";

const AlertaStateProvider = (props) => {
  const initialState = {
    alerta: null,
  };

  const [state, dispatch] = useReducer(alertaReducer, initialState);
  //funciones
  const mostrarAlerta = (msg, categoria) => {
    console.log("entraste a mostrar alerta");
    dispatch({
      type: MOSTRAR_ALERTA,
      payload: {
        msg: msg,
        categoria: categoria,
      },
    });

    setTimeout(() => {
      dispatch({
        type: OCULTAR_ALERTA,
      });
    }, 5000);
  };

  return (
    <alertContext.Provider value={{ alerta: state.alerta, mostrarAlerta }}>
      {props.children}
    </alertContext.Provider>
  );
};
export default AlertaStateProvider;
