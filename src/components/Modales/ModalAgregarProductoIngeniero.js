import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

import {
  peticionAgregarProductoModuloIngeniero,
  peticionObtenerPartidasProducto,
  peticionObtenerProductosProducto,
  peticionObtenerSubPartidasProducto,
} from "../services/apisBackOffice";

function ModalAgregarProductoIngeniero({
  detalleModulos,
  detalleTabla,
  fichaTecnica,
  obtenerDetalleTecnicasIngeniero,
}) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    const variable = detalleTabla.length +1; 
    setInputValue(variable);
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
    descuento,
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

  //consumo de apis

  const [subpartidasProducto, setSubPartidasProducto] = useState(null);
  const [codPartidaObtenido, setCodPartidaObtenido] = useState(null);
  const setAgarrarPartida = async (event) => {
    // console.log('valor en obtener partida =>',valor )
    const selectedOption = event.target.selectedOptions[0];
    const value1 = selectedOption.value;
    const value2 = selectedOption.getAttribute("data-valor");
    console.log(value1, value2);
    try {
      setLoading(true);
      const result = await peticionObtenerSubPartidasProducto(value1);
      setLoading(false);
      setSubPartidasProducto(result);
      setCodPartidaObtenido(value2);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const [codSubPartidaObtenido, setCodSubPartidaObtenido] = useState(null);
  const obtenerCodSubPartida = (event) => {
    const selectedOption = event.target.selectedOptions[0];
    const value1 = selectedOption.value;
    const value2 = selectedOption.getAttribute("data-valor");
    console.log(value1, value2);
    setCodSubPartidaObtenido(value2);
  };

  //obtener partidas
  const [partidasProducto, setPartidasProducto] = useState(null);
  const obteniendoPartidasProductos = async () => {
    try {
      setLoading(true);
      const result = await peticionObtenerPartidasProducto();
      //console.log(result);
      setLoading(false);
      setPartidasProducto(result);
    } catch (error) {
      setLoading(false);
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
      console.log("a ver productos", data);
      setProductoPorBusqueda(data);
    } catch (error) {
      console.log(error);
    }
  };
  //
  const [inputValue, setInputValue] = useState(0);
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  //

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (productoPorBusqueda) {
        if (
          productoPorBusqueda.codigosoftcomProducto == "9999999999" ||
          productoPorBusqueda.codigosoftcomProducto == "0170020200"
        ) {
          console.log("existe condicional");
          const data = {
            ...registrarProducto,
            numPartida: detalleTabla.length + 1,
            subPartida: codSubPartidaObtenido,
            idPartida: codPartidaObtenido,
            descripcion: productoPorBusqueda.descripcionProducto,
            costoDiseno: productoPorBusqueda.costodisenoProducto,
            idFichatecnica: fichaTecnica.idFichatecnica,
          };
          console.log("esta data final  9999 ===>", data);
          await peticionAgregarProductoModuloIngeniero(data);
          await obtenerDetalleTecnicasIngeniero(fichaTecnica.idFichatecnica);

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

          handleClose();
        } else {
          console.log("No existe condicional");
          const data = {
            ...registrarProducto,
            numPartida: detalleTabla.length + 1,
            subPartida: codSubPartidaObtenido,
            idPartida: codPartidaObtenido,
            costoDiseno: productoPorBusqueda.costodisenoProducto,
            idFichatecnica: fichaTecnica.idFichatecnica,
          };
          console.log("esta data final ===>", data);

          await peticionAgregarProductoModuloIngeniero(data);
          await obtenerDetalleTecnicasIngeniero(fichaTecnica.idFichatecnica);

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
          handleClose();

          return;
        }
      } else {
        console.log("no aplico busqueda");
        const data = {
          ...registrarProducto,
          numPartida: inputValue,
          idFichatecnica: fichaTecnica.idFichatecnica,
        };
        console.log("ver data ->", data);

        await peticionAgregarProductoModuloIngeniero(data);
        await obtenerDetalleTecnicasIngeniero(fichaTecnica.idFichatecnica);

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
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="text-uppercase">
        Agregar producto
      </Button>
      <Modal show={show} onHide={handleClose} size="lg">
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
                    type="number"
                    placeholder="Ingrese numero de item:"
                    /*   name="numPartida"
                    value={detalleTabla.length +1}
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
                      setAgarrarPartida(e);
                      actualizarInput(e);
                    }}
                    required
                  >
                    <option disabled>Seleccione una partida</option>
                    {!partidasProducto ? (
                      ''
                    ) : (
                      partidasProducto.map((partida, i) => (
                        <option
                          value={partida.idPartida}
                          data-valor={partida.codPartida}
                          key={i}
                        >
                          {partida.nombrePartida}
                        </option>
                      ))
                    )}
                  </Form.Select>
                </Form.Group>

                {/* <option value="" selected disabled hidden>Seleccione una Sub-partida</option> */}
                <Form.Group className="mb-3">
                  <Form.Label className="text-uppercase">
                    Sub Partidas
                  </Form.Label>
                  <Form.Select
                    aria-label="Seleccione una Sub-partida"
                    name="subPartida"
                    value={subPartida}
                    onChange={(e) => {
                      obtenerCodSubPartida(e);
                      actualizarInput(e);
                    }}
                    required
                  >
                    {!subpartidasProducto && (
                      <option value="" selected disabled hidden>
                        Seleccione una Partida primero
                      </option>
                    )}
                    {!subpartidasProducto ? (
                      ''
                    ) : (
                      <>
                        <option value="" selected disabled hidden>
                          Seleccione una Subpartida
                        </option>
                        {subpartidasProducto.map((subpartida, i) => (
                          <option
                            value={subpartida.nombreSubPartida}
                            data-valor={subpartida.codSubPartida}
                            key={i}
                          >
                            {subpartida.nombreSubPartida}
                          </option>
                        ))}
                      </>
                    )}
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
                    value={"Pendiente"}
                    //onChange={(e) => actualizarInput(e)}
                    disabled
                  />
                </Form.Group>

                {/*  <Form.Group className="mb-3" controlId="formBasicText">
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
                </Form.Group> */}

                <Button className="btn btn-success mt-3" type="submit">
                  Guardar
                </Button>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalAgregarProductoIngeniero;
