import React, { useState } from "react";
import { Button, Col, Container } from "react-bootstrap";
import { peticionObtenerProductosNoGlobales } from "../services/apisBackOffice";
import Row from "react-bootstrap/Row";
import "./style.css";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/system";
import * as XLSX from "xlsx";
import { useRef } from "react";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import Modal from "react-bootstrap/Modal";

function ModalDetallePedido({ id, obtenerDatosTablaReporte }) {
  const ref = useRef();
  //  console.log('ver Id =>',id);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [productos, setProductos] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [codigo, setCodigo] = useState('')
  const obtenerProductos = async () => {
    try {
      const result = await peticionObtenerProductosNoGlobales(id);
      // console.log('VER PRODUCTOS ==>',result);
      setProductos(result);
      handleShow();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90, hide: true },
    {
      field: "itemPedido",
      headerName: "Nro Item",
      width: 100,
      //editable: true,
    },
    {
      field: "cantidadPedido",
      headerName: "Cantidad Pedido",
      width: 110,
      align: "right",
    },
    {
      field: "codigoproveedorPedido",
      headerName: "Proveedor",
      width: 110,
      align: "right",
    },
    {
      field: "codigosoftcomProducto",
      headerName: "Softcom",
      width: 110,
      align: "left",
    },

    {
      field: "costoingPedido",
      headerName: "Costo Pedido",
      width: 110,
    },

    {
      field: "costopromedioPedido",
      headerName: "Costo Promedio",
      width: 110,
    },

    {
      field: "costototalPedido",
      headerName: "Costo Total",
      width: 110,
      align: "left",
      //editable: true,
    },
    {
      field: "descripcionPedido",
      headerName: "Descripcion",
      width: 400,
      //editable: true,
    },
    {
      field: "descuentogerentegeneralPedido",
      headerName: "Descuento GG",
      width: 110,
      align: "left",
      //editable: true,
    },
    {
      field: "descuentopartidaPedido",
      headerName: "Descuento Partida",
      width: 110,
      align: "left",
      //editable: true,
    },
    {
      field: "descuentosubpartidaPedido",
      headerName: "Descuento SubPartida",
      width: 110,
      align: "left",
      //editable: true,
    },
    {
      field: "descuentototalPedido",
      headerName: "Descuento Total",
      width: 110,
      align: "left",
      //editable: true,
    },
    {
      field: "descuentounitarioPedido",
      headerName: "Descuento Unitario",
      width: 110,
      align: "left",
      //editable: true,
    },

    {
      field: "marcaPedido",
      headerName: "Marca Pedido",
      width: 120,
      align: "left",
      //editable: true,
    },
    {
      field: "moduloPedido",
      headerName: "Modulo Pedido",
      width: 120,
      align: "left",
      //editable: true,
    },
    {
      field: "partidaPedido",
      headerName: "Partida Pedido",
      width: 120,
      align: "left",
      //editable: true,
    },
    {
      field: "preciodescuentoPedido",
      headerName: "Precio Descuento $",
      width: 120,
      align: "left",
      //editable: true,
    },
    {
      field: "preciototalPedido",
      headerName: "Precio Total $",
      width: 120,
      align: "left",
      //editable: true,
    },
    {
      field: "preciounitarioPedido",
      headerName: "Precio Unitario $",
      width: 120,
      align: "left",
      //editable: true,
    },
    {
      field: "subpartidaPedido",
      headerName: "Sub Partida",
      width: 120,
      align: "left",
      //editable: true,
    },
    {
      field: "undPedido",
      headerName: "UND",
      width: 120,
      align: "left",
      //editable: true,
    },
  ];

  const rows = productos.map((dato, i) => ({
    ...dato,
    id: i + 1,
  }));

  const vincularCodigo = async()=>{
    console.log('ver fila',selectedRows[0].idDetallePedido)
    if(codigo==''){
        alert('No puede haber codigo vacio')
        return;
    }

    const infoData =
    {
        iddetpedido: selectedRows[0].idDetallePedido,
        codErp: codigo
    }
    

    try {
        // setLoading(true);
        const { data } = await clienteAxios.put(
          `/api/VincularCodigoNueveDetallePedido`,
          infoData,
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
        await obtenerDatosTablaReporte(id)
        return data;
      } catch (error) {
        console.log(error.response.data.messages.error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.response.data.messages.error}`,
        });
      }
  }
  return (
    <>
      <Button
        variant="primary text-uppercase mt-2"
        onClick={() => obtenerProductos()}
      >
        No globales
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
          <Modal.Title>Productos No Globales </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
          

            {
              selectedRows.length == 1 ?

              (
                <div className="row mb-3">

                <div className="col-sm-12 col-md-1 me-2 mb-2">
                  <button className="btn btn-success " onClick={(e)=> vincularCodigo()}>Vincular</button>
                </div>
  
                <div className="col-sm-12 col-md-4">
  
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ingrese codErp"
                    value={codigo}
                    onChange={(e)=>setCodigo(e.target.value)}
                  />
  
                </div>
              </div>
              ) : <></>
            }
            <Row>
              <Col md={12}>
                <Box sx={{ height: "750px", width: "100%" }}>
                  {productos.length > 0 ? (
                    <>
                      <DataGrid
                        columns={columns}
                        rows={rows}
                        pageSize={15}
                        checkboxSelection
                        onSelectionModelChange={(ids) => {
                          const selectedIDs = new Set(ids);
                          const selectedRows = rows.filter((row) =>
                            selectedIDs.has(row.id)
                          );

                          setSelectedRows(selectedRows);
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <p className="text-uppercase text-warning">
                        no existen productos No globales
                      </p>
                    </>
                  )}
                </Box>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          {/* <Button variant="primary"></Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalDetallePedido;
