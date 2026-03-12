import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Accordion, Card } from "react-bootstrap";
import { MdPageview } from "react-icons/md";
import { FcDownload } from "react-icons/fc";
import clienteAxios from "../../config/axios";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";

import { BsNewspaper } from "react-icons/bs";
import { BsFillEmojiLaughingFill } from "react-icons/bs";
import { BsFillEmojiFrownFill } from "react-icons/bs";
import ModelDetalleGeneral from "../Modales/ModelDetalleGeneral";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

function VerFichasTecnicasGerenteDeAdministracion() {
  ///////////////////////////////////////////////////////////////////////////HOOKS
  const [
    fichasTecnicasGerenteAdministracion,
    setFichasTecnicasGerenteAdministracion,
  ] = useState([]);
  const [fichaTecnica, setFichaTecnica] = useState({});
  const [mostarFicha, setMostarFicha] = useState(false);
  const [detalleTabla, setDetalleTabla] = useState([]);
  const [detalleGeneral, setDetalleGeneral] = useState([]);
  const [detalleModulos, setDetalleModulos] = useState([]);
  const [cargando, setCargando] = useState(false)
  /////////////////////////////////////////////////////////////////////////CONSUMO DE APIS
  const obtenerFichasAceptadasGa = async () => {
    try {
      setCargando(true)
      const { data } = await clienteAxios.get("/api/fichas-tecnicas-gerencias-administraciones");
      console.log("obtenerFichasAceptadas", data);
      setFichasTecnicasGerenteAdministracion(data);
      setCargando(false)
      //idFichatecnica
      return data;
    } catch (error) {
      console.log(error);
      setCargando(false)
    }
  };
  useEffect(() => {
    setCargando(true)
    setTimeout(() => {
      obtenerFichasAceptadasGa();
    }, 2500);
  
  }, []);

  //obtener valores en la Tabla para gerente administracion
  const obtenerDatosTablaReporte = async (id) => {
    console.log("entraste a obtenerDatosTablaReporte", id);
    try {
      //setLoading(true);
      const resultado = await clienteAxios.get(
        `/listarDetalleGerenteGeneral/${id}`
      );
      // setDataTablaGerenteGeneral(resultado.data);
      setDetalleTabla(resultado.data.DetalleTabla);
      setDetalleGeneral(resultado.data.DetalleGeneral);
      setDetalleModulos(resultado.data.DetalleModulos);
      // setLoading(false);
    } catch (error) {
      console.log("hay un error");
      console.log(error.response.data.messages.error);
    }
  };
  const btnVerTabla = (ficha, indice) => {
    console.log("haber la ficha", ficha, "id", ficha.idFichatecnica);
    setFichaTecnica(ficha);
    obtenerDatosTablaReporte(ficha.idFichatecnica);
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
      //editable: true,
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
      width: 150,
       align: "right",
      //editable: true,
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
       align: "right",
      //editable: true,
    },

    {
      field: "preciounitarioDetallefichatecnica",
      headerName: "Precio unitario $",
      width: 150,
       align: "right",
      // editable: true,
    },

    {
      field: "preciototalDetallefichatecnica",
      headerName: "Sub-Total $",
      width: 150,
       align: "right",
      // editable: true,
    },

    {
      field: "preciodescuentoDetallefichatecnica",
      headerName: "Sub-Total con descuento $",
      width: 250,
       align: "right",
      // editable: true,
    },
    {
      field: "costoingDetallefichatecnica",
      headerName: "Costo de diseño $",
      width: 200,
       align: "right",
      // editable: true,
    },
    {
      field: "costototalDetallefichatecnica",
      headerName: "Costo Total $",
      width: 150,
       align: "right",
      //editable: true,
    },

    {
      field: "descuentounitarioDetallefichatecnica",
      headerName: "Descuento unitario %",
      width: 200,
       align: "right",
      // editable: true,
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
      width: 150,
       align: "right",
      //editable: true,
    },
  ];

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

  const altaNegocioGerenteAdministracion = async (idFicha, numero) => {
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
          `/api/AprobacionGerenteAdministracion/${idFicha}`,
          numero
        );
        ;
        alert('Se confirma alta de negocio')
        console.log("resultado de altaNegocio", resultado);
        console.log("resultado de altaNegocio", resultado.data);
        await obtenerFichasAceptadasGa();
        setMostarFicha(false);
      }
    } catch (error) {
      console.log(error.response.data.messages.error);
    }
  };
  const DenegarAltaNegocioGerenteAdministracion = async (idFicha, numero) => {
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
          `/api/AprobacionGerenteAdministracion/${idFicha}`,
          numero
        );
        console.log("resultado de altaNegocio", resultado);
        console.log("resultado de altaNegocio", resultado.data);
        await obtenerFichasAceptadasGa();
        setMostarFicha(false);
      }
    } catch (error) {
      console.log(error.response.data.messages.error);
    }
  };

  ///MODAL
  const [show, setShow] = useState(false);
  const abrirModal = () => {
    setShow(true);
  };
  return (
    <div className="container-fluid pt-4 ">
      <div className="my-4 text-center container ">
        <h4 className=" fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
        Ver Fichas Técnicas - Gerente Administración
        </h4>
      </div>
     {
      cargando ? <p className="text-uppercase">Cargando....</p>:(
        <div className="row">
        <Accordion defaultActiveKey="0" className="mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Fichas tecnicas</Accordion.Header>
            <Accordion.Body>
              <div
                className="row p-3"
                style={{ height: "300px", overflow: "auto" }}
              >
                {fichasTecnicasGerenteAdministracion.length <= 0 ? (
                  <span className="text-danger text-uppercase">
                    No hay fichas tecnicas
                  </span>
                ) : (
                  fichasTecnicasGerenteAdministracion.map((fichaTecnica, i) => (
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

                          <button
                            className="btn btn-success text-uppercase btn btn-sm mb-3"
                            onClick={() => btnVerTabla(fichaTecnica, i)}
                          >
                            <MdPageview className="h3 m-0 p-0 pe-1" />
                            Ver Lista de Materiales
                          </button>

                          {fichaTecnica.aprobaciongerenteadministracionFichatecnica ==
                            2 && (
                            <>
                              <br />
                              <span className="p-1 bg-danger fw-bolder mt-4 rounded rounded-md">
                                Rechazado
                              </span>
                            </>
                          )}
                          {fichaTecnica.aprobaciongerenteadministracionFichatecnica ==
                            1 && (
                            <>
                              <br />
                              <span className="p-1 bg-success fw-bolder mt-4 rounded rounded-md">
                                Confirmado
                              </span>
                            </>
                          )}
                          {fichaTecnica.aprobaciongerenteadministracionFichatecnica ==
                            0 && (
                            <>
                              <br />
                              <span className="p-1 bg-warning fw-bolder mt-4 rounded rounded-md">
                                En revision
                              </span>
                            </>
                          )}

                          {/*   {fichaTecnica.aprobaciongerenteadministracionFichatecnica ==
                          1 ? (
                            <>
                              <br />
                              <span className="p-1 bg-success fw-bolder mt-4 rounded rounded-md">
                                Confirmado
                              </span>
                            </>
                          ) : (
                            <>
                              <br />
                              <span className="p-1 bg-warning fw-bolder mt-4 rounded rounded-md">
                                En revision
                              </span>
                            </>
                          )} */}
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
      )
     }
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
              </div>
              <div>
                {fichaTecnica.aprobaciongerenteadministracionFichatecnica ==
                0 ? (
                  <>
                    <div className="row mt-3">
                      <div className="col-12 col-sm-2 mb-2 text-start">
                        <button
                          className="btn btn-success text-uppercase btn btn-sm"
                          onClick={() =>
                            altaNegocioGerenteAdministracion(
                              fichaTecnica.idFichatecnica,
                              1
                            )
                          }
                        >
                          <BsFillEmojiLaughingFill className="h3 m-0 p-0 pe-1" />
                          Confirmar alta de negocio
                        </button>
                      </div>
                      <div className="col-12 col-sm-2 mb-2  text-start">
                        <button
                          className="btn btn-danger text-uppercase btn btn-sm"
                          onClick={() =>
                            DenegarAltaNegocioGerenteAdministracion(
                              fichaTecnica.idFichatecnica,
                              2
                            )
                          }
                        >
                          <BsFillEmojiFrownFill className="h3 m-0 p-0 pe-1" />
                          Denegar alta de negocio
                        </button>
                      </div>
                      
                      <div className="col-12 col-sm-2 text-start">
                        <button
                          className="btn btn-warning btn btn-sm text-uppercase"
                          onClick={() => abrirModal()}
                        >
                          <BsNewspaper className="h3 m-0 p-0 pe-1" /> Detalle
                          general
                        </button>
                      </div>

                      <div className="col-12 col-sm-2 text-start">
                        <Link
                          className="btn btn-warning btn btn-sm text-uppercase"
                          to={`/ver-fichas-tecnicas-gerente-administacion/${fichaTecnica.idFichatecnica}`}
                        >
                          <FcDownload className="h3 m-0 p-0 pe-1" /> 
                          Descarga de archivos
                        </Link>
                      </div>

                    </div>
                  </>
                ) : (
                  <div className="col-12 col-sm-4 text-start mb-3">
                    <button
                      className="btn btn-warning btn btn-sm text-uppercase me-2 mt-1"
                      onClick={() => abrirModal()}
                    >
                      <BsNewspaper className="h3 m-0 p-0 pe-1" /> Detalle
                      general
                    </button>
                    <Link
                          className="btn btn-warning btn btn-sm text-uppercase mt-1"
                          to={`/ver-fichas-tecnicas-gerente-administacion/${fichaTecnica.idFichatecnica}`}
                        >
                          <FcDownload className="h3 m-0 p-0 pe-1" /> 
                          Descarga de archivos
                        </Link>


                  </div>
                )}

                <div
                  style={{
                    width: "100%",
                    height: "650px",
                    overflow: "auto",
                  }}
                >
                  {detalleTabla.length >= 0 && (
                    <DataGrid
                      columns={columns}
                      rows={rows}
                      pageSize={15}
                      rowsPerPageOptions={[5]}
                      //checkboxSelection
                      // disableSelectionOnClick
                    />
                  )}
                </div>

                <div className="mb-3">
                  <div className="my-4">
                    <span className=" h4 border border-secondary rounded p-2 shadow mb-2 bg-body text-uppercase text-success">
                      Datos por Modulos
                    </span>
                  </div>

                  <Box
                    //style={{ height: "360px", overflow: "auto" }}
                    sx={{
                      height: 360,
                      width: "100%",
                      "& .super-app-theme--header": {
                        backgroundColor: "rgba(255, 7, 0, 0.55)",
                      },
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
                  </Box>
                </div>
              </div>
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

export default VerFichasTecnicasGerenteDeAdministracion;
