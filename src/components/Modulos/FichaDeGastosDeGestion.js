import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { Accordion, Button, Form, Spinner, Tab, Tabs } from "react-bootstrap";
import Cargando from "../../view/Cargando";
import clienteAxios from "../../config/axios";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import FichaDeGasto from "./FichasGastos/FichaDeGasto";
const FichaDeGastosDeGestion = () => {
  const [fichasTecnicas, setFichasTecnicas] = useState([]);
  const [fichaTecnica, setFichaTecnica] = useState({});
  const [listaGastos, setListaGastos] = useState(null);
  const [loading, setLoading] = useState(false);

  const obtenerTodasLasFichasTecnicas = async () => {
    try {
      const respuesta = await clienteAxios.get("/api/fichatecnica");
      /*  console.log("respuesta de obtenerTodasLasFichasTecnicas", respuesta.data); */
      setFichasTecnicas(respuesta.data);
      return respuesta.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerTodasLasFichasTecnicas();
  }, []);

  const obtenerListaGastos = async (idFicha) => {
    try {
      const respuesta = await clienteAxios.get(`/gastos/${idFicha}`);
      console.log("respuesta de obtenerListaGastos", respuesta.data);
      // setFichasTecnicas(respuesta.data);
      console.log("respuesta obtenerListaGastos =>", respuesta.data);
      setListaGastos(respuesta.data);
      return respuesta.data;
    } catch (error) {
      console.log(error.response.data.messages.error);
    }
  };
  const btnVerFichaGastos = (fichaTecnica, indice) => {
    console.log("ver ficha tecnica", fichaTecnica.idFichatecnica);
    setFichaTecnica(fichaTecnica);
    obtenerListaGastos(fichaTecnica.idFichatecnica);
    setOpcion(0);
    let lista = document.querySelectorAll(".cambiarcolores");
    lista.forEach((item, i) => {
      if (i === indice) {
        item.classList.add("bg-secondary");
        item.classList.add("text-white");
      } else {
        item.classList.remove("bg-secondary");
        item.classList.remove("text-white");
      }
    });
  };

  const [opcion, setOpcion] = useState(0);
  return (
    <div className="container-fluid pt-4 ">
      <div className="my-4 text-center container ">
        <h4 className=" fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
          Fichas de gastos de gestion
        </h4>
      </div>
      <div className="row">
        <Accordion defaultActiveKey="0" className="mb-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Fichas tecnicas</Accordion.Header>
            <Accordion.Body>
              <div
                className="row p-3"
                style={{ height: "300px", overflow: "auto" }}
              >
                {fichasTecnicas.length <= 0 ? (
                  <span className="text-danger text-uppercase">
                    No hay fichas tecnicas
                  </span>
                ) : (
                  fichasTecnicas.map((fichaTecnica, i) => (
                    <div className="col-12 col-md-3 col-lg-3 mb-3" key={i}>
                      <Card className="cambiarcolores">
                        <Card.Body>
                          <Card.Title className="text-uppercase">
                            {" "}
                            <span>{fichaTecnica.nombreFichatecnica}</span>-{" "}
                            {fichaTecnica.numFichatecnica}
                          </Card.Title>
                          <Card.Subtitle className="mb-2  text-uppercase border border text-center rounded p-2">
                            {fichaTecnica.estadoFichaproyecto}
                          </Card.Subtitle>

                          <Button
                            className="btn btn-success mx-2 py-0 text-uppercase"
                            onClick={() => btnVerFichaGastos(fichaTecnica, i)}
                          >
                            ficha de gastos
                          </Button>
                        </Card.Body>
                      </Card>
                    </div>
                  ))
                )}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      <div className="row">
        <div className="col-12 col-md-12 col-lg-12 col-xl-12 mb-3">
          {listaGastos ? (
            <FichaDeGasto
              listaGastos={listaGastos}
              fichaTecnica={fichaTecnica}
              obtenerListaGastos={obtenerListaGastos}
              setLoading={setLoading}
              loading={loading}
              setOpcion={setOpcion}
              opcion={opcion}
            />
          ) : (
            <span>Seleccione ficha de gasto</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FichaDeGastosDeGestion;
