import React, { useState } from "react";
import { useRef } from "react";
import * as XLSX from "xlsx";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";

function RegistrarGuiasVsPedido() {
  const ref = useRef();

  const [noErrores, setNoErrores] = useState([]);

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
      registrarGuiasVsPedidos(items); // ESTO ES LO Q SE ENVIA PRIMERO AL BACKEND Y SE REGRESA EN tablaDatos
    });
  };

  const registrarGuiasVsPedidos = async (datos) => {
    console.log("envio estos datos =>", datos);
    try {
      const respuesta = await clienteAxios.post(
        "/api/RegistrarGuiaPedido",
        datos
      );
      console.log("POST de registrarGuiasVsPedidos ===>", respuesta);

      //setFichasTecnicas(respuesta.data);
      if (respuesta.data.length > 0) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Carga exitosa",
          showConfirmButton: false,
          timer: 2500,
        });
        setNoErrores(respuesta.data);
      }
      return respuesta.data;
    } catch (error) {
      console.log("error ==>", error.response.data.messages.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
      setNoErrores([]);
    }
  };

  const [excel, setExcel] = useState("");
  function cargarExcel(e) {
    console.log(e.target.files);
    setExcel(e.target.files[0]);
  }

  function enviarData() {
    const formData = new FormData();
    formData.append("excel", excel);
    clienteAxios.post("/api/RegistrarGuiaPedido", formData).then((res) => {
      console.log(res);
    });
  }

  return (
    <div className="container-fluid pt-4">
      <div className="my-4 text-center container ">
        <h4 className=" fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
          Registro de guias vs pedido
        </h4>
      </div>
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="alert alert-warning" role="alert">
            Estamos en pruebas <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
  <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
</svg>
          </div>
        </div>
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
        /*     onChange={cargarExcel} */
          />
        {/*   <button className="btn btn-primary my-3" onClick={enviarData}>
            Cargar
          </button> */}
        </div>
      </div>

      {noErrores.length > 0 && (
        <div className="row mt-4">
          <h4 className="text-success text-uppercase">Registro exitoso </h4>

          {/*  {errores.map((error, i) => (
            <p className="text-uppercase" key={i}>
              {error}
            </p>
          ))} */}
        </div>
      )}
    </div>
  );
}

export default RegistrarGuiasVsPedido;
