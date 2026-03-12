import React, { useState } from "react";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import { useEffect } from "react";
import FichaTecnica from "./FichaTecnica";

import * as XLSX from "xlsx";
import { useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineSave } from "react-icons/ai";
function VerFichasTecnicasDiseñador() {
  const [fichasTecnicas, setFichasTecnicas] = useState([]);
  const [obtenerDatosTabla, setObtenerDatosTabla] = useState([]);
  const [fichaTecnica, setFichaTecnica] = useState({});
  const [existeFichaTecnica, setExisteFichaTecnica] = useState(false);
  const [cargaDelExcel, setCargaDelExcel] = useState([]);
  const [erroresExcel, setErroresExcel] = useState([]);
  const ref = useRef();

  const obtenerTodasLasFichasTecnicas = async () => {
    try {
      const respuesta = await clienteAxios.get("/api/fichatecnica");
      /*  console.log("respuesta de obtenerTodasLasFichasTecnicas", respuesta.data); */
      setFichasTecnicas(respuesta.data);
      return respuesta.data;
    } catch (error) {
      console.log(error.response.data.messages.error);
    }
  };

  useEffect(() => {
    obtenerTodasLasFichasTecnicas();
  }, []);

  const [cambiarColor, setCambiarColor] = useState(false);

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
     /*  console.log("haber itemsFinales", items); */
      ref.current.value = "";
      const itemsFinalesConId = items.map((item) => ({
        ...item,
        idFichatecnica: fichaTecnica.idFichatecnica,
      }));
    /*   console.log("ver agregarId", itemsFinalesConId); */
      const ArraySinEspacios = itemsFinalesConId.map((item)=>{return {...item,DESCRIPCIÓN:item.DESCRIPCIÓN.trim()}})
      //const ArraySinEspaciosSinSlash = ArraySinEspacios.map((item)=>{return item.DESCRIPCIÓN.replaceAll("", "XDD") })
      setCargaDelExcel(ArraySinEspacios);
     // console.log('Esto ENVIO AL BACKEND',ArraySinEspacios);
      //console.log('Esto ENVIO AL BACKEND SIN SLASH',ArraySinEspaciosSinSlash);
      registrarDetalleFichaDisenador(ArraySinEspacios);// ESTO ES LO Q SE ENVIA PRIMERO AL BACKEND Y SE REGRESA EN tablaDatos
      /* setInterval(() => {
        obtenerDetalleFichaTecnicaDisenador(fichaTecnica.idFichatecnica);
      }, 2500); */
    });
  };
  /* para importar un excel y convertilo en un array de objetos */

  //Registrar detalle ficha dise;ador

  const registrarDetalleFichaDisenador = async (datos) => {
    try {
      const respuesta = await clienteAxios.post("/detallefichatecnica", datos);
      console.log("POST de registrarDetalleFichaDisenador ->", respuesta.data);
      console.log(
        "POST de registrarDetalleFichaDisenador errores ->",
        respuesta.data.Errores
      );
      //setFichasTecnicas(respuesta.data);
      if (respuesta.data.Errores.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Archivo con errores`,
        });
        setObtenerDatosTabla(respuesta.data.Detalle);
        setErroresExcel(respuesta.data.Errores);
      } else {
        setObtenerDatosTabla(respuesta.data.Detalle);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Carga exitosa",
          showConfirmButton: false,
          timer: 2500,
        });
        setErroresExcel([]);
      }
      return respuesta.data;
    } catch (error) {
      console.log(error.response.data.messages.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
    }
  };

  //Tabla con material UI
  const columns = [
    { field: "id", headerName: "ID", width: 90, hide: true },
    {
      field: "itemDetallefichatecnica",
      headerName: "N item",
      width: 80,
      //editable: true,
    },
    {
      field: "moduloDetallefichatecnica",
      headerName: "Modulo",
      width: 150,
      editable: true,
    },
    {
      field: "partidaDetallefichatecnica",
      headerName: "Partida",
      width: 170,
      editable: true,
    },
    {
      field: "subpartidaDetallefichatecnica",
      headerName: "SubPartida",
      width: 130,
      editable: true,
    },
    {
      field: "marcaDetallefichatecnica",
      headerName: "Marca",
      width: 130,
      editable: true,
    },
    {
      field: "codigosoftcomProducto",
      headerName: "Codigo ERP",
      width: 140,
      editable: true,
    },
    {
      field: "codigoproveedorDetallefichatecnica",
      headerName: "Codigo Proveedor",
      width: 180,
       editable: true,
    },
    {
      field: "descripcionDetallefichatecnica",
      headerName: "Descripcion",
      width: 400,
       editable: true,
    },
    {
      field: "cantidadDetallefichatecnica",
      headerName: "Cantidad",
      width: 110,
      // editable: true,
    },
  ];

  const rows = obtenerDatosTabla.map((dato, i) => ({
    ...dato,
    id: i + 1,
  }));

  const actualizarEnvioDisenador = async (idFichaTecnica) => {
    console.log("se envio este id", idFichaTecnica);
    try {
      const respuesta = await clienteAxios.put(
        `/api/FichaTecnicaDisenador/${idFichaTecnica}`
      );
      console.log("respuesta de actualizarEnvioDisenador", respuesta.data);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${respuesta.data.MENSAJE}`,
        showConfirmButton: false,
        timer: 2500,
      });
      obtenerTodasLasFichasTecnicas();
      setExisteFichaTecnica(false);
      // setFichasTecnicas(respuesta.data);
      return respuesta.data;
    } catch (error) {
      console.log(error.response.data.messages.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
      setExisteFichaTecnica(true);
    }
  };
  const btnActualizarEnvioDisenador = () => {
    console.log("funciona");
    console.log(
      "haber ficha tecnica",
      fichaTecnica,
      "id",
      fichaTecnica.idFichatecnica
    );
    actualizarEnvioDisenador(fichaTecnica.idFichatecnica);
    obtenerTodasLasFichasTecnicas();
    setExisteFichaTecnica(false);
  };
  return (
    <div className="container-fluid pt-4">
      <div className="mb-5 text-center container ">
        <h4 className=" fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
        Ficha Técnica de Proyecto - Diseñador
        </h4>
      </div>
      <div className="row">
        <div className="col-12 col-md-12 col-lg-12 col-xl-9 mb-3">
          {existeFichaTecnica ? (
            <>
              <span className="h3 text-uppercase mb-3">
                {fichaTecnica.nombreFichatecnica} -{" "}
                {fichaTecnica.numFichatecnica}
              </span>
              {fichaTecnica.enviodiseniadorFichatecnica == "0" && (
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
              )}

              <div
                style={{ height: "550px", overflow: "auto" }}
                className="mt-5"
              >
                {obtenerDatosTabla.length >= 0 && (
                  <DataGrid
                    columns={columns}
                    //columns={[{ field: "idDetallefichatecnica" }]}
                    rows={rows}
                    pageSize={15}
                    rowsPerPageOptions={[5]}
                    // checkboxSelection
                    //disableSelectionOnClick
                  />
                )}
              </div>
              <div>
                {erroresExcel.length > 0 && (
                  <>
                    <h4>Errores</h4>
                    {erroresExcel.map((item) => (
                      <p className="text-danger upper-text">{item}</p>
                    ))}
                  </>
                )}
              </div>
              {fichaTecnica.enviodiseniadorFichatecnica == "0" && (
                <div>
                  <button
                    className="btn btn-success btn btn-sm mt-3"
                    onClick={() => btnActualizarEnvioDisenador()}
                  >
                    <AiOutlineSave className="h3 m-0 p-0 pe-1 " />
                    Guardar
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="row">
              <div className="col-12 col-md-12">
                <p className="border border-secondary bg-bg shadow p-3 rounded mx-2 text-danger ">
                  Por favor seleccione{" "}
                  <span className="text-success">
                    "Ver Lista de Materiales"
                  </span>
                  de alguna ficha tecnica
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-md-12 col-lg-12 col-xl-3 mt-3">
          <ul
            className="list-group "
            style={{ height: "700px", overflow: "auto" }}
          >
            {fichasTecnicas.length <= 0 ? (
              <span className="text-danger text-uppercase">
                No hay fichas tecnicas
              </span>
            ) : (
              fichasTecnicas.map((fichaTecnica, i) => (
                <FichaTecnica
                  fichaTecnica={fichaTecnica}
                  key={i}
                  i={i}
                  setCambiarColor={setCambiarColor}
                  setObtenerDatosTabla={setObtenerDatosTabla}
                  setFichaTecnica={setFichaTecnica}
                  setExisteFichaTecnica={setExisteFichaTecnica}
                  setErroresExcel={setErroresExcel}
                />
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default VerFichasTecnicasDiseñador;
