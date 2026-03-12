import React, { useContext, useEffect, useState } from "react";
import LogoRelix from "../../img/relixjpgg.png";
import correoPassword from "../../img/correopassword.svg";
import { Form, Button } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";

import authContext from "../../context/autenticacion/authContext";
import alertContext from "../../context/alertas/alertaContext";

function OlvidastePassword() {
  /*  const alertascontext = useContext(alertContext);
  const { alerta, mostrarAlerta } = alertascontext; */
  /////////////////////////////////
  const autentificaciones = useContext(authContext);
  const { enviarCorreoPassword } = autentificaciones;
  ///////////////////////////////////

  /*  useEffect(() => {
    if (mensaje) {
      mostrarAlerta(mensaje.msg, mensaje.categoria);
    }
  }, [mensaje]);
 */
  const [enviarCorreo, setEnviarCorreo] = useState({
    correoUsuario: "",
  });
  const { correoUsuario } = enviarCorreo;

  const enviarInput = (e) => {
    setEnviarCorreo({
      ...enviarCorreo,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (correoUsuario.trim() === "") {
      /* mostrarAlerta("Todos los campos son obligatorios", "alert alert-danger"); */
      alert("todos los campos son obligatorios");
      return;
    }
    //console.log(enviarCorreo);

    enviarCorreoPassword({ correoUsuario });

    /*  mostrarAlerta("Cambio de clave Exitosa", "alert alert-success"); */
    setEnviarCorreo({ correoUsuario: "" });
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
                    <h3 style={{ background: "white" }}>
                      Recuperar Contraseña
                    </h3>
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
                        Recuperar Clave
                      </Button>
                    </Form>
                    {/*  {alerta ? (
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
                src={correoPassword}
                alt=""
                style={{
                  borderRadius: "0 10px 10px 0",
                  width: "100%",
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

export default OlvidastePassword;
