import React, { useState,useContext } from 'react'
import { Accordion, Card } from "react-bootstrap";
import { peticionObtenerArchivos2 } from '../services/apisDescargaDeArchivos'
import { MdPageview } from "react-icons/md";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect } from "react";
import authContext from '../../context/autenticacion/authContext';
import clienteAxios from '../../config/axios';
import { FcDownload } from "react-icons/fc";
function VerDescargaDeArchivos() {
      /////////////////////////////////
  const autentificaciones = useContext(authContext);
  const { usuario } = autentificaciones;
  ///////////////////////////////////////////
  const [
    fichasTecnicasGerenteAdministracion,
    setFichasTecnicasGerenteAdministracion,
  ] = useState([]);
  const [fichaTecnica, setFichaTecnica] = useState({});
  const [mostarFicha, setMostarFicha] = useState(false);
  const [archivos, setArchivos] = useState([]);
  
 /*  useEffect(() => {
    setTimeout(() => {
        usuario && obtenerArchivos();
    }, 2500);
   
  }, []); */
    /////////////////////////////////////////////////////////////////////////CONSUMO DE APIS
    const obtenerFichasAceptadasGa = async () => {
        try {
          const { data } = await clienteAxios.get("/api/fichas-tecnicas-gerencias-administraciones");
          console.log("obtenerFichasAceptadas", data);
          setFichasTecnicasGerenteAdministracion(data);
          //idFichatecnica
          return data;
        } catch (error) {
          console.log(error);
        }
      };
      useEffect(() => {
        setTimeout(() => {
          obtenerFichasAceptadasGa();
        }, 2500);
      
      }, []);

  const btnVerTabla = (ficha, indice) => {
    console.log("haber la ficha", ficha, "id", ficha.idFichatecnica);
    setFichaTecnica(ficha);
   // obtenerDatosTablaReporte(ficha.idFichatecnica);
    obtenerArchivos(ficha.idFichatecnica)
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
 
  const obtenerArchivos = async (idficha) => {
   // console.log("idusuario", usuario.idUsuario, "idficha", params.id);
    try {
      const archivosTemporales = await peticionObtenerArchivos2(
        usuario.idUsuario,
        idficha
      );
      setArchivos(archivosTemporales);
    } catch (error) {
      console.log("ver error", error);
    }
  };
 /*  const obtenerDatosTablaReporte = async (id) => {
    console.log("entraste a obtenerDatosTablaReporte", id);
    try {
      //setLoading(true);
      const resultado = await clienteAxios.get(
        `/listarDetalleGerenteGeneral/${id}`
      );
      // setDataTablaGerenteGeneral(resultado.data);
      //setDetalleTabla(resultado.data.DetalleTabla);
      // setLoading(false);
    } catch (error) {
      console.log("hay un error");
      console.log(error.response.data.messages.error);
    }
  }; */
   //tabla material ui
   const columns = [
    { field: "ID_ARCHIVO", headerName: "ID", width: 90, hide: true },
    {
      field: "NOMBRE_ORIGINAL_ARCHIVO",
      headerName: "Nombre archivo",
      width: 200,
      //editable: true,
    },
    {
      field: "TIPO_ARCHIVO",
      headerName: "Tipo archivo",
      width: 200,
      //editable: true,
    },
    {
      field: "URL_DOWNLOAD",
      headerName: "Descargar",
      
      width: 100,
      renderCell: (cellValues) => {
        return (
          <div>
            <a href={cellValues.row.URL_DOWNLOAD} target="_blank">
            <FcDownload className="h3 m-0 p-0 pe-1" /> 
            </a>
            
          </div>
        );
      },
    },
    
  ];
  const rows = archivos.map((dato, i) => ({
    ...dato,
    id: i + 1,
  }));

  return (
    <div className="container-fluid pt-4 ">
          <div className="my-4 text-center container ">
        <h4 className=" fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
        Gestor de archivos fichas tecnicas
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
                {fichasTecnicasGerenteAdministracion.length <= 0 ? (
                  <span className="text-danger text-uppercase">
                    No hay fichas tecnicas
                  </span>
                ) : (
                  fichasTecnicasGerenteAdministracion.map((fichaTecnica, i) => (
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

                          <button
                            className="btn btn-success text-uppercase btn btn-sm mb-3"
                            onClick={() => btnVerTabla(fichaTecnica, i)}
                          >
                            <MdPageview className="h3 m-0 p-0 pe-1" />
                            Ver Lista de Materiales
                          </button>

                          {fichaTecnica.aprobaciongerenteadministracionFichatecnica ==
                            2 && (
                            <>
                              <br />
                              <span className="p-1 bg-danger fw-bolder mt-4 rounded rounded-md">
                                Rechazado
                              </span>
                            </>
                          )}
                          {fichaTecnica.aprobaciongerenteadministracionFichatecnica ==
                            1 && (
                            <>
                              <br />
                              <span className="p-1 bg-success fw-bolder mt-4 rounded rounded-md">
                                Confirmado
                              </span>
                            </>
                          )}
                          {fichaTecnica.aprobaciongerenteadministracionFichatecnica ==
                            0 && (
                            <>
                              <br />
                              <span className="p-1 bg-warning fw-bolder mt-4 rounded rounded-md">
                                En revision
                              </span>
                            </>
                          )}

                          {/*   {fichaTecnica.aprobaciongerenteadministracionFichatecnica ==
                          1 ? (
                            <>
                              <br />
                              <span className="p-1 bg-success fw-bolder mt-4 rounded rounded-md">
                                Confirmado
                              </span>
                            </>
                          ) : (
                            <>
                              <br />
                              <span className="p-1 bg-warning fw-bolder mt-4 rounded rounded-md">
                                En revision
                              </span>
                            </>
                          )} */}
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
        {mostarFicha && (
 <div className="col-12 col-lg-4 mx-auto">
 <div
     style={{
       width: "100%",
       height: "450px",
       overflow: "auto",
     }}
   >
     {archivos.length >0 ? (
       <DataGrid
         columns={columns}
         rows={rows}
         pageSize={15}
                          rowsPerPageOptions={[15]}
         getRowHeight={() => "auto"}
         //checkboxSelection
         // disableSelectionOnClick
       />
     ):(
        <p className='bg-secondary p-4 rounded text-center text-uppercase text-white'>No hay Archivos</p>
     )}
   </div>
 </div>
        )}
       
      </div>

    </div>
  )
}

export default VerDescargaDeArchivos