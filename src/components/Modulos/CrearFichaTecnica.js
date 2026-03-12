import React, { useEffect, useState, useContext } from "react";
import {
  Form,
  Button,
  Col,
  Row,
  Table,
  Modal,
  InputGroup,
} from "react-bootstrap";
import LogoRelix from "../../img/relixjpg1.svg";
////////
import authContext from "../../context/autenticacion/authContext";
/* import fichaTecnicaContext from "../../context/fichaTecnica/fichaTecnicaContext"; */
import {
  obtenerTiposDeProyectos,
  obtenerVendedores,
  obtenerEstados,
  obtenerDepartamentos,
  obtenerProvincias,
  obtenerDistritos,
  obtenerCodigoFichaTenica,
  obtenerFormasDePago,
} from "../services/apisFichaTecnica";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";

function CrearFichaTecnica() {
  /////////////////////////////////
  const autentificaciones = useContext(authContext);
  const { usuario } = autentificaciones;

  if (!usuario) {
    return <span>No hay usuario</span>;
  }
  ///////////////////////////////
  //consumiento apis
  const [formasDePagos, setFormasDePagos] = useState([]);
  const [tiposDeProyectos, setTiposDeProyectos] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [estados, setEstados] = useState([]);

  /////////
  const [departamentos, setDepartamentos] = useState([]);
  const [agarrarDepartamento, setAgarrarDepartamento] = useState("");
  ////////
  const [provincias, setProvincias] = useState([]);
  const [agarrarProvincia, setAgarrarProvincia] = useState("");
  ////////
  const [distritos, setDistritos] = useState([]);
  const [agarrarDistrito, setAgarrarDistrito] = useState("");
  ////////
  const [numVendedor, setNumVendedor] = useState("");

  const [botonActivo, setBotonActivo] = useState(true);

  ////////registrar ficha tecnica
  const registroDeFichaTecnica = async (datos) => {
    console.log("entraste a registroDeFichaTecnica", datos);
    try {
      const respuesta = await clienteAxios.post("/api/fichatecnica", datos);
      console.log("respuesta de registroDeFichaTecnica", respuesta);
      console.log(respuesta.data);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Registro exitoso",
        showConfirmButton: false,
        timer: 1500,
      });
      return respuesta.data;
    } catch (error) {
      console.log(error);
      /* console.log(error.response.data.messages.error); */

      /* Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      }); */
    }
  };

  const [registrarFichaTecnica, setRegistrarFichaTecnica] = useState({
    fechaFichatecnica: "",
    numFichatecnica: "",
    idDivision: "",
    tipoProyecto: "",
    tipoProyectoManual: "",
    nombreFichatecnica: "",
    clienteFichatecnica: "",
    rucclienteFichatecnica: "",
    telefonoFichatecnica: "",
    direccionfiscalFichatecnica: "",
    idVendedor: "",
    idDepartamento: "",
    idProvincia: "",
    idDistrito: "",
    direccionentregaFichatecnica: "",
    alcanceFichatecnica: "",
    areaFichatecnica: "",
    cultivoFichatecnica: "",
    idModalidadcontrato: "",
    idModalidadejecucion: "",
    detraccionesFichatecnica: "",
    retencionFichatecnica: "",
    cartafianzaFichatecnica: "",
    fielcumplimientoFichatecnica: "",
    plazoejecucionFichatecnica: "",
    inicioproyectadoFichatecnica: "",
    finproyectadoFichatecnica: "",
    //////
    /*  forma de pago */
    anticipoFichatecnica: "",
    porcentajeanticipoFichatecnica: "",
    idFormapago: "",
    financiamientoFichatecnica: "",
    tasaFichatecnica: "",
    periodograciaFichatecnica: "",
    plazoFichatecnica: "",
    periodocuotaFichatecnica: "",
    iniciofinanciamientoFichatecnica: "",
    facturanegociableFichatecnica: "",
    letraanticipadaFichatecnica: "",
    /*  Facturacion */
    anticipoocFichatecnica: "",
    firmacontratoFichatecnica: "",
    idFacturacion: "",
    idEstadofichaproyecto: "",
    /*  Recursos */
    instalacionFichatecnica: "",
    guardianiaFichatecnica: "",
    contenedoroficinaFichatecnica: "",
    residenteobraFichatecnica: "",
    vehiculoFichatecnica: "",
    prevencionistaFichatecnica: "",

    costoproyectoFichatecnica: "",
    margenFichatecnica: "",
    /*  utilidadFichatecnica: "", */
    /*  valorventaFichatecnica: "", */
    /*   valorventaigvFichatecnica: "", */
    oportunidadesFichatecnica: "",
    riesgocontratoFichatecnica: "",
    codigoVendedorFichatecnica: "",
    idUsuario: usuario.idUsuario,
  });

  const {
    fechaFichatecnica,
    numFichatecnica,
    idDivision,
    tipoProyecto,
    tipoProyectoManual,
    nombreFichatecnica,
    clienteFichatecnica,
    rucclienteFichatecnica,
    telefonoFichatecnica,
    direccionfiscalFichatecnica,
    idVendedor,
    idDepartamento,
    idProvincia,
    idDistrito,
    direccionentregaFichatecnica,
    alcanceFichatecnica,
    areaFichatecnica,
    cultivoFichatecnica,
    idModalidadcontrato,
    idModalidadejecucion,
    detraccionesFichatecnica,
    retencionFichatecnica,
    cartafianzaFichatecnica,
    fielcumplimientoFichatecnica,
    plazoejecucionFichatecnica,
    inicioproyectadoFichatecnica,
    finproyectadoFichatecnica,
    anticipoFichatecnica,
    porcentajeanticipoFichatecnica,
    idFormapago,
    financiamientoFichatecnica,
    tasaFichatecnica,
    periodograciaFichatecnica,
    plazoFichatecnica,
    periodocuotaFichatecnica,
    iniciofinanciamientoFichatecnica,
    facturanegociableFichatecnica,
    letraanticipadaFichatecnica,
    anticipoocFichatecnica,
    firmacontratoFichatecnica,
    idFacturacion,
    idEstadofichaproyecto,
    instalacionFichatecnica,
    guardianiaFichatecnica,
    contenedoroficinaFichatecnica,
    residenteobraFichatecnica,
    vehiculoFichatecnica,
    prevencionistaFichatecnica,
    costoproyectoFichatecnica,
    margenFichatecnica,
    /*  utilidadFichatecnica, */
    /*   valorventaFichatecnica, */
    /*   valorventaigvFichatecnica, */
    oportunidadesFichatecnica,
    riesgocontratoFichatecnica,
    codigoVendedorFichatecnica,
    idUsuario,
  } = registrarFichaTecnica;

  const utilidad =
    costoproyectoFichatecnica / (1 - margenFichatecnica / 100) -
    costoproyectoFichatecnica;

  const valorVentaSinIgv = costoproyectoFichatecnica * 1 + utilidad;
  const valorVentaConIgv = valorVentaSinIgv * 1.18;

  const actualizarInput = (e) => {
    setRegistrarFichaTecnica({
      ...registrarFichaTecnica,
      [e.target.name]: e.target.value,
    });
  };
  const [codigoFichaTecnica, setCodigoFichaTecnica] = useState(null);

  const obtenerCodidoDeFichaTecnica = async (id) => {
    //console.log("entraste a obtenerCodidoDeFichaTecnica =>", id);
    const obteniendoCodigoFichaTecnica = await obtenerCodigoFichaTenica(id);
    setCodigoFichaTecnica(obteniendoCodigoFichaTecnica);
    console.log(
      "haber obteniendoCodigoFichaTecnica =>",
      obteniendoCodigoFichaTecnica
    );

    const obtenerCodigoVendedor = vendedores.filter(
      (vendedor) => vendedor.idVendedor == id
    );
    console.log("obtenerCodigoVendedor =>", obtenerCodigoVendedor);

    const valorNum = `PR-${obtenerCodigoVendedor[0].codigoVendedor}-${obteniendoCodigoFichaTecnica.codigoFicha}`;

    console.log("valorNum es", valorNum);
    setRegistrarFichaTecnica({
      ...registrarFichaTecnica,
      numFichatecnica: valorNum,
      idVendedor: id,
      codigoVendedorFichatecnica: obtenerCodigoVendedor[0].codigoVendedor,
    });
  };

  const cambiarNum = (e) => {
    // console.log("entraste a cambiarNum", e.target.value);
    console.log(e.target.value);
    obtenerCodidoDeFichaTecnica(e.target.value);
  };
  ///////////////////////////////////////////////////aqui para hacer el put
  /* useEffect(() => {
    if (fichaEdicion !== null) {
      // setRegistrarFichaTecnica(fichaEdicion);
      console.log("fichaedicion existe", fichaEdicion);
      setRegistrarFichaTecnica(fichaEdicion);
    } else {
      console.log("fichaedicion no existe existe"); // me quede aqui
    }
  }, [fichaEdicion]); */
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  const [validated, setValidated] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);
    ///////////console.log("enviaste esta ficha tecnica", registrarFichaTecnica);
    if (
      fechaFichatecnica.trim() === "" ||
      numFichatecnica.trim() === "" ||
      idDivision.trim() === "" ||
      tipoProyecto.trim() === "" ||
      nombreFichatecnica.trim() === "" ||
      clienteFichatecnica.trim() === "" ||
      rucclienteFichatecnica.trim() === "" ||
      telefonoFichatecnica.trim() === "" ||
      direccionfiscalFichatecnica.trim() === "" ||
      idVendedor.trim() === "" ||
      idDepartamento.trim() === "" ||
      idProvincia.trim() === "" ||
      idDistrito.trim() === "" ||
      direccionentregaFichatecnica.trim() === "" ||
      alcanceFichatecnica.trim() === "" ||
      areaFichatecnica.trim() === "" ||
      cultivoFichatecnica.trim() === "" ||
      idModalidadcontrato.trim() === "" ||
      idModalidadejecucion.trim() === "" ||
      detraccionesFichatecnica.trim() === "" ||
      retencionFichatecnica.trim() === "" ||
      cartafianzaFichatecnica.trim() === "" ||
      fielcumplimientoFichatecnica.trim() === "" ||
      plazoejecucionFichatecnica.trim() === "" ||
      inicioproyectadoFichatecnica.trim() === "" ||
      firmacontratoFichatecnica.trim() === "" ||
      anticipoFichatecnica.trim() === "" ||
      porcentajeanticipoFichatecnica.trim() === "" ||
      idFormapago.trim() === "" ||
      financiamientoFichatecnica.trim() === "" ||
      tasaFichatecnica.trim() === "" ||
      periodograciaFichatecnica.trim() === "" ||
      plazoFichatecnica.trim() === "" ||
      periodocuotaFichatecnica.trim() === "" ||
      iniciofinanciamientoFichatecnica.trim() === "" ||
      facturanegociableFichatecnica.trim() === "" ||
      letraanticipadaFichatecnica.trim() === "" ||
      anticipoocFichatecnica.trim() === "" ||
      firmacontratoFichatecnica.trim() === "" ||
      idFacturacion.trim() === "" ||
      idEstadofichaproyecto.trim() === "" ||
      instalacionFichatecnica.trim() === "" ||
      guardianiaFichatecnica.trim() === "" ||
      contenedoroficinaFichatecnica.trim() === "" ||
      residenteobraFichatecnica.trim() === "" ||
      oportunidadesFichatecnica.trim() === "" ||
      riesgocontratoFichatecnica.trim() === "" ||
      margenFichatecnica.trim() === ""
    ) {
      console.log("no puede haber un valor vacio");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `No puede haber un valor vacio`,
      });
      return;
    }
    console.log("no hay errores");
    if (tipoProyectoManual == "") {
      registroDeFichaTecnica({
        fechaFichatecnica,
        numFichatecnica,
        idDivision,
        tipoProyecto,
        nombreFichatecnica,
        clienteFichatecnica,
        rucclienteFichatecnica,
        telefonoFichatecnica,
        direccionfiscalFichatecnica,
        idVendedor,
        codigoVendedorFichatecnica,
        idDepartamento,
        idProvincia,
        idDistrito,
        direccionentregaFichatecnica,
        alcanceFichatecnica,
        areaFichatecnica,
        cultivoFichatecnica,
        idModalidadcontrato,
        idModalidadejecucion,
        detraccionesFichatecnica,
        retencionFichatecnica,
        cartafianzaFichatecnica,
        fielcumplimientoFichatecnica,
        plazoejecucionFichatecnica,
        inicioproyectadoFichatecnica,
        finproyectadoFichatecnica,
        anticipoFichatecnica,
        porcentajeanticipoFichatecnica,
        idFormapago,
        financiamientoFichatecnica,
        tasaFichatecnica,
        periodograciaFichatecnica,
        plazoFichatecnica,
        periodocuotaFichatecnica,
        iniciofinanciamientoFichatecnica,
        facturanegociableFichatecnica,
        letraanticipadaFichatecnica,
        anticipoocFichatecnica,
        firmacontratoFichatecnica,
        idFacturacion,
        idEstadofichaproyecto,
        instalacionFichatecnica,
        guardianiaFichatecnica,
        contenedoroficinaFichatecnica,
        residenteobraFichatecnica,
        vehiculoFichatecnica,
        prevencionistaFichatecnica,
        costoproyectoFichatecnica,
        margenFichatecnica,
        /* utilidadFichatecnica, */
        /*   valorventaFichatecnica, */
        /*    valorventaigvFichatecnica, */
        oportunidadesFichatecnica,
        riesgocontratoFichatecnica,
        idUsuario,
      });
      setRegistrarFichaTecnica({
        fechaFichatecnica: "",
        numFichatecnica: "",
        idDivision: "",
        tipoProyecto: "",
        tipoProyectoManual: "",
        nombreFichatecnica: "",
        clienteFichatecnica: "",
        rucclienteFichatecnica: "",
        telefonoFichatecnica: "",
        direccionfiscalFichatecnica: "",
        idVendedor: "",
        idDepartamento,
        idProvincia,
        idDistrito,
        direccionentregaFichatecnica: "",
        alcanceFichatecnica: "",
        areaFichatecnica: "",
        cultivoFichatecnica: "",
        idModalidadcontrato: "",
        idModalidadejecucion: "",
        detraccionesFichatecnica: "",
        retencionFichatecnica: "",
        cartafianzaFichatecnica: "",
        fielcumplimientoFichatecnica: "",
        plazoejecucionFichatecnica: "",
        inicioproyectadoFichatecnica: "",
        finproyectadoFichatecnica: "",
        //////
        anticipoFichatecnica: "",
        porcentajeanticipoFichatecnica: "",
        idFormapago: "",
        financiamientoFichatecnica: "",
        tasaFichatecnica: "",
        periodograciaFichatecnica: "",
        plazoFichatecnica: "",
        periodocuotaFichatecnica: "",
        iniciofinanciamientoFichatecnica: "",
        facturanegociableFichatecnica: "",
        letraanticipadaFichatecnica: "",
        /////
        anticipoocFichatecnica: "",
        firmacontratoFichatecnica: "",
        idFacturacion: "",
        idEstadofichaproyecto: "",
        ////
        instalacionFichatecnica: "",
        guardianiaFichatecnica: "",
        contenedoroficinaFichatecnica: "",
        residenteobraFichatecnica: "",
        vehiculoFichatecnica: "",
        prevencionistaFichatecnica: "",

        costoproyectoFichatecnica: "",
        margenFichatecnica: "",
        /* utilidadFichatecnica: "", */
        /*  valorventaFichatecnica: "", */
        /*    valorventaigvFichatecnica: "", */
        oportunidadesFichatecnica: "",
        riesgocontratoFichatecnica: "",
        idUsuario: usuario.idUsuario,
      });
      return;
    } else {
      registroDeFichaTecnica({
        fechaFichatecnica,
        numFichatecnica,
        idDivision,
        tipoProyecto: tipoProyectoManual,
        nombreFichatecnica,
        clienteFichatecnica,
        rucclienteFichatecnica,
        telefonoFichatecnica,
        direccionfiscalFichatecnica,
        idVendedor,
        codigoVendedorFichatecnica,
        idDepartamento,
        idProvincia,
        idDistrito,
        direccionentregaFichatecnica,
        alcanceFichatecnica,
        areaFichatecnica,
        cultivoFichatecnica,
        idModalidadcontrato,
        idModalidadejecucion,
        detraccionesFichatecnica,
        retencionFichatecnica,
        cartafianzaFichatecnica,
        fielcumplimientoFichatecnica,
        plazoejecucionFichatecnica,
        inicioproyectadoFichatecnica,
        finproyectadoFichatecnica,
        anticipoFichatecnica,
        porcentajeanticipoFichatecnica,
        idFormapago,
        financiamientoFichatecnica,
        tasaFichatecnica,
        periodograciaFichatecnica,
        plazoFichatecnica,
        periodocuotaFichatecnica,
        iniciofinanciamientoFichatecnica,
        facturanegociableFichatecnica,
        letraanticipadaFichatecnica,
        anticipoocFichatecnica,
        firmacontratoFichatecnica,
        idFacturacion,
        idEstadofichaproyecto,
        instalacionFichatecnica,
        guardianiaFichatecnica,
        contenedoroficinaFichatecnica,
        residenteobraFichatecnica,
        vehiculoFichatecnica,
        prevencionistaFichatecnica,
        costoproyectoFichatecnica,
        margenFichatecnica,
        /* utilidadFichatecnica, */
        /*   valorventaFichatecnica, */
        /*    valorventaigvFichatecnica, */
        oportunidadesFichatecnica,
        riesgocontratoFichatecnica,
        idUsuario,
      });
      setRegistrarFichaTecnica({
        fechaFichatecnica: "",
        numFichatecnica: "",
        idDivision: "",
        tipoProyecto: "",
        tipoProyectoManual: "",
        nombreFichatecnica: "",
        clienteFichatecnica: "",
        rucclienteFichatecnica: "",
        telefonoFichatecnica: "",
        direccionfiscalFichatecnica: "",
        idVendedor: "",
        idDepartamento,
        idProvincia,
        idDistrito,
        direccionentregaFichatecnica: "",
        alcanceFichatecnica: "",
        areaFichatecnica: "",
        cultivoFichatecnica: "",
        idModalidadcontrato: "",
        idModalidadejecucion: "",
        detraccionesFichatecnica: "",
        retencionFichatecnica: "",
        cartafianzaFichatecnica: "",
        fielcumplimientoFichatecnica: "",
        plazoejecucionFichatecnica: "",
        inicioproyectadoFichatecnica: "",
        finproyectadoFichatecnica: "",
        //////
        anticipoFichatecnica: "",
        porcentajeanticipoFichatecnica: "",
        idFormapago: "",
        financiamientoFichatecnica: "",
        tasaFichatecnica: "",
        periodograciaFichatecnica: "",
        plazoFichatecnica: "",
        periodocuotaFichatecnica: "",
        iniciofinanciamientoFichatecnica: "",
        facturanegociableFichatecnica: "",
        letraanticipadaFichatecnica: "",
        /////
        anticipoocFichatecnica: "",
        firmacontratoFichatecnica: "",
        idFacturacion: "",
        idEstadofichaproyecto: "",
        ////
        instalacionFichatecnica: "",
        guardianiaFichatecnica: "",
        contenedoroficinaFichatecnica: "",
        residenteobraFichatecnica: "",
        vehiculoFichatecnica: "",
        prevencionistaFichatecnica: "",

        costoproyectoFichatecnica: "",
        margenFichatecnica: "",
        /* utilidadFichatecnica: "", */
        /*  valorventaFichatecnica: "", */
        /*    valorventaigvFichatecnica: "", */
        oportunidadesFichatecnica: "",
        riesgocontratoFichatecnica: "",
        idUsuario: usuario.idUsuario,
      });
      return;
    }

    /* if (fichaEdicion === null) {
      //ficha nueva
      console.log("entras aqui si agregas ficha nueva");
      console.log("ficha antes", registrarFichaTecnica);

      registroDeFichaTecnica({
        fechaFichatecnica,
        numFichatecnica,
        idDivision,
        tipoProyecto,
        nombreFichatecnica,
        clienteFichatecnica,
        rucclienteFichatecnica,
        telefonoFichatecnica,
        direccionfiscalFichatecnica,
        idVendedor,
        codigoVendedorFichatecnica,
        idDepartamento,
        idProvincia,
        idDistrito,
        direccionentregaFichatecnica,
        alcanceFichatecnica,
        areaFichatecnica,
        cultivoFichatecnica,
        idModalidadcontrato,
        idModalidadejecucion,
        detraccionesFichatecnica,
        retencionFichatecnica,
        cartafianzaFichatecnica,
        fielcumplimientoFichatecnica,
        plazoejecucionFichatecnica,
        inicioproyectadoFichatecnica,
        finproyectadoFichatecnica,
        anticipoFichatecnica,
        porcentajeanticipoFichatecnica,
        idFormapago,
        financiamientoFichatecnica,
        tasaFichatecnica,
        periodograciaFichatecnica,
        plazoFichatecnica,
        periodocuotaFichatecnica,
        iniciofinanciamientoFichatecnica,
        facturanegociableFichatecnica,
        letraanticipadaFichatecnica,
        anticipoocFichatecnica,
        firmacontratoFichatecnica,
        idFacturacion,
        idEstadofichaproyecto,
        instalacionFichatecnica,
        guardianiaFichatecnica,
        contenedoroficinaFichatecnica,
        residenteobraFichatecnica,
        vehiculoFichatecnica,
        prevencionistaFichatecnica,
        costoproyectoFichatecnica,
        margenFichatecnica,
        utilidadFichatecnica,
        valorventaFichatecnica,
        valorventaigvFichatecnica,
        oportunidadesFichatecnica,
        riesgocontratoFichatecnica,
        idUsuario,
      });
    } else {
      console.log("vas a actualizar una ficha", registrarFichaTecnica);
      setBotonActivo(false);
      actualizarFicha(registrarFichaTecnica);
      setTimeout(() => {
        setBotonActivo(true);
      }, 3000);
    } */

    /* setActivarFicha(false); */
  };

  const getData = async () => {
    try {
      const tiposDeProyectosObtenidos = await obtenerTiposDeProyectos();
      setTiposDeProyectos(tiposDeProyectosObtenidos);

      const todosLosVendedores = await obtenerVendedores();
      setVendedores(todosLosVendedores);

      const todosLosEstados = await obtenerEstados();
      setEstados(todosLosEstados);

      const obteniendoFormasDePago = await obtenerFormasDePago();
      setFormasDePagos(obteniendoFormasDePago);

      const todosLosDepartamentos = await obtenerDepartamentos();
      setDepartamentos(todosLosDepartamentos);

      if (agarrarDepartamento) {
        //console.log("agarrarDepartamento existe");
        const todosLasProvincias = await obtenerProvincias(agarrarDepartamento);
        setProvincias(todosLasProvincias);
      }
      if (agarrarProvincia) {
        //console.log("agarrarProvincia existe", agarrarProvincia);
        const todosLosDistritos = await obtenerDistritos(agarrarProvincia);
        setDistritos(todosLosDistritos);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //console.log("vendedores", vendedores);
  //console.log("departamentos", departamentos);
  // console.log("estados", estados);
  //console.log("codigo", codigoFichaTecnica);
  useEffect(() => {
    getData();
  }, [agarrarDepartamento, agarrarProvincia, idVendedor]);

  //registrar ficha tecnica

  return (
    <div>
      <div className="container mt-3">
        <div className="row d-flex justify-content-center">
          <div
            className="col-12"
            style={{
              background: "white",
              boxShadow: "0px 4px 25px rgba(0, 0, 0, 0.15)",
              borderRadius: "10px",
            }}
          >
            <div>
              <div style={{ background: "white" }}>
                <img src={LogoRelix} alt="" className="mt-2 mb-2" />
                <h4 style={{ background: "white" }} className="text-uppercase">
                  Ficha Tecnica
                </h4>
              </div>
              {/* {fichaEdicion && (
                <>
                  <p className="lead text-success text-bolder">
                    Estas en Editar, por temas de validaciones por favor volver
                    a seleccionar la ubicacion
                  </p>
                  <p className="lead text-primary text-bolder">
                    La ubicacion es {fichaEdicion.nombreDepartamento}-
                    {fichaEdicion.nombreProvincia} -
                    {fichaEdicion.nombreDistrito}
                  </p>
                </>
              )} */}

              <div>
                <Form
                  className="pb-3 "
                  onSubmit={(e) => onSubmit(e)}
                  noValidate
                  validated={validated}
                >
                  <div className="row ">
                    <div className="col-12  col-md-4">
                   
                      <Form.Group>
                        <Form.Label>Fecha</Form.Label>
                        <InputGroup hasValidation>
                          <Form.Control
                            type="date"
                            placeholder="Ingrese fecha"
                            name="fechaFichatecnica"
                            value={fechaFichatecnica}
                            onChange={(e) => actualizarInput(e)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            seleccione una fecha
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>

                    {codigoFichaTecnica && (
                      <div className="col-12  col-md-4">
                        <Form.Group>
                          <Form.Label>NUM</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Codigo vendedor"
                            disabled
                            value={numFichatecnica}
                            style={{ width: "275px" }}
                          />
                        </Form.Group>
                      </div>
                    )}

                    <div className="col-12 col-md-4">
                      <Form.Group>
                        <Form.Label>Division</Form.Label>

                        <Form.Select
                          aria-label="Default select example"
                          value={idDivision}
                          name="idDivision"
                          onChange={(e) => {
                            actualizarInput(e);
                          }}
                          required
                        >
                          <option value="" selected disabled hidden>
                            Seleccione una Opcion
                          </option>
                          <option value="1">AGUA</option>
                          <option value="2">RIEGO</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </div>
                  {/* ya esta */}
                  <Form.Group className="my-2">
                    <Form.Label>Tipo de Proyecto:</Form.Label>
                    {tipoProyecto == "Otros: XXXXX" ? (
                      <>
                        <Form.Control
                          type="text"
                          name="tipoProyectoManual"
                          value={tipoProyectoManual}
                          placeholder="Tipo del proyecto"
                          onChange={(e) => actualizarInput(e)}
                          required
                        />
                        <span className="text-success">
                          Selecciono la opcion manual, si quiere regresar a las
                          opciones por favor actualizar
                        </span>
                      </>
                    ) : (
                      <Form.Select
                        aria-label="Default select example"
                        name="tipoProyecto"
                        value={tipoProyecto}
                        onChange={(e) => {
                          actualizarInput(e);
                        }}
                        required
                      >
                        <option value="" selected disabled hidden>
                          Seleccione
                        </option>
                        {tiposDeProyectos.map((proyecto, i) => (
                          <option
                            key={i}
                            value={proyecto.tipoProyecto}
                            className="text-uppercase"
                          >
                            {proyecto.tipoProyecto}
                          </option>
                        ))}
                      </Form.Select>
                    )}
                  </Form.Group>{" "}
                  {/* ya esta */}
                  <div className="row">
                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group>
                        <Form.Label>Proyecto:</Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            name="nombreFichatecnica"
                            value={nombreFichatecnica}
                            placeholder="Nombre del proyecto"
                            onChange={(e) => actualizarInput(e)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            escriba un proyecto.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>{" "}
                      {/* ya esta */}
                    </div>
                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group>
                        <Form.Label>Cliente</Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Cliente"
                            name="clienteFichatecnica"
                            value={clienteFichatecnica}
                            onChange={(e) => actualizarInput(e)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            escriba un cliente.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                      {/* ya esta */}
                    </div>
                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group>
                        <Form.Label>RUC</Form.Label>
                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Ruc"
                            name="rucclienteFichatecnica"
                            value={rucclienteFichatecnica}
                            onChange={(e) => actualizarInput(e)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            escriba un Ruc.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                      {/* ya esta */}
                    </div>
                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group>
                        <Form.Label>Telefono</Form.Label>
                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Telefono"
                            name="telefonoFichatecnica"
                            value={telefonoFichatecnica}
                            onChange={(e) => actualizarInput(e)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            escriba un telefono.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                      {/* ya esta */}
                    </div>
                  </div>
                  {/* ya esta */}
                  <div className="row" style={{ background: "white" }}>
                    <div className="col-12 col-sm-6 col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Direccion de Fiscal:
                        </Form.Label>
                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Direccion de Fiscal"
                            name="direccionfiscalFichatecnica"
                            value={direccionfiscalFichatecnica}
                            onChange={(e) => actualizarInput(e)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            escriba una direccion.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                      {/* ya esta */}
                    </div>

                    <div className="col-12 col-sm-6 col-lg-3">
                      <Form.Group>
                        <Form.Label style={{ background: "white" }}>
                          Vendedor:
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          name="idVendedor"
                          value={idVendedor}
                          onChange={(e) => {
                            actualizarInput(e);
                            cambiarNum(e);
                          }}
                          required
                        >
                          <option value="" selected disabled hidden>
                            Seleccione
                          </option>
                          {vendedores.map((vendedor, i) => (
                            <option value={vendedor.idVendedor} key={i}>
                              {vendedor.nombreVendedor}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      {/* ya esta */}
                    </div>

                    <div className="col-12 col-sm-6 col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Codigo:
                        </Form.Label>
                        {idVendedor ? (
                          <>
                            <Form.Control
                              type="text"
                              placeholder="Codigo"
                              value={codigoVendedorFichatecnica}
                              disabled
                            />
                          </>
                        ) : (
                          <>
                            <Form.Control
                              type="text"
                              placeholder="Codigo"
                              disabled
                            />
                          </>
                        )}
                      </Form.Group>
                      {/* ya esta */}
                    </div>

                    <div className="col-12 col-sm-6 col-lg-3">
                      <Form.Group>
                        <Form.Label style={{ background: "white" }}>
                          Departamento:
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          value={idDepartamento}
                          name="idDepartamento"
                          onChange={(e) => {
                            setAgarrarDepartamento(e.target.value);
                            actualizarInput(e);
                          }}
                          required
                        >
                          <option value="" selected disabled hidden>
                            Seleccione
                          </option>
                          {departamentos.map((departamento, i) => (
                            <option value={departamento.idDepartamento} key={i}>
                              {departamento.nombreDepartamento}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      {/* ya esta DEPARTAMENTO*/}
                    </div>
                  </div>
                  {/* ya esta */}
                  <div className="row" style={{ background: "white" }}>
                    <div className="col-12 col-sm-6  col-lg-3">
                      {/* ya esta PROVINCIA*/}
                      {agarrarDepartamento ? (
                        <>
                          <Form.Group>
                            <Form.Label style={{ background: "white" }}>
                              Provincia:
                            </Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              name="idProvincia"
                              //value={fichaEdicion[0].nombreDistrito}
                              onChange={(e) => {
                                setAgarrarProvincia(e.target.value);
                                actualizarInput(e);
                              }}
                              required
                            >
                              <option value="" selected disabled hidden>
                                Seleccione
                              </option>
                              {provincias.map((provincia, i) => (
                                <option value={provincia.idProvincia} key={i}>
                                  {provincia.nombreProvincia}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </>
                      ) : (
                        <>
                          <Form.Group>
                            <Form.Label style={{ background: "white" }}>
                              Provincia:
                            </Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              disabled
                            ></Form.Select>
                          </Form.Group>
                        </>
                      )}
                    </div>
                    <div className="col-12 col-sm-6  col-lg-3">
                      {agarrarProvincia ? (
                        <>
                          <Form.Group>
                            <Form.Label style={{ background: "white" }}>
                              Distrito:
                            </Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              name="idDistrito"
                              value={idDistrito}
                              onChange={(e) => {
                                setAgarrarDistrito(e.target.value);
                                actualizarInput(e);
                              }}
                              required
                            >
                              <option value="" selected disabled hidden>
                                Seleccione
                              </option>
                              {distritos.map((distrito, i) => (
                                <option value={distrito.idDistrito} key={i}>
                                  {distrito.nombreDistrito}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </>
                      ) : (
                        <>
                          <Form.Group>
                            <Form.Label style={{ background: "white" }}>
                              Distrito:
                            </Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              disabled
                            ></Form.Select>
                          </Form.Group>
                        </>
                      )}
                    </div>
                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Direccion de Entrega:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            name="direccionentregaFichatecnica"
                            value={direccionentregaFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            placeholder="Direccion de entrega"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            escriba una direccion.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>

                    <div className="col-12 col-sm-6 col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Alcance
                        </Form.Label>
                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Alcance"
                            name="alcanceFichatecnica"
                            value={alcanceFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            escriba un alcance.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row" style={{ background: "white" }}>
                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Area (Has):
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Ingrese cantidad de hectareas"
                            name="areaFichatecnica"
                            value={areaFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            escriba un Area.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>

                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Cultivo:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Ingrese cultivo"
                            name="cultivoFichatecnica"
                            value={cultivoFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            escriba un cultivo.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>

                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Modalidad del contrato:
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          name="idModalidadcontrato"
                          value={idModalidadcontrato}
                          onChange={(e) => {
                            actualizarInput(e);
                          }}
                          required
                        >
                          <option value="" selected disabled hidden>
                            Seleccione una Opcion
                          </option>
                          <option value="1">Suma Alzada</option>
                          <option value="2">Detallado</option>
                        </Form.Select>
                      </Form.Group>
                    </div>

                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Modalidad de ejecucion:
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          name="idModalidadejecucion"
                          value={idModalidadejecucion}
                          onChange={(e) => {
                            actualizarInput(e);
                          }}
                          required
                        >
                          <option value="" selected disabled hidden>
                            Seleccione una Opcion
                          </option>
                          <option value="1">Llave en mano</option>
                          <option value="2">
                            Suministro de materiales e instalación
                          </option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row" style={{ background: "white" }}>
                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group>
                        <Form.Label style={{ background: "white" }}>
                          Detracciones:
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          name="detraccionesFichatecnica"
                          value={detraccionesFichatecnica}
                          onChange={(e) => {
                            actualizarInput(e);
                          }}
                          required
                        >
                          <option value="" selected disabled hidden>
                            Seleccione una Opcion
                          </option>
                          <option value="si">Si</option>
                          <option value="no">No</option>
                        </Form.Select>
                      </Form.Group>
                    </div>

                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group>
                        <Form.Label style={{ background: "white" }}>
                          Retenciones:
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          name="retencionFichatecnica"
                          value={retencionFichatecnica}
                          onChange={(e) => {
                            actualizarInput(e);
                          }}
                          required
                        >
                          <option value="" selected disabled hidden>
                            Seleccione una Opcion
                          </option>
                          <option value="si">Si</option>
                          <option value="no">No</option>
                        </Form.Select>
                      </Form.Group>
                    </div>

                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group>
                        <Form.Label style={{ background: "white" }}>
                          Carta Fianza por Anticipo:
                        </Form.Label>
                        <Form.Select
                          required
                          aria-label="Default select example"
                          name="cartafianzaFichatecnica"
                          value={cartafianzaFichatecnica}
                          onChange={(e) => {
                            actualizarInput(e);
                          }}
                        >
                          <option value="" selected disabled hidden>
                            Seleccione una Opcion
                          </option>
                          <option value="si">Si</option>
                          <option value="no">No</option>
                        </Form.Select>
                      </Form.Group>
                    </div>

                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group>
                        <Form.Label style={{ background: "white" }}>
                          Fiel Cumplimiento:
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          name="fielcumplimientoFichatecnica"
                          value={fielcumplimientoFichatecnica}
                          onChange={(e) => {
                            actualizarInput(e);
                          }}
                          required
                        >
                          <option value="" selected disabled hidden>
                            Seleccione una Opcion
                          </option>
                          <option value="si">Si</option>
                          <option value="no">No</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row" style={{ background: "white" }}>
                    <div className="col-12 col-12  col-md-4">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Plazo de ejecucion:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Plazo de ejecucion"
                            name="plazoejecucionFichatecnica"
                            value={plazoejecucionFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            escriba un plazo de ejecucion.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                      {/* ya esta */}
                    </div>

                    <div className="col-12  col-md-4">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Inicio Proyectado:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="date"
                            placeholder="Ingrese inicio"
                            name="inicioproyectadoFichatecnica"
                            value={inicioproyectadoFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            escriba un inicio de proyectado.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                      {/* ya esta */}
                    </div>

                    <div className="col-12  col-md-4">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Termino Proyectado:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="date"
                            placeholder="Ingrese fin"
                            name="finproyectadoFichatecnica"
                            value={finproyectadoFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            escriba un termino de proyectado.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                      {/* ya esta */}
                    </div>
                  </div>
                  <h3 className="text-primary my-3">Forma de pago</h3>
                  <div className="row" style={{ background: "white" }}>
                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group>
                        <Form.Label style={{ background: "white" }}>
                          Anticipo:
                        </Form.Label>
                        <Form.Select
                          required
                          aria-label="Default select example"
                          name="anticipoFichatecnica"
                          value={anticipoFichatecnica}
                          onChange={(e) => {
                            actualizarInput(e);
                          }}
                        >
                          <option value="" selected disabled hidden>
                            Seleccione opcion
                          </option>
                          <option value="si">Si</option>
                          <option value="no">No</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          %:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="%"
                            name="porcentajeanticipoFichatecnica"
                            value={porcentajeanticipoFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            %
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>
                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Saldo:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Saldo"
                            name="idFormapago"
                            value={idFormapago}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            ingrese un saldo
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>
                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group>
                        <Form.Label style={{ background: "white" }}>
                          Financimiento:
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          name="financiamientoFichatecnica"
                          value={financiamientoFichatecnica}
                          onChange={(e) => {
                            actualizarInput(e);
                          }}
                          required
                        >
                          <option value="" selected disabled hidden>
                            Seleccione opcion
                          </option>
                          <option value="si">Si</option>
                          <option value="no">No</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row" style={{ background: "white" }}>
                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Tasa:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Tasa"
                            name="tasaFichatecnica"
                            value={tasaFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            ingrese una tasa
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>

                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Periodo de Gracia:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Periodo de Gracia"
                            name="periodograciaFichatecnica"
                            value={periodograciaFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            ingrese un periodo de gracia
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>

                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Plazo:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Plazo"
                            name="plazoFichatecnica"
                            value={plazoFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            ingrese plazo.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>

                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Periodo de cuotas:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Periodo de cuotas"
                            name="periodocuotaFichatecnica"
                            value={periodocuotaFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            ingrese plazo.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row" style={{ background: "white" }}>
                    <div className="col-12  col-md-4">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Inicio del financiamiento:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Inicio del financiamiento"
                            name="iniciofinanciamientoFichatecnica"
                            value={iniciofinanciamientoFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            ingrese plazo.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>

                    <div className="col-12  col-md-4">
                      <Form.Group>
                        <Form.Label style={{ background: "white" }}>
                          Factura negociable:
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          name="facturanegociableFichatecnica"
                          value={facturanegociableFichatecnica}
                          onChange={(e) => {
                            actualizarInput(e);
                          }}
                          required
                        >
                          <option value="" selected disabled hidden>
                            Seleccione opcion
                          </option>
                          <option value="si">Si</option>
                          <option value="no">No</option>
                          <option value="En descuento">En descuento</option>
                        </Form.Select>
                      </Form.Group>
                    </div>

                    <div className="col-12  col-md-4">
                      <Form.Group>
                        <Form.Label style={{ background: "white" }}>
                          Letras anticipadas:
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          name="letraanticipadaFichatecnica"
                          value={letraanticipadaFichatecnica}
                          onChange={(e) => {
                            actualizarInput(e);
                          }}
                          required
                        >
                          <option value="" selected disabled hidden>
                            Seleccione opcion
                          </option>
                          <option value="si">Si</option>
                          <option value="no">No</option>
                          <option value="En descuento">En descuento</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </div>
                  <h3 className="text-primary my-3">Facturacion</h3>
                  <div className="row" style={{ background: "white" }}>
                    <div className="col-12  col-md-4">
                      <Form.Group>
                        <Form.Label style={{ background: "white" }}>
                          Anticipo con la OC:
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          name="anticipoocFichatecnica"
                          value={anticipoocFichatecnica}
                          onChange={(e) => {
                            actualizarInput(e);
                          }}
                          required
                        >
                          <option value="" selected disabled hidden>
                            Seleccione opcion
                          </option>
                          <option value="si">Si</option>
                          <option value="no">No</option>
                        </Form.Select>
                      </Form.Group>
                    </div>

                    <div className="col-12  col-md-4">
                      <Form.Group>
                        <Form.Label style={{ background: "white" }}>
                          A firma de contrato:
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          name="firmacontratoFichatecnica"
                          value={firmacontratoFichatecnica}
                          onChange={(e) => {
                            actualizarInput(e);
                          }}
                          required
                        >
                          <option value="" selected disabled hidden>
                            Seleccione opcion
                          </option>
                          <option value="si">Si</option>
                          <option value="no">No</option>
                        </Form.Select>
                      </Form.Group>
                    </div>

                    <div className="col-12  col-md-4">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Saldo:
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          name="idFacturacion"
                          value={idFacturacion}
                          onChange={(e) => {
                            actualizarInput(e);
                          }}
                          required
                        >
                          <option value="" selected disabled hidden>
                            Seleccione opcion
                          </option>
                          <option value="1">100% contra entrega </option>
                          <option value="2">
                            Contra entrega de materiales
                          </option>
                          <option value="3">
                            Contra avance valorizado de obra
                          </option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </div>
                  <Form.Group className="my-2">
                    <Form.Label style={{ background: "white" }}>
                      Estado:
                    </Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      name="idEstadofichaproyecto"
                      value={idEstadofichaproyecto}
                      onChange={(e) => {
                        actualizarInput(e);
                      }}
                      required
                    >
                      <option value="" selected disabled hidden>
                        Seleccione
                      </option>
                      {estados.map((estado, i) => (
                        <option value={estado.idEstadofichaproyecto} key={i}>
                          {estado.estadoFichaproyecto}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  {/*  */}
                  <h3 className="text-primary my-3">Recursos</h3>
                  {/*  */}
                  <div className="row" style={{ background: "white" }}>
                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Instalacion:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Instalacion"
                            name="instalacionFichatecnica"
                            value={instalacionFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            ingrese instalacion.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>

                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Guardiania:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Guardiania"
                            name="guardianiaFichatecnica"
                            value={guardianiaFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            ingrese guardiania.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>

                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Contenedor Oficina:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Contenedor Oficina"
                            name="contenedoroficinaFichatecnica"
                            value={contenedoroficinaFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            ingrese contenedor oficina.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>

                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Residente de obra:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Residente de obra"
                            name="residenteobraFichatecnica"
                            value={residenteobraFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            ingrese residente de obra.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Vehiculo:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Vehiculo"
                            name="vehiculoFichatecnica"
                            value={vehiculoFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            ingrese vehiculo.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>

                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Prevencionista:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Prevencionista"
                            name="prevencionistaFichatecnica"
                            value={prevencionistaFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            ingrese prevencionista.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>

                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Costos del Proyecto USD:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="USD"
                            name="costoproyectoFichatecnica"
                            value={costoproyectoFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            ingrese costo del proyecto USD.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>

                    <div className="col-12 col-sm-6  col-lg-3">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Margen %:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Margen %"
                            name="margenFichatecnica"
                            value={margenFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            ingrese margen %.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Oportunidades de Optimizacion:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Oportunidades de Optimizacion"
                            name="oportunidadesFichatecnica"
                            value={oportunidadesFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            ingrese oportunidades de optimizacion.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>
                    <div className="col-12 col-md-6">
                      <Form.Group
                        controlId="formBasicText"
                        style={{ background: "white" }}
                      >
                        <Form.Label style={{ background: "white" }}>
                          Riesgos del contrato:
                        </Form.Label>

                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Riesgos del contrato"
                            name="riesgocontratoFichatecnica"
                            value={riesgocontratoFichatecnica}
                            onChange={(e) => {
                              actualizarInput(e);
                            }}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            ingrese riesgos del contrato.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-12 col-md-6">
                      <p className="text-success fw-bold text-uppercase">
                        Utilidad USD:{utilidad.toFixed(4)}
                        {/*  toFixed(2) */}
                      </p>
                      <p className="text-primary fw-bold text-uppercase">
                        Valor venta sin igv USD: {valorVentaSinIgv.toFixed(4)}
                      </p>
                      <p className="text-primary fw-bold text-uppercase">
                        Valor venta con igv USD: {valorVentaConIgv.toFixed(4)}
                      </p>
                      {/*  {fichaEdicion ? (
                        <Button
                          variant="info w-100 py-2  text-white btn btn-success"
                          type="submit"
                          disabled={!botonActivo}
                        >
                          Editar
                        </Button>
                      ) : (
                        <Button
                          variant="info w-100 py-2  text-white btn btn-success"
                          type="submit"
                          disabled={!botonActivo}
                        >
                          Guardar
                        </Button>
                      )} */}
                      <Button
                        variant="info w-100 py-2  text-white btn btn-success"
                        type="submit"
                        //disabled={!botonActivo}
                      >
                        Guardar ficha tecnica
                      </Button>
                    </div>
                    {/* <div className="col-12 col-md-6 ">
                      <Button
                        variant="info w-100 py-2 text-white  btn btn-warning"
                        onClick={() => setActivarFicha(false)}
                      >
                        Retroceder
                      </Button>
                    </div> */}
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrearFichaTecnica;
