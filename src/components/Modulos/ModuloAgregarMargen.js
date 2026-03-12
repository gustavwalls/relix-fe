import React, { useState } from "react";
import { useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
function ModuloAgregarMargen() {
  const [inputMargen, setInputMargen] = useState("");

  const [listaMargenes, setListaMargenes] = useState({});
  const peticionActualizarMargen = async (datos) => {
    console.log("Put peticionActualizarMargen ->", datos);
    try {
      /* console.log("haber token", localStorage.getItem("token")); */
      const { data } = await clienteAxios.put(`/margen`, datos);
      console.log("ver data", data);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Marge exitoso",
        showConfirmButton: false,
        timer: 1500,
      });
      peticionListarMargen()
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const peticionListarMargen = async () => {
    try {
      const { data } = await clienteAxios.get(`/margen`);
      console.log("ver data peticionListarMargen =>", data);
      setListaMargenes(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    peticionListarMargen();
  }, []);

  const manejarSubmit = async(e) => {
    e.preventDefault();
    if (inputMargen === "") {
      alert("No puede ingresar un margen vacio");
      return;
    }
    {
      //console.log("margen", inputMargen);
      const idUsuario = localStorage.getItem("user");
     // console.log("haber idUsuario ", idUsuario);
      const data = {
        margen: inputMargen,
        usuario: idUsuario,
      };
     // console.log("data a enviar", data);
     await peticionActualizarMargen(data);
    }
  };

  return (
    <div className="container pt-4 ">
      <div className="my-4 text-center container ">
        <h4 className=" fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
          Actualizar Margen
        </h4>
      </div>
      <div className="row justify-content-center">
        <div className="col-12 col-md-4 col-lg-4">
            <p className="text-uppercase text-success">👍 por favor decimales con "." (punto)</p>
          <Form
            className="border border-1 rounded p-3"
            onSubmit={(e) => manejarSubmit(e)}
          >
            <Form.Group>
              <Form.Label>Actualizar margen</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su margen"
                onChange={(e) => setInputMargen(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary mt-2" type="submit">
              Actualizar
            </Button>
          </Form>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-4 col-lg-4">
          <p className="h3 fw-bold text-primary">Margen actual</p>
          {listaMargenes ? (
            <p className="h3 fw-bold text-success">
              {" "}
              👉 {listaMargenes.MARGEN_ACTUAL}
            </p>
          ) : (
            <p className="h3 fw-bold text-danger">No hay margenes</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModuloAgregarMargen;
