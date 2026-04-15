import React, { useState } from "react";
import clienteAxios from "../../config/axios";
import { useEffect } from "react";
import {
  Accordion,
  Button,
  Card,
} from "react-bootstrap";
import TitlePage from "../../shared/TitlePage";
import FichaTecnica from "./Modulo-Comercial/FichaTecnica/FichaTecnica";
import Cargando from "../../view/Cargando";
import FichasTecnicasAcordeon from "../../shared/FichasTecnicasAcordeon";

function EdicionesFichasTecnicas() {
  const [loading, setLoading] = useState(false);
  const [todasLasFichasTecnicas, setTodasLasFichasTecnicas] = useState([]);
  const [fichaTecnica, setFichaTecnica] = useState({});
  const {
    idDepartamento,
    idProvincia,
  } = fichaTecnica;
  

  const obtenerTodasLasFichasTecnicas = async () => {
    try {
      setLoading(true)
      const { data } = await clienteAxios.get("/api/fichatecnica");
      setLoading(false)
       setTodasLasFichasTecnicas(data);
      
      return data;
    } catch (error) {
      console.log(error);
      setTodasLasFichasTecnicas([]);
      setLoading(false)
    }
    setLoading(false)
  };
  useEffect(() => {
    obtenerTodasLasFichasTecnicas();
  }, []);


  const [mostarFicha, setMostarFicha] = useState(false);
  const btnVerTabla = async (ficha, indice) => {
    console.log("ver ficha", ficha);
    try {
      const { data } = await clienteAxios.get("/api/v1/formas-pagos");
      const match = data.find(function (f) { return f.codFormaPago === ficha.NIDE_FORMA_PAGO; });
      const fichaConFormaPago = match ? Object.assign({}, ficha, { idFormaPago: match.idFormaPago }) : ficha;
      setFichaTecnica(fichaConFormaPago);
    } catch (error) {
      console.log("Error al obtener formas de pago", error);
      setFichaTecnica(ficha);
    }
    setMostarFicha(true);
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
  return (
    
  <>
     {loading && <Cargando />}
    <div className="container pt-4 ">
      <TitlePage title=" Editar Ficha Técnica de Proyecto" />
      <div className="row">
        <FichasTecnicasAcordeon title ='Fichas tecnicas para editar' loading={loading}
        fichasTecnicas={todasLasFichasTecnicas} btnVerTabla={btnVerTabla}
        />
      </div>
      <div className="row">
        {!mostarFicha ? (
          <p className="text-uppercase h2 fw-bolder text-primary">
            ☝ Seleccione una ficha tecnica 👆
          </p>
        ) : (
          <p className="text-uppercase text-success h2 fw-bolder">
            👉 {fichaTecnica.nombreFichatecnica}-{" "}
            {fichaTecnica.numFichatecnica}
          </p>
        )}
      </div>
      {mostarFicha && (
        <FichaTecnica key={fichaTecnica.idFichatecnica} fichaTecnica={fichaTecnica} idFichaTecnica={fichaTecnica.idFichatecnica} idDepartamento={idDepartamento} idProvincia={idProvincia} setMostarFicha={setMostarFicha} obtenerTodasLasFichasTecnicas={obtenerTodasLasFichasTecnicas}/>
      )}
    </div>
  </>
  );
}

export default EdicionesFichasTecnicas;
