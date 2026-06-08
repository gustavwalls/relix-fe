import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { Accordion, Button, Form } from "react-bootstrap";
import clienteAxios from "../../config/axios";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";

import { BsNewspaper } from "react-icons/bs";
import { BsFillEmojiLaughingFill } from "react-icons/bs";
import { BsFillEmojiFrownFill } from "react-icons/bs";
import { MdPageview } from "react-icons/md";
import ModelDetalleGeneral from "../Modales/ModelDetalleGeneral";
import Box from "@mui/material/Box";
import {
  peticionObtenerModulos,
  peticionObtenerPartidas,
  peticionObtenerSubPartidas,
} from "../services/apisFichaTecnicaIngeniero";
const ROLES_COSTOS_REALES = ["BackOffice", "Gerente General"];

function VerFichasTecnicasGerente() {
  ///////////////////////////////////////////////////////////////////////////HOOKS
  const navigate = useNavigate();
  const nombreRol = localStorage.getItem("nombreRol");
  const [fichasTecnicasGerente, setFichasTecnicasGerente] = useState([]);
  const [fichaTecnica, setFichaTecnica] = useState({});
  const [loading, setLoading] = useState(false);
  const [mostarFicha, setMostarFicha] = useState(false);
  const [dataTablaGerenteGeneral, setDataTablaGerenteGeneral] = useState([]);
  const [detalleTabla, setDetalleTabla] = useState([]);
  const [detalleGeneral, setDetalleGeneral] = useState([]);
  const [detalleModulos, setDetalleModulos] = useState([]);
  const [descuentoInput, setDescuentoInput] = useState("");
  /////////////////////////////////////////////////////////////////////////CONSUMO DE APIS
  const obtenerFichasAceptadas = async () => {
    try {
      const { data } = await clienteAxios.get("/api/fichas-tecnicas-gerencias-generales");
      console.log("obtenerFichasAceptadas", data);
      setFichasTecnicasGerente(data);

      return data;
    } catch (error) {
      console.log(error);
    }
  };
  //obtener valores en la Tabla para gerente general
  const obtenerDatosTablaReporte = async (id) => {
    console.log("entraste a obtenerDatosTablaReporte", id);
    try {
      //setLoading(true);
      const resultado = await clienteAxios.get(
        `/listarDetalleGerenteGeneral/${id}`
      );
      setDataTablaGerenteGeneral(resultado.data);
      setDetalleTabla(resultado.data.DetalleTabla);
      setDetalleGeneral(resultado.data.DetalleGeneral);
      setDetalleModulos(resultado.data.DetalleModulos);

      // setLoading(false);
    } catch (error) {
      console.log("hay un error");
      console.log(error.response.data.messages.error);
    }
  };

  ////////////////////////////////////////////////////////////////////EFECTS
  useEffect(() => {
    obtenerFichasAceptadas();
  }, []);

  const btnVerTabla = (ficha, indice) => {
    console.log("haber la ficha", ficha, "id", ficha.idFichatecnica);
    setFichaTecnica(ficha);
    obtenerDatosTablaReporte(ficha.idFichatecnica);
    setMostarFicha(true);
    obtenerModulos(ficha.idFichatecnica);
    // obtenerPartidas(ficha.idFichatecnica);
    // obtenerSubPartidas(ficha.idFichatecnica);
    obtenerDatosTablaReporte(ficha.idFichatecnica);
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

  //Tabla con material UI
  const columns = [
    { field: "id", headerName: "ID", width: 90, hide: true },
    {
      field: "itemDetallefichatecnica",
      headerName: "Nro Item",
      width: 100,
      //editable: true,
    },
    {
      field: "moduloDetallefichatecnica",
      headerName: "Modulo",
      width: 150,
      //editable: true,
    },

    {
      field: "partidaDetallefichatecnica",
      headerName: "Partida",
      width: 150,
      //editable: true,
    },
    {
      field: "subpartidaDetallefichatecnica",
      headerName: "Subpartida",
      width: 200,
      editable: true,
    },
    {
      field: "marcaDetallefichatecnica",
      headerName: "Marca",
      width: 150,
      // editable: true,
    },
    {
      field: "undDetallefichatecnica",
      headerName: "UND",
      width: 150,
      // editable: true,
    },
    {
      field: "codigoproveedorDetallefichatecnica",
      headerName: "Proveedor",
      width: 150,
      // editable: true,
    },
    {
      field: "codigosoftcomProducto",
      headerName: "Codigo softcom",
      width: 200,
      //editable: true,
       align: "right",
       headerAlign: "right",
    },

    {
      field: "descripcionDetallefichatecnica",
      headerName: "Descripcion",
      width: 400,
       editable: true,
    },

    {
      field: "cantidadDetallefichatecnica",
      headerName: "Cantidad",
      width: 150,
      //editable: true,
       align: "right",
       headerAlign: "right",
    },

    {
      field: "preciounitarioDetallefichatecnica",
      headerName: "Precio unitario $",
      width: 190,
      // editable: true,
       align: "right",
       headerAlign: "right",
    },

    {
      field: "preciototalDetallefichatecnica",
      headerName: "Sub-Total $",
      width: 150,
      // editable: true,
       align: "right",
    },

    {
      field: "preciodescuentoDetallefichatecnica",
      headerName: "Sub-Total con descuento $",
      width: 250,
      // editable: true,
       align: "right",
    },
    {
      field: "costoingDetallefichatecnica",
      headerName: "Costo de diseño $",
      width: 200,
      // editable: true,
       align: "right",
    },
    {
      field: "costototalDetallefichatecnica",
      headerName: "Costo Total $",
      width: 150,
      //editable: true,
       align: "right",
    },

    {
      field: "descuentounitarioDetallefichatecnica",
      headerName: "Descuento unitario %",
      width: 200,
       editable: true,
        align: "right",
    },
    {
      field: "descuentopartidaDetallefichatecnica",
      headerName: "Descuento partida %",
      width: 200,
       align: "right",
      // editable: true,
    },
    {
      field: "descuentosubpartidaDetallefichatecnica",
      headerName: "Descuento Subpartida %",
      width: 200,
       align: "right",
      //editable: true,
    },
    {
      field: "descuentototalDetallefichatecnica",
      headerName: "Descuento modulo %",
      width: 200,
       align: "right",
      // editable: true,
    },
    {
      field: "descuentogerentegeneralDetallefichatecnica",
      headerName: "Descuento Gerente general %",
      width: 200,
      editable: true,
      headerClassName: "super-app-theme--descuento",
       align: "right",
    },

    {
      field: "Acciones",
      width: 210,
      renderCell: (cellValues) => {
        return (
          <div>
            {/*  <>
            fichaTecnica.aprobaciongerenteFichatecnica == 0
              <button
                className="btn-warning p-2 rounded"
                onClick={() => btnAplicarDescuentoUnitario(cellValues)}
              >
                Descuento
              </button>
            </> */}
            {fichaTecnica.aprobaciongerenteFichatecnica == "0" ? (
              <>
                <button
                  className="btn-primary p-2 rounded"
                  onClick={() => btnAplicarDescuentoUnitario(cellValues)}
                >
                  Descuento
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
  const btnAplicarDescuentoUnitario = (cellValues) => {
    const data = {
      idDetallefichatecnica: cellValues.row.idDetallefichatecnica,
      descuentounitarioDetallefichatecnica:
        cellValues.row.descuentogerentegeneralDetallefichatecnica,
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

  const rows = detalleTabla.map((dato, i) => ({
    ...dato,
    id: i + 1,
  }));

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
      width: 150,
       align: "right",
      // editable: true,
    },
    {
      field: "DESCUENTO_TOTAL_X_MODULO",
      headerName: "Descuento total por modulo USD",
      width: 200,
       align: "right",
      // editable: true,
    },
    {
      field: "SUBTOTAL_CON_DESCUENTO_X_MODULO",
      headerName: "Sub-Total con descuento por modulo USD",
      width: 200,
       align: "right",
      // editable: true,
    },
    {
      field: "IGV",
      headerName: "IGV 18 %",
      width: 150,
       align: "right",
       headerAlign: "right"
      // editable: true,
    },
    {
      field: "TOTAL_X_MODULO",
      headerName: "Total venta por MODULO USD",
      width: 150,
       align: "right",
      // editable: true,
    },
    {
      field: "COSTO_DISENO_X_MODULO",
      headerName: "Total costo diseño por modulo USD",
      width: 200,
       align: "right",
      //editable: true,
    },
    {
      field: "MARGEN_TOTAL_X_MODULO",
      headerName: "Margen total por modulo %",
      width: 220,
       align: "right",
      //editable: true,
    },
    {
      field: "PORCENTAJE_GASTOS",
      headerName: "Gastos %",
      width: 150,
       align: "right",
       headerAlign: "right"
      //editable: true,
    },
    {
      field: "MARGEN_FINAL_X_MODULO",
      headerName: "Margen Final por Modulo",
      width: 180,
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
      setLoading(true);
      const obteniendoModulos = await peticionObtenerModulos(idficha);
      setLoading(false);
      /* console.log("haber obteniendoModulos", obteniendoModulos); */
      setModulos(obteniendoModulos);
    } catch (error) {
      setLoading(false);
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
      setLoading(true);
      const { data } = await clienteAxios.put(
        `/agregarDescuentoModuloFichaTecnicaGerenteGeneral/${idficha}`,
        datos,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setLoading(false);
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
      setLoading(false);
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

  //alta de negocio
  const altaNegocio = async (idFicha, numero) => {
    console.log("esta es la data en altaNegocio ", idFicha, numero);
    try {
    
      const accionUsuario = await Swal.fire({
        icon: "warning",
        title: "Esta apunto de confirmar alta de negocio",
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (accionUsuario.isConfirmed) {
        const resultado = await clienteAxios.put(
          `/api/AprobacionGerenteGeneral/${idFicha}`,
          numero
        );
        alert('Se confirma alta de negocio')
        console.log("resultado de altaNegocio", resultado);
        console.log("resultado de altaNegocio", resultado.data);
        await obtenerFichasAceptadas();
        setMostarFicha(false);
      }
    } catch (error) {
      console.log(error.response.data.messages.error);
    }
  };
  //denegaralta de negocio
  const denegarAlta = async (idFicha, numero) => {
    console.log("esta es la data en altaNegocio ", idFicha, numero);
    try {
     
      const accionUsuario = await Swal.fire({
        icon: "warning",
        title: "Esta apunto de denegar alta de negocio",
        showConfirmButton: true,
        showCancelButton: true,
      });

      if (accionUsuario.isConfirmed) {
        const resultado = await clienteAxios.put(
          `/api/AprobacionGerenteGeneral/${idFicha}`,
          numero
        );
        console.log("resultado de altaNegocio", resultado);
        console.log("resultado de altaNegocio", resultado.data);
        await obtenerFichasAceptadas();
        setMostarFicha(false);
      }
    } catch (error) {
      console.log(error.response.data.messages.error);
    }
  };
  return (
    <div className="container-fluid pt-4">
      <div className="my-4 text-center container ">
        <h4 className=" fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
        Ficha Técnica de Proyecto - Gerente General
        </h4>
      </div>
      <div className="row">
        <Accordion defaultActiveKey="0" className="mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Fichas tecnicas</Accordion.Header>
            <Accordion.Body>
              <div
                className="row p-3"
                style={{ height: "300px", overflow: "auto" }}
              >
                {fichasTecnicasGerente.length <= 0 ? (
                  <span className="text-danger text-uppercase">
                    No hay fichas tecnicas
                  </span>
                ) : (
                  fichasTecnicasGerente.map((fichaTecnica, i) => (
                    <div className="col-12 col-md-3 col-lg-3 mb-3" key={i}>
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

                          {/*   <button
                            className="btn btn-success btn btn-sm mx-2 py-0 text-uppercase"
                            onClick={() => btnVerTabla(fichaTecnica, i)}
                          >
                            <GrView className="h3 m-0 p-0 pe-1 color-white" />
                            Ver Lista de Materiales
                          </button> */}

                          <button
                            className="btn btn-success text-uppercase btn btn-sm mb-3"
                            onClick={() => btnVerTabla(fichaTecnica, i)}
                          >
                            <MdPageview className="h3 m-0 p-0 pe-1" />
                            Ver Lista de Materiales
                          </button>
                          {fichaTecnica.aprobaciongerenteFichatecnica == 2 && (
                            <>
                              <br />
                              <span className="p-1 bg-danger fw-bolder mt-4 rounded rounded-md">
                                Rechazado
                              </span>
                            </>
                          )}
                          {fichaTecnica.aprobaciongerenteFichatecnica == 1 && (
                            <>
                              <br />
                              <span className="p-1 bg-success fw-bolder mt-4 rounded rounded-md">
                                Confirmado
                              </span>
                            </>
                          )}
                          {fichaTecnica.aprobaciongerenteFichatecnica == 0 && (
                            <>
                              <br />
                              <span className="p-1 bg-warning fw-bolder mt-4 rounded rounded-md">
                                En revision
                              </span>
                            </>
                          )}
                        </Card.Body>
                      </Card>
                    </div>
                  ))
                )}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      {ROLES_COSTOS_REALES.includes(nombreRol) && (
        <div className="row mb-3">
          <div className="col-12">
            <button
              className="btn btn-success btn-sm text-uppercase"
              onClick={() => navigate("/consultar-costos-reales")}
            >
              Consultar costos reales
            </button>
          </div>
        </div>
      )}
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
                {fichaTecnica.aprobaciongerenteFichatecnica == 0 && (
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
                                  type="text"
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
                                <Button
                                  className="btn btn-primary"
                                  type="submit"
                                >
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
                                <Button
                                  className="btn btn-primary"
                                  type="submit"
                                >
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
                )}
              </div>
              {loading ? (
               ''
              ) : (
                <div>
                  {fichaTecnica.aprobaciongerenteFichatecnica == 0 ? (
                    <>
                      <div className="row mt-3">
                        <div className="col-12 col-sm-4 mb-2 text-start">
                          <button
                            className="btn btn-success text-uppercase btn btn-sm"
                            onClick={() =>
                              altaNegocio(fichaTecnica.idFichatecnica, 1)
                            }
                          >
                            <BsFillEmojiLaughingFill className="h3 m-0 p-0 pe-1" />
                            Confirmar alta de negocio
                          </button>
                        </div>
                        <div className="col-12 col-sm-4 mb-2  text-start">
                          <button
                            className="btn btn-danger text-uppercase btn btn-sm"
                            onClick={() =>
                              denegarAlta(fichaTecnica.idFichatecnica, 2)
                            }
                          >
                            {" "}
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
                    <div className="col-12 col-sm-4 text-start mb-3">
                      <button
                        className="btn btn-warning btn btn-sm text-uppercase"
                        onClick={() => abrirModal()}
                      >
                        <BsNewspaper className="h3 m-0 p-0 pe-1" /> Detalle
                        general
                      </button>
                    </div>
                  )}

                  <Box
                    sx={{
                      height: "650px",
                      width: "100%",

                      "& .super-app-theme--descuento": {
                        backgroundColor: "rgb(13, 110, 253)",
                        color: "white",
                      },
                    }}
                  >
                    {detalleTabla.length >= 0 && (
                      <DataGrid
                        columns={columns}
                        rows={rows}
                        pageSize={15}
                          rowsPerPageOptions={[15]}
                        //checkboxSelection
                        // disableSelectionOnClick
                      />
                    )}
                  </Box>

                  <div className="mb-3">
                    <div className="my-4">
                      <span className=" h4 border border-secondary rounded p-2 shadow mb-2 bg-body text-uppercase text-success">
                        Datos por Modulos
                      </span>
                    </div>

                    {loading ? (
                     ''
                    ) : (
                      <div style={{ height: "360px", overflow: "auto" }}>
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
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ModelDetalleGeneral
        show={show}
        setShow={setShow}
        detalleGeneral={detalleGeneral}
        fichaTecnica={fichaTecnica}
      />
    </div>
  );
}

export default VerFichasTecnicasGerente;
