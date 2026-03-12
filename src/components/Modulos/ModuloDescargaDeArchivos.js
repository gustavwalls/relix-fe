import React from "react";
import { useState, useContext,useRef  } from "react";
import {
  cargarArchivo,
  peticionAsignarArchivos,
  peticionEliminarArchivos,
  peticionObtenerArchivos,
  peticionBorrarArchivo
} from "../services/apisDescargaDeArchivos";
import { Link, useParams } from "react-router-dom";
import authContext from "../../context/autenticacion/authContext";
import { useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";

import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import clienteAxios from "../../config/axios";
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import Swal from "sweetalert2";
function ModuloDescargaDeArchivos() {
  /////////////////////////////////
  const autentificaciones = useContext(authContext);
  const { usuario } = autentificaciones;
  ///////////////////////////////////////////
  const params = useParams();
  //console.log('este es el id de la ficha',params.id)
  /////////////////////////////
  const [cargando, setCargando] = useState(false)
  const [todosLosUsuarios, setTodosLosUsuarios] = useState([]);
  const peticionMostrarUsuarios = async () => {
    try {
      /* console.log("haber token", localStorage.getItem("token")); */
      const { data } = await clienteAxios.get("/api/usuarios", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      /* console.log("haber data de peticionMostrarUsuarios", data); */
      setTodosLosUsuarios(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    peticionMostrarUsuarios()
  }, [])
  
  const [archivos, setArchivos] = useState([]);
  const obtenerArchivos = async () => {
   // console.log("idusuario", usuario.idUsuario, "idficha", params.id);
    try {
      const archivosTemporales = await peticionObtenerArchivos(
        usuario.idUsuario,
        params.id
      );
      setArchivos(archivosTemporales);
    } catch (error) {
      console.log("ver error", error);
    }
  };
  useEffect(() => {
    setTimeout(() => {
        usuario && obtenerArchivos();
    }, 2500);
   
  }, []);

  const [selectedFile, setSelectedFile] = useState(null);
  const inputFileRef = useRef(null);
  const handleFileInputChange = (e) => {
    //console.log(e.target.files[0])
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true)
    const formData = new FormData();
    formData.append("userfile", selectedFile);
    formData.append("idficha", params.id);
    // console.log("funcionaa");
    try {
      await cargarArchivo(formData);
      await obtenerArchivos()
      setSelectedFile(null) 
      inputFileRef.current.value = "";
      setCargando(false)
    } catch (error) {
      console.log("ver error =>", error);
      setCargando(false)
    }
  };

  
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
      width: 300,
      renderCell: (cellValues) => {
        return (
          <div>
            <a href={cellValues.row.URL_DOWNLOAD} target="_blank">
              Click aqui para descargar
            </a>
          </div>
        );
      },
    },
    
    {
      field: "Usuarios",
      headerName: "Asignar Usuarios",
      width: 500,
      renderCell: (cellValues) => {
        return (
          <div>
            <Stack spacing={3} sx={{ width: 500 }}>
              <Autocomplete
                multiple
                id="tags-standard"
                options={todosLosUsuarios}
                //options={cellValues.row.USUARIOS_ARCHIVO}
                getOptionLabel={(option) => option.correoUsuario}
              //  defaultValue={[top100Films[0], top100Films[1], top100Films[2]]}
                //defaultValue={[top100Films[13]]}
                //defaultValue={[todosLosUsuarios[11]]}
               // disableCloseOnSelect={true}
                //clearOnBlur={false} 
                //disableClearable={true}
                //disableCloseIcon={true}
                onChange={(event, value) => {
                    asignarUsuario(cellValues.row.ID_ARCHIVO
                    ,value)}}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            label={option.correoUsuario}
                            disabled // desactivar las opciones seleccionadas
                           // sx={{ backgroundColor: '#2196f3', color: '#000' }}
                          />
                        ))
                      }
                 
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Asignar"
                    placeholder="Correos"
                 
                  />
                )}
              />
            </Stack>
          </div>
        );
      },
    },
    
     {
      field: "Usuarios Eliminar",
      headerName: "Eliminar Permisos",
      width: 500,
      renderCell: (cellValues) => {
        return (
          <div>
            {
                    (cellValues.row.USUARIOS_ARCHIVO).map((valor, index) => (
                        <Chip
                          key={index}
                          label={valor.correoUsuario}
                          onDelete={() => eliminarPermisos(valor.idUsuario,cellValues.row.ID_ARCHIVO
                            )}
                          deleteIcon={<DeleteIcon />}
                          style={{ marginRight: '5px', marginBottom: '5px' }}
                        />
                      ))
            
            }
          </div>
        );
      },
    }, 
    
     {
      field: "Eliminar Archivo",
      headerName: "Eliminar Archivo",
      width: 200,
      renderCell: (cellValues) => {
        return (
          <div>
           <button className="btn btn-danger" onClick={()=>btnBorrarArchivo(cellValues.row)}>Eliminar</button>
          </div>
        );
      },
    }, 

  ];

  const btnBorrarArchivo = async (data)=>{
    console.log('borrado archivo',data);
    const nuevaData ={
      id : params.id,
      nombreArchivo : data.NOMBRE_ALEATORIO_ARCHIVO
    }
   // console.log('se va enviar esto ->',nuevaData);
   //ARCHIVO ELIMINADO EXITOSAMENTE
    try {
      Swal.fire({
        title: 'Seguro que quieres borrar archivo?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `No`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
           peticionBorrarArchivo(nuevaData);
          Swal.fire('Eliminado!', '', 'success')
          const nuevosArchivos = archivos.filter((archivo)=>(
            archivo.ID_ARCHIVO != data.ID_ARCHIVO
          ))
          console.log('nuevosArchivos =>',nuevosArchivos);
          setArchivos(nuevosArchivos)

        } else if (result.isDenied) {
          Swal.fire('Archivo no borrado', '', 'info')
        }
      })
    
    } catch (error) {
      console.log(error);
    }
  }

  const asignarUsuario = async(idArchivo,valor) => {
    console.log('ver valor =>',valor)
    const lastIndex = valor.length - 1
    const data =
    {
        idusuario : valor[lastIndex].idUsuario,
        idarchivo : idArchivo,
        idficha : params.id
    }
   // console.log('esta data se enviara =>',data)
   try {
    await peticionAsignarArchivos(data)
   } catch (error) {
    console.log(error)
   }
  };

  const rows = archivos.map((dato, i) => ({
    ...dato,
    id: i + 1,
  }));

  const eliminarPermisos = async(idUsuario,idArchivo) =>{
    const data =
    {
        idusuario : idUsuario,
        idarchivo : idArchivo,
        idficha : params.id
    }
    console.log('esta data se enviara =>',data)
   await peticionEliminarArchivos(data)
    await obtenerArchivos()
  }

  return (
    <div className="container-fluid">
      <Link
        className="btn btn-warning"
        to={`/ver-fichas-tecnicas-gerente-administacion`}
      >
        Regresar
      </Link>
      <div className="row mt-4">
        <div className="col-12 col-md-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
               ref={inputFileRef}
                className="form-control"
                type="file"
                id="formFile"
                onChange={(e) => handleFileInputChange(e)}
              />
              <button className="btn btn-primary mt-2" type="submit">
                Subir
              </button>
            </div>
          </form>
        </div>
      </div>
     {cargando  ? <p className="text-uppercase">Cargando....</p> :  <div className="row">
        <div className="col-12">
            
          <div
            style={{
              width: "100%",
              height: "650px",
              overflow: "auto",
            }}
          >
            {archivos.length > 0 ? (
              <DataGrid
                columns={columns}
                rows={rows}
                pageSize={15}
                rowsPerPageOptions={[5]}
                getRowHeight={() => "auto"}
                //checkboxSelection
                // disableSelectionOnClick
              />
            ): <p className="text-uppercase">No hay archivos</p>}
          </div>
        </div>
      </div>}
      <div className="row">
        <div className="col-12">
        </div>
      </div>
    </div>
  );
}

export default ModuloDescargaDeArchivos;
