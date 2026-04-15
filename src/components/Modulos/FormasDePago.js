import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";

const ITEMS_POR_PAGINA = 10;

function FormasDePago() {
  const [formasDePago, setFormasDePago] = useState([]);
  const [nuevaForma, setNuevaForma] = useState({ codFormaPago: "", desFormaPago: "" });
  const { codFormaPago, desFormaPago } = nuevaForma;
  const [value, setValue] = useState("1");
  const [pagina, setPagina] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setPagina(1);
  };

  const obtenerFormasDePago = async () => {
    try {
      const { data } = await clienteAxios.get("/api/v1/formas-pagos");
      setFormasDePago(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerFormasDePago();
  }, []);

  const actualizarInput = (e) => {
    setNuevaForma({ ...nuevaForma, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (codFormaPago === "" || desFormaPago === "") {
      Swal.fire({ icon: "error", title: "Oops...", text: "No puede haber campos en blanco" });
      return;
    }
    const payload = { codFormaPago, desFormaPago, flgEstado: "1" };
    try {
      const { data } = await clienteAxios.post("/api/v1/formas-pagos", payload);
       Swal.fire({ position: "top-end", icon: "success", title: "Forma de pago agregado correctamente", showConfirmButton: false, timer: 2500 });
      setNuevaForma({ codFormaPago: "", desFormaPago: "" });
      obtenerFormasDePago();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error && error.response && error.response.data && error.response.data.messages ? error.response.data.messages.error : "Error al registrar, codigo repetido" });
    }
  };

  const inactivarFormaDePago = async (item) => {
    const confirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Estás seguro?",
      text: "¿Quieres inactivar esta forma de pago?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Sí, inactivar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#d32f2f",
    });
    if (!confirmacion.isConfirmed) return;
    const payload = {
      codFormaPago: item.codFormaPago,
      desFormaPago: item.desFormaPago,
      flgEstado: 0,
    };
    try {
      await clienteAxios.put("/api/v1/formas-pagos/" + item.idFormaPago, payload);
      Swal.fire({ position: "top-end", icon: "success", title: "Forma de pago inactivada correctamente", showConfirmButton: false, timer: 2500 });
      obtenerFormasDePago();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error && error.response && error.response.data && error.response.data.messages ? error.response.data.messages.error : "Error al inactivar" });
    }
  };

  const activarFormaDePago = async (item) => {
    const payload = {
      codFormaPago: item.codFormaPago,
      desFormaPago: item.desFormaPago,
      flgEstado: 1,
    };
    try {
      const { data } = await clienteAxios.put("/api/v1/formas-pagos/" + item.idFormaPago, payload);
        Swal.fire({ position: "top-end", icon: "success", title: "Forma de pago activada correctamente", showConfirmButton: false, timer: 2500 });
      obtenerFormasDePago();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error && error.response && error.response.data && error.response.data.messages ? error.response.data.messages.error : "Error al activar" });
    }
  };

  const editarFormaDePago = async (item) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Forma de Pago",
      html:
        '<div style="text-align:left;margin-bottom:16px">' +
          '<label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:4px;color:#555">Código de forma de pago</label>' +
          '<input id="swal-codigo" class="swal2-input" style="margin:0;width:100%" placeholder="Código de forma de pago" value="' + item.codFormaPago + '">' +
        '</div>' +
        '<div style="text-align:left">' +
          '<label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:4px;color:#555">Descripción de forma de pago</label>' +
          '<input id="swal-descripcion" class="swal2-input" style="margin:0;width:100%" placeholder="Descripción de forma de pago" value="' + item.desFormaPago + '">' +
        '</div>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const cod = document.getElementById("swal-codigo").value.trim();
        const des = document.getElementById("swal-descripcion").value.trim();
        if (!cod || !des) {
          Swal.showValidationMessage("No puede haber campos en blanco");
          return false;
        }
        return {
          codFormaPago: cod,
          desFormaPago: des,
          flgEstado: item.flgEstado,
        };
      },
    });
    if (!formValues) return;
    try {
      const { data } = await clienteAxios.put("/api/v1/formas-pagos/" + item.idFormaPago, formValues);
          Swal.fire({ position: "top-end", icon: "success", title: "Forma de pago edito correctamente", showConfirmButton: false, timer: 2500 });
      obtenerFormasDePago();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error && error.response && error.response.data && error.response.data.messages ? error.response.data.messages.error : "Error al editar" });
    }
  };

  // Paginado
  const totalPaginas = Math.ceil(formasDePago.length / ITEMS_POR_PAGINA);
  const inicio = (pagina - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;
  const paginaActual = formasDePago.slice(inicio, fin);

  return (
    <div className="container pt-4">
      <div className="my-4 text-center container">
        <h4 className="fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
          Formas de Pago
        </h4>
      </div>

      <div className="container">
        <TabContext value={value}>
          <TabList aria-label="tabs formas de pago" onChange={handleChange}>
            <Tab label="Listado" value="1" />
            <Tab label="Agregar forma de pago" value="2" />
          </TabList>

          <TabPanel value="1">
            <div className="row">
              <div className="col-12">
                <table className="table table-bordered w-100">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginaActual.map((item, i) => (
                      <tr key={i}>
                        <td>{item.idFormaPago}</td>
                        <td>{item.codFormaPago}</td>
                        <td>{item.desFormaPago}</td>
                        <td>
                          <span className={item.flgEstado === "1" || item.flgEstado === 1 ? "text-success fw-semibold" : "text-secondary fw-semibold"}>
                            {item.flgEstado === "1" || item.flgEstado === 1 ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm me-1"
                            title="Editar"
                            onClick={() => editarFormaDePago(item)}
                            style={{ color: "#1976d2" }}
                          >
                            <i className="bx bx-pencil" style={{ fontSize: "1.2rem" }}></i>
                          </button>
                          <button
                            className="btn btn-sm me-1"
                            title="Eliminar"
                            onClick={() => inactivarFormaDePago(item)}
                            style={{ color: "#d32f2f" }}
                          >
                            <i className="bx bx-x" style={{ fontSize: "1.2rem" }}></i>
                          </button>
                          <button
                            className="btn btn-sm"
                            title="Activar"
                            onClick={() => activarFormaDePago(item)}
                            style={{ color: "#388e3c" }}
                          >
                            <i className="bx bx-check" style={{ fontSize: "1.2rem" }}></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {formasDePago.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">
                          No hay formas de pago registradas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Paginado */}
                {formasDePago.length > 0 && (
                  <div className="d-flex justify-content-end align-items-center gap-3 mt-2">
                    <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                      {inicio + 1}–{Math.min(fin, formasDePago.length)} of {formasDePago.length}
                    </span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={pagina === 1}
                      onClick={() => setPagina(pagina - 1)}
                    >
                      <i className="bx bx-chevron-left"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={pagina === totalPaginas || totalPaginas === 0}
                      onClick={() => setPagina(pagina + 1)}
                    >
                      <i className="bx bx-chevron-right"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </TabPanel>

          <TabPanel value="2">
            <div className="row d-flex justify-content-center">
              <div className="col-12 col-md-12 col-lg-8 col-xl-6">
                <Form
                  className="border border-2 border-secondary rounded p-3"
                  onSubmit={handleSubmit}
                >
                  <Form.Group className="mb-3">
                    <Form.Label className="text-uppercase">Código de forma de pago</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese código"
                      name="codFormaPago"
                      value={codFormaPago}
                      onChange={actualizarInput}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-uppercase">Descripción de forma de pago</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese descripción"
                      name="desFormaPago"
                      value={desFormaPago}
                      onChange={actualizarInput}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Registrar
                  </Button>
                </Form>
              </div>
            </div>
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
}

export default FormasDePago;
