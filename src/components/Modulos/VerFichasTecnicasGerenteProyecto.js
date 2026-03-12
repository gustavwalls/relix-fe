import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import authContext from "../../context/autenticacion/authContext";

import { Accordion, Button, Form } from "react-bootstrap";
import {
  peticionObtenerModulos,
  peticionObtenerPartidas,
  peticionObtenerSubPartidas,
} from "../services/apisFichaTecnicaIngeniero";

import Card from "react-bootstrap/Card";
import { DataGrid } from "@mui/x-data-grid";
import { BsNewspaper } from "react-icons/bs";
import { BsFillEmojiLaughingFill } from "react-icons/bs";
import { BsFillEmojiFrownFill } from "react-icons/bs";
import { MdPageview } from "react-icons/md";
import { BiSave } from "react-icons/bi";
import { TbDiscount } from "react-icons/tb";
import { AiFillDelete } from "react-icons/ai";
import { AiOutlineSave } from "react-icons/ai";
import ModelDetalleGeneral from "../Modales/ModelDetalleGeneral";
import Box from "@mui/material/Box";
import clsx from "clsx";
import ModalDatosDePartidaIng from "../Modales/ModalDatosDePartidaIng";
import ModalDatosDeSubPartidaIng from "../Modales/ModalDatosDeSubPartidaIng";
import ModalAgregarProductoIngeniero from "../Modales/ModalAgregarProductoIngeniero";

