import React, { useEffect, useState, useContext } from "react";
import LogoRelix from "../../img/relixjpgg.png";
import register from "../../img/register.svg";
import { Form, Button, Col, Row, Table, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
///////////////
import authContext from "../../context/autenticacion/authContext";
import alertContext from "../../context/alertas/alertaContext";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  peticionObtenerAcciones,
  peticionObtenerRoles,
} from "./service/rolesService";

function Registrar() {
  /////////////////////////////////

  const alertascontext = useContext(alertContext);
  const { alerta, mostrarAlerta } = alertascontext;
  /////////////////////////////////
  const autentificaciones = useContext(authContext);
  const { mensaje } = autentificaciones;
  /////////////////////////////////
  const [infoPeticion, setInfoPeticion] = useState("");
  const [banderaPeticion, setbanderaPeticion] = useState(false);
  const [todosLosUsuarios, setTodosLosUsuarios] = useState([]);
  //
  const [roles, setRoles] = useState(null);
  const [acciones, setAcciones] = useState([]);

  useEffect(() => {
    if (mensaje) {
      mostrarAlerta(mensaje.msg, mensaje.categoria);
    }
    // eslint-disable-next-line
  }, [mensaje]);

  useEffect(() => {
    peticionMostrarUsuarios();

    setTimeout(() => {
      obtenerTodosLosRoles();
    }, 2300);
    obtenerTodosLasAcciones();
  }, []);

  const obtenerTodosLosRoles = async () => {
    const roles = await peticionObtenerRoles();
    setRoles(roles);
    // console.log('ver roles =>',roles)
  };

  const obtenerTodosLasAcciones = async () => {
    try {
      const acciones = await peticionObtenerAcciones();

      setAcciones(acciones);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerTodosLasAcciones();
  }, [2000]);

  const [registrarUsuario, setregistrarUsuario] = useState({
    idUsuario: "",
    nombreUsuario: "",
    correoUsuario: "",
    apellidoUsuario: "",
    nombreRol: "",
    idRol: "",
    rutas: [],
  });
  const {
    nombreUsuario,
    apellidoUsuario,
    correoUsuario,
    idRol,
    idUsuario,
    nombreRol,
    rutas,
  } = registrarUsuario;

  const actualizarInput = (e) => {
    setregistrarUsuario({
      ...registrarUsuario,
      [e.target.name]: e.target.value,
    });
  };
  /////////////////////////////////////////////////////////////////
  const [listaChecks, setListaChecks] = useState({
    moduloRegistroUsuario: false,
    moduloRegistrarFichaTecnica: false,
    moduloVerFichasTecnicasDisenador: false,
    moduloVerFichasTecnicasBackoffice: false,
    moduloVerFichasTecnicasIngeniero: false,
    moduloDescargarReportePipeLine: false,
    moduloReportePresupuesto: false,
    moduloRegistroVendedor: false,
    moduloReporteAnalisis: false,
    moduloVerFichasTecnicasGerenteGeneral: false,
    moduloReporteCotizacion: false,
    moduloFichaDeGastos: false,
    moduloEditarFichaTecnica: false,
    moduloVerFichasTecnicasGerenteAdministracion: false,
    moduloActualizarMargen: false,
    moduloRegistroPartidasSubpartidas: false,
    moduloMaestroProducto: false,
    moduloMaestroCosto: false,
  });
  const {
    moduloRegistroUsuario,
    moduloRegistrarFichaTecnica,
    moduloVerFichasTecnicasDisenador,
    moduloVerFichasTecnicasBackoffice,
    moduloVerFichasTecnicasIngeniero,
    moduloDescargarReportePipeLine,
    moduloReporteAnalisis,
    moduloVerFichasTecnicasGerenteGeneral,
    moduloVerFichasTecnicasGerenteAdministracion,
    moduloReporteCotizacion,
    moduloFichaDeGastos,
    moduloEditarFichaTecnica,
    moduloReportePresupuesto,
    moduloRegistroVendedor,
    moduloActualizarMargen,
    moduloRegistroPartidasSubpartidas,
    moduloMaestroProducto,
    moduloMaestroCosto,
  } = listaChecks;

  const actualizarCheckout = (e) => {
    /*   setListaChecks({
      ...listaChecks,
      [e.target.name]: e.target.checked,
    }); */
  };
  const [rutasFinales, setRutasFinales] = useState([]);

  const handleCheckboxChange = (event) => {
    //console.log('funciona?');
    const { name, checked } = event.target;
    console.log("name", name, "checked", checked);
    const updatedCheckboxes = acciones.map((checkbox) =>
      checkbox.idModulosistema === name ? { ...checkbox, checked } : checkbox
    );
    const newArray = updatedCheckboxes.map(({ idModulosistema, checked }) => ({
      idModulosistema,
      checked,
    }));
    const renamedArray = newArray.map(
      ({ idModulosistema: id, checked: estado }) => ({ id, estado })
    );

    setAcciones(updatedCheckboxes);
    //console.log("ver updatedCheckboxes", updatedCheckboxes);
    //console.log(newArray);
    // console.log(renamedArray);
    setRutasFinales(renamedArray);
  };

  //error
  const [error, setError] = useState(null);

  const peticionRegistrarUsuario = async (datos) => {
    try {
      /* console.log("haber token", localStorage.getItem("token")); */
      const { data } = await clienteAxios.post("/api/usuarios", datos, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setInfoPeticion(data);
      setbanderaPeticion(true);
      console.log("haber data de registrarUsuario", data);
      peticionMostrarUsuarios();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Registro exitoso",
        showConfirmButton: false,
        timer: 1500,
      });
      setError(null);
      return data;
    } catch (error) {
      console.log(error.response.data.messages.error);
      setError(error.response.data.messages.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
    }
  };

  const peticionActualizarUsuario = async (idUsuario, datos) => {
    console.log("Put peticionActualizarUsuario ->", datos);
    try {
      /* console.log("haber token", localStorage.getItem("token")); */
      const { data } = await clienteAxios.put(
        `/api/usuarios/${idUsuario}`,
        datos,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      peticionMostrarUsuarios();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const peticionMostrarUsuarios = async () => {
    try {
      /* console.log("haber token", localStorage.getItem("token")); */
      const { data } = await clienteAxios.get("/api/usuarios", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      /* console.log("haber data de peticionMostrarUsuarios", data); */
      setTodosLosUsuarios(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  //Registrar usuario
  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        nombreUsuario.trim() === "" ||
        apellidoUsuario.trim() === "" ||
        correoUsuario.trim() === "" ||
        idRol.trim() === ""
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `No puede haber un valor vacio`,
        });
        return;
      }

      const data = {
        nombreUsuario: nombreUsuario,
        correoUsuario: correoUsuario,
        apellidoUsuario: apellidoUsuario,
        idRol: idRol,
        rutas: rutasFinales,
      };
      console.log("funciona haber data", data);
      peticionRegistrarUsuario(data);

      /* setError(null); */
    } catch (error) {
      console.log(error);
    }
  };
  //modal EDITAR AQUI ES PARA PONER MAS MODULOS NO OLVIDAR
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setregistrarUsuario({
      nombreUsuario: "",
      correoUsuario: "",
      apellidoUsuario: "",
      idRol: "",
      rutas:[]
    });
  };
  const handleShow = () => setShow(true);
  const [copiaRutas, setCopiaRutas] = useState([]);
  const seleccionarUsuario = (item) => {
    console.log("estas Editando", item);
    setregistrarUsuario(item);
    setCopiaRutas(item.rutas);
    handleShow();
  };

  //modal EDITAR AQUI ES PARA PONER MAS MODULOS NO OLVIDAR
  const editarUsuario = async () => {
  //  console.log("estas editando");
    //console.log("haber id", idUsuario);
   // console.log("data editada", registrarUsuario);
   
    //console.log('copiaRutas',copiaRutas);
    try {
        const data = {
        nombreUsuario: nombreUsuario,
        correoUsuario: correoUsuario,
        apellidoUsuario: apellidoUsuario,
        idRol: idRol,
        rutas: copiaRutas,
      };

      console.log("haber data para editar", data, "id", idUsuario);
      await peticionActualizarUsuario(idUsuario, data);
    
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  //modal EDITAR AQUI ES PARA PONER MAS MODULOS NO OLVIDAR
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCheckboxChange2 = (event, index) => {
    const { checked } = event.target;
    setCopiaRutas(prevState => prevState.map((accion, i) => {
      if (i === index) {
        return { ...accion, estado: checked };
      } else {
        return accion;
      }
    }));
  };
  

  return (
    <div className="pt-4 container">
      <TabContext value={value}>
        <TabList aria-label="tabs example" onChange={handleChange}>
          <Tab label="Registrar Usuario" value="1" />
          <Tab label="Ver Usuarios" value="2" />
        </TabList>

        <TabPanel value="1">
          {" "}
          <div className="d-flex justify-content-center align-items-center ">
            <div className="container">
              {/*  <div className="row">
                <h2 className="text-primary mb-4 text-uppercase">Registrar un Usuario</h2>
                <hr />
              </div> */}

              <row>
                {!error ? (
                  <span className="text-danger">{error}</span>
                ) : (
                  <span className="text-danger text-uppercase">{error}</span>
                )}
              </row>
              <div className="row">
                <div
                  className="col-12 col-lg-12"
                  style={{
                    background: "white",
                    boxShadow: "0px 4px 25px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <div
                    style={{
                      background: "white",
                      height: "100%",
                    }}
                    className="d-flex flex-column "
                  >
                    <div style={{ background: "white" }}>
                      <img src={LogoRelix} alt="" className="mt-4 mb-4" />
                      <h3
                        style={{ background: "white" }}
                        className="text-uppercase"
                      >
                        Registrar
                      </h3>
                    </div>
                    <div>
                      <Form
                        style={{ background: "white" }}
                        className="pb-5"
                        onSubmit={(e) => manejarSubmit(e)}
                      >
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicText"
                          style={{ background: "white" }}
                        >
                          <Form.Label style={{ background: "white" }}>
                            Nombre:
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ingrese su Nombre"
                            name="nombreUsuario"
                            value={nombreUsuario}
                            onChange={(e) => actualizarInput(e)}
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicText"
                          style={{ background: "white" }}
                        >
                          <Form.Label style={{ background: "white" }}>
                            Apellido:
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ingrese su Apellido"
                            name="apellidoUsuario"
                            value={apellidoUsuario}
                            onChange={(e) => actualizarInput(e)}
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicEmail"
                          style={{ background: "white" }}
                        >
                          <Form.Label style={{ background: "white" }}>
                            Correo:
                          </Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Ingrese su Correo"
                            name="correoUsuario"
                            value={correoUsuario}
                            onChange={(e) => actualizarInput(e)}
                          />
                        </Form.Group>

                        <Form.Group
                          controlId="formGridState"
                          style={{ background: "white" }}
                        >
                          <Form.Label style={{ background: "white" }}>
                            Rol
                          </Form.Label>
                          <Form.Select
                            defaultValue="Seleccione"
                            name="idRol"
                            value={idRol}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                          >
                            <option value="" selected disabled hidden>
                              Seleccione
                            </option>
                            {roles &&
                              roles.map((usuario, i) => (
                                <option
                                  key={i}
                                  value={usuario.idRol}
                                  onChange={(e) => {
                                    actualizarInput(e);
                                  }}
                                >
                                  {usuario.nombreRol}
                                </option>
                              ))}
                          </Form.Select>
                        </Form.Group>
                        <Form.Group
                          controlId="formGridState"
                          style={{ background: "white" }}
                        >
                          <Form.Label style={{ background: "white" }}>
                            Acciones
                          </Form.Label>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          {acciones &&
                            acciones.map((accion, i) => (
                              <>
                                <label>
                                  <input
                                    key={i}
                                    type="checkbox"
                                    name={accion.idModulosistema}
                                    checked={accion.checked}
                                    onChange={handleCheckboxChange}
                                  />
                                  {accion.nombreModulo}
                                </label>
                                <br />
                              </>
                            ))}

                          {/*  <br />
                          <label>
                            <input
                              type="checkbox"
                              name="moduloRegistrarFichaTecnica"
                              value={moduloRegistrarFichaTecnica}
                              onChange={(e) => {
                                actualizarCheckout(e);
                              }}
                            /> */}
                        </Form.Group>

                        <Button
                          variant="info w-100 mt-4 text-white"
                          type="submit"
                          style={{
                            background:
                              "linear-gradient(180deg, #1478A3 0%, rgba(37, 182, 244, 0.51) 100%)",
                            border: "none",
                          }}
                        >
                          Registrar
                        </Button>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel value="2">
          {" "}
          <div className="container">
            {/*         <h3 className="text-success mt-5">Lista de usuarios creados</h3> */}
            <hr />
            {todosLosUsuarios.length > 0 ? (
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Rol</th>
                    <th>Correo</th>
                    <th>Modulos</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {todosLosUsuarios.map((usuario, i) => (
                    <tr key={i}>
                      <td>{usuario.nombreUsuario}</td>
                      <td>{usuario.apellidoUsuario}</td>
                      <td>{usuario.nombreRol}</td>
                      <td>{usuario.correoUsuario}</td>
                      {usuario.rutas.length <= 0 ? (
                        <td> No tiene Modulos</td>
                      ) : (
                        <td>
                          {usuario.rutas.map((ruta, i) => (
                            <span key={i}>
                              {ruta.estado === true ? (
                                <span className="badge bg-primary mx-1">
                                  {ruta.nombreModulo}
                                </span>
                              ) : (
                                <span className="badge bg-danger mx-1">
                                  {ruta.nombreModulo}
                                </span>
                              )}
                            </span>
                          ))}
                        </td>
                      )}
                      <td>
                        <button
                          className="btn btn-warning"
                          onClick={() => seleccionarUsuario(usuario)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-danger text-center">
                No ha creado ningun usuario aun
              </p>
            )}

            <Modal show={show} onHide={handleClose} backdrop="static">
              <Modal.Header>
                <div>
                  <h3>Editar Usuario</h3>
                </div>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <label>Id</label>
                  <input
                    type="text"
                    className="form-control"
                    name="idUsuario"
                    value={registrarUsuario && registrarUsuario.idUsuario}
                    disabled
                  />
                  <br />
                  <label>Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombreUsuario"
                    value={registrarUsuario && registrarUsuario.nombreUsuario}
                    onChange={(e) => actualizarInput(e)}
                  />
                  <br />
                  <label>Apellido</label>
                  <input
                    type="text"
                    className="form-control"
                    name="apellidoUsuario"
                    value={registrarUsuario && registrarUsuario.apellidoUsuario}
                    onChange={(e) => actualizarInput(e)}
                  />
                  <br />
                  <label>Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    name="correoUsuario"
                    value={registrarUsuario && registrarUsuario.correoUsuario}
                    onChange={(e) => actualizarInput(e)}
                  />
                  <br />
                  <label>Rol</label>
                  <Form.Select
                    defaultValue="Seleccione"
                    name="idRol"
                    value={registrarUsuario && registrarUsuario.idRol}
                    onChange={(e) => {
                      actualizarInput(e);
                    }}
                  >
                    {roles &&
                      roles.map((usuario, i) =>
                        usuario.nombreRol == registrarUsuario.nombreRol ? (
                          <option
                            key={i}
                            value={usuario.idRol}
                            selected
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                          >
                            {registrarUsuario.nombreRol}
                          </option>
                        ) : (
                          <option
                            key={i}
                            value={usuario.idRol}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                          >
                            {usuario.nombreRol}
                          </option>
                        )
                      )}
                  </Form.Select>
                  <div className="text-warning my-2">
                    No se olvide de seleccionar modulos
                  </div>
                  {copiaRutas &&
                    copiaRutas.map((accion, i) => (
                      <>
                        <label>
                          <input
                            key={i}
                            type="checkbox"
                            name={accion.rutaModulo}
                            checked={accion.estado}
                            onChange={(event) =>
                              handleCheckboxChange2(event, i)
                            }
                          />
                          {accion.nombreModulo}
                        </label>
                        <br />
                      </>
                    ))}

                  {/*    <br />
                  <label>
                    <input
                      type="checkbox"
                      name="moduloRegistrarFichaTecnica"
                      checked={
                        listaChecks && listaChecks.moduloRegistrarFichaTecnica
                      }
                      onChange={(e) => {
                        actualizarCheckout(e);
                      }}
                    />
                    Registrar Ficha Técnica de Proyecto
                  </label>
                  <br /> */}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button
                  className="btn btn-primary"
                  onClick={() => editarUsuario()}
                >
                  Actualizar
                </button>
                <button className="btn btn-danger" onClick={handleClose}>
                  Cancelar
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        </TabPanel>
      </TabContext>
    </div>
  );
}

export default Registrar;
