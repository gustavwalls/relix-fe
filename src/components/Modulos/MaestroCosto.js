import React, { useRef } from 'react'
import { useState } from 'react';
import { Button, Modal, Row, Col, Form } from "react-bootstrap";
import { actualizarCosto } from '../services/apisMaestroCosto';
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
function MaestroCosto() {
    const ref = useRef();

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
        actualizarCosto(items); //para registrar productos en el excel LISTO
      });
    };
  

    ///AGREGAR MANUALMENTE

 /*  const [actualizarProducto, setActualizarProducto] = useState({
    CODIGO: "",
    SIST_REAL: "",
  });
  const {
    CODIGO,
    SIST_REAL,
  } = actualizarProducto;
  const agarrarInput = (e) => {
    setActualizarProducto({ ...actualizarProducto, [e.target.name]: e.target.value });
  }; */

/*   const handleSubmit = (e) => {
    e.preventDefault();
    if (
        CODIGO == "" ||
      SIST_REAL == "" 
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No puede haber espacios en blanco",
      });
      return;
    }
    console.log("funciona");
    registroProducto(nuevoProducto); // api para registrar producto Listo
    setNuevoProducto({
        CODIGO: "",
        SIST_REAL: "",
    });
  }; */

  return (
    <div className="container-fluid pt-4">
        <div className="my-4 text-center container ">
        <h4 className=" fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
          Maestro Costo
        </h4>
      </div>

      <div className="row border border-secondary bg-bg shadow p-3 rounded mx-2 mt-3 mb-5">
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


    </div>
  )
}

export default MaestroCosto