import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import {
  Accordion,
  Button,
  Col,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import {
  peticionObtenerModulos,
  peticionObtenerPartidas,
  peticionObtenerSubPartidas,
} from "../services/apisFichaTecnicaIngeniero";
import { MdPageview } from "react-icons/md";
import { BsNewspaper } from "react-icons/bs";
import { BsFillEmojiLaughingFill } from "react-icons/bs";
import { BsFillEmojiFrownFill } from "react-icons/bs";
import { FaProductHunt } from "react-icons/fa";

import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import ModelDetalleGeneral from "../Modales/ModelDetalleGeneral";
import { DataGrid } from "@mui/x-data-grid";
import {
  peticionObtenerSubPartidasProducto,
  peticionObtenerEstadosProducto,
  peticionAgregarProducto,
  peticionObtenerPartidasProducto,
  peticionObtenerProductosProducto,
  anularProducto,
  registrarObservacionPedido,
  descargarExcelMaterialesProcesos,
  actualizarCostosRealesOrdenesServicios,
} from "../services/apisBackOffice";
import { AiOutlineSave } from "react-icons/ai";
import ModalProductosGlobales from "../Modales/ModalProductosGlobales";
import ModalRegistrarRqPedido from "../Modales/ModalRegistrarRqPedido";
import {
  peticionObtenerListadoDeRq,
  peticionActualizarCodRq,
} from "../services/apisRqPedidos";
import ModalDetallePedido from "../Modales/ModalDetallePedido";
import AnularRequerimientoPedido from "./Botones/AnularRequerimientoPedido";
import TitlePage from "../../shared/TitlePage";
import FichasTecnicasAcordeon from "../../shared/FichasTecnicasAcordeon";
import Cargando from "../../view/Cargando";

function VerFichasTecnicasBackoffice() {
  ///////////////////////////////////////////////////////////////////////////HOOKS
  const [loading, setLoading] = useState(false);
  const [fichasTecnicasBackoffice, setFichasTecnicasBackoffice] = useState([]);
  const [fichaTecnica, setFichaTecnica] = useState({});

  const [mostarFicha, setMostarFicha] = useState(false);
  const [dataTablaBackoffice, setDataTablaBackoffice] = useState([]);

  const [detalleTabla, setDetalleTabla] = useState([]);
  const [detalleGeneral, setDetalleGeneral] = useState([]);
  const [detalleModulos, setDetalleModulos] = useState([]);

  const [listaDeRqs, setListaDeRqs] = useState([]);
  const [rqSeleccionado, setRqSeleccionado] = useState("");
  const [codPed, setCodPed] = useState("");
  const [activarDescargar, setActivarDescargar] = useState(false);
  const [activarBtnRqPedido, setActivarBtnRqPedido] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  /////////////////////////////////////////////////////////////////////////CONSUMO DE APIS
  const obtenerFichasAceptadas = async () => {
    try {
      setLoading(true)
      const { data } = await clienteAxios.get("/api/FichaTecnicaBackOffice");
      //  console.log("obtenerFichasAceptadas", data);
      setFichasTecnicasBackoffice(data);
      setLoading(false)
      return data;
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
    setLoading(false)
  };
   ////////////////////////////////////////////////////////////////////EFECTS
   useEffect(() => {
    obtenerFichasAceptadas();
  }, []);
  //obtener valores en la Tabla para backofiice
  const obtenerDatosTablaReporte = async (id) => {
    //console.log("entraste a obtenerDatosTablaReporte =>", id);
    try {
      //setLoading(true);
      const resultado = await clienteAxios.get(
        `/api/listarDetalleBackOffice/${id}`
      );
    //  console.log("VER RESULTADO ===>", resultado);
      setDataTablaBackoffice(resultado.data);
      setDetalleTabla(resultado.data.DetalleTabla);
      setDetalleGeneral(resultado.data.DetalleGeneral);
      setDetalleModulos(resultado.data.DetalleModulos);

      // setLoading(false);
    } catch (error) {
      console.log("hay un error");
      console.log(error.response.data.messages.error);
    }
  };
 
  

  /////////////////////////////////////////////////descuento por modulo
  const btnVerTabla = async (ficha,i) => {
   // console.log("haber la ficha", ficha, "id", ficha.idFichatecnica);
    setFichaTecnica(ficha);
    obtenerDatosTablaReporte(ficha.idFichatecnica);
    setMostarFicha(true);
    obtenerModulos(ficha.idFichatecnica);
    setActivarDescargar(false);
    const variablePeticiones = await peticionObtenerListadoDeRq(
      ficha.idFichatecnica
    );
    setListaDeRqs(variablePeticiones);
    //  obtenerPartidas(ficha.idFichatecnica);
    //  obtenerSubPartidas(ficha.idFichatecnica);
    //  obtenerDatosTablaReporte(ficha.idFichatecnica);
  };

  const pintarCard = (indice) => {
   // console.log("indice", indice);
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

  const [codigoRequerimientoDetalleReqPedido, setCodigoRequerimientoDetalleReqPedido] = useState('')
  //Tabla con material UI
  const columns = [
    { field: "id", headerName: "ID", width: 90, hide: true },
    {
      field: "itemPedido",
      headerName: "Nro Item",
      width: 100,
      //editable: true,
    },
    {
      field: "moduloPedido",
      headerName: "Modulo",
      width: 150,
      //editable: true,
    },

    {
      field: "partidaPedido",
      headerName: "Partida",
      width: 150,
      //editable: true,
    },
    {
      field: "subpartidaPedido",
      headerName: "Subpartida",
      width: 200,
      editable: true,
    },
    {
      field: "marcaPedido",
      headerName: "Marca",
      width: 150,
      // editable: true,
    },
    {
      field: "undPedido",
      headerName: "UND",
      width: 150,
      // editable: true,
    },
    {
      field: "codigoproveedorPedido",
      headerName: "Proveedor",
      width: 150,
      // editable: true,
    },
    {
      field: "codigosoftcomProducto",
      headerName: "Codigo softcom",
      width: 200,
      align: "right",
      headerAlign: "right",
      //editable: true,
    },

    {
      field: "descripcionPedido",
      headerName: "Descripcion",
      width: 400,
      editable: true,
    },

    {
      field: "cantidadPedido",
      headerName: "Cantidad",
      width: 150,
      align: "right",
      headerAlign: "right",
      //editable: true,
    },
    {
      field: "cantidadRequerida",
      headerName: "Cantidad Requerida",
      width: 180,
      align: "right",
      headerAlign: "right",
      editable: true,
      headerClassName: "super-app-theme--editar",
      hide: true,
    },

    {
      field: "preciounitarioPedido",
      headerName: "Precio unitario $",
      width: 195,
      align: "right",
      headerAlign: "right",
    },

    {
      field: "preciototalPedido",
      headerName: "Sub-Total $",
      width: 150,
      align: "right",
      headerAlign: "right",
      // editable: true,
    },
    {
      field: "codigoRequerimientoDetalleReqPedido",
      headerName: "RQ",
      width: 150,
      align: "right",
      headerAlign: "right",
      // editable: true,
    },
    {
      field: "codigoPedidoDetalleReqPedido",
      headerName: "PD2",
      width: 150,
      align: "right",
      headerAlign: "right",
      // editable: true,
    },

    {
      field: "preciodescuentoDetallefichatecnica",
      headerName: "Sub-Total con descuento $",
      width: 250,
      // editable: true,
    },
    {
      field: "costoingDetallefichatecnica",
      headerName: "Costo de diseño $",
      width: 200,
      // editable: true,
      // headerClassName: "super-app-theme--editar",
    },
    {
      field: "costototalPedido",
      headerName: "Costo Total $",
      width: 150,
      align: "right",
      //editable: true,
    },

    {
      field: "descuentounitarioPedido",
      headerName: "Descuento unitario %",
      width: 200,
      // editable: true,
      //  headerClassName: "super-app-theme--descuento",
    },
    {
      field: "descuentopartidaPedido",
      headerName: "Descuento partida %",
      width: 200,
      // editable: true,
    },
    {
      field: "descuentosubpartidaPedido",
      headerName: "Descuento Subpartida %",
      width: 200,
      //editable: true,
    },
    {
      field: "descuentototalPedido",
      headerName: "Descuento modulo %",
      width: 200,
      // editable: true,
    },
    {
      field: "nombreEstado",
      headerName: "Estado",
      width: 200,
      // editable: true,
    },
    {
      field: "observacionPedido",
      headerName: "Observacion",
      width: 200,
      editable: true,
    },
    //es el costo real
    {
      field: "costopromedioPedido",
      headerName: "Costo Real $",
      width: 200,
      editable: true,
    },
    {
      field: "codOrdenServicio",
      headerName: "Orden de servicio",
      width: 200,
      editable:true
    },
    {
      field: "Acciones",
      align: "center",
      width: 400,
      renderCell: (cellValues) => {
        return (
          <div>
            {cellValues.row.nombreEstado == "ANULADO" ? (
              <span>Anulacion hecha</span>
            ) : (
              <>
                <button
                  className="btn btn-danger me-2 p-2 rounded"
                  onClick={() => btnAnular(cellValues)}
                >
                  Anular
                </button>
                <button
                  className="btn btn-primary me-2 p-2 rounded"
                  onClick={() => btnRegistrarObservacion(cellValues)}
                >
                  Registrar Observacion
                </button>
                <button
                  className="btn btn-primary me-2 p-2 rounded"
                  onClick={() => btnActualizarCostosReales(cellValues)}
                >
                  Actualizar
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];
  const rows = detalleTabla.map((dato, i) => ({
    ...dato,
    id: i + 1,
  }));
  const btnRegistrarObservacion = async (cellValues) => {
    //  console.log("id fila =>", cellValues.row.idDetallePedido);

    if (cellValues.row.observacionPedido == null) {
      alert(
        "Tiene que dar enter al escribir una observacion y/o no puede estar vacia"
      );
      return;
    } else {
      const data = {
        descripcion: cellValues.row.observacionPedido,
      };
      await registrarObservacionPedido(cellValues.row.idDetallePedido, data);
      obtenerDatosTablaReporte(fichaTecnica.idFichatecnica);
      return;
    }
  };
  const btnActualizarCostosReales = async (cellValues) => {
      /* console.log("idDetallePedido =>", cellValues.row.idDetallePedido);
      console.log("idReqDetallePedido =>", cellValues.row.idDetalleReqPedido); */
      /* console.log('codigoRequerimientoDetalleReqPedido ==>',codigoRequerimientoDetalleReqPedido);
     
 */
   
      const stringToNumber = parseFloat(cellValues.row.costopromedioPedido);
   /*  if (cellValues.row.observacionPedido == null) {
      alert(
        "Tiene que dar enter al escribir una observacion y/o no puede estar vacia"
      );
      return;
    }  */
    
   // console.log('ver fila seleccionada =>',cellValues.row);
    //console.log('ver fila seleccionada =>',cellValues.row.idDetalleReqPedido);
    //console.log('ver codOrdenServicio=>',cellValues.row.codOrdenServicio);
   // console.log('ver codigosoftcomProducto=>',cellValues.row.codigosoftcomProducto);
    let tresPrimerosDigitos = cellValues.row.codigosoftcomProducto.substring(0, 3)
    console.log('tresPrimerosDigitos =>',tresPrimerosDigitos);
    if(cellValues.row.idDetalleReqPedido !== null && tresPrimerosDigitos!='017'){
      {
      
        const data = {
          detallePedido:cellValues.row.idDetallePedido,
          reqDetallePedido:cellValues.row.idDetalleReqPedido,
          costoReal:stringToNumber,
          ordenServicio:cellValues.row.codOrdenServicio
        };
        console.log('data =>',data);
        await actualizarCostosRealesOrdenesServicios(data);
        setDetalleTabla([])
        setCodigoRequerimientoDetalleReqPedido('')
        await obtenerDatosTablaReporte(fichaTecnica.idFichatecnica);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Actualizacion exitosa`,
          showConfirmButton: false,
          timer: 2700,
        });
        return;
      } 
    }else{
      alert('Error al actualizar')
    }
  };
  const btnAnular = async (cellValues) => {
    console.log("id fila =>", cellValues.row.idDetallePedido);
    console.log("observacionInput =>", cellValues.row.observacionPedido);
    if (cellValues.row.observacionPedido == null) {
      alert(
        "Tiene que dar enter al escribir una observacion y/o no puede estar vacia"
      );
      return;
    } else {
      const data = {
        id: cellValues.row.idDetallePedido,
        observacion: cellValues.row.observacionPedido,
      };
      await anularProducto(data);
      obtenerDatosTablaReporte(fichaTecnica.idFichatecnica);
      return;
    }
  };

  const btnAplicarDescuentoUnitario = (cellValues) => {
    const data = {
      idDetallefichatecnica: cellValues.row.idDetallePedido,
      descuentounitarioDetallefichatecnica:
        cellValues.row.descuentogerentegeneralPedido,
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
        `/agregarDescuentoUnitarioFichaTecnicaGerenteGeneral/${idficha}`,
        datos,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      /* console.log("haber respuesta", data); */
      obtenerDatosTablaReporte(idficha);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${data}`,
        showConfirmButton: false,
        timer: 2700,
      });
      obtenerDatosTablaReporte(idficha);
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
  ///MODAL
  const [show, setShow] = useState(false);
  const abrirModal = () => {
    setShow(true);
  };
  ///
  //consumiendo apis

  const [modulos, setModulos] = useState([]);
  const [partidas, setPartidas] = useState([]);
  const [subPartidas, setSubPartidas] = useState([]);

  const obtenerModulos = async (idficha) => {
    try {
      /* let idFichaTecnica = fichaTecnica.idFichatecnica; */
      /* console.log("haber id", idficha); */
      const obteniendoModulos = await peticionObtenerModulos(idficha);
      setModulos(obteniendoModulos);
      /* console.log("haber obteniendoModulos", obteniendoModulos); */
    } catch (error) {
      console.log(error);
    }
  };
  const obtenerPartidas = async (idficha, nombreModulo) => {
    try {
      /* let idFichaTecnica = fichaTecnica.idFichatecnica; */
      /*   console.log("haber id", idficha); */
      // setLoading(true);
      const obteniendoPartidas = await peticionObtenerPartidas(
        idficha,
        nombreModulo
      );
      //  setLoading(false);
      /* console.log("haber obteniendoModulos", obteniendoPartidas); */
      setPartidas(obteniendoPartidas);
    } catch (error) {
      // setLoading(false);
      console.log(error);
    }
  };
  const obtenerSubPartidas = async (idficha, nombrePartida) => {
    try {
      /* let idFichaTecnica = fichaTecnica.idFichatecnica; */
      /*   console.log("haber id", idficha); */
      // setLoading(true);
      const data = {
        modulo: selectModulo,
        partida: nombrePartida,
      };
      const obteniendoSubPartidas = await peticionObtenerSubPartidas(
        idficha,
        data
      );
      // setLoading(false);
      /*   console.log("haber obteniendoModulos", obteniendoSubPartidas); */
      setSubPartidas(obteniendoSubPartidas);
    } catch (error) {
      //  setLoading(false);
      console.log(error);
    }
  };
  /////////////////////////////////////////////////////////////////////////////DESCUENTOS

  ///////////////////////////////////////////////////////////DESCUENTO POR SUBPARTIDAS
  const [selectSubpartida, setSelectSubpartida] = useState("");
  const [inputSubpartida, setInputSubpartida] = useState(0);

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
        `/agregarDescuentoSubPartidaFichaTecnicaGerenteGeneral/${idficha}`,
        datos,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      /* console.log("haber respuesta", data); */
      obtenerDatosTablaReporte(idficha);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${data}`,
        showConfirmButton: false,
        timer: 2700,
      });
      obtenerDatosTablaReporte(idficha);
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
  const [selectPartida, setSelectPartida] = useState("");
  const [inputPartida, setInputPartida] = useState(0);

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
        `/agregarDescuentoPartidaFichaTecnicaGerenteGeneral/${idficha}`,
        datos,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      obtenerDatosTablaReporte(idficha);
      /* console.log("haber respuesta", data); */
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${data}`,
        showConfirmButton: false,
        timer: 2700,
      });
      obtenerDatosTablaReporte(idficha);
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
  const [selectModulo, setSelectModulo] = useState("");
  const [inputModulo, setInputModulo] = useState(0);
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
      // setLoading(true);
      const { data } = await clienteAxios.put(
        `/agregarDescuentoModuloFichaTecnicaGerenteGeneral/${idficha}`,
        datos,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      // setLoading(false);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${data}`,
        showConfirmButton: false,
        timer: 2700,
      });
      obtenerDatosTablaReporte(idficha);
      return data;
    } catch (error) {
      /* console.log(error); */
      //  setLoading(false);
      console.log(error.response.data.messages.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
      setMostarFicha(false);
    }
  };

  //agregar producto manualmente
  const [registrarProducto, setRegistrarProducto] = useState({
    numPartida: "",
    idPartida: "",
    subPartida: "",
    marca: "",
    codProveedor: "",
    codErp: "",
    descripcion: "",
    cantTotal: "",
    precioUnitario: "",
    costoDiseno: "",
    descuento: "",
    observacion: "",
    modulo: "",
  });
  const {
    numPartida,
    idPartida,
    subPartida,
    marca,
    codProveedor,
    codErp,
    descripcion,
    cantTotal,
    precioUnitario,
    costoDiseno,
    observacion,
    modulo,
  } = registrarProducto;

  const actualizarInput = (e) => {
    setRegistrarProducto({
      ...registrarProducto,
      [e.target.name]: e.target.value,
    });
  };

  const actualizarInputBusqueda = (e) => {
    setProductoPorBusqueda({
      ...productoPorBusqueda,
      [e.target.name]: e.target.value,
    });
  };
  //agregar producto
  ///modal
  const [showModalProducto, setShowModalProducto] = useState(false);

  const handleCloseProducto = () => {
    setShowModalProducto(false);
  };

  const btnAgregarProducto = () => {
    setShowModalProducto(true);
   // console.log('ver detalleTabla.length =>',detalleTabla.length);
   const variable = detalleTabla.length +1
    setInputValue(variable)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    /* console.log("entro a agregar producto");
    console.log("productoPorBusqueda", productoPorBusqueda);
    console.log(
      "productoPorBusqueda.codigosoftcomProducto",
      productoPorBusqueda.codigosoftcomProducto
    ); */
/*    */

    try {
      if(productoPorBusqueda){
        if (
          productoPorBusqueda.codigosoftcomProducto == "9999999999" ||
          productoPorBusqueda.codigosoftcomProducto == "0170020200"
        ) {
          console.log("existe condicional");
          const data = {
            ...registrarProducto,
            numPartida: inputValue,
            descripcion: productoPorBusqueda.descripcionProducto,
            costoDiseno: productoPorBusqueda.costodisenoProducto,
            idFichatecnica: fichaTecnica.idFichatecnica,
          };
          console.log("esta data final  9999 ===>", data);
          await peticionAgregarProducto(data);
          obtenerDatosTablaReporte(fichaTecnica.idFichatecnica);
  
          setRegistrarProducto({
            numPartida: "",
            idPartida: "",
            subPartida: "",
            marca: "",
            codProveedor: "",
            codErp: "",
            descripcion: "",
            cantTotal: "",
            precioUnitario: "",
            costoDiseno: "",
            descuento: "",
            observacion: "",
            modulo: "",
          });
          setProductoPorBusqueda(null);
  
          handleCloseProducto();
        } else {
          console.log("No existe condicional");
          const data = {
            ...registrarProducto,
            numPartida: inputValue,
            costoDiseno: productoPorBusqueda.costodisenoProducto,
            idFichatecnica: fichaTecnica.idFichatecnica,
          };
          console.log("esta data final ===>", data);
  
          await peticionAgregarProducto(data);
          obtenerDatosTablaReporte(fichaTecnica.idFichatecnica);
  
          setRegistrarProducto({
            numPartida: "",
            idPartida: "",
            subPartida: "",
            marca: "",
            codProveedor: "",
            codErp: "",
            descripcion: "",
            cantTotal: "",
            precioUnitario: "",
            costoDiseno: "",
            descuento: "",
            observacion: "",
            modulo: "",
          });
          setProductoPorBusqueda(null);
          handleCloseProducto();
  
          return;
        }
      }else{
        console.log('no aplico busqueda');
        const data = {
          ...registrarProducto,
          numPartida: inputValue,
          idFichatecnica: fichaTecnica.idFichatecnica,
        };
        console.log('ver data ->',data); 
        await peticionAgregarProducto(data);
        
        obtenerDatosTablaReporte(fichaTecnica.idFichatecnica);

        setRegistrarProducto({
          numPartida: "",
          idPartida: "",
          subPartida: "",
          marca: "",
          codProveedor: "",
          codErp: "",
          descripcion: "",
          cantTotal: "",
          precioUnitario: "",
          costoDiseno: "",
          descuento: "",
          observacion: "",
          modulo: "",
        });
        setProductoPorBusqueda(null);
        handleCloseProducto();
      }
      

    } catch (error) {
      console.log(error);
    }


  };

  //obtener subPartidas
  const [subpartidasProducto, setSubPartidasProducto] = useState(null);

  const setAgarrarPartida = async (valor) => {
    try {
      const result = await peticionObtenerSubPartidasProducto(valor);
      setSubPartidasProducto(result);
    } catch (error) {
      console.log(error);
    }
  };

  //obtener partidas
  const [partidasProducto, setPartidasProducto] = useState(null);
  const obteniendoPartidasProductos = async () => {
    try {
      const result = await peticionObtenerPartidasProducto();
      //console.log(result);
      setPartidasProducto(result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    obteniendoPartidasProductos();
  }, []);

  //btn buscar
  const [productoPorBusqueda, setProductoPorBusqueda] = useState(null);

  const btnBuscar = async () => {
    console.log("busqued", codErp);
    try {
      const data = await peticionObtenerProductosProducto(codErp);
      //console.log("a ver productos", data);
      setProductoPorBusqueda(data);
    } catch (error) {
      console.log(error);
    }
  };

  //obtener estados

  const [estados, setEstados] = useState(null);
  const obteniendoEstados = async () => {
    try {
      const result = await peticionObtenerEstadosProducto();
    //  console.log(result);
      setEstados(result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    obteniendoEstados();
  }, []);

  const actualizarCodRq = async () => {
    try {
      const data = {
        codReq: rqSeleccionado,
        codPed: codPed,
      };
      if (rqSeleccionado === "" || codPed === "") {
        alert("No puede haber datos vacios");
        return;
      }
      await peticionActualizarCodRq(data);
      await obtenerDatosTablaReporte(fichaTecnica.idFichatecnica);
      setCodPed("");
      setRqSeleccionado("");
    } catch (error) {
      console.log(error);
    }
  };

  const reporteMaterialesProcesos = async () => {
    try {
      await descargarExcelMaterialesProcesos(fichaTecnica.idFichatecnica,fichaTecnica);
    } catch (error) {
      console.log(error);
    }
  };

  const activarDescarga = async () => {
    if (rqSeleccionado === "") {
      alert("Vacio");
      return;
    }

    const fecha = new Date();
    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;
    const anoActual = fecha.getFullYear();
    try {
      var config = {
        responseType: "arraybuffer",
      };
      const resultado = await clienteAxios.get(
        `/api/exportarPlantillaCargaPedido/${rqSeleccionado}`,
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
      link.setAttribute(
        "download",
        `CARGA_REQUERIMIENTO_${rqSeleccionado}_${hoy}_${mesActual}_${anoActual}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error.response.data.messages.error);
    }
  };

  const filaSeleccionada = (filas) => {
    console.log("funciona", filas);
    const verificar = filas.some((fila) => {
      return (
        fila.nombreEstado == "ANULADO" ||
        fila.nombreEstado == "PROCESADO" ||
        fila.codigosoftcomProducto == "9999999999"
      );
    });
    console.log("verificar =>", verificar);
    if (verificar) {
      setActivarBtnRqPedido(true);
      alert(
        "Selecciono una fila con Estado Anulado, Procesado o Codigo Softcom 9999999999"
      );
      return;
    }
    setActivarBtnRqPedido(false);
    // return fila.nombreEstado =='Anulado' ? true : false;
  };
  //
  const [inputValue, setInputValue] = useState(0);
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  //
 
  return (
    <>
    {loading && <Cargando />}
    <div className="container-fluid pt-4 ">
      <TitlePage title="  Ficha Técnica de Proyecto - Backoffice" />
      <div className="row">
      <FichasTecnicasAcordeon title ='Fichas tecnicas Backoffice' loading={loading}
        fichasTecnicas={fichasTecnicasBackoffice}
        btnVerTabla={btnVerTabla}
        sitio='backoffice'
        />
      </div>

      <div className="row">
        <div className="col-12 col-md-12 col-lg-12 col-xl-12 mb-3">
          {!mostarFicha ? (
            <div className="row">
              <div className="col-12 col-md-4">
                <p className="border border-secondary bg-bg shadow p-3 rounded mx-2 text-danger ">
                  Por favor seleccione{" "}
                  <span className="text-success">
                    "Ver Lista de Materiales"
                  </span>
                  de alguna ficha tecnica
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div>
                {fichaTecnica && (
                  <div className="row">
                    <div className="my-4 col-12 col-sm-4 col-md-5 col-lg-4">
                      <h4
                        className="border border-secondary rounded p-2 shadow mb-2 bg-body text-uppercase text-center"
                        style={{ color: "#8A2BE2" }}
                      >
                        Proyecto: {fichaTecnica.nombreFichatecnica}
                      </h4>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-uppercase">Aplique sus descuentos:</p>
                  <div className="my-2">
                    {/*   DESCUENTO MODULO */}
                    <Form
                      className="w-100"
                      onSubmit={(e) => btnAplicarDescuentoModulo(e)}
                    >
                      <div className="row">
                        <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4">
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
                        <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                          {" "}
                          <Form.Group className="my-1">
                            <Form.Control
                              type="number"
                              placeholder="Descuento por modulo"
                              onChange={(e) => setInputModulo(e.target.value)}
                            />
                          </Form.Group>
                        </div>
                        <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                          {" "}
                          <Form.Group className="my-1">
                            {
                              <Button className="btn btn-primary" type="submit">
                                Aplicar
                              </Button>
                            }
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
                          <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4">
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
                          <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                            {" "}
                            <Form.Group className="my-1">
                              <Form.Control
                                type="number"
                                placeholder="Descuento por partida"
                                onChange={(e) =>
                                  setInputPartida(e.target.value)
                                }
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
                          <div className="col-sm-12 col-md-4 col-lg-4">
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
                          <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4">
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
                    </div>
                  )}

                  {/*   FIN DESCUENTO SUBPARTIDA */}
                </div>
              </div>
              {
                <div>
                  {fichaTecnica.aprobaciongerenteFichatecnica == 0 ? (
                    <>
                      <div className="row mt-3">
                        <div className="col-12 col-sm-4 mb-2 text-start">
                          <button
                            className="btn btn-success text-uppercase btn btn-sm"
                            //   onClick={() =>  altaNegocio(fichaTecnica.idFichatecnica, 1)}
                          >
                            <BsFillEmojiLaughingFill className="h3 m-0 p-0 pe-1" />
                            Confirmar alta de negocio
                          </button>
                        </div>
                        <div className="col-12 col-sm-4 mb-2  text-start">
                          <button
                            className="btn btn-danger text-uppercase btn btn-sm"
                            //  onClick={() =>  denegarAlta(fichaTecnica.idFichatecnica, 2)}
                          >
                            <BsFillEmojiFrownFill className="h3 m-0 p-0 pe-1" />
                            Denegar alta de negocio
                          </button>
                        </div>
                        <div className="col-12 col-sm-4 text-start">
                          <button
                            className="btn btn-warning btn btn-sm text-uppercase"
                            onClick={() => abrirModal()}
                          >
                            <BsNewspaper className="h3 m-0 p-0 pe-1" /> Detalle
                            general
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="row">
                        <div className="col-12 col-sm-4 text-start mb-3">
                          <button
                            className="btn btn-warning btn btn-sm text-uppercase me-3 mt-2"
                            onClick={() => abrirModal()}
                          >
                            <BsNewspaper className="h3 m-0 p-0 pe-1" /> Detalle
                            general
                          </button>
                          <ModalProductosGlobales
                            id={fichaTecnica.idFichatecnica}
                            obtenerDatosTablaReporte={obtenerDatosTablaReporte}
                          />
                          <br />
                          <ModalDetallePedido
                            id={fichaTecnica.idFichatecnica}
                            obtenerDatosTablaReporte={obtenerDatosTablaReporte}
                          />
                        </div>
                        <div className="col-12 col-sm-4 text-start mb-3">
                          <button
                            className="btn btn-success btn btn-sm text-uppercase"
                            onClick={() => btnAgregarProducto()}
                          >
                            <FaProductHunt className="h3 m-0 p-0 pe-1" />
                            Agregar producto
                          </button>
                        </div>
                        <div className="col-12 col-sm-4 text-start mb-3">
                          {activarBtnRqPedido ? (
                            <p className="text-white fw-bolder text-uppercase p-1 bg-secondary text-center rounded-pill w-75">
                              No hay acceso
                            </p>
                          ) : (
                            <ModalRegistrarRqPedido
                              selectedRows={selectedRows}
                              fichaTecnica={fichaTecnica}
                              obtenerDatosTablaReporte={
                                obtenerDatosTablaReporte
                              }
                              btnVerTabla={btnVerTabla}
                            />
                          )}
                          <button
                            className="btn btn-warning text-uppercase mt-2"
                            onClick={() => reporteMaterialesProcesos()}
                          >
                            Reporte materiales procesados y pendientes{" "}
                          </button>
                        </div>
                      </div>
                      <hr></hr>
                      <div className="row">
                        <div className="col-4">
                          <Form.Select
                            className="my-1"
                            // defaultValue="default"
                            onChange={(e) => {
                              setRqSeleccionado(e.target.value);
                              setActivarDescargar(true);
                            }}
                          >
                            <option value="">Seleccione requerimiento</option>
                            {listaDeRqs.length > 0 ? (
                              listaDeRqs.map((modulo, i) => (
                                <option value={modulo.AGENCIA} key={i}>
                                  {modulo.AGENCIA}
                                </option>
                              ))
                            ) : (
                              <option disabled>
                                No cuenta con un requerimiento
                              </option>
                            )}
                          </Form.Select>
                        </div>
                        <div className="col-2">
                          <Form.Control
                            value={codPed}
                            onChange={(e) => setCodPed(e.target.value)}
                            className="my-1"
                            type="text"
                            placeholder=""
                          />
                        </div>
                        <div className="col-2">
                          <button
                            className="btn btn-success my-1 text-uppercase"
                            onClick={() => actualizarCodRq()}
                          >
                            Actualizar
                          </button>
                        </div>
                        {activarDescargar === true && (
                          <div className="col-2">
                            <button
                              className="btn btn-warning my-1 text-uppercase me-1 btn-sm"
                              onClick={() => activarDescarga()}
                            >
                              Descargar
                            </button>
                            <AnularRequerimientoPedido
                              rqSeleccionado={rqSeleccionado}
                              fichaTecnica={fichaTecnica}
                              obtenerDatosTablaReporte={
                                obtenerDatosTablaReporte
                              }
                              btnVerTabla={btnVerTabla}
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <Box
                    sx={{
                      height: "550px",
                      width: "100%",
                      "& .super-app-theme--editar": {
                        backgroundColor: "rgb(255, 202, 44)",
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
                      "& .amarillo": {
                        backgroundColor: "yellow",
                      },
                    }}
                    style={{ background: "white" }}
                  >
                    {detalleTabla.length >= 0 && (
                      <DataGrid
                        columns={columns}
                        rows={rows}
                        pageSize={15}
                          rowsPerPageOptions={[15]}
                        checkboxSelection
                        disableSelectionOnClick
                        experimentalFeatures={{ newEditingApi: true }}
                        onSelectionModelChange={(ids) => {
                          const selectedIDs = new Set(ids);
                          const selectedRows = rows.filter((row) =>
                            selectedIDs.has(row.id)
                          );
                          //   console.log("haber selectedRows2", selectedRows);

                          setSelectedRows(selectedRows);
                          filaSeleccionada(selectedRows);
                        }}
                        getCellClassName={(params) => {
                          let className = "";

                          if (
                            params.field === "codOrdenServicio" &&
                            params.row.codigoRequerimientoDetalleReqPedido !== null
                          ) {
                            className += " amarillo"; // Agregar la clase "amarillo" si cumple la condición
                          }
                  
                          // Agregar las clases adicionales según las condiciones existentes
                          if (params.row.idEstadoproductoDetallefichatecnica === "4") {
                            className += " hot";
                          } else {
                            className += " cold";
                          }
                  
                          return className.trim(); // Eliminar posibles espacios en blanco adicionales
                       
                        }}
                      />
                    )}
                  </Box>

                  <div className="mb-3">
                    <div className="my-4">
                      <span className=" h4 border border-secondary rounded p-2 shadow mb-2 bg-body text-uppercase text-success">
                        Datos por Modulos
                      </span>
                    </div>

                    {
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
                          rowsPerPageOptions={[15]}
                            //checkboxSelection
                            // disableSelectionOnClick
                            style={{ height: "100%", width: "100%" }}
                          />
                        )}
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          )}
        </div>
      </div>

      <Modal
        size="lg"
        show={showModalProducto}
        onHide={handleCloseProducto}
        centered
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Agrege Producto Manualmente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col lg={12}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className="text-uppercase">
                    Numero de Item:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese numero de item:"
                    /*   name="numPartida"
                    value={detalleTabla.length + 1}
                 //   value={numPartida}
                    onChange={(e) => actualizarInput(e)} */
                    value={inputValue}
                    onChange={(e) => handleInputChange(e)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-uppercase">Partida:</Form.Label>
                  <Form.Select
                    aria-label="Seleccione una partida"
                    name="idPartida"
                    defaultValue={"3"}
                    onChange={(e) => {
                      setAgarrarPartida(e.target.value);
                      actualizarInput(e);
                    }}
                    required
                  >
                    <option disabled>Seleccione una partida</option>
                    {partidasProducto &&
                      partidasProducto.map((partida, i) => (
                        <option value={partida.idPartida} key={i}>
                          {partida.nombrePartida}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-uppercase">
                    Sub Partidas
                    {subpartidasProducto == null ? (
                      <span className="text-warning">
                        (tiene que elegir una partida primero)
                      </span>
                    ) : (
                      <></>
                    )}
                    :
                  </Form.Label>
                  <Form.Select
                    aria-label="Seleccione una Sub-partida"
                    name="subPartida"
                    value={subPartida}
                    onChange={(e) => {
                      //setAgarrarPartida(e.target.value);
                      actualizarInput(e);
                    }}
                    required
                  >
                    <option>Seleccione una Sub-partida</option>
                    {subpartidasProducto &&
                      subpartidasProducto.map((subpartida, i) => (
                        <option value={subpartida.nombreSubPartida} key={i}>
                          {subpartida.nombreSubPartida}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-uppercase">Modulo:</Form.Label>
                  <Form.Select
                    aria-label="Seleccione un Modulo"
                    //  defaultValue="default"
                    name="modulo"
                    value={modulo}
                    onChange={(e) => {
                      //setAgarrarPartida(e.target.value);
                      actualizarInput(e);
                    }}
                    required
                  >
                    <option>Seleccione un Modulo</option>
                    {detalleModulos &&
                      detalleModulos.map((modulo, i) => (
                        <option value={modulo.MODULOS} key={i}>
                          {modulo.MODULOS}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>

                <div className="row">
                  <div className="col-12  col-md-6">
                    <Form.Group className="mb-3" controlId="formBasicText">
                      <Form.Label className="text-uppercase">
                        Codigo ERP:
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Ingrese Codigo ERP:"
                        name="codErp"
                        value={codErp}
                        onChange={(e) => actualizarInput(e)}
                        required
                      />
                    </Form.Group>
                  </div>

                  <div className="col-12  col-md-6">
                    <Form.Group className="mb-3" controlId="formBasicText">
                      <Form.Label className="text-uppercase">
                        Buscar codigo erp:
                      </Form.Label>
                      <Button
                        className="btn btn-warning w-100"
                        onClick={() => btnBuscar()}
                      >
                        Buscar
                      </Button>
                    </Form.Group>
                  </div>
                </div>

                {productoPorBusqueda ? (
                  <>
                    <Form.Group className="mb-3" controlId="formBasicText">
                      <Form.Label className="text-uppercase">Marca:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese Marca"
                        name="marca"
                        value={productoPorBusqueda.marcaProducto}
                        onChange={(e) => actualizarInput(e)}
                        disabled
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicText">
                      <Form.Label className="text-uppercase">
                        Codigo Proveedor:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese Proveedor:"
                        name="codProveedor"
                        value={productoPorBusqueda.codigoreferenciaProducto}
                        onChange={(e) => actualizarInput(e)}
                        disabled
                      />
                    </Form.Group>

                    {productoPorBusqueda.codigosoftcomProducto ===
                      "9999999999" ||
                    productoPorBusqueda.codigosoftcomProducto ===
                      "0170020200" ? (
                      <>
                        <Form.Group className="mb-3" controlId="formBasicText">
                          <Form.Label className="text-uppercase">
                            Descripcion:
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ingrese Descripcion:"
                            name="descripcionProducto"
                            value={
                              productoPorBusqueda &&
                              productoPorBusqueda.descripcionProducto
                            }
                            onChange={(e) => actualizarInputBusqueda(e)}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicText">
                          <Form.Label className="text-uppercase">
                            Costo de diseño:
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ingrese Costo de diseño:"
                            name="costodisenoProducto"
                            value={
                              productoPorBusqueda &&
                              productoPorBusqueda.costodisenoProducto
                            }
                            onChange={(e) => actualizarInputBusqueda(e)}
                          />
                        </Form.Group>
                      </>
                    ) : (
                      <>
                        <Form.Group className="mb-3" controlId="formBasicText">
                          <Form.Label className="text-uppercase">
                            Descripcion:
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ingrese Descripcion:"
                            name="descripcionProducto"
                            value={
                              productoPorBusqueda &&
                              productoPorBusqueda.descripcionProducto
                            }
                            onChange={(e) => actualizarInputBusqueda(e)}
                            disabled
                          />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicText">
                          <Form.Label className="text-uppercase">
                            Costo de diseño:
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ingrese Costo de diseño:"
                            name="costodisenoProducto"
                            value={
                              productoPorBusqueda &&
                              productoPorBusqueda.costodisenoProducto
                            }
                            onChange={(e) => actualizarInputBusqueda(e)}
                            disabled
                          />
                        </Form.Group>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Form.Group className="mb-3" controlId="formBasicText">
                      <Form.Label className="text-uppercase">Marca:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese Marca"
                        name="marca"
                        value={marca}
                        onChange={(e) => actualizarInput(e)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicText">
                      <Form.Label className="text-uppercase">
                        Codigo Proveedor:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese Proveedor:"
                        name="codProveedor"
                        value={codProveedor}
                        onChange={(e) => actualizarInput(e)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicText">
                      <Form.Label className="text-uppercase">
                        Descripcion:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese Codigo Descripcion:"
                        name="descripcion"
                        value={descripcion}
                        onChange={(e) => actualizarInput(e)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicText">
                      <Form.Label className="text-uppercase">
                        Costo de diseño:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese Costo de diseño:"
                        name="costoDiseno"
                        value={costoDiseno}
                        onChange={(e) => actualizarInput(e)}
                        required
                      />
                    </Form.Group>
                  </>
                )}

                {productoPorBusqueda ? (
                  <>
                    {productoPorBusqueda.codigosoftcomProducto ===
                      "9999999999" ||
                    productoPorBusqueda.codigosoftcomProducto ===
                      "0170020200" ? (
                      <Form.Group className="mb-3" controlId="formBasicText">
                        <Form.Label className="text-uppercase">
                          Precio unitario:
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese precio"
                          name="precioUnitario"
                          onChange={(e) => actualizarInput(e)}
                          required
                        />
                      </Form.Group>
                    ) : (
                      <Form.Group className="mb-3">
                        <Form.Label className="text-uppercase">
                          Precios:
                        </Form.Label>
                        <Form.Select
                          aria-label="Seleccione un Precio"
                          name="precioUnitario"
                          /*   defaultValue={`${productoPorBusqueda.precios.precioventadosProducto}`} */
                          onChange={(e) => {
                            // setAgarrarPartida(e.target.value);
                            /*  setAgarrarProductoBusqueda(productoPorBusqueda.precios.precioventadosProducto) */
                            actualizarInput(e);
                          }}
                        >
                          <option>Seleccione un precio</option>

                          <option
                            value={
                              productoPorBusqueda.precios.precioventaunoProducto
                            }
                          >
                            ${" "}
                            {productoPorBusqueda.precios.precioventaunoProducto}
                          </option>

                          <option
                            value={
                              productoPorBusqueda.precios.precioventadosProducto
                            }
                          >
                            ${" "}
                            {productoPorBusqueda.precios.precioventadosProducto}
                          </option>

                          <option
                            value={
                              productoPorBusqueda.precios
                                .precioventatresProducto
                            }
                          >
                            ${" "}
                            {
                              productoPorBusqueda.precios
                                .precioventatresProducto
                            }
                          </option>

                          <option
                            value={
                              productoPorBusqueda.precios
                                .precioventacuatroProducto
                            }
                          >
                            ${" "}
                            {
                              productoPorBusqueda.precios
                                .precioventacuatroProducto
                            }
                          </option>
                        </Form.Select>
                      </Form.Group>
                    )}
                  </>
                ) : (
                  <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label className="text-uppercase">
                      Precio Unitario:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese Precio Unitario:"
                      name="precioUnitario"
                      value={precioUnitario}
                      onChange={(e) => actualizarInput(e)}
                      required
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className="text-uppercase">
                    Cantidad Total:
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingrese  Cantidad Total:"
                    name="cantTotal"
                    value={cantTotal}
                    onChange={(e) => actualizarInput(e)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className="text-uppercase">Estado:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese Observacion:"
                    name="adicional"
                    value={"Adicional"}
                    //onChange={(e) => actualizarInput(e)}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className="text-uppercase">
                    Observacion:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese Observacion:"
                    name="observacion"
                    value={observacion}
                    onChange={(e) => actualizarInput(e)}
                    required
                  />
                </Form.Group>

                <Button className="btn btn-success mt-3" type="submit">
                  Guardar
                </Button>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      <ModelDetalleGeneral
        show={show}
        setShow={setShow}
        detalleGeneral={detalleGeneral}
        fichaTecnica={fichaTecnica}
      />
    </div>
    </>
  );
}

export default VerFichasTecnicasBackoffice;
