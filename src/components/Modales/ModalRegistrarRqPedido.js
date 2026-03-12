import React, { useState, useContext } from "react";
import { Button, Col, Container, Form } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import Row from "react-bootstrap/Row";
import { Box } from "@mui/system";
import clienteAxios from "../../config/axios";
import Modal from "react-bootstrap/Modal";
import authContext from "../../context/autenticacion/authContext";
import Swal from "sweetalert2";
import {
  registrarRqPedido,
  descargarExcelAlRegistrar,
} from "../services/apisBackOffice";

import "./style.css";

function ModalRegistrarRqPedido({ selectedRows, fichaTecnica,obtenerDatosTablaReporte,btnVerTabla }) {
  const autentificaciones = useContext(authContext);
  const { usuario } = autentificaciones;
  // console.log("ver usuario", usuario);
  // console.log("ver fichaTecnica", fichaTecnica);
  const [show, setShow] = useState(false);
  const [numRq, setNumRq] = useState("");
  const [errores, setErrores] = useState([])
  const copiaFilas = selectedRows;

  const [copiaDeFilas, setCopiaDeFila] = useState([]);
  const handleClose = () => {
    setShow(false)
    setErrores([])
    setCopiaDeFila([])
  };
  const handleShow = () => setShow(true);



  const [registroRQ, setRegistroRQ] = useState({
    agencia: "",
    fechaRequerimiento: "",
    centroCosto: "",
    tipDoc: "FT",
    codCliente: "",
    moneda: "us",
    codFormaPago: "",
    fechaVencimiento: "",
    numCompra: "",
    glosa: "",
    tipo: "N",
    tipoCalculo: "N",
  });

  const mostrarTabla = () => {
    console.log('copiaFilas =>',copiaFilas);
    setCopiaDeFila(copiaFilas); //asignar la copia
  };

  const actualizarInput = (e) => {
    setRegistroRQ({
      ...registroRQ,
      [e.target.name]: e.target.value,
    });
  };

  const obtenernumReq = async (centroCosto) => {
    console.log("entraste a obtenernumReq =>", centroCosto);
    try {
      //setLoading(true);
      const resultado = await clienteAxios.get(
        `/api/CodigoReqPedido/${centroCosto}`
      );
      console.log("VER RESULTADO =>", resultado.data[0].CODREQPEDIDO);
      setNumRq(resultado.data[0].CODREQPEDIDO);

      // setLoading(false);
    } catch (error) {
      console.log("hay un error");
      setNumRq("");
      //   console.log(error.response.data.messages.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("ver copia ->", copiaDeFilas);
    const data = {
      reqPedido: {
        ...registroRQ,
        numRequerimiento: numRq,
        idficha: fichaTecnica.idFichatecnica,
        usuario: usuario.idUsuario,
      },

      detalleReqPedido: copiaDeFilas,
    };
    console.log('data a enviarse ->',data);

    try {
   //   await registrarRqPedido(data);
   const  {resultado}  = await clienteAxios.post('api/registrarRequerimientoPedido', data);
      console.log('resultado -->',resultado);
      await descargarExcelAlRegistrar(data.reqPedido.numRequerimiento)
      handleClose()
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Registro exitoso`,
        showConfirmButton: false,
        timer: 2200,
      });

     await  btnVerTabla(fichaTecnica)
      //await obtenerDatosTablaReporte(fichaTecnica.idFichatecnica)
      setErrores([])
     
    } catch (error) {
     // console.log('error.response.data.messages.error',error.response.data.messages.error);
     if(error.response.data.messages.error){
      alert(error.response.data.messages.error)
      return;
     }
      
      setErrores(error.response.data.messages)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `error`,
      });
    }

   // console.log("ver data a enviar a be =>", data);
  };
  //Tabla con material UI
  const columns = [
    { field: "id", headerName: "ID", width: 90, hide: true },
    {
      field: "idDetallePedido",
      headerName: "Nro Item",
      width: 100,
      //editable: true,
     // hide: true,
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
      field: "preciodescuentoDetallefichatecnica",
      headerName: "Sub-Total con descuento $",
      width: 250,
      // editable: true,
    },
    {
      field: "preciodescuentoPedido",
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
      field: "observacionPedido",
      headerName: "Observacion",
      width: 200,
      // editable: true,
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
    /*  console.log(
      "ver FILA COMPLETA =>",
      Number(cellValues)
    );
    console.log(
      "ver cantidadRequerida =>",
      Number(cellValues.row.cantidadRequerida)
    ); */
    //console.log("ver idDetallePedido =>", cellValues.row.idDetallePedido);
    if (
      Number(cellValues.row.cantidadRequerida) >= 0 &&
      Number(cellValues.row.cantidadRequerida) <=
        Number(cellValues.row.cantidadPedido)
    ) {
      setCopiaDeFila(
        copiaDeFilas.map((item) => {
          if (item.idDetallePedido == cellValues.row.idDetallePedido) {
            item.cantidadRequerida = cellValues.row.cantidadRequerida;
          }
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
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Cantidad requerida tiene que ser mayor que 0 y menor que Cantidad`,
      });
      cellValues.row.cantidadRequerida = 0;
      return;
    }
  };

  const rows = copiaDeFilas.map((dato, i) => ({
    ...dato,
    id: i + 1,
  }));

  return (
    <>
      <Button
        variant="warning text-uppercase mt-2"
        onClick={() => handleShow()}
      >
        Registrar RQ de pedido
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Registrar Requerimiento de Pedido</Modal.Title>
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
                  <Form.Label>Agencia:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Agencia"
                    name="agencia"
                    onChange={(e) => actualizarInput(e)}
                    maxlength="4"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-12 col-lg-4">
                  <Form.Label>Fecha Requerimiento:</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Fecha requerimiento"
                    name="fechaRequerimiento"
                    onChange={(e) => actualizarInput(e)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-12 col-lg-4">
                  <Form.Label>Centro Costo:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Centro Costo"
                    name="centroCosto"
                    onChange={(e) => {
                      actualizarInput(e);
                      obtenernumReq(e.target.value);
                    }}
                    maxlength="6"
                    required
                  />
                </Form.Group>
              </div>

              <div className="row">
                <Form.Group className="mb-3 col-12 col-lg-4">
                  <Form.Label>Numero Requerimiento:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Numero Requerimiento"
                    value={numRq}
                    onChange={(e) => actualizarInput(e)}
                    disabled
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-12 col-md-4">
                  <Form.Label>Tipo Documento:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Tipo Documento"
                    name="tipDoc"
                    defaultValue="FT"
                    onChange={(e) => actualizarInput(e)}
                    maxlength="2"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-12 col-md-4">
                  <Form.Label>Codigo Cliente:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Codigo Cliente"
                    name="codCliente"
                    onChange={(e) => actualizarInput(e)}
                    maxlength="18"
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
                <Form.Group className="mb-3 col-12 col-md-4">
                  <Form.Label>Cod Forma de Pago:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Forma de pago"
                    name="codFormaPago"
                    onChange={(e) => actualizarInput(e)}
                    maxlength="3"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-12 col-md-4">
                  <Form.Label>Fecha vencimiento:</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Fecha Vencimiento"
                    name="fechaVencimiento"
                    onChange={(e) => actualizarInput(e)}
                    required
                  />
                </Form.Group>
              </div>

              <div className="row">
                <Form.Group className="mb-3 col-12 col-md-4">
                  <Form.Label>Nro. Orden de Compra:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nro. Orden de Compra"
                    name="numCompra"
                    onChange={(e) => actualizarInput(e)}
                    maxlength="20"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-12 col-md-4">
                  <Form.Label>Glosa:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Glosa max 60 caracteres"
                    name="glosa"
                    onChange={(e) => actualizarInput(e)}
                    as="textarea" rows={3} 
                    maxlength="60"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-12 col-md-4">
                  <Form.Label>Tipo de pedido:</Form.Label>

                  <Form.Select name="tipo" onChange={(e) => actualizarInput(e)}
                  required
                  >
                    <option value="N">N</option>
                    <option value="E">E</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3 col-12 col-md-5">
                  <Form.Label>
                    Tipo de pedido para calculo de percepción:
                  </Form.Label>

                  <Form.Select
                    name="tipoCalculo"
                    onChange={(e) => actualizarInput(e)}
                    required
                  >
                    <option value="N">N</option>
                    <option value="E">E</option>
                    <option value="i">I</option>
                  </Form.Select>
                </Form.Group>
              </div>

              {copiaDeFilas.length > 0 && (
                <Button variant="primary mt-3 float-end " type="submit">
                  Agregar
                </Button>
              )}
            </Form>
            {
              errores.length>0 &&
              errores.map((error,i)=>(
                <div className="mt-1">
              <p className="text-uppercase text-danger bg-secondary text-white p-2"> {error}</p>
              </div>

              ))
            }
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalRegistrarRqPedido;
