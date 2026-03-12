import React, { useEffect } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import Vendedor from "./Vendedor/Vendedor";
import ListGroup from "react-bootstrap/ListGroup";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
function RegistrarVendedor() {
  ////////////////////////////////////////////////////////hooks
  const [registrarVendedor, setRegistrarVendedor] = useState({
    codigo: "",
    nombre: "",
  });
  const { codigo, nombre } = registrarVendedor;
  const [todosLosVendedores, setTodosLosVendedores] = useState([]);
  const [usuariosConRol, setUsuariosConRol] = useState([]);
  const [usuariosConVendedores, setUsuariosConVendedores] = useState([]);
  ////////////////////////////////////////////////////consumo de api
  const peticionRegistrarVendedor = async (datos) => {
    try {
      const respuesta = await clienteAxios.post("/vendedor", datos);
      console.log("POST de peticionRegistrarVendedor ->", respuesta.data);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${respuesta.data}`,
        showConfirmButton: false,
        timer: 2500,
      });
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
  

  const obtenerVendedores = async () => {
    try {
      const { data } = await clienteAxios.get("/vendedor");
      setTodosLosVendedores(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const obtenerUsuariosConRol = async () => {
    try {
      const { data } = await clienteAxios.get("/api/UsuarioIngeniero");
      setUsuariosConRol(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const obtenerUsuariosConVendedores = async () => {
    try {
      const { data } = await clienteAxios.get("/api/UsuarioVendedor");
      setUsuariosConVendedores(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerVendedores();
    obtenerUsuariosConRol();
    obtenerUsuariosConVendedores();
  }, []);

  const actualizarIdUsuarioConVendedor = async (datos) => {
    //console.log("envio esto", idVendedor, idUsuario);
    try {
      const { data } = await clienteAxios.put(`/vendedor`, datos, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      /* console.log("haber respuesta", data); */
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${data}`,
        showConfirmButton: false,
        timer: 2700,
      });
     await obtenerUsuariosConVendedores()
      return data;
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.messages.error}`,
      });
    }
  };

  ////////////////////////////////////////////////////////////
  const actualizarInput = (e) => {
    setRegistrarVendedor({
      ...registrarVendedor,
      [e.target.name]: e.target.value,
    });
  };
  //////////////////////////////////REGISTRO
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("haber registrarVendedor", registrarVendedor);
    peticionRegistrarVendedor(registrarVendedor);
    setRegistrarVendedor({
      codigo: "",
      nombre: "",
    });
  };

  ///asignar vendedor
  const [idUsuario, setIdUsuario] = useState("");
  const [idVendedor, setIdVendedor] = useState("");
  const asignarVendedor = (e) => {
    e.preventDefault();
    //console.log("id del usario", idUsuario, "id vendedor", idVendedor);
    const data = {
      idVendedor: idVendedor,
      ID: idUsuario,
    };
    actualizarIdUsuarioConVendedor(data);
  };

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const peticionDesvincularVendedor = async (datos) => {
    try {
      const respuesta = await clienteAxios.put("/vendedorDesvincular", datos);
      console.log("put de peticionDesvincularVendedor ->", respuesta.data);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${respuesta.data}`,
        showConfirmButton: false,
        timer: 2500,
      });
      obtenerUsuariosConVendedores()
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
  const desvincularVendedor=(item)=>{
    const data = {
      ID_VENDEDOR: item.ID_VENDEDOR,
      ID: item.ID,
    };
    console.log('haber data' ,data);
    peticionDesvincularVendedor(data)
    obtenerUsuariosConVendedores()
  }
  return (
    <div className="container pt-4 ">
      <div className="my-4 text-center container ">
        <h4 className=" fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
          Registro de vendedor
        </h4>
      </div>

      <div className="container">
        <TabContext value={value}>
          <TabList aria-label="tabs example" onChange={handleChange}>
            <Tab label="Registrar vendedor" value="1" />
            <Tab label="Asignar vendedor" value="2" />
            <Tab label="Desvincular vendedor" value="3" />
          </TabList>
          <TabPanel value="1">
            {" "}
            <div className="row d-flex justify-content-center">
              <div className="col-12 col-md-12 col-lg-8 col-xl-6 col-xxl-6">
                <Form
                  className="border border-2 border-secondary rounded p-3"
                  onSubmit={handleSubmit}
                >
                  <Form.Group className="mb-3">
                    <Form.Label>Codigo</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Ingrese codigo"
                      name="codigo"
                      value={codigo}
                      onChange={(e) => actualizarInput(e)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese nombre"
                      name="nombre"
                      value={nombre}
                      onChange={(e) => actualizarInput(e)}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Registrar
                  </Button>
                </Form>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="2">
            {" "}
            <div className="row">
              <div className="col-12 col-md-8">
                <Form onSubmit={asignarVendedor}>
                  <Form.Group controlId="formBasicText">
                    <Form.Label className="text-uppercase">
                      seleccione un usuario:
                    </Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => setIdUsuario(e.target.value)}
                    >
                      <option value="" selected disabled hidden>
                        Seleccione opcion
                      </option>
                      {usuariosConRol.map((usuario, i) => (
                        <option value={usuario.ID} key={i}>
                          {usuario.NOMBRE}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Button variant="primary text-uppercase my-3" type="submit">
                    Asignar
                  </Button>
                </Form>
              </div>
              <div className="col-12 col-md-4">
                <p className="text-uppercase text-primary fw-bold">
                  Seleccione un vendedor
                </p>
                <ListGroup>
                  {todosLosVendedores.map((vendedor, i) => (
                    <Vendedor
                      vendedor={vendedor}
                      key={i}
                      i={i}
                      setIdVendedor={setIdVendedor}
                    />
                  ))}
                </ListGroup>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="3">
            <div className="row">
              <div className="col-12">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Vendedor</th>
                      <th>Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosConVendedores.map((item, i) => (
                      <tr key={i}>
                        <td>{item.NOMBRE}</td>
                        <td>{item.NOMBRE_VENDEDOR}</td>
                        <td>
                          <button className="btn btn-danger" onClick={()=>desvincularVendedor(item)}>
                            Desvincular
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
}

export default RegistrarVendedor;
