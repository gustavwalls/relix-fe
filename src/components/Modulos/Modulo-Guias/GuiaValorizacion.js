import React, { useState } from "react";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { GiSaveArrow } from "react-icons/gi";

import Card from "react-bootstrap/Card";
import { Accordion } from "react-bootstrap";
import { MdPageview } from "react-icons/md";
import { AiOutlineSave } from "react-icons/ai";
import Box from "@mui/material/Box";
import ModalGuiaValorizada from "../../Modales/ModalGuiaValorizada";
import clienteAxios from "../../../config/axios";

function GuiaValorizacion() {
  ///////////////////////////////////////////////////////////////////////////HOOKS
  const [fichasTecnicasBackoffice, setFichasTecnicasBackoffice] = useState([]);
  const [fichaTecnica, setFichaTecnica] = useState({});
  const [dataTablaBackoffice, setDataTablaBackoffice] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activarBt, setActivarBtn] = useState(false);
  ////MOSTRAR FICHA
  const [mostarFicha, setMostarFicha] = useState(false);

  const obtenerFichasAceptadas = async () => {
    try {
      const { data } = await clienteAxios.get("/api/FichaTecnicaBackOffice");
      //  console.log("obtenerFichasAceptadas", data);
      setFichasTecnicasBackoffice(data);

      return data;
    } catch (error) {
      console.log(error);
    }
  };
  ////////////////////////////////////////////////////////////////////EFECTS
  useEffect(() => {
    obtenerFichasAceptadas();
  }, []);

  //obtener valores en la Tabla para backofiice
  const obtenerDatosTablaReporte = async (id) => {
    console.log("entraste a ListarDetallePedidoGuiasTraslado =>", id);
    try {
      //setLoading(true);
      const resultado = await clienteAxios.get(
        `/api/GuiaTrasladoDetalle/${id}`
      );
      console.log("VER RESULTADO =>", resultado);
      setDataTablaBackoffice(resultado.data);

      // setLoading(false);
    } catch (error) {
      console.log("hay un error");
      // console.log(error.response.data.messages.error);
    }
  };

  /////////////////////////////////////////////////descuento por modulo
  const btnVerTabla = async (ficha, indice) => {
    console.log("haber la ficha", ficha, "id", ficha.idFichatecnica);
    setFichaTecnica(ficha);
    obtenerDatosTablaReporte(ficha.idFichatecnica);
    setMostarFicha(true);

    //  obtenerPartidas(ficha.idFichatecnica);
    //  obtenerSubPartidas(ficha.idFichatecnica);
    //  obtenerDatosTablaReporte(ficha.idFichatecnica);
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
      field: "NUMERO_ITEM_GUIA_TRASLADO_DETALLE",
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
      field: "PARTIDA_GUIA_TRASLADO_DETALLE",
      headerName: "Partida",
      width: 150,
      //editable: true,
    },
    {
      field: "SUBPARTIDA_GUIA_TRASLADO_DETALLE",
      headerName: "Sub-Partida",
      width: 150,
      //editable: true,
    },
    {
      field: "MARCA_GUIA_TRASLADO_DETALLE",
      headerName: "Marca",
      width: 150,
      //editable: true,
    },
    {
      field: "CODIGO_SOFTCOM_GUIA_TRASLADO_DETALLE",
      headerName: "CodSoftcom",
      width: 170,
      //editable: true,
    },
    {
      field: "CODIGO_PROVEEDOR_GUIA_TRASLADO_DETALLE",
      headerName: "CodProveedor",
      width: 170,
      //editable: true,
    },
    {
      field: "DESCRIPCION_GUIA_TRASLADO_DETALLE",
      headerName: "Descripcion",
      width: 450,
      editable: true,
    },
    {
      field: "CANTIDAD_GUIA_TRASLADO_DETALLE",
      headerName: "Cantidad",
      width: 150,
      //editable: true,
    },
    {
      field: "PRECIO_UNIT_GUIA_TRASLADO_DETALLE",
      headerName: "Precio Unitario",
      width: 180,
      //editable: true,
    },
    {
      field: "SUBTOTAL_GUIA_TRASLADO_DETALLE",
      headerName: "Sub-Total",
      width: 150,
      //editable: true,
    },
    {
      field: "CODIGO_REQUERIMIENTO_GUIA_TRASLADO_DETALLE",
      headerName: "CodRequerimiento",
      width: 150,
      //editable: true,
    },
    {
      field: "CODIGO_PEDIDO_GUIA_TRASLADO_DETALLE",
      headerName: "CodPedido",
      width: 150,
      //editable: true,
    },
    {
      field: "CODIGO_GUIA_TRASLADO_DETALLE",
      headerName: "CodGuia",
      width: 150,
      //editable: true,
    },
  ];

  const rows = dataTablaBackoffice.map((dato, i) => ({
    ...dato,
    id: i + 1,
  }));

  const descargarReporteValorizacion = async (ficha) => {
    //   console.log(ficha.idFichatecnica)
    let id = ficha.idFichatecnica;
    console.log("entraste a descargarReporteValorizacion");
    const fecha = new Date();
    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;
    const anoActual = fecha.getFullYear();
    try {
      var config = {
        responseType: "arraybuffer",
      };
      const resultado = await clienteAxios.get(
        `/api/GuiaTrasladoDetalle/ReporteValorizacion/${id}`,
        config
      );
      console.log(
        "respuesta de descargarReporteValorizacion",
        resultado.data
      );

      const url = URL.createObjectURL(
        new Blob([resultado.data], {
          type: "application/vnd.ms-excel",
        })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `R6_${ficha.nombreFichatecnica}-${ficha.numFichatecnica}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error.response.data.messages.error);
    }
  };

  const filaSeleccionada = (filas) => {
    console.log("funciona", filas);
    /*  if(filas.length<4){
      console.log('funciona',filas)
    }else{
      alert('no puede haber mas de 20 filas seleccionadas')
      return;
    } */
    const verificar = filas.some((fila) => {
      return (
        fila.nombreEstado == "ANULADO" ||
        fila.nombreEstado == "PROCESADO" ||
        fila.codigosoftcomProducto == "9999999999"
      );
    });
    //  console.log("verificar =>", verificar);
    if (verificar) {
      setActivarBtn(true);
      alert(
        "Selecciono una fila con Estado Anulado, Procesado o Codigo Softcom 9999999999"
      );
      return;
    }
    setActivarBtn(false);
    // return fila.nombreEstado =='Anulado' ? true : false;
  };
  return (
    <div className="container-fluid pt-4 ">
      <div className="my-4 text-center container ">
        <h4 className=" fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
          Guias Valorizadas
        </h4>
      </div>
      <div className="row">
        <Accordion defaultActiveKey="0" className="mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Fichas</Accordion.Header>
            <Accordion.Body>
              <div
                className="row p-3"
                style={{ height: "300px", overflow: "auto" }}
              >
                {fichasTecnicasBackoffice.length <= 0 ? (
                  <span className="text-danger text-uppercase">No Guias</span>
                ) : (
                  fichasTecnicasBackoffice.map((fichaTecnica, i) => (
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
                            className="btn btn-success text-uppercase btn btn-sm mb-3"
                            onClick={() => btnVerTabla(fichaTecnica, i)}
                          >
                            <MdPageview className="h3 m-0 p-0 pe-1" />
                            Ver Lista de Materiales
                          </button>
                          {fichaTecnica.aprobaciongerenteFichatecnica == "0" &&
                          fichaTecnica.aprobaciongerenteFichatecnica == "0" ? (
                            <>
                              <br />
                              <span className="bg-warning text-dark px-2 rounded text-uppercase">
                                Sin aceptar
                              </span>
                            </>
                          ) : (
                            <>
                              <br />
                              <span className="bg-primary text-light p-1 rounded text-uppercase">
                                <AiOutlineSave className="h3 m-0 p-0 pe-1 my-2" />
                                Aceptado
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
      {mostarFicha ? (
        dataTablaBackoffice.length >= 1 ? (
          <div className="row">
            <div className="row">
              <div className="col-md-4">
                {/*     conversar si se queda o no */}
                <button
                  className="btn btn-primary btn-sm mb-3 text-uppercase"
                  onClick={() => descargarReporteValorizacion(fichaTecnica)}
                >
                  Descargar reporte de valorizacion
                </button>
              </div>
              {selectedRows.length < 20 && (
                <div className="col-md-4">
                  <ModalGuiaValorizada
                    selectedRows={selectedRows}
                    fichaTecnica={fichaTecnica}
                    obtenerDatosTablaReporte={obtenerDatosTablaReporte}
                    btnVerTabla={btnVerTabla}
                  />
                </div>
              )}
              {selectedRows.length >= 20 && (
                <div class="alert alert-danger" role="alert">
                  No puede seleccionar mas de 20 filas
                </div>
              )}
            </div>
            <Box
              sx={{
                height: "650px",
                width: "100%",
              }}
            >
              {dataTablaBackoffice.length >= 0 && (
                <DataGrid
                  columns={columns}
                  rows={rows}
                  pageSize={15}
                  checkboxSelection
                  rowsPerPageOptions={[5]}
                  onSelectionModelChange={(ids) => {
                    const selectedIDs = new Set(ids);
                    const selectedRows = rows.filter((row) =>
                      selectedIDs.has(row.id)
                    );
                    setSelectedRows(selectedRows);
                    filaSeleccionada(selectedRows);
                  }}
                />
              )}
            </Box>
          </div>
        ) : (
          <div className="alert alert-warning" role="alert">
            Aún no se ha procesado ningún requerimiento de pedido
          </div>
        )
      ) : (
        <div className="alert alert-success" role="alert">
          Seleccione una ficha
        </div>
      )}
    </div>
  );
}

export default GuiaValorizacion;
