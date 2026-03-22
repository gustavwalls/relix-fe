import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import clienteAxios from "../../../config/axios";
import Swal from "sweetalert2";
import { FormGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
function FichaDeGasto({
  listaGastos,
  fichaTecnica,
  setLoading,
  loading,
  obtenerListaGastos,
  opcion,
  setOpcion,
}) {
  const {
    CostoDisenio,
    DetalleGastos,
    SubTotalGastos,
    IndicadorPartida,
    IndicadorSubPartida,
  } = listaGastos;

  const peticionActualizarMontos = async (datos) => {
    console.log("datos peticionActualizarMontos ->", datos);
    try {
      /* console.log("haber token", localStorage.getItem("token")); */
      // setLoading(true);
      const { data } = await clienteAxios.put(`/gastos`, datos, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      console.log("Put de peticionActualizarMontos ->", data);
      //await obtenerTodasLasFichasTecnicas();
      //peticionMostrarUsuarios();
      await obtenerListaGastos(fichaTecnica.idFichatecnica);
      //setLoading(false);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${data}`,
        showConfirmButton: false,
        timer: 2700,
      });

      return data;
    } catch (error) {
      console.log(error.response.data.messages.error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
      // setLoading(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90, hide: true },
    {
      field: "nomGasto",
      headerName: "Nombre gasto",
      width: 250,
      //editable: true,
      headerAlign: "center",
    },
    {
      field: "montoAplicado",
      headerName: "$ Aplicado",
      width: 150,
      editable: true,
      headerAlign: "center",
    },
    {
      field: "porcentajeAplicado",
      headerName: "% aplicado",
      width: 150,
      editable: true,
      headerAlign: "center",
    },
    {
      field: "SUBTOTAL",
      headerName: "Sub total",
      width: 150,
      headerAlign: "center",
      //editable: true,
    },
    {
      field: "Acciones",
      width: 150,
      renderCell: (cellValues) => {
        return (
          <div>
            <button
              className="btn-success me-2 p-2 rounded"
              onClick={() => btnAplicar(cellValues)}
            >
              Aplicar
            </button>
          </div>
        );
      },
      headerAlign: "center",
    },
  ];
  const rows = DetalleGastos.map((dato, i) => ({
    ...dato,
    id: i + 1,
  }));
  const rowsPrimeraFila = rows.filter((row, i) => i == 0);
  //console.log("haber rowsPrimeraFila", rowsPrimeraFila);
  const rows2 = rows.filter((dato, i) => i !== 0);
  //console.log("haber rows2", rows2);
  const btnAplicar = (cellValues) => {
    console.log("aplicado", cellValues.row);
    const datos = {
      idGasto: cellValues.row.idGasto,
      idFichatecnica: cellValues.row.idFichatecnica,
      montoAplicado: cellValues.row.montoAplicado,
      porcentajeAplicado: cellValues.row.porcentajeAplicado,
    };
    peticionActualizarMontos(datos);
  };

  const changeRadioButton = (e) => {
    console.log("haber valor", e.target.value);
    setOpcion(e.target.value);
  };
  return (
    <div>
      <div className="row">
        <div className="col-12 col-md-6 col-lg-4">
          <p className="text-black fw-bolder h4 text-uppercase">
            Nombre de proyecto: {fichaTecnica.nombreFichatecnica}
          </p>
          <p className="text-success fw-bolder h4 text-uppercase">
            Total $ :{CostoDisenio[0].COSTOTOTAL}{" "}
          </p>
          <p className="text-success fw-bolder h4 text-uppercase">
            Sub-total $ :{SubTotalGastos[0].SUBTOTALGASTOS}{" "}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-4">
          <FormGroup className="formGroupRadios">
            <div className="row">
              <div className="col-12 col-sm-6">
                {IndicadorPartida &&
                  (IndicadorPartida == 1 ? (
                    <FormGroup>
                      <Form.Check
                        type="radio"
                        id="radio1"
                        value="1"
                        label="PARTIDA"
                        name="group1"
                        onChange={(e) => changeRadioButton(e)}
                        checked={opcion == 1}
                      />
                    </FormGroup>
                  ) : null)}
              </div>
              <div className="col-12 col-sm-6">
                {IndicadorSubPartida &&
                  (IndicadorSubPartida == 1 ? (
                    <FormGroup>
                      <Form.Check
                        type="radio"
                        id="radio2"
                        value="2"
                        label="SUB-PARTIDA"
                        name="group1"
                        onChange={(e) => changeRadioButton(e)}
                        checked={opcion == 2}
                      />
                    </FormGroup>
                  ) : null)}
              </div>
            </div>
          </FormGroup>
        </div>
      </div>
      <div className="row">
        <div className="row d-flex justify-content-center">
          {opcion == 1 && (
            <div
              style={{
                height: "720px",
                overflow: "auto",
              }}
              className="col-12 col-md-12 col-lg-10 col-xl-6 mb-3 d-flex justify-content-center"
            >
              {DetalleGastos.length >= 0 && (
                <DataGrid
                  columns={columns}
                  rows={rowsPrimeraFila}
                  pageSize={15}
                          rowsPerPageOptions={[15]}
                  //checkboxSelection
                  disableSelectionOnClick
                />
              )}
            </div>
          )}
          {opcion == 2 && (
            <div
              style={{
                height: "720px",
                overflow: "auto",
              }}
              className="col-12 col-md-12 col-lg-10 col-xl-6 mb-3 d-flex justify-content-center"
            >
              {DetalleGastos.length >= 0 && (
                <DataGrid
                  columns={columns}
                  rows={rows2}
                  pageSize={15}
                          rowsPerPageOptions={[15]}
                  //checkboxSelection
                  disableSelectionOnClick
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FichaDeGasto;
