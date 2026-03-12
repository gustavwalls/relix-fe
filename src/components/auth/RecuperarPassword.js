import React, { useContext, useEffect, useState } from "react";
import LogoRelix from "../../img/relixjpgg.png";
import Password from "../../img/password.svg";
import { Form, Button } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import authContext from "../../context/autenticacion/authContext";
import alertContext from "../../context/alertas/alertaContext";
function RecuperarPassword() {
  /////////////////////////////////
  const autentificaciones = useContext(authContext);
  const { mensaje, actualizarPassword, cambioClave } = autentificaciones;
  ///////////////////////////////////

  /*  useEffect(() => {
    if (mensaje) {
      mostrarAlerta(mensaje.msg, mensaje.categoria);
    }
  }, [mensaje]); */

  const [recuperarPassword, setRecuperarPassword] = useState({
    correoUsuario: "",
    codigo: "",
    passwordUsuario: "",
    confirmarClave: "",
  });
  const {
    correoUsuario,
    codigo,
    passwordUsuario,
    confirmarClave,
  } = recuperarPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    //error
    if (
      correoUsuario.trim() === "" ||
      codigo.trim() === "" ||
      passwordUsuario.trim() === "" ||
      confirmarClave.trim() === ""
    ) {
      alert("Todos los campos son obligatorios");

      //console.log("error");
      return;
    }
    if (passwordUsuario !== confirmarClave) {
      alert("Passwords diferentes");

      //console.log("error");
      return;
    }
    actualizarPassword({
      correoUsuario,
      codigo,
      passwordUsuario,
      confirmarClave,
    });
    // console.log(recuperarPassword);
    setRecuperarPassword({
      correoUsuario: "",
      codigo: "",
      passwordUsuario: "",
      confirmarClave: "",
    });
  };

  const enviarInput = (e) => {
    setRecuperarPassword({
      ...recuperarPassword,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="container">
          <div className="row">
            <div
              className="col-12 col-lg-6"
              style={{
                background: "white",
                boxShadow: "0px 4px 25px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div className="d-flex flex-column ">
                <div>
                  <div style={{ background: "white" }}>
                    <img src={LogoRelix} alt="" className="mt-4 mb-4" />
                    <h3 style={{ background: "white" }}>Cambiar Contraseña</h3>
                  </div>

                  <div>
                    <Form
                      style={{ background: "white" }}
                      className="pb-3"
                      onSubmit={handleSubmit}
                    >
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
                          onChange={(e) => enviarInput(e)}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Password antigua:
                        </Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Ingrese su codigo"
                          name="codigo"
                          value={codigo}
                          onChange={(e) => enviarInput(e)}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Clave Nueva:
                        </Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Ingrese su clave nueva"
                          name="passwordUsuario"
                          value={passwordUsuario}
                          onChange={(e) => enviarInput(e)}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Confirmar Clave:
                        </Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Confirme clave"
                          name="confirmarClave"
                          value={confirmarClave}
                          onChange={(e) => enviarInput(e)}
                        />
                      </Form.Group>
                      <Button
                        variant="info w-100 mt-2 text-white"
                        style={{
                          background:
                            "linear-gradient(180deg, #1478A3 0%, rgba(37, 182, 244, 0.51) 100%)",
                          border: "none",
                        }}
                        // className="btn btn-success mb-2 w-100"
                        // to={`/registrar`}
                        type="submit"
                      >
                        Cambiar Clave
                      </Button>
                    </Form>
                    {/* {alerta ? (
                      <div className={`${alerta.categoria}`} role="alert">
                        {alerta.msg}
                      </div>
                    ) : null} */}
                    <div className="d-flex justify-content-end mb-3">
                      <Link to="/">Regresar</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6 mx-0 px-0 ">
              <img
                src={Password}
                alt=""
                style={{
                  background:
                    "linear-gradient(180deg, #1478A3 0%, rgba(37, 182, 244, 0.51) 100%)",
                  boxShadow: "0px 4px 25px rgba(0, 0, 0, 0.15)",
                  width: "100%",
                  height: "100%",
                  borderRadius: "0 10px 10px 0",
                }}
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecuperarPassword;
