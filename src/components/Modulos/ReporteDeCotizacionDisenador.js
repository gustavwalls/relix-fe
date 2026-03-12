import React, { useState } from "react";
import { useEffect } from "react";
import clienteAxios from "../../config/axios";
import { DataGrid } from "@mui/x-data-grid";

function ReporteDeCotizacionDisenador() {
  const [todasLasFichasTecnicas, setTodasLasFichasTecnicas] = useState([]);
  const obtenerTodasLasFichasTecnicas = async () => {
    try {
      const respuesta = await clienteAxios.get("/api/fichatecnica");
   //   console.log("respuesta de obtenerTodasLasFichasTecnicas", respuesta.data);
      setTodasLasFichasTecnicas(respuesta.data);
    } catch (error) {
     // console.log(error.response.data.messages.error);
    }
  };

  useEffect(() => {
    obtenerTodasLasFichasTecnicas();
  }, []);

  const reporteCotizacionDisenador = async (cellValues) => {
    let chaparId = cellValues.row.idFichatecnica;
    console.log("este es el id", chaparId);
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
        `/ExcelReporteDos/${chaparId}`,
        config
      );
      console.log("respuesta de reporteCotizacionDisenador", resultado.data);

      const url = URL.createObjectURL(
        new Blob([resultado.data], {
          type: "application/vnd.ms-excel",
        })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `R2_${cellValues.row.nombreFichatecnica}-${cellValues.row.numFichatecnica}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error.response.data.messages.error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90, hide: true },
    {
      field: "numFichatecnica",
      headerName: "NÚMERO DE COTIZACIÓN",
      width: 400,
      //editable: true,
    },

    {
      field: "clienteFichatecnica",
      headerName: "RAZÓN SOCIAL",
      width: 400,
      //editable: true,
    },

    {
      field: "nombreFichatecnica",
      headerName: "NOMBRE DE PROYECTO",
      width: 400,
      //editable: true,
    },

    {
      field: "nombreVendedor",
      headerName: "VENDEDOR",
      width: 400,
      //editable: true,
    },

    {
      field: "ACCIONES",
      width: 210,
      renderCell: (cellValues) => {
        return (
          <div>
            <button
              className="btn-primary p-2 rounded"
              onClick={() => reporteCotizacionDisenador(cellValues)}
            >
              DESCARGAR
            </button>
          </div>
        );
      },
    },
  ];

  const rows = todasLasFichasTecnicas.map((dato, i) => ({
    ...dato,
    id: i + 1,
  }));
  return (
    <div className="container-fluid pt-4 ">
      <div className="text-center my-5">
        <span className=" h2 fw-bold text-success  border border-secondary rounded p-2 shadow mb-2 bg-body text-uppercase">
         Metrado de materiales
        </span>
      </div>

      <div className="row">
        <div className="col-12">
          <div
            style={{
              height: "550px",
              width: "100%",
              overflow: "auto",
            }}
          >
            <DataGrid
              columns={columns}
              rows={rows}
              pageSize={15}
              rowsPerPageOptions={[5]}
             // checkboxSelection
              disableSelectionOnClick
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReporteDeCotizacionDisenador;
