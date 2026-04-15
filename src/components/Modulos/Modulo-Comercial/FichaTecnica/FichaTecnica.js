import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import TitlePage from "../../../../shared/TitlePage";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Form, Button, InputGroup } from "react-bootstrap";
import {
  obtenerTiposDeProyectos,
  obtenerVendedores,
  obtenerCodigoFichaTenica,
  obtenerDepartamentos,
  obtenerProvincias,
  obtenerDistritos,
  obtenerEstados,
} from "../../../services/apisFichaTecnica";
import { useEffect } from "react";
import Cargando from "../../../../view/Cargando";
import authContext from "../../../../context/autenticacion/authContext";
import clienteAxios from "../../../../config/axios";
import Swal from "sweetalert2";
export default function FichaTecnica({
  fichaTecnica,
  idFichaTecnica,
  idDepartamento,
  idProvincia,
  setMostarFicha,
  obtenerTodasLasFichasTecnicas
}) {
  //PARA EL FORMULARIO
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,reset 
  } = useForm();

  //FIN PARA EL FORMULARIO
  //VARIABLES GLOBALES
  const autentificaciones = useContext(authContext);
  const { usuario } = autentificaciones;
  ///FIN VARIABLES GLOBALES
  const [loading, setLoading] = useState(false);
  const [tiposDeProyectos, setTiposDeProyectos] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [mostrarCampoOtros, setMostrarCampoOtros] = useState(false);
  const [codigoVendedorFichaTecnica, setCodigoVendedorFichaTecnica] =
    useState("");
    const [estados, setEstados] = useState([]);
  const [isIdVendedorTouched, setIsIdVendedorTouched] = useState(false);
  const [isIdTipoDeProyectoTouched, setIsIdTipoDeProyectoTouched] =
    useState(false);
  //DEPARTAMENTOS PROVINCIA Y CIUDAD
  const [departamentos, setDepartamentos] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  useEffect(() => {
    getData();
  }, []);
  React.useEffect(() => {
    for (const key in fichaTecnica) {
      setValue(key, fichaTecnica[key]);
    }
    handleSelectChangeProvincia(idDepartamento);
    handleSelectChangeDistrito(idProvincia);
  }, [fichaTecnica, setValue]);

  React.useEffect(() => {
    if (formasPago.length > 0 && fichaTecnica && fichaTecnica.NIDE_FORMA_PAGO) {
      setValue("NIDE_FORMA_PAGO", fichaTecnica.NIDE_FORMA_PAGO);
    }
  }, [formasPago]);



  function insertar(data) {
    if (!fichaTecnica) {
      const dataApiRegistroFichaTecnia = {
        ...data,
        idUsuario: usuario.idUsuario,
      };
      registrarFichaTecnica(dataApiRegistroFichaTecnia);
    } else {
      editarFichaTecnica(data);
    }
  }

  const registrarFichaTecnica = async (datos) => {
    try {
      setLoading(true);
      const respuesta = await clienteAxios.post("/api/fichatecnica", datos);
      setLoading(false);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Registro exitoso",
        showConfirmButton: false,
        timer: 1500,
      });
      reset();
      return respuesta.data;
    } catch (error) {
      console.log("ERR CONSUMIR API REGISTRO FICHA TECNICA", error);
      setLoading(false);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "ERROR",
        text: `${error.mensaje}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
    setLoading(false);
  };
  const editarFichaTecnica = async (datos) => {
    var datosAEnviar = Object.assign({}, fichaTecnica, datos);
    try {
      setLoading(true)
      const resultado = await clienteAxios.put(
        `/api/fichatecnica/${idFichaTecnica}`,
        datosAEnviar
      );
      setLoading(false)
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Edicion exitosa",
        showConfirmButton: false,
        timer: 1500,
      });
      obtenerTodasLasFichasTecnicas()
      setMostarFicha(false)
      return resultado.data;
    } catch (error) {
      console.log('ERR CONSUMIR API EDITAR FICHA TECNICA',error);
      setLoading(false)
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "ERROR",
        text: `${error.mensaje}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  const getData = async () => {
    try {
      setLoading(true);
      const tiposDeProyectosObtenidos = await obtenerTiposDeProyectos();
      setTiposDeProyectos(tiposDeProyectosObtenidos);
      const todosLosVendedores = await obtenerVendedores();
      setVendedores(todosLosVendedores);
      const todosLosDepartamentos = await obtenerDepartamentos();
      setDepartamentos(todosLosDepartamentos);
      const todosLosEstados = await obtenerEstados();
      setEstados(todosLosEstados);
      const respuestaFormasPago = await clienteAxios.get("/api/v1/formas-pagos");
      setFormasPago(respuestaFormasPago.data.filter((f) => f.flgEstado === "1" || f.flgEstado === 1));
    } catch (error) {
      setLoading(false);
      console.log("erro", error);
    }
    setLoading(false);
  };
  // Función para manejar el cambio en la selección del tipo de proyecto
  const handleTipoProyectoChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "Otros: XXXXX") {
      setMostrarCampoOtros(true);
    } else {
      setMostrarCampoOtros(false);
    }
    setIsIdTipoDeProyectoTouched(true);
  };
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    obtenerCodidoVenderdorDeFichaTecnica(selectedValue);
    setIsIdVendedorTouched(true);
  };
  const obtenerCodidoVenderdorDeFichaTecnica = async (id) => {
    try {
      setLoading(true);
      const obteniendoCodigoFichaTecnica = await obtenerCodigoFichaTenica(id);
      const obtenerCodigoVendedor = vendedores.filter(
        (vendedor) => vendedor.idVendedor == id
      );
      const valorNum = `PR-${obtenerCodigoVendedor[0].codigoVendedor}-${obteniendoCodigoFichaTecnica.codigoFicha}`;
      setCodigoVendedorFichaTecnica(valorNum);
      setValue("numFichatecnica", valorNum);
      setValue(
        "codigoVendedorFichatecnica",
        obtenerCodigoVendedor[0].codigoVendedor
      );
    } catch (error) {
      console.log(
        "error al obtener codigo Vendedor para ficha tecnica->",
        error
      );
      setLoading(false);
    }
    setLoading(false);
  };

  const handleSelectChangeProvincia = (id) => {
    if (id == undefined) {
      console.log("No existe id", id);
      return;
    } else {
      console.log("Tienes id para ver provincias ->", id);
      obteniendoLasProvincias(id);
    }
  };
  const obteniendoLasProvincias = async (id) => {
    try {
      setLoading(true);
      const todosLasProvincias = await obtenerProvincias(id);
      setProvincias(todosLasProvincias);
      /* setDistritos([]);
      setValue("idDistrito", ""); */
    } catch (error) {
      console.log("error en Obtener Provincias ->", error);
      setLoading(false);
    }
    setLoading(false);
  };
  const handleSelectChangeDistrito = (id) => {
    if (id == undefined) {
      console.log("No existe id", id);
      return;
    } else {
      console.log("Tienes id para ver distritos ->", id);
      obteniendoLasDistritos(id);
    }
  };
  const obteniendoLasDistritos = async (id) => {
    try {
      setLoading(true);
      const todosLosDistritos = await obtenerDistritos(id);
      //console.log('todosLosDistritos',todosLosDistritos);
      setDistritos(todosLosDistritos);
    } catch (error) {
      console.log("error en Obtener Los Distritos", error);
      setLoading(false);
    }
    setLoading(false);
  };
  const [activeKey, setActiveKey] = useState("Datos"); // Estado para controlar la pestaña activa

  const handleTabChange2 = (key) => {
    setActiveKey(key); // Función para cambiar la pestaña activa cuando se hace clic en el botón
  };
  return (
    <>
      {loading && <Cargando />}

      <TitlePage
        title={
          fichaTecnica
            ? "Edicion de ficha tecnica"
            : "Creacion de ficha tecnica"
        }
      />
      <div>
        <Form onSubmit={handleSubmit(insertar)}>
          <Tabs
            activeKey={activeKey}
            id="uncontrolled-tab-example"
            className="mb-3 container"
            onSelect={handleTabChange2} // Usar la función de cambio de pestaña cuando se selecciona una pestaña
          >
            <Tab eventKey="Datos" title="Datos">
              <div className="container bg-white py-4 px-4">
                <div className="row">
                  <div className="col-12  col-md-4">
                    <Form.Group>
                      <Form.Label>Fecha</Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="Ingrese fecha"
                        {...register("fechaFichatecnica", { required: true })}
                      />
                      {errors.fechaFichatecnica &&
                        errors.fechaFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Esta fecha es obligatoria
                          </span>
                        )}
                    </Form.Group>
                  </div>

                  <div className="col-12 col-md-4">
                    <Form.Group>
                      <Form.Label>Division</Form.Label>

                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        {...register("idDivision", { required: true })}
                      >
                        <option value="" disabled>
                          Seleccione una Opcion
                        </option>
                        <option value="1">AGUA</option>
                        <option value="2">RIEGO</option>
                      </Form.Select>
                      {errors.idDivision &&
                        errors.idDivision.type === "required" && (
                          <span className="text-danger">
                            Esta division es obligatoria
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  {!mostrarCampoOtros && (
                    <div className="col-12 col-md-4">
                      <Form.Group>
                        <Form.Label>Tipo de Proyecto:</Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          defaultValue={""}
                          {...register("tipoProyecto", { required: true })}
                          onChange={handleTipoProyectoChange}
                        >
                          <option value="" disabled>
                            Seleccione
                          </option>
                          {tiposDeProyectos.map((proyecto, i) => (
                            <option key={i} value={proyecto.tipoProyecto}>
                              {proyecto.tipoProyecto}
                            </option>
                          ))}
                        </Form.Select>
                        {errors.tipoProyecto &&
                          errors.tipoProyecto.type === "required" &&
                          !isIdTipoDeProyectoTouched && (
                            <span className="text-danger">
                              Tipo de proyecto es obligatorio
                            </span>
                          )}
                      </Form.Group>
                    </div>
                  )}

                  {mostrarCampoOtros && (
                    <div className="row">
                      <div className="col-12">
                        <Form.Group>
                          <Form.Label>
                            Ingrese el tipo de proyecto manualmente:
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ingrese el tipo de proyecto"
                            {...register("tipoProyecto", { required: true })}
                          />
                          {errors.tipoProyecto &&
                            errors.tipoProyecto.type === "required" && (
                              <span className="text-danger">
                                Este campo es obligatorio
                              </span>
                            )}
                        </Form.Group>
                        <button
                          onClick={() =>
                            setMostrarCampoOtros(!mostrarCampoOtros)
                          }
                          className="btn btn-primary"
                        >
                          Regresar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label>Proyecto</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese Proyecto"
                        {...register("nombreFichatecnica", { required: true })}
                      />
                      {errors.nombreFichatecnica &&
                        errors.nombreFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Nombre de proyecto es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label>Cliente</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese Cliente"
                        {...register("clienteFichatecnica", { required: true })}
                      />
                      {errors.clienteFichatecnica &&
                        errors.clienteFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Nombre de Cliente es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label>RUC</Form.Label>
                      <Form.Control
                        type="number"
                        inputMode="numeric"
                        placeholder="Ingrese Ruc"
                        {...register("rucclienteFichatecnica", {
                          required: "Ruc es obligatorio",
                        })}
                      />
                      {errors.rucclienteFichatecnica && (
                        <span className="text-danger">
                          {errors.rucclienteFichatecnica.message}
                        </span>
                      )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label>Telefono</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Ingrese Telefono"
                        {...register("telefonoFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.telefonoFichatecnica &&
                        errors.telefonoFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Telefono es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label>Direccion de Fiscal:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese Proyecto"
                        {...register("direccionfiscalFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.direccionfiscalFichatecnica &&
                        errors.direccionfiscalFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">
                            Nombre de Direccion es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> Vendedor:</Form.Label>

                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        {...register("idVendedor", { required: true })}
                        onChange={handleSelectChange}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        {vendedores.map((vendedor, i) => (
                          <option value={vendedor.idVendedor} key={i}>
                            {vendedor.nombreVendedor}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.idVendedor &&
                        errors.idVendedor.type === "required" &&
                        !isIdVendedorTouched && (
                          <span className="text-danger">
                            Vendedor es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> NUM:</Form.Label>
                      <Form.Control
                        disabled
                        type="text"
                        placeholder="NUM VENDEDOR"
                        {...register("numFichatecnica", {
                          required: false,
                        })}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> CODIGO:</Form.Label>
                      <Form.Control
                        disabled
                        type="text"
                        placeholder="CODIGO VENDEDOR"
                        {...register("codigoVendedorFichatecnica", {
                          required: false,
                        })}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> Departamento:</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        name="idDepartamento"
                        defaultValue={""}
                        {...register("idDepartamento", { required: true })}
                        onChange={(e) =>
                          handleSelectChangeProvincia(e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        {departamentos.map((departamento, i) => (
                          <option value={departamento.idDepartamento} key={i}>
                            {departamento.nombreDepartamento}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.idDepartamento &&
                        errors.idDepartamento.type === "required" && (
                          <span className="text-danger">
                            Departamento es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> Provincias:</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        disabled={provincias.length === 0}
                        {...register("idProvincia", { required: true })}
                        onChange={(e) =>
                          handleSelectChangeDistrito(e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        {provincias.map((provincia, i) => (
                          <option value={provincia.idProvincia} key={i}>
                            {provincia.nombreProvincia}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.idProvincia &&
                        errors.idProvincia.type === "required" && (
                          <span className="text-danger">
                            Provincia es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> Distritos:</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        disabled={distritos.length === 0}
                        {...register("idDistrito", { required: true })}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        {distritos.map((distrito, i) => (
                          <option value={distrito.idDistrito} key={i}>
                            {distrito.nombreDistrito}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.idDistrito &&
                        errors.idDistrito.type === "required" && (
                          <span className="text-danger">
                            Distrito es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label>Direccion de Entrega:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese Direccion de Entrega"
                        {...register("direccionentregaFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.direccionentregaFichatecnica &&
                        errors.direccionentregaFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">
                            Direccion de entrega es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> Alcance:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese Alcance"
                        {...register("alcanceFichatecnica", { required: true })}
                      />
                      {errors.alcanceFichatecnica &&
                        errors.alcanceFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Alcanse es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> Area (Has):</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.00001"
                        placeholder="Ingrese cantidad de hectareas"
                        {...register("areaFichatecnica", { required: true })}
                      />
                      {errors.areaFichatecnica &&
                        errors.areaFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Area es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> Cultivo:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese cultivo"
                        {...register("cultivoFichatecnica", { required: true })}
                      />
                      {errors.cultivoFichatecnica &&
                        errors.cultivoFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Cultivo es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> Modalidad del contrato:</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        {...register("idModalidadcontrato", { required: true })}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        <option value="1">Suma Alzada</option>
                        <option value="2">Detallado</option>
                      </Form.Select>
                      {errors.idModalidadcontrato &&
                        errors.idModalidadcontrato.type === "required" && (
                          <span className="text-danger">
                            Distrito es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label>Modalidad de ejecucion:</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        {...register("idModalidadejecucion", {
                          required: true,
                        })}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        <option value="1">Llave en mano</option>
                        <option value="2">
                          Suministro de materiales e instalación
                        </option>
                      </Form.Select>
                      {errors.idModalidadejecucion &&
                        errors.idModalidadejecucion.type === "required" && (
                          <span className="text-danger">
                            Modalidad de ejecucion es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> Detracciones:</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        {...register("detraccionesFichatecnica", {
                          required: true,
                        })}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        <option value="si">Si</option>
                        <option value="no">No</option>
                      </Form.Select>
                      {errors.detraccionesFichatecnica &&
                        errors.detraccionesFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Detracciones es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> Retenciones:</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        {...register("retencionFichatecnica", {
                          required: true,
                        })}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        <option value="si">Si</option>
                        <option value="no">No</option>
                      </Form.Select>
                      {errors.retencionFichatecnica &&
                        errors.retencionFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Retenciones es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> Carta Fianza por Anticipo:</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        {...register("cartafianzaFichatecnica", {
                          required: true,
                        })}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        <option value="si">Si</option>
                        <option value="no">No</option>
                      </Form.Select>
                      {errors.cartafianzaFichatecnica &&
                        errors.cartafianzaFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Carta Fianza por Anticipo es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> Fiel Cumplimiento:</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        {...register("fielcumplimientoFichatecnica", {
                          required: true,
                        })}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        <option value="si">Si</option>
                        <option value="no">No</option>
                      </Form.Select>
                      {errors.fielcumplimientoFichatecnica &&
                        errors.fielcumplimientoFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">
                            Fiel Cumplimiento es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label>Plazo de ejecucion:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Plazo de ejecucion"
                        {...register("plazoejecucionFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.plazoejecucionFichatecnica &&
                        errors.plazoejecucionFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">
                            Plazo de ejecucion es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12  col-md-3">
                    <Form.Group>
                      <Form.Label>Fecha</Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="Ingrese inicio"
                        {...register("inicioproyectadoFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.inicioproyectadoFichatecnica &&
                        errors.inicioproyectadoFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">
                            Fecha inicio es obligatoria
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12  col-md-3">
                    <Form.Group>
                      <Form.Label> Termino Proyectado:</Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="Ingrese fin"
                        {...register("finproyectadoFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.finproyectadoFichatecnica &&
                        errors.finproyectadoFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">
                            Fecha fin es obligatoria
                          </span>
                        )}
                    </Form.Group>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab eventKey="Forma de pago" title="Forma de pago">
              <div className="container bg-white py-4 px-4">
                <div className="row">
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> Anticipo:</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        {...register("anticipoFichatecnica", {
                          required: true,
                        })}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        <option value="si">Si</option>
                        <option value="no">No</option>
                      </Form.Select>
                      {errors.anticipoFichatecnica &&
                        errors.anticipoFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Anticipo es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12  col-md-3">
                    <Form.Group>
                      <Form.Label> %:</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.00001"
                        placeholder="%"
                        {...register("porcentajeanticipoFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.porcentajeanticipoFichatecnica &&
                        errors.porcentajeanticipoFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">% es obligatoria</span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12  col-md-3">
                    <Form.Group>
                      <Form.Label> Saldo:</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.00001"
                        placeholder="Ingrese Saldo"
                        {...register("idFormapago", {
                          required: true,
                        })}
                      />
                      {errors.idFormapago &&
                        errors.idFormapago.type === "required" && (
                          <span className="text-danger">
                            Saldo es obligatoria
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> Financimiento:</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        {...register("financiamientoFichatecnica", {
                          required: true,
                        })}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        <option value="si">Si</option>
                        <option value="no">No</option>
                      </Form.Select>
                      {errors.financiamientoFichatecnica &&
                        errors.financiamientoFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">
                            Financimiento es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> Tasa:</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.00001"
                        placeholder="Tasa"
                        {...register("tasaFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.tasaFichatecnica &&
                        errors.tasaFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Tasa es obligatoria
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12  col-md-3">
                    <Form.Group>
                      <Form.Label> Periodo de Gracia:</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.00001"
                        placeholder="Periodo de Gracia"
                        {...register("periodograciaFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.periodograciaFichatecnica &&
                        errors.periodograciaFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">
                            Periodo de Gracia es obligatoria
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12  col-md-3">
                    <Form.Group>
                      <Form.Label> Plazo:</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.00001"
                        placeholder="Plazo"
                        {...register("plazoFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.plazoFichatecnica &&
                        errors.plazoFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Plazo es obligatoria
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> Periodo de cuotas:</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Periodo de cuotas"
                        {...register("periodocuotaFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.periodocuotaFichatecnica &&
                        errors.periodocuotaFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Periodo de cuotas es obligatoria
                          </span>
                        )}
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label>Inicio del financiamiento:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Periodo de cuotas"
                        {...register("iniciofinanciamientoFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.iniciofinanciamientoFichatecnica &&
                        errors.iniciofinanciamientoFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">
                            Inicio del financiamiento es obligatoria
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label>Factura negociable:</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        {...register("facturanegociableFichatecnica", {
                          required: true,
                        })}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        <option value="si">Si</option>
                        <option value="no">No</option>
                      </Form.Select>
                      {errors.facturanegociableFichatecnica &&
                        errors.facturanegociableFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">
                            Factura negociable es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label>Letras anticipadas:</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        {...register("letraanticipadaFichatecnica", {
                          required: true,
                        })}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        <option value="si">Si</option>
                        <option value="no">No</option>
                        <option value="En descuento">En descuento</option>
                      </Form.Select>
                      {errors.letraanticipadaFichatecnica &&
                        errors.letraanticipadaFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">
                            Letras anticipadas es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label>Forma de Pago:</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        {...register("NIDE_FORMA_PAGO", { required: true })}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        {formasPago.map((forma) => (
                          <option key={forma.idFormaPago} value={forma.idFormaPago}>
                            {forma.desFormaPago}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab eventKey="Facturacion" title="Facturacion">
              <div className="container bg-white py-4 px-4">
                <div className="row">
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label>Anticipo con la OC:</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        {...register("anticipoocFichatecnica", {
                          required: true,
                        })}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        <option value="si">Si</option>
                        <option value="no">No</option>
                      </Form.Select>
                      {errors.anticipoocFichatecnica &&
                        errors.anticipoocFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Anticipo con la OC es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label>A firma de contrato:</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        {...register("firmacontratoFichatecnica", {
                          required: true,
                        })}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        <option value="si">Si</option>
                        <option value="no">No</option>
                      </Form.Select>
                      {errors.firmacontratoFichatecnica &&
                        errors.firmacontratoFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">
                            A firma de contrato es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label> Saldo:</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        {...register("idFacturacion", {
                          required: true,
                        })}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        <option value="1">100% contra entrega </option>
                        <option value="2">Contra entrega de materiales</option>
                        <option value="3">
                          Contra avance valorizado de obra
                        </option>
                      </Form.Select>
                      {errors.idFacturacion &&
                        errors.idFacturacion.type === "required" && (
                          <span className="text-danger">
                            Saldo es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6  col-lg-3">
                    <Form.Group>
                      <Form.Label>Estado:</Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        defaultValue={""}
                        {...register("idEstadofichaproyecto", {
                          required: true,
                        })}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        {estados.map((estado, i) => (
                        <option value={estado.idEstadofichaproyecto} key={i}>
                          {estado.estadoFichaproyecto}
                        </option>
                      ))}
                      </Form.Select>
                      {errors.idEstadofichaproyecto &&
                        errors.idEstadofichaproyecto.type === "required" && (
                          <span className="text-danger">
                            Estado es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab eventKey="Recursos" title="Recursos">
              <div className="container bg-white py-4 px-4">
                <div className="row">
                  <div className="col-12 col-sm-6 col-lg-3">
                    <Form.Group>
                      <Form.Label>Instalacion:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Instalacion"
                        {...register("instalacionFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.instalacionFichatecnica &&
                        errors.instalacionFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Instalacion es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3">
                    <Form.Group>
                      <Form.Label> Guardiania:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Guardiania"
                        {...register("guardianiaFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.guardianiaFichatecnica &&
                        errors.guardianiaFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Guardiania es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3">
                    <Form.Group>
                      <Form.Label> Contenedor Oficina:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Contenedor Oficina"
                        {...register("contenedoroficinaFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.contenedoroficinaFichatecnica &&
                        errors.contenedoroficinaFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">
                            Contenedor Oficina es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3">
                    <Form.Group>
                      <Form.Label> Residente de obra:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Residente de obra"
                        {...register("residenteobraFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.residenteobraFichatecnica &&
                        errors.residenteobraFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">
                            Residente de obra es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3">
                    <Form.Group>
                      <Form.Label> Vehiculo:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Vehiculo"
                        {...register("vehiculoFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.vehiculoFichatecnica &&
                        errors.vehiculoFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Vehiculo es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3">
                    <Form.Group>
                      <Form.Label> Prevencionista:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Prevencionista"
                        {...register("prevencionistaFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.prevencionistaFichatecnica &&
                        errors.prevencionistaFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">
                            Prevencionista es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3">
                    <Form.Group>
                      <Form.Label> Costos del Proyecto USD:</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.00001"
                        placeholder="Costos del Proyecto USD"
                        {...register("costoproyectoFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.costoproyectoFichatecnica &&
                        errors.costoproyectoFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">
                            {" "}
                            Costos del Proyecto USD es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3">
                    <Form.Group>
                      <Form.Label> Margen %:</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.00001"
                        placeholder="Margen %"
                        {...register("margenFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.margenFichatecnica &&
                        errors.margenFichatecnica.type === "required" && (
                          <span className="text-danger">
                            Margen % es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3">
                    <Form.Group>
                      <Form.Label> Oportunidades de Optimizacion:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Oportunidades de Optimizacion"
                        {...register("oportunidadesFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.oportunidadesFichatecnica &&
                        errors.oportunidadesFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">
                            Oportunidades de Optimizacion es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-3">
                    <Form.Group>
                      <Form.Label> Riesgos del contrato:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Riesgos del contrato"
                        {...register("riesgocontratoFichatecnica", {
                          required: true,
                        })}
                      />
                      {errors.riesgocontratoFichatecnica &&
                        errors.riesgocontratoFichatecnica.type ===
                          "required" && (
                          <span className="text-danger">
                            Riesgos del contrato es obligatorio
                          </span>
                        )}
                    </Form.Group>
                  </div>
                </div>
                <div className="row mt-4">
                  <button className="btn btn-primary ">
                    {fichaTecnica
                      ? "Editar Ficha Tecnica"
                      : "Crear Ficha Tecnica"}
                  </button>
                  {Object.keys(errors).length > 0 && (
                    <div className="alert alert-danger mt-2" role="alert">
                      Hay campos obligatorios sin completar. Por favor revisa todas las pestañas antes de guardar.
                    </div>
                  )}
                </div>
              </div>
            </Tab>
          </Tabs>
        </Form>
        <div className="container w-100 mt-3">
          <div className="d-flex justify-content-end">
            {activeKey == "Datos" && (
              <Button
                onClick={() => handleTabChange2("Forma de pago")}
                className="mr-2"
              >
                Siguiente
              </Button>
            )}
            {activeKey == "Forma de pago" && (
              <>
                <Button onClick={() => handleTabChange2("Datos")}>Atras</Button>
                <Button
                  onClick={() => handleTabChange2("Facturacion")}
                  className="mx-2"
                >
                  Siguiente
                </Button>
              </>
            )}
            {activeKey == "Facturacion" && (
              <>
                <Button onClick={() => handleTabChange2("Forma de pago")}>
                  Atras
                </Button>
                <Button
                  onClick={() => handleTabChange2("Recursos")}
                  className="mx-2"
                >
                  Siguiente
                </Button>
              </>
            )}
            {activeKey == "Recursos" && (
              <>
                <Button onClick={() => handleTabChange2("Facturacion")}>
                  Atras
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