function VerFichasTecnicasGerenteProyecto() {
  /////////////////////////////////
  const autentificaciones = useContext(authContext);
  const { usuario } = autentificaciones;

  if (!usuario) {
    return null;
  }

  const { idUsuario, nombreRol } = usuario;

  //DETALLES
  const [detalleFichaTecnica, setDetalleFichaTecnica] = useState({});
  const [detalleTabla, setDetalleTabla] = useState([]);
  const [detalleGeneral, setDetalleGeneral] = useState([]);
  const [detalleModulos, setDetalleModulos] = useState([]);
  const [fichaTecnica, setFichaTecnica] = useState({});
  const { envio_ingeniero_fichatecnica } = fichaTecnica;
  const [fichasTecnicasIngeniero, setFichasTecnicasIngeniero] = useState([]);
  const [idUsuarioFichaTecnica, setidUsuarioFichaTecnica] = useState("");
  ////MOSTRAR FICHA
  const [mostarFicha, setMostarFicha] = useState(false);

  //MODALES
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  /////
  const [modulos, setModulos] = useState([]);
  const [partidas, setPartidas] = useState([]);
  const [subPartidas, setSubPartidas] = useState([]);

  const [selectSubpartida, setSelectSubpartida] = useState("");
  const [inputSubpartida, setInputSubpartida] = useState(0);

  const [selectPartida, setSelectPartida] = useState("");
  const [inputPartida, setInputPartida] = useState(0);

  const [selectModulo, setSelectModulo] = useState("");
  const [inputModulo, setInputModulo] = useState(0);

  const [dataModalIng, setDataModalIng] = useState({});
  const [dataModalSubPartidasIng, setDataModalSubPartidasIng] = useState({});

  const obtenerFichasTecnicasIngeniero = async (idUsuario) => {
    try {
      const respuesta = await clienteAxios.get(
        `/api/FichaTecnicaIngeniero/${idUsuario}`
      );
      setFichasTecnicasIngeniero(respuesta.data);
      return respuesta.data;
    } catch (error) {
      console.log("error en api/FichaTecnicaIngeniero =>", error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      obtenerFichasTecnicasIngeniero(idUsuario);
    }, 2500);
  }, []);

  const btnVerTabla = (ficha, indice) => {
    console.log("haber la ficha", ficha, "id", ficha.idFichatecnica);
    console.log("usuario de ficha tecnica ->", ficha.idUsuario);
    setidUsuarioFichaTecnica(ficha.idUsuario);
    setFichaTecnica(ficha);
    obtenerDetalleTecnicasIngeniero(ficha.idFichatecnica);
    obtenerModulos(ficha.idFichatecnica);
    // obtenerPartidas(ficha.idFichatecnica);
    //obtenerSubPartidas(ficha.idFichatecnica);
    setMostarFicha(true);
    let lista = document.querySelectorAll(".cambiarcolores");
    lista.forEach((item, i) => {
      if (i === indice) {
        item.classList.add("bg-secondary");
        item.classList.add("text-white");
      } else {
        item.classList.remove("bg-secondary");
        item.classList.remove("text-white");
      }
    });
  };

  const obtenerDetalleTecnicasIngeniero = async (idFichaTecnica) => {
    try {
      // setLoading(true);
      const respuesta = await clienteAxios.get(
        `/DetalleFichaTecnicaIngeniero/${idFichaTecnica}`
      );
      console.log(
        "respuesta de obtenerDetalleTecnicasIngeniero",
        respuesta.data
      );

      setDetalleFichaTecnica(respuesta.data);
      setDetalleTabla(respuesta.data.DetalleTabla);
      setDetalleGeneral(respuesta.data.DetalleGeneral);
      setDetalleModulos(respuesta.data.DetalleModulos);
      //setLoading(false);
      return respuesta.data;
    } catch (error) {
      //setLoading(false);
      console.log(error.response.data.messages.error);
    }
  };

  //Tabla con material UI
  const columns = [
    { field: "id", headerName: "ID", width: 90, hide: true },
    {
      field: "itemDetallefichatecnica",
      headerName: "Item",

      //editable: true,
    },
    {
      field: "moduloDetallefichatecnica",
      headerName: "Modulo",
      minWidth: 100,
      maxWidth: 150,

      //editable: true,
    },

    {
      field: "partidaDetallefichatecnica",
      headerName: "Partida",
      minWidth: 150,
      maxWidth: 350,

      //editable: true,
    },
    {
      field: "subpartidaDetallefichatecnica",
      headerName: "Subpartida",
      minWidth: 150,
      maxWidth: 550,
      //editable: true,
    },

    {
      field: "marcaDetallefichatecnica",
      headerName: "Marca",

      // editable: true,
    },
    {
      field: "undDetallefichatecnica",
      headerName: "UND",

      // editable: true,
    },
    {
      field: "codigoproveedorDetallefichatecnica",
      headerName: "Proveedor",

      // editable: true,
    },
    {
      field: "codigosoftcomProducto",
      headerName: "Codigo softcom",
      headerClassName: "super-app-theme--soft",
      //editable: true,
      width: 125,
      minWidth: 150,
      maxWidth: 850,
    },

    {
      field: "descripcionDetallefichatecnica",
      headerName: "Descripcion",
      editable: true,
      width: 125,
      minWidth: 480,
      maxWidth: 850,
      // editable: true,
    },

    {
      field: "cantidadDetallefichatecnica",
      headerName: "Cantidad",
      width: 125,
      minWidth: 150,
      maxWidth: 550,
      editable: true,
      /*  align: "right",
          headerAlign: "right", */
    },

    {
      field: "preciounitarioDetallefichatecnica",
      headerName: "Precio unitario USD",
      width: 125,
      minWidth: 150,
      maxWidth: 550,
      editable: true,
      headerClassName: "super-app-theme--editar",
      cellClassName: (params) => {
        if (params.value == null) {
          return "";
        }

        return clsx("super-app", {
          negative: params.value <= 0.0,
          positive: params.value > 0.0,
        });
      },
      type: "number",
      valueFormatter: ({ value }) => `${value}`,
    },

    {
      field: "preciototalDetallefichatecnica",
      headerName: "Sub-Total USD",
      width: 125,
      minWidth: 150,
      maxWidth: 550,
      //align: "right",
      // editable: true,
    },

    {
      field: "preciodescuentoDetallefichatecnica",
      headerName: "Sub-Total con descuento USD",
      width: 125,
      minWidth: 250,
      maxWidth: 550,
      //  align: "right",
      // editable: true,
    },
    {
      field: "costoingDetallefichatecnica",
      headerName: "Costo de diseño USD",
      width: 125,
      minWidth: 250,
      maxWidth: 550,
      editable: true,
      headerClassName: "super-app-theme--editar",
      cellClassName: (params) => {
        if (params.value == null) {
          return "";
        }

        return clsx("super-app", {
          negative: params.value <= 0.0,
          positive: params.value > 0.0,
        });
      },
      type: "number",
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: "costototalDetallefichatecnica",
      headerName: "Costo Total USD",
      width: 125,
      minWidth: 250,
      maxWidth: 550,
      //  align: "right",
      //editable: true,
    },

    {
      field: "descuentounitarioDetallefichatecnica",
      headerName: "Descuento unitario %",
      width: 125,
      minWidth: 250,
      maxWidth: 550,
      editable: true,
      headerClassName: "super-app-theme--descuento",
      // align: "right",
    },
    {
      field: "descuentopartidaDetallefichatecnica",
      headerName: "Descuento partida %",
      width: 125,
      minWidth: 250,
      maxWidth: 550,
      //  align: "right",
      // editable: true,
    },
    {
      field: "descuentosubpartidaDetallefichatecnica",
      headerName: "Descuento Subpartida %",
      width: 125,
      minWidth: 250,
      maxWidth: 550,
      // align: "right",
      //editable: true,
    },
    {
      field: "descuentototalDetallefichatecnica",
      headerName: "Descuento modulo %",
      width: 125,
      minWidth: 250,
      maxWidth: 550,
      // align: "right",
      // editable: true,
    },

    {
      field: "Acciones",
      width: 125,
      minWidth: 250,
      maxWidth: 550,
      renderCell: (cellValues) => {
        return (
          <div>
            {fichaTecnica.cotizacionenviadaFichatecnica == "0" ? (
              <>
                <button
                  className="btn-warning btn-sm rounded"
                  onClick={() => btnEditar(cellValues)}
                >
                  <BiSave className="h3" />
                </button>
                <button
                  className="btn-primary btn-sm rounded mx-1"
                  onClick={() => btnAplicarDescuentoUnitario(cellValues)}
                >
                  <TbDiscount className="h3" />
                </button>
                <button
                  className="btn-danger btn-sm rounded"
                  onClick={() => btnEliminarProducto(cellValues)}
                >
                  <AiFillDelete className="h3" />
                </button>
              </>
            ) : (
              <span className="text-uppercase fw-bold text-success">
                sin acciones
              </span>
            )}
          </div>
        );
      },
    },
  ];

  const btnEliminarProducto = async (cellValues) => {
    // console.log('ver ficha',fichaTecnica)
    const idProducto = {
      iddetallefichatecnica: cellValues.row.idDetallefichatecnica,
    };
    try {
      const { data } = await clienteAxios.put(
        `/anularDetalleFichaTecnicaIngeniero`,
        idProducto,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      obtenerDetalleTecnicasIngeniero(fichaTecnica.idFichatecnica);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${data}`,
        showConfirmButton: false,
        timer: 2700,
      });
      obtenerDetalleTecnicasIngeniero(fichaTecnica.idFichatecnica);
      return data;
    } catch (error) {
      console.log("HAY ERROR EN ELIMINAR PRODUCTO", error);

      setMostarFicha(false);
    }
  };

  const btnEditar = (cellValues) => {
    // console.log("aplicar boton", cellValues);
    //console.log("haber fila", cellValues.row);
    const data = {
      idDetallefichatecnica: cellValues.row.idDetallefichatecnica,
      costoingDetallefichatecnica: cellValues.row.costoingDetallefichatecnica,
      cantidadDetallefichatecnica: cellValues.row.cantidadDetallefichatecnica,
      descripcionDetallefichatecnica:
        cellValues.row.descripcionDetallefichatecnica,
      preciounitarioDetallefichatecnica:
        cellValues.row.preciounitarioDetallefichatecnica,
    };
    console.log("haber data", data);

    let idficha = fichaTecnica.idFichatecnica;
    //console.log("este es el id de la ficha tecnica", idficha);
    actualizarCostoPrecio(idficha, data);
  };
  const actualizarCostoPrecio = async (idficha, datos) => {
    try {
      //console.log("haber token", localStorage.getItem("token"));
      //setLoading(true);
      const { data } = await clienteAxios.put(
        `/agregarDetalleFichaTecnicaIngeniero/${idficha}`,
        datos,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      /* console.log("haber respuesta", data); */
      obtenerDetalleTecnicasIngeniero(idficha);
      // setLoading(false);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${data}`,
        showConfirmButton: false,
        timer: 2700,
      });
      obtenerDetalleTecnicasIngeniero(idficha);
      return data;
    } catch (error) {
      /* console.log(error); */
      console.log(error.response.data.messages.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
      setMostarFicha(false);
    }
  };
  const btnAplicarDescuentoUnitario = (cellValues) => {
    const data = {
      idDetallefichatecnica: cellValues.row.idDetallefichatecnica,
      descuentounitarioDetallefichatecnica:
        cellValues.row.descuentounitarioDetallefichatecnica,
    };
    console.log("haber data", data);
    let idficha = fichaTecnica.idFichatecnica;
    console.log("este es el id de la ficha tecnica", idficha);
    descuentoUnitario(idficha, data);
  };
  const descuentoUnitario = async (idficha, datos) => {
    console.log("descuentoUnitario data", datos, "id", idficha);
    try {
      const { data } = await clienteAxios.put(
        `/agregarDescuentoUnitarioFichaTecnicaIngeniero/${idficha}`,
        datos,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      /* console.log("haber respuesta", data); */
      obtenerDetalleTecnicasIngeniero(idficha);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${data}`,
        showConfirmButton: false,
        timer: 2700,
      });
      obtenerDetalleTecnicasIngeniero(idficha);
      return data;
    } catch (error) {
      /* console.log(error); */
      console.log(error.response.data.messages.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
      setMostarFicha(false);
    }
  };

  //consumiendo apis

  const obtenerModulos = async (idficha) => {
    try {
      /* let idFichaTecnica = fichaTecnica.idFichatecnica; */
      /* console.log("haber id", idficha); */
      const obteniendoModulos = await peticionObtenerModulos(idficha);
      /* console.log("haber obteniendoModulos", obteniendoModulos); */
      setModulos(obteniendoModulos);
    } catch (error) {
      console.log(error);
    }
  };
  const obtenerPartidas = async (idficha, nombreModulo) => {
    try {
      // setLoading(true);

      const obteniendoPartidas = await peticionObtenerPartidas(
        idficha,
        nombreModulo
      );
      // setLoading(false);
      setPartidas(obteniendoPartidas);
    } catch (error) {
      // setLoading(false);
      console.log(error);
    }
  };
  const obtenerSubPartidas = async (idficha, nombrePartida) => {
    //console.log("este es el id y la data", idficha, data);
    try {
      //  setLoading(true);
      const data = {
        modulo: selectModulo,
        partida: nombrePartida,
      };
      console.log("vas a enviar esta data => ", data);
      const obteniendoSubPartidas = await peticionObtenerSubPartidas(
        idficha,
        data
      );
      //  setLoading(false);
      setSubPartidas(obteniendoSubPartidas);
    } catch (error) {
      // setLoading(false);
      console.log(error);
    }
  };
  /////////////////////////////////////////////////////////////////////////////DESCUENTOS

  ///////////////////////////////////////////////////////////DESCUENTO POR SUBPARTIDAS

  const btnAplicarDescuentoSubpartida = (e) => {
    e.preventDefault();
    console.log("haber selectPartida", inputModulo);
    const data = {
      SUBPARTIDAS: selectSubpartida,
      PARTIDAS: selectPartida,
      MODULOS: selectModulo,
      descuento: inputSubpartida,
    };
    console.log("haber data", data);
    let idficha = fichaTecnica.idFichatecnica;
    descuentoSubpartida(idficha, data);
  };

  const descuentoSubpartida = async (idficha, datos) => {
    console.log("descuentoSubpartida data", datos, "id", idficha);
    try {
      const { data } = await clienteAxios.put(
        `/agregarDescuentoSubPartidaFichaTecnicaIngeniero/${idficha}`,
        datos,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      /* console.log("haber respuesta", data); */
      obtenerDetalleTecnicasIngeniero(idficha);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${data}`,
        showConfirmButton: false,
        timer: 2700,
      });
      obtenerDetalleTecnicasIngeniero(idficha);
      return data;
    } catch (error) {
      /* console.log(error); */
      console.log(error.response.data.messages.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
      setMostarFicha(false);
    }
  };
  ///////////////////////////////////////////////////////////DESCUENTO POR SUBPARTIDAS
  ///////////////////////////////////////////////////////////////////DESCUENTO POR PARTIDAS

  const btnAplicarDescuentoPartida = (e) => {
    e.preventDefault();
    console.log("haber selectPartida", inputModulo);
    const data = {
      PARTIDAS: selectPartida,
      MODULOS: selectModulo,
      descuento: inputPartida,
    };
    console.log("haber data", data);
    let idficha = fichaTecnica.idFichatecnica;
    descuentoPartida(idficha, data);
  };
  const descuentoPartida = async (idficha, datos) => {
    console.log("descuentoUnitario data", datos, "id", idficha);
    try {
      const { data } = await clienteAxios.put(
        `/agregarDescuentoPartidaFichaTecnicaIngeniero/${idficha}`,
        datos,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      obtenerDetalleTecnicasIngeniero(idficha);
      /* console.log("haber respuesta", data); */
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${data}`,
        showConfirmButton: false,
        timer: 2700,
      });
      obtenerDetalleTecnicasIngeniero(idficha);
      return data;
    } catch (error) {
      /* console.log(error); */
      console.log(error.response.data.messages.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
      setMostarFicha(false);
    }
  };
  ///////////////////////////////////////////////////////////////////DESCUENTO POR PARTIDAS

  /////////////////////////////////////////////////descuento por modulo

  const btnAplicarDescuentoModulo = (e) => {
    e.preventDefault();
    console.log("haber selectModulo", inputModulo);
    const data = {
      MODULOS: selectModulo,
      descuento: inputModulo,
    };
    console.log("haber data", data);
    let idficha = fichaTecnica.idFichatecnica;
    descuentoModulo(idficha, data);
  };
  const descuentoModulo = async (idficha, datos) => {
    console.log("descuentoUnitario data", datos, "id", idficha);
    try {
      const { data } = await clienteAxios.put(
        `/agregarDescuentoModuloFichaTecnicaIngeniero/${idficha}`,
        datos,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      /* console.log("haber respuesta", data); */
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${data}`,
        showConfirmButton: false,
        timer: 2700,
      });
      obtenerDetalleTecnicasIngeniero(idficha);
      return data;
    } catch (error) {
      /* console.log(error); */
      console.log(error.response.data.messages.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
      setMostarFicha(false);
    }
  };
  /////////////////////////////////////////////////descuento por modulo

  const rows = detalleTabla.map((dato, i) => ({
    ...dato,
    id: i + 1,
  }));
  //
  const columnsModulos = [
    { field: "id", headerName: "ID", width: 90, hide: true },

    {
      field: "MODULOS",
      headerName: "Modulo",
      width: 110,
      align: "right",
      //editable: true,
    },
    {
      field: "SUBTOTAL_X_MODULO",
      headerName: "Sub-Total por modulo USD",
      width: 125,
      minWidth: 250,
      maxWidth: 550,
      align: "right",
      // editable: true,
    },
    {
      field: "DESCUENTO_TOTAL_X_MODULO",
      headerName: "Descuento total por modulo USD",
      width: 125,
      minWidth: 250,
      maxWidth: 550,
      align: "right",
      // editable: true,
    },
    {
      field: "SUBTOTAL_CON_DESCUENTO_X_MODULO",
      headerName: "Sub-Total con descuento por modulo USD",
      width: 125,
      minWidth: 320,
      maxWidth: 550,
      align: "right",
      // editable: true,
    },
    {
      field: "IGV",
      headerName: "IGV 18 %",
      width: 150,
      align: "right",
      headerAlign: "right",
      // editable: true,
    },
    {
      field: "TOTAL_X_MODULO",
      headerName: "Total venta por MODULO USD",
      width: 125,
      minWidth: 250,
      maxWidth: 550,
      align: "right",
      // editable: true,
    },
    {
      field: "COSTO_DISENO_X_MODULO",
      headerName: "Total costo diseño por modulo USD",
      width: 125,
      minWidth: 280,
      maxWidth: 550,
      align: "right",
      //editable: true,
    },
    {
      field: "MARGEN_TOTAL_X_MODULO",
      headerName: "Margen total por modulo %",
      width: 125,
      minWidth: 250,
      maxWidth: 550,
      align: "right",
      //editable: true,
    },
    {
      field: "PORCENTAJE_GASTOS",
      headerName: "Gastos %",
      width: 150,
      align: "right",
      headerAlign: "right",
      //editable: true,
    },
    {
      field: "MARGEN_FINAL_X_MODULO",
      headerName: "Margen Final por Modulo",
      width: 125,
      minWidth: 250,
      maxWidth: 550,
      align: "right",
      //editable: true,
    },
  ];
  const rowsModulos = detalleModulos.map((dato, i) => ({
    ...dato,
    id: i + 1,
  }));

  //eliminar tabla
  const eliminarDatosTabla = async (id) => {
    console.log("estas en eliminarDatosTabla y has enviado este id", id);
    try {
      const resultado = await clienteAxios.delete(`/detallefichatecnica/${id}`);
      console.log("resultado de eliminarDatosTabla", resultado);
      console.log(
        "resultado de eliminarDatosTabla,ESTO ES LO Q ME DEVUELVE",
        resultado.data
      );
      setDetalleTabla([]);
      setDetalleGeneral([]);
      setDetalleModulos([]);
      obtenerFichasTecnicasIngeniero(idUsuario);
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarTabla = async () => {
    const accionUsuario = await Swal.fire({
      icon: "warning",
      title: "¿Esta seguro de eliminar? no se podran revertir los cambios",
      showConfirmButton: true,
      showCancelButton: true,
    });

    if (accionUsuario.isConfirmed) {
      eliminarDatosTabla(fichaTecnica.idFichatecnica);
      obtenerFichasTecnicasIngeniero(idUsuario);
    }
  };

  const EnviarguardadoCotizacion = async () => {
    //guardar cotizacion

    Swal.fire({
      //  title: `"Solicitar a gerente de proyectos:"`,
      title: `${
        nombreRol == "Gerente de Proyecto"
          ? "Solicitar a gerencia general:"
          : "Solicitar a gerente de proyectos:"
      }`,
      html: `<input type="text" id="mensaje" className="swal2-input" placeholder="Mensaje">
    `,
      confirmButtonText: "Enviar mensaje",
      focusConfirm: false,
      preConfirm: () => {
        const mensaje = Swal.getPopup().querySelector("#mensaje").value;

        return guardarCotizacion(mensaje, fichaTecnica.idFichatecnica);
      },
    }).then((result) => {
      console.log(result);
    });
  };

  const guardarCotizacion = async (mensaje, idFichaTecnica) => {
    console.log("hola??");
    //mensaje
    // console.log("en guardarCotizacion el id es", idFichaTecnica);
    // console.log(mensaje, idFichaTecnica);

    const datos = {
      idfichatecnica: idFichaTecnica,
      mensaje: mensaje,
      id_usuario: idUsuario,
    };
    try {
      const resultado = await clienteAxios.put(
        "/GuardarCotizacionIngeniero",
        datos
      );
      /*  const resultado = await clienteAxios.put(
        "/detallefichatecnica",
        idFichaTecnica
      ); */
      // console.log("resultado de guardarCotizacion", resultado);
      console.log("resultado de guardarCotizacion", resultado.data); //me regresa objeto de ficha tecnica con valores cambiados
      setFichaTecnica(resultado.data);
      obtenerFichasTecnicasIngeniero(idUsuario);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Guardado exitoso !`,
        showConfirmButton: false,
        timer: 2700,
      });
    } catch (error) {
      // console.log(error.response.data.messages.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        html: `<b> ${error.response.data.messages.error}</b>`,
      });
    }
  };

  const aprobarCotizacion = () => {
    Swal.fire({
      title: "Solicitar a gerencia general:",
      html: `<input type="text" id="mensaje" className="swal2-input" placeholder="Mensaje">
    `,
      confirmButtonText: "Enviar mensaje",
      focusConfirm: false,
      preConfirm: () => {
        const mensaje = Swal.getPopup().querySelector("#mensaje").value;

        return GuardarAprobarCotizacion(mensaje, fichaTecnica.idFichatecnica);
      },
    }).then((result) => {
      console.log(result);
    });
  };

  const GuardarAprobarCotizacion = async (mensaje, idFichaTecnica) => {
    console.log("entras?");
    const datos = {
      id_usuario: idUsuario,
      idfichatecnica: idFichaTecnica,
      mensaje: mensaje,
    };
    try {
      const resultado = await clienteAxios.put("/detallefichatecnica", datos);
      // console.log("resultado de guardarCotizacion", resultado);
      console.log("resultado de guardarCotizacion", resultado.data); //me regresa objeto de ficha tecnica con valores cambiados
      setFichaTecnica(resultado.data);
      obtenerFichasTecnicasIngeniero(idUsuario);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Guardado exitoso !`,
        showConfirmButton: false,
        timer: 2700,
      });
    } catch (error) {
      // console.log(error.response.data.messages.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        html: `<b> ${error.response.data.messages.error}</b>`,
      });
    }
  };

  //denegaralta de negocio
  const denegarAlta = async (idFicha, numero) => {
    console.log("esta es la data en altaNegocio ", idFicha, numero);
    try {
     
      const accionUsuario = await Swal.fire({
        icon: "warning",
        title: "¿Esta seguro que desea desaprobar?",
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (accionUsuario.isConfirmed) {
        const resultado = await clienteAxios.put(
          `/api/aprobaciones-gerentes-proyectos/${idFicha}`,
          numero
        );
        console.log("resultado de altaNegocio", resultado);
        console.log("resultado de altaNegocio", resultado.data);
        await obtenerFichasTecnicasIngeniero(idUsuario);
        setMostarFicha(false);
      }
    } catch (error) {
      alert(error.response.data.messages.error)
      console.log(error.response.data.messages.error);
    }
  };

  ///MODAL

  const abrirModal = () => {
    setShow(true);
  };

  const abrirModal2 = () => {
    console.log("modal 2");
    setShow2(true);
    setDataModalIng({
      modulo: selectModulo,
      partida: selectPartida,
    });
  };

  const abrirModal3 = () => {
    console.log("modal 3");
    setShow3(true);
    setDataModalSubPartidasIng({
      modulo: selectModulo,
      partida: selectPartida,
      subpartida: selectSubpartida,
    });
  };

  return (
    <div className="container-fluid pt-4 ">
      <div className="my-4 text-center container ">
        <h4 className=" fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
          Ficha Técnica de Proyecto - Gerente de Proyecto
        </h4>
      </div>
      <div className="row">
        <Accordion defaultActiveKey="0" className="mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Lista de tus fichas tecnicas</Accordion.Header>
            <Accordion.Body>
              <div
                className="row p-3"
                style={{ height: "300px", overflow: "auto" }}
              >
                {fichasTecnicasIngeniero.length <= 0 ? (
                  <span className="text-danger text-uppercase">
                    No hay fichas tecnicas
                  </span>
                ) : (
                  fichasTecnicasIngeniero.map((fichaTecnica, i) => (
                    <div className="col-12 col-lg-3 mb-3" key={i}>
                      <Card className="cambiarcolores">
                        <Card.Body>
                          <Card.Title className="text-uppercase">
                            {" "}
                            <span>{fichaTecnica.nombreFichatecnica}</span>-{" "}
                            {fichaTecnica.numFichatecnica}
                          </Card.Title>
                          <Card.Subtitle className="mb-2  text-uppercase border border text-center rounded p-2">
                            {fichaTecnica.estadoFichaproyecto}
                          </Card.Subtitle>

                          <button
                            className="btn btn-success text-uppercase btn btn-sm me-2 mb-2"
                            onClick={() => btnVerTabla(fichaTecnica, i)}
                          >
                            <MdPageview className="h3 m-0 p-0 pe-1" />
                            Ver Lista de Materiales
                          </button>

                           {
                            fichaTecnica.cotizacionenviadaFichatecnica == "0" &&(
                              <>
                              <br />
                              <span className="bg-warning text-dark px-2 rounded text-uppercase mt-3">
                                Sin guardar
                              </span>
                            </>
                            )
                          }
                           {
                            fichaTecnica.cotizacionenviadaFichatecnica == "1" &&(
                              <>
                              <br />
                              <span className="bg-primary text-light p-1 rounded text-uppercase mt-3">
                                <AiOutlineSave className="h3 m-0 p-0 pe-1 my-2" />
                                Guardado
                              </span>
                            </>
                            )
                          }
                          {
                            fichaTecnica.cotizacionenviadaFichatecnica == "2" &&(
                              <>
                              <br />
                              <span className="bg-danger text-dark px-2 rounded text-uppercase mt-3">
                                Rechazado
                              </span>
                            </>
                            )
                          }
                         
                        </Card.Body>
                      </Card>
                    </div>
                  ))
                )}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <div className="col-12 col-md-12 col-lg-12 col-xl-12 mb-3">
          {mostarFicha ? (
            <div>
              <div>
                {fichaTecnica && (
                  <div className="row">
                    <div className="mt-4 col-12 col-sm-5 col-md-5 col-lg-5">
                      <h4
                        className="border border-secondary rounded p-2 shadow mb-2 bg-body text-uppercase text-center"
                        style={{ color: "#8A2BE2" }}
                      >
                        Proyecto: {fichaTecnica.nombreFichatecnica}
                      </h4>
                      <p className="mt-5 mb-0 fw-bold text-uppercase">
                        1. Solo los
                        <span className="bg-success text-white px-1 rounded text-uppercase mt-3">
                          codigos softcom
                        </span>
                        con codigo{" "}
                        <span className="text-primary">9999999999</span> y{" "}
                        <span className="text-primary">0170020200</span> tienen{" "}
                        <span className="bg-warning text-dark px-2 rounded text-uppercase mt-3">
                          Precio unitario
                        </span>{" "}
                        y{" "}
                        <span className="bg-warning text-dark px-2 rounded text-uppercase mt-3">
                          Costo de diseño
                        </span>{" "}
                        👉🏼 <span className="text-danger">USD 0.00</span>
                      </p>
                      <p className="mt-3 mb-0 fw-bold text-uppercase">
                        2. PARA COMPLETAR, FILTRAR EN LA COLUMNA
                        <span className="bg-success text-white px-1 rounded text-uppercase mt-3">
                          codigos softcom
                        </span>{" "}
                        ,facilita las ediciones en
                        <span className="bg-warning text-dark px-2 rounded text-uppercase mt-3">
                          Precio unitario
                        </span>{" "}
                        y{" "}
                        <span className="bg-warning text-dark px-2 rounded text-uppercase mt-3">
                          Costo de diseño
                        </span>{" "}
                      </p>
                      <p className="mt-3 mb-0 fw-bold text-uppercase mt-3">
                        3. Para decimales usar solo el "." (punto)
                      </p>
                    </div>
                  </div>
                )}

                <div className="my-5">
                  <span className=" h4 border border-secondary rounded p-2 shadow mb-2 bg-body text-uppercase text-success">
                    Detalle Tabla:
                  </span>
                </div>
                {/*      AQUI ES TODO LOS DESCUENTOS */}
                {fichaTecnica.cotizacionenviadaFichatecnica == "0" && (
                  <div>
                    <p className="text-uppercase">Aplique sus descuentos:</p>
                    <p className="text-uppercase text-success">
                      Para decimales usar solo el "." (punto)
                    </p>
                    <div className="my-2">
                      {/*   DESCUENTO MODULO */}
                      <Form
                        className="w-100"
                        onSubmit={(e) => btnAplicarDescuentoModulo(e)}
                      >
                        <div className="row">
                          <div className="col-sm-12 col-md-4 col-lg-4 col-xl-3">
                            <Form.Select
                              aria-label="Default select example"
                              className="my-1"
                              defaultValue="default"
                              onChange={(e) => {
                                setSelectModulo(e.target.value);
                                obtenerPartidas(
                                  fichaTecnica.idFichatecnica,
                                  e.target.value
                                );
                              }}
                            >
                              <option disabled value="default">
                                Seleccione modulo
                              </option>
                              {modulos.length >= 0 ? (
                                modulos.map((modulo, i) => (
                                  <option value={modulo.MODULOS} key={i}>
                                    {modulo.MODULOS}
                                  </option>
                                ))
                              ) : (
                                <option>Seleccione modulo</option>
                              )}
                            </Form.Select>
                          </div>
                          <div className="col-sm-12 col-md-4 col-lg-4 col-xl-3">
                            {" "}
                            <Form.Group className="my-1">
                              <Form.Control
                                type="text"
                                placeholder="Descuento por modulo"
                                onChange={(e) => setInputModulo(e.target.value)}
                              />
                            </Form.Group>
                          </div>
                          <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                            {" "}
                            <Form.Group className="my-1">
                              <Button className="btn btn-primary" type="submit">
                                Aplicar
                              </Button>
                            </Form.Group>
                          </div>
                        </div>
                      </Form>
                      {/*   FIN DESCUENTO MODULO */}
                    </div>
                    {/*   DESCUENTO PARTIDA */}
                    {partidas.length > 0 && (
                      <div className="my-1">
                        <Form
                          className="w-100"
                          onSubmit={(e) => btnAplicarDescuentoPartida(e)}
                        >
                          <div className="row">
                            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-3">
                              <Form.Select
                                aria-label="Default select example"
                                className="my-1"
                                defaultValue="default"
                                onChange={(e) => {
                                  setSelectPartida(e.target.value);

                                  obtenerSubPartidas(
                                    fichaTecnica.idFichatecnica,
                                    e.target.value
                                  );
                                }}
                              >
                                <option value="default" disabled>
                                  Seleccione partida
                                </option>
                                {partidas.length >= 0 ? (
                                  partidas.map((partida, i) => (
                                    <option value={partida.PARTIDAS} key={i}>
                                      {partida.PARTIDAS}
                                    </option>
                                  ))
                                ) : (
                                  <option>Seleccione Partida</option>
                                )}
                              </Form.Select>
                            </div>
                            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-3">
                              {" "}
                              <Form.Group className="my-1">
                                <Form.Control
                                  type="text"
                                  placeholder="Descuento por partida"
                                  onChange={(e) =>
                                    setInputPartida(e.target.value)
                                  }
                                />
                              </Form.Group>
                            </div>
                            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-3">
                              {" "}
                              <Form.Group className="my-1">
                                <Button
                                  className="btn btn-primary"
                                  type="submit"
                                >
                                  Aplicar
                                </Button>
                              </Form.Group>
                            </div>
                            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-3">
                              {" "}
                              <Form.Group className="my-1">
                                <Button
                                  className="btn btn-success"
                                  onClick={() => abrirModal2()}
                                >
                                  Ver datos de partida
                                </Button>
                              </Form.Group>
                            </div>
                          </div>
                        </Form>
                      </div>
                    )}

                    {/*  FIN DESCUENTO PARTIDA */}
                    {/*   DESCUENTO SUBPARTIDA */}
                    {subPartidas.length > 0 && (
                      <div className="my-2">
                        <Form
                          className="w-100"
                          onSubmit={(e) => btnAplicarDescuentoSubpartida(e)}
                        >
                          <div className="row">
                            <div className="col-sm-12 col-md-4 col-lg-3">
                              <Form.Select
                                aria-label="Default select example"
                                className="my-1"
                                defaultValue="default"
                                onChange={(e) =>
                                  setSelectSubpartida(e.target.value)
                                }
                              >
                                <option value="default" disabled>
                                  Seleccione Subpartida{" "}
                                </option>
                                {subPartidas.length >= 0 ? (
                                  subPartidas.map((subPartida, i) => (
                                    <option
                                      value={subPartida.SUBPARTIDAS}
                                      key={i}
                                    >
                                      {subPartida.SUBPARTIDAS}
                                    </option>
                                  ))
                                ) : (
                                  <option>Seleccione Subpartida</option>
                                )}
                              </Form.Select>
                            </div>
                            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-3">
                              {" "}
                              <Form.Group className="my-1">
                                <Form.Control
                                  type="text"
                                  placeholder="Descuento por subpartida"
                                  onChange={(e) =>
                                    setInputSubpartida(e.target.value)
                                  }
                                />
                              </Form.Group>
                            </div>
                            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-3">
                              {" "}
                              <Form.Group className="my-1">
                                <Button
                                  className="btn btn-primary"
                                  type="submit"
                                >
                                  Aplicar
                                </Button>
                              </Form.Group>
                            </div>
                            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-3">
                              {" "}
                              <Form.Group className="my-1">
                                <Button
                                  className="btn btn-success"
                                  onClick={() => abrirModal3()}
                                >
                                  Ver datos de Subpartida
                                </Button>
                              </Form.Group>
                            </div>
                          </div>
                        </Form>
                      </div>
                    )}

                    {/*   FIN DESCUENTO SUBPARTIDA */}
                    <div className="row mb-3">
                      <div className="col-12 col-sm-2 my-1">
                        <button
                          className="btn btn-warning text-uppercase"
                          onClick={() => aprobarCotizacion()}
                        >
                          aprobar cotizacion
                        </button>
                      </div>

                      {idUsuario == idUsuarioFichaTecnica ? (
                        <div className="col-12 col-sm-2 my-1">
                          <button
                            className="btn btn-danger btn btn-sm text-uppercase"
                            onClick={() => eliminarTabla()}
                          >
                            <BsFillEmojiFrownFill className="h3 m-0 p-0 pe-1" />
                            Limpiar tabla{" "}
                          </button>
                        </div>
                      )
                      :(
<div className="col-12 col-sm-2 my-1">
                        <button
                          className="btn btn-danger btn btn-sm text-uppercase"
                          onClick={() => denegarAlta(fichaTecnica.idFichatecnica, 2)}
                        >
                          <BsFillEmojiFrownFill className="h3 m-0 p-0 pe-1" />
                          Desaprobar{" "}
                        </button>
                      </div>
                      )
                      }

                      
                      <div className="col-12 col-sm-2 my-1">
                        <button
                          className="btn btn-warning btn btn-sm text-uppercase"
                          onClick={() => abrirModal()}
                        >
                          <BsNewspaper className="h3 m-0 p-0 pe-1" /> Detalle
                          general
                        </button>
                      </div>
                      <div className="col-12 col-sm-2 my-1">
                        <ModalAgregarProductoIngeniero
                          detalleModulos={detalleModulos}
                          detalleTabla={detalleTabla}
                          fichaTecnica={fichaTecnica}
                          obtenerDetalleTecnicasIngeniero={
                            obtenerDetalleTecnicasIngeniero
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
                {fichaTecnica.cotizacionenviadaFichatecnica == "1" && (
                  <div className="mb-3">
                    <button
                      className="btn btn-warning btn btn-sm text-uppercase"
                      onClick={() => abrirModal()}
                    >
                      <BsNewspaper className="h3 m-0 p-0 pe-1" /> Detalle
                      general
                    </button>
                  </div>
                )}
                <div style={{ height: 560, width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      height: "100%",
                      background: "white",
                    }}
                  >
                    <Box
                      sx={{
                        height: "auto",
                        width: "100%",
                        "& .super-app-theme--editar": {
                          backgroundColor: "rgb(255, 202, 44)",
                        },
                        "& .super-app-theme--soft": {
                          backgroundColor: "rgb(25,135,84)",
                          color: "white",
                        },
                        "& .super-app-theme--descuento": {
                          backgroundColor: "rgb(13, 110, 253)",
                          color: "white",
                        },
                        "& .super-app.negative": {
                          backgroundColor: "#d47483",
                        },
                        "& .super-app.positive": {
                          color: "#1a3e72",
                        },
                        "& .hot": {
                          backgroundColor: "#d47483",
                        },
                        "& .cold": {
                          backgroundColor: "white",
                        },
                      }}
                      /*     style={{height:'100%', opacity:0.8, backgroundColor:'white', textAlign:'center'}} */
                    >
                      {detalleTabla.length >= 0 && (
                        <DataGrid
                          columns={columns}
                          rows={rows}
                          pageSize={15}
                          rowsPerPageOptions={[5]}
                          getCellClassName={(params) => {
                            /*  if (params.field === 'city' || params.value == null) {
                             return '';
                           }
                           return params.value >= 15 ? 'hot' : 'cold'; */
                            return params.row
                              .idEstadoproductoDetallefichatecnica == "4"
                              ? "hot"
                              : "cold";
                            /*       console.log('ver params',params) */
                          }}
                        />
                      )}
                    </Box>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <div className="my-4">
                  <span className=" h4 border border-secondary rounded p-2 shadow mb-2 bg-body text-uppercase text-success">
                    Datos por Modulos
                  </span>
                </div>

                <div
                  style={{
                    height: "360px",
                    overflow: "auto",
                    background: "white",
                  }}
                >
                  {detalleModulos.length >= 0 && (
                    <DataGrid
                      columns={columnsModulos}
                      rows={rowsModulos}
                      pageSize={15}
                      rowsPerPageOptions={[5]}
                      //checkboxSelection
                      // disableSelectionOnClick
                      style={{ height: "100%", width: "100%" }}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <span>Seleccione una ficha</span>
          )}
        </div>
      </div>
      <ModelDetalleGeneral
        show={show}
        setShow={setShow}
        detalleGeneral={detalleGeneral}
        fichaTecnica={fichaTecnica}
      />
      <ModalDatosDePartidaIng
        show2={show2}
        setShow2={setShow2}
        dataModalIng={dataModalIng}
        fichaTecnica={fichaTecnica}
      />
      <ModalDatosDeSubPartidaIng
        show3={show3}
        setShow3={setShow3}
        dataModalSubPartidasIng={dataModalSubPartidasIng}
        fichaTecnica={fichaTecnica}
      />
    </div>
  );
}

export default VerFichasTecnicasGerenteProyecto;
