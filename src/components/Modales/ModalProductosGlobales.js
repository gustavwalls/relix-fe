
import React, { useState } from "react";
import { Button, Col, Container } from "react-bootstrap";
import { peticionObtenerProductosGlobales } from "../services/apisBackOffice";
import Row from "react-bootstrap/Row";
import "./style.css";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/system";
import * as XLSX from "xlsx";
import { useRef } from "react";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import Modal from "react-bootstrap/Modal";
function ModalProductosGlobales({ id ,obtenerDatosTablaReporte}) {

  const ref = useRef();
  //  console.log('ver Id =>',id);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [cargaDelExcel, setCargaDelExcel] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const obtenerProductos = async () => {
    try {
      const result = await peticionObtenerProductosGlobales(id);
     // console.log('VER PRODUCTOS ==>',result);
      setProductos(result);
      handleShow(); 
    } catch (error) {
      console.log(error);
    }
  };
 // console.log('ver SELECT =>',selectedRows)
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

  /* para importar un excel y convertilo en un array de objetos */
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((itemsFinales) => {
      //setItems(d);
      const items = itemsFinales;
     // console.log("haber itemsFinales", items);
      ref.current.value = "";
      const itemsFinalesConId = items.map((item) => ({
        ...item,
        idFichatecnica: id,
        itemFicha:selectedRows[0].itemPedido,
        idDetalleFicha:selectedRows[0].idDetallePedido,
      }));
      console.log("ver agregarId", itemsFinalesConId);
      setCargaDelExcel(itemsFinalesConId);
      registrarExcelGlobales(itemsFinalesConId); // ESTO ES LO Q SE ENVIA PRIMERO AL BACKEND Y SE REGRESA EN tablaDatos
      /* setInterval(() => {
        obtenerDetalleFichaTecnicaDisenador(fichaTecnica.idFichatecnica);
      }, 2500); */
    });
  };
  /* para importar un excel y convertilo en un array de objetos */

  const registrarExcelGlobales = async(datos)=>{
    try {
      const respuesta = await clienteAxios.post("/api/RegistrarGlobalDetallePedido", datos);
      console.log("POST de registrarExcelGlobales ->", respuesta.data);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Realizado`,
        showConfirmButton: false,
        timer: 2500,
      });
      await obtenerDatosTablaReporte(id)
      handleClose()
      return respuesta.data;
    } catch (error) {
      console.log(error)
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
        productos global 99999
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
          <Modal.Title>Productos 99999 Globales </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            {
              selectedRows.length == 1 ?

              (
                <div className="row border border-secondary bg-bg shadow p-3 rounded mx-2 mt-3 mb-4">
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <span>Registrar excel con globales:</span>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6">
                  <input
                    className="form-control"
                    type="file"
                    ref={ref}
                    id="formFile"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      readExcel(file);
                    }}
                  />
                </div>
              </div>
              ) : <></>
            }
         
            <Row>
              <Col md={12}>
                <Box sx={{ height: "550px", width: "100%" }}>
                  {
                    productos.length > 0 ?
                    (
                      <>
                      <DataGrid columns={columns} rows={rows} pageSize={15} checkboxSelection
                  onSelectionModelChange={(ids) => {
                    const selectedIDs = new Set(ids);
                    const selectedRows = rows.filter((row) =>
                      selectedIDs.has(row.id),
                    );
          
                    setSelectedRows(selectedRows);
                  }}
                  />
                      </>
                    )
                    :
                    (<>
                    <p className="text-uppercase text-warning">no existen productos con globales</p>
                    </>)
                  }
                  
                </Box>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="primary"></Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalProductosGlobales;
