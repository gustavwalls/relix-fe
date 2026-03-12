import React, { useState } from "react";
import { useRef } from "react";
import * as XLSX from "xlsx";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
function RegistrarPartidasySubpartidas() {
  const ref = useRef();

  const [errores, setErrores] = useState([]);

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
      /* const itemsFinalesConId = items.map((item) => ({
        ...item,
        idFichatecnica: fichaTecnica.idFichatecnica,
      }));
      console.log("ver agregarId", itemsFinalesConId);
      setCargaDelExcel(itemsFinalesConId); */
      registrarPartidasSubpartidas(items); // ESTO ES LO Q SE ENVIA PRIMERO AL BACKEND Y SE REGRESA EN tablaDatos
    });
  };
  /* para importar un excel y convertilo en un array de objetos */
  const registrarPartidasSubpartidas = async (datos) => {
    console.log("envio estos datos =>", datos);
    try {
      const respuesta = await clienteAxios.post(
        "/registrarPartidaSubpartida",
        datos
      );
      console.log("POST de registrarPartidasSubpartidas ->", respuesta.data);

      //setFichasTecnicas(respuesta.data);
      if (respuesta.data.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Archivo con errores`,
        });
        setErrores(respuesta.data);
      } else {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Carga exitosa",
          showConfirmButton: false,
          timer: 2500,
        });
      }
      return respuesta.data;
    } catch (error) {
      console.log(error.response.data.messages.error);
  
    }
  };
  
  return (
    <div className="container-fluid pt-4">
      <div className="my-4 text-center container ">
        <h4 className=" fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
          Registro de partidas y subpartidas
        </h4>
      </div>

      <div className="row border border-secondary bg-bg shadow p-3 rounded mx-2 mt-3">
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

      {errores.length > 0 && (
        <div className="row mt-4">
          <h4 className="text-danger text-uppercase">Informacion de subida :</h4>

          {errores.map((error, i) => (
            <p className="text-uppercase" key={i}>
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default RegistrarPartidasySubpartidas;
