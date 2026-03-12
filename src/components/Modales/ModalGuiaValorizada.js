import React, { useState, useContext } from "react";
import { Button, Col, Container, Form } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import Row from "react-bootstrap/Row";
import { Box } from "@mui/system";
import clienteAxios from "../../config/axios";
import Modal from "react-bootstrap/Modal";
import authContext from "../../context/autenticacion/authContext";
import Swal from "sweetalert2";
import "./style.css";

function ModalGuiaValorizada({
  selectedRows,
  fichaTecnica,
  obtenerDatosTablaReporte,
  btnVerTabla,
}) {
  const autentificaciones = useContext(authContext);
  const { usuario } = autentificaciones;
  // console.log("ver usuario", usuario);
  // console.log("ver fichaTecnica", fichaTecnica);
  const [show, setShow] = useState(false);
  const [errores, setErrores] = useState([]);
  // const arrayGlobal =[]
  const copiaFilas = selectedRows;
  const [copiaDeFilas, setCopiaDeFila] = useState([]);
  const handleClose = () => {
    setShow(false);
    setErrores([]);
    setCopiaDeFila([]);
  };
  const [verificarEnter, setVerificarEnter] = useState(false)
  const handleShow = () => setShow(true);

  const [registroRQ, setRegistroRQ] = useState({
    codigoAlmacen: "",
    moneda: "us",
  });

  const mostrarTabla = () => {
    console.log("copiaFilas", copiaFilas);
    setCopiaDeFila(copiaFilas); //asignar la copia
  };

  const actualizarInput = (e) => {
    setRegistroRQ({
      ...registroRQ,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      reqValorizacion: {
        ...registroRQ,
        idficha: fichaTecnica.idFichatecnica,
        usuario: usuario.idUsuario,
      },
      detalleReqValorizacion: copiaDeFilas,
    };
    const fecha = new Date();
    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;
    const anoActual = fecha.getFullYear();
    try {
      var config = {
        responseType: "arraybuffer",
      };
      const resultado = await clienteAxios.post(
        "api/GuiaTrasladoDetalle/requerimiento",
        data,
        config
      );
      console.log("resultado.data ==>", resultado.data);

      const url = URL.createObjectURL(
        new Blob([resultado.data], {
          type: "application/vnd.ms-excel",
        })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `GuisValorizada-${hoy}_${mesActual}_${anoActual}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Registro exitoso",
        showConfirmButton: false,
        timer: 1500,
      });
      await btnVerTabla(fichaTecnica);
      handleClose();
    } catch (error) {
      console.log("ver error =>", error);
      /*  setErrores(error.response.data.messages)*/
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `error`,
      });
    }
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
      width: 150,
      //editable: true,
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
    {
      field: "cantidad",
      headerName: "Cantidad Requerida",
      width: 180,
      align: "right",
      headerAlign: "right",
      editable: true,
      headerClassName: "super-app-theme--editar",
    },
    {
      field: "descuento",
      headerName: "Descuento",
      width: 180,
      align: "right",
      headerAlign: "right",
      editable: true,
      headerClassName: "super-app-theme--editar",
    },
    {
      field: "Acciones",
      width: 280,
      renderCell: (cellValues) => {
        return (
          <div>
            <button
              className="btn-warning me-2 p-2 rounded"
              onClick={() => btnAgregarCantidad(cellValues)}
            >
              Agregar cantidad requerida
            </button>
          </div>
        );
      },
    },
  ];

  const btnAgregarCantidad = (cellValues) => {
    console.log("ver cantidadRequerida =>", Number(cellValues.row.cantidad));
    console.log("ver descuentodRequerido =>", Number(cellValues.row.descuento));
    const cantidadRequerida = Number(cellValues.row.cantidad);
    const descuentoRequerido = Number(cellValues.row.descuento);
    /* if (isNaN(cantidadRequerida) && isNaN(descuentoRequerido)) {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: "Por favor, llene al menos 1 campo",
      });
      setVerificarEnter(true)
      return;
    } */
    if (
      Number(cellValues.row.cantidad) <=
      Number(cellValues.row.CANTIDAD_GUIA_TRASLADO_DETALLE) || isNaN(cantidadRequerida)
    ) {
      setVerificarEnter(false)
      setCopiaDeFila(
        copiaDeFilas.map((item) => {
          if (
            item.ID_GUIA_TRASLADO_DETALLE ==
            cellValues.row.ID_GUIA_TRASLADO_DETALLE
          ) {
            item.cantidad = cellValues.row.cantidad == undefined ? "0" : cellValues.row.cantidad;
            item.descuento =
              cellValues.row.descuento == undefined
                ? "0"
                : cellValues.row.descuento;
            item.guiatrasladodetalle = cellValues.row.ID_GUIA_TRASLADO_DETALLE;
          }
          console.log("item ->", item);
          return item;
        })
      );
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Cantidad agregada`,
        showConfirmButton: false,
        timer: 2000,
      });

      return;
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Cantidad requerida no puede ser mayor de la cantidad que ya se tiene`,
      });
      cellValues.row.cantidadRequerida = 0;
      cellValues.row.descuentodRequerido = 0;
      return;
    }
  };

  const rows = copiaDeFilas.map((dato, i) => ({
    ...dato,
    id: i + 1,
  }));

  return (
    <>
      <button
        className="btn btn-warning btn-sm mb-3 text-uppercase"
        onClick={() => handleShow()}
      >
        Registrar guia valorizada
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Registrar Consumo Valorizado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {copiaFilas.length > 0 ? (
            <button
              className="btn btn-primary mb-3 w-25"
              onClick={() => mostrarTabla()}
            >
              Mostrar tabla
            </button>
          ) : (
            <div className="alert alert-danger mb-3" role="alert">
              No has seleccionado ningun fila ,por favor seleccione algunas
            </div>
          )}
          <div className="row mb-3">
            <div className="col-12">
              <Container>
                {copiaDeFilas.length > 0 && (
                  <Row>
                    {verificarEnter && <div class="alert alert-warning" role="alert">
                      Por favor al terminar de escribir presionar enter
                    </div>}
                    
                    <Col md={12}>
                      <Box
                        sx={{
                          height: "550px",
                          width: "100%",
                          "& .super-app-theme--editar": {
                            backgroundColor: "rgb(255, 202, 44)",
                          },
                        }}
                      >
                        <DataGrid
                          columns={columns}
                          rows={rows}
                          pageSize={15}
                          rowsPerPageOptions={[5]}
                          experimentalFeatures={{ newEditingApi: true }}
                          /*  checkboxSelection
                      disableSelectionOnClick */
                        />
                      </Box>
                    </Col>
                  </Row>
                )}
              </Container>
            </div>
          </div>
          <div className="row">
            <Form
              onSubmit={(e) => handleSubmit(e)}
              className="FormRegistrarPedido"
            >
              <div className="row">
                <Form.Group className="mb-3 col-12 col-lg-4">
                  <Form.Label>Codigo almacen:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Codigo almacen"
                    name="codigoAlmacen"
                    onChange={(e) => actualizarInput(e)}
                    maxLength="4"
                    required
                  />
                </Form.Group>
              </div>

              <div className="row">
                <Form.Group className="mb-3 col-12 col-md-4">
                  <Form.Label>Moneda:</Form.Label>
                  <Form.Select
                    name="moneda"
                    onChange={(e) => actualizarInput(e)}
                    required
                  >
                    <option value="us">US(Dolares)</option>
                    <option value="mn">MN(Soles)</option>
                  </Form.Select>
                </Form.Group>
              </div>

              {copiaDeFilas.length > 0 && (
                <Button variant="primary mt-3 float-end " type="submit">
                  Agregar
                </Button>
              )}
            </Form>
            {errores.length > 0 &&
              errores.map((error, i) => (
                <div className="mt-1">
                  <p className="text-uppercase text-danger bg-secondary text-white p-2">
                    {" "}
                    {error}
                  </p>
                </div>
              ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalGuiaValorizada;
