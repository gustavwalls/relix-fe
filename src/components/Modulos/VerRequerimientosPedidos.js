import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import clienteAxios from "../../config/axios";
import { peticionObtenerRqPedidos } from "../services/apisRqPedidos";

function VerRequerimientosPedidos() {
  const [rqPedidos, setRqPedidos] = useState([]);

  const funcionObtenerRqPedidos = async () => {
    const datos = await peticionObtenerRqPedidos();
    setRqPedidos(datos);
      console.log('datos =>',datos)
  };

  useEffect(() => {
    funcionObtenerRqPedidos();
  }, []);

  const descargarExcel = async (codigorequerimiento) => {
    console.log("codigorequerimiento", codigorequerimiento);
    console.log("entraste a reportePresupuesto");
    const fecha = new Date();
    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;
    const anoActual = fecha.getFullYear();
    try {
      var config = {
        responseType: "arraybuffer",
      };
      const resultado = await clienteAxios.get(
        `/api/exportarPlantillaCargaPedido/${codigorequerimiento}`,
        config
      );
      console.log("respuesta de descargarExcel", resultado.data);

      const url = URL.createObjectURL(
        new Blob([resultado.data], {
          type: "application/vnd.ms-excel",
        })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `CargaDePedido ${hoy}_${mesActual}_${anoActual}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error.response.data.messages.error);
    }
    
  };


  
  return (
    <div className="container-fluid pt-4">
      <div className="mb-5 text-center container ">
        <h4 className=" fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
          Requerimientos pedidos
        </h4>
      </div>

      <div className="row">
        <div className="col-12 col-md-12 col-lg-12 col-xl-9 mb-3">En desarrollo</div>

        <div className="col-12 col-md-12 col-lg-12 col-xl-3 mt-3">
          <ListGroup defaultActiveKey="#link1">
            {rqPedidos.length > 0 ? (
              rqPedidos.map((item, i) => (
                <ListGroup.Item
                key={i}
                href={`#${i}`}
                className='text-uppercase text-center'
                >
                  {item.agenciaReqPedido}
                  <Button  variant="success mx-2" size="sm" onClick={()=>descargarExcel(item.numReqPedido)}>Descargar</Button>
                </ListGroup.Item>
              ))
            ) : (
              <div className="alert alert-danger text-uppercase" role="alert">
                No hay Requerimientos de pedidos
              </div>
            )}
          </ListGroup>
        </div>
      </div>
    </div>
  );
}

export default VerRequerimientosPedidos;
