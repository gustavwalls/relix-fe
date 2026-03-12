import React, { useState } from "react";
import { useRef } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

import {
  registroProductos,
  registroProducto,
} from "../services/apisMaestroProducto";
import { Button, Modal, Row, Col, Form } from "react-bootstrap";
function MaestroProducto() {
  const ref = useRef();

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
      console.log("haber itemsFinales", items);
      ref.current.value = "";
      registroProductos(items); //para registrar productos en el excel LISTO
    });
  };

  ///AGREGAR MANUALMENTE

  const [nuevoProducto, setNuevoProducto] = useState({
    codigosoftcomProducto: "",
    descripcionProducto: "",
    codigoreferenciaProducto: "",
    undProducto: "",
    marcaProducto: "",
    costodisenoProducto: "",
    familiaProducto: "",
    precioventaunoProducto: "",
    precioventadosProducto: "",
    precioventatresProducto: "",
    precioventacuatroProducto: "",
  });
  const {
    codigosoftcomProducto,
    descripcionProducto,
    codigoreferenciaProducto,
    undProducto,
    marcaProducto,
    costodisenoProducto,
    familiaProducto,
    precioventaunoProducto,
    precioventadosProducto,
    precioventatresProducto,
    precioventacuatroProducto,
  } = nuevoProducto;

  const agarrarInput = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      codigosoftcomProducto == "" ||
      descripcionProducto == "" ||
      codigoreferenciaProducto == "" ||
      undProducto == "" ||
      marcaProducto == "" ||
      costodisenoProducto == "" ||
      familiaProducto == "" ||
      precioventaunoProducto == "" ||
      precioventadosProducto == "" ||
      precioventatresProducto == "" ||
      precioventacuatroProducto == ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No puede haber espacios en blanco",
      });
      return;
    }
    console.log("funciona");
    registroProducto(nuevoProducto); // api para registrar producto Listo
    setNuevoProducto({
      codigosoftcomProducto: "",
      descripcionProducto: "",
      codigoreferenciaProducto: "",
      undProducto: "",
      marcaProducto: "",
      costodisenoProducto: "",
      familiaProducto: "",
      precioventaunoProducto: "",
      precioventadosProducto: "",
      precioventatresProducto: "",
      precioventacuatroProducto: "",
    });
  };
  const btnAgregarProducto = () => {
    console.log("hizo click en agregar producto");
    setShowModal(true);
  };
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="container-fluid pt-4">
      <div className="my-4 text-center container ">
        <h4 className=" fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
          Maestro producto
        </h4>
      </div>

      <div className="row border border-secondary bg-bg shadow p-3 rounded mx-2 mt-3 mb-5">
        <div className="col-sm-12 col-md-6 col-lg-6">
          <span>Por favor cargar el excel :</span>
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

      <div className="row mt-4">
        <p className="text-uppercase">
          En caso que necesite agregar manualmente : 👇🏼
        </p>
        <div className="col-5">
          <span className="me-4">👉🏼</span>
          <Button
            className="btn btn-success my-3"
            onClick={() => btnAgregarProducto()}
          >
            Agregar Manualmente
          </Button>
        </div>
      </div>

      <Modal
        size="lg"
        show={showModal}
        onHide={handleClose}
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
                    Ingrese Codigo:
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingrese Codigo"
                    name="codigosoftcomProducto"
                    value={codigosoftcomProducto}
                    onChange={(e) => agarrarInput(e)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className="text-uppercase">
                    Descripcion:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Descripcion"
                    name="descripcionProducto"
                    value={descripcionProducto}
                    onChange={(e) => agarrarInput(e)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className="text-uppercase">
                    Codigo Referencia:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Codigo Referencia"
                    name="codigoreferenciaProducto"
                    value={codigoreferenciaProducto}
                    onChange={(e) => agarrarInput(e)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className="text-uppercase">UND:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="UND"
                    name="undProducto"
                    value={undProducto}
                    onChange={(e) => agarrarInput(e)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className="text-uppercase">
                    Precio Venta 01:
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Precio Venta 01"
                    name="precioventaunoProducto"
                    value={precioventaunoProducto}
                    onChange={(e) => agarrarInput(e)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className="text-uppercase">
                    Precio Venta 02:
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Precio Venta 02"
                    name="precioventadosProducto"
                    value={precioventadosProducto}
                    onChange={(e) => agarrarInput(e)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className="text-uppercase">
                    Precio Venta 03:
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Precio Venta 03"
                    name="precioventatresProducto"
                    value={precioventatresProducto}
                    onChange={(e) => agarrarInput(e)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className="text-uppercase">
                    Precio Venta 04:
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Precio Venta 04"
                    name="precioventacuatroProducto"
                    value={precioventacuatroProducto}
                    onChange={(e) => agarrarInput(e)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className="text-uppercase">
                    Costo de diseño:
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Costo de diseño"
                    name="costodisenoProducto"
                    value={costodisenoProducto}
                    onChange={(e) => agarrarInput(e)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className="text-uppercase">Familia:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Familia"
                    name="familiaProducto"
                    value={familiaProducto}
                    onChange={(e) => agarrarInput(e)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Label className="text-uppercase">Marca:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Marca"
                    name="marcaProducto"
                    value={marcaProducto}
                    onChange={(e) => agarrarInput(e)}
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
    </div>
  );
}

export default MaestroProducto;
