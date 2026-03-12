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

export default (state, action) => {
  switch (action.type) {
    case REGISTRO_FICHATECNICA_EXITOSA:
      return {
        ...state,

        //todasLasFichasTecnica: [action.payload, ...state.todasLasFichasTecnica],
        //alerta: action.payload,
        todasLasFichasTecnica: [...state.todasLasFichasTecnica, action.payload],
      };
    case TODAS_LAS_FICHAS_TECNICAS:
      return {
        ...state,
        todasLasFichasTecnica: action.payload,
        //alerta: action.payload,
      };
    case FICHATECNICA_ACTUAL:
      return {
        ...state,
        fichaTecnica: state.todasLasFichasTecnica.filter(
          (ftecnica) => ftecnica.idFichatecnica === action.payload
        ),
      };
    case FICHA_EDICION:
      return {
        ...state,
        fichaEdicion: action.payload,
      };
    case ACTUALIZAR_FICHA:
      return {
        ...state,
        todasLasFichasTecnica: state.todasLasFichasTecnica.map((ficha) =>
          ficha.idFichatecnica === action.payload.idFichatecnica
            ? action.payload
            : ficha
        ),
      };

    case ENVIAR_GUARDAR_COTIZACION:
      return {
        ...state,
        // prueba: action.payload,
        fichaTecnica: [action.payload],
        /*  fichaTecnica: state.todasLasFichasTecnica.filter(
            (ficha) => ficha.idFichatecnica === action.payload.idFichatecnica
          ), */
      };
    case EXCEL_REPORTE_DOS:
      return {
        ...state,
      };

    default:
      return state;
  }
};
