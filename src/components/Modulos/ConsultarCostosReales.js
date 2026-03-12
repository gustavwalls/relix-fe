import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, InputGroup } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { BsSearch, BsArrowLeft } from "react-icons/bs";
import clienteAxios from "../../config/axios";

const columns = [
  { field: "id", headerName: "N°", width: 60 },
  {
    field: "codigoRelix",
    headerName: "Código Relix",
    width: 150,
    align: "left",
  },
  {
    field: "descripcion",
    headerName: "Descripción",
    width: 300,
  },
  {
    field: "unidad",
    headerName: "UND",
    width: 80,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "cantidadReal",
    headerName: "Cantidad Real",
    width: 130,
    align: "right",
    headerAlign: "right",
  },
  {
    field: "costoUnitarioReal",
    headerName: "Costo Unit. Real $",
    width: 160,
    align: "right",
    headerAlign: "right",
    valueFormatter: (params) =>
      params.value != null ? params.value.toFixed(2) : "",
  },
  {
    field: "costoTotalReal",
    headerName: "Costo Total Real $",
    width: 160,
    align: "right",
    headerAlign: "right",
    valueFormatter: (params) =>
      params.value != null ? params.value.toFixed(2) : "",
  },
  {
    field: "proveedor",
    headerName: "Proveedor",
    width: 180,
  },
  {
    field: "fechaRegistro",
    headerName: "Fecha Registro",
    width: 140,
    align: "center",
    headerAlign: "center",
  },
];

function ConsultarCostosReales() {
  const navigate = useNavigate();
  const [codigoRelix, setCodigoRelix] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscado, setBuscado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!codigoRelix.trim()) return;

    setLoading(true);
    setError("");
    setResultados([]);
    setBuscado(false);

    try {
      const { data } = await clienteAxios.get(`/productos/${codigoRelix.trim()}`);
      setResultados(Array.isArray(data) ? data : [{ ...data, id: 1 }]);
      setBuscado(true);
    } catch (err) {
      const msg =
        err.response && err.response.data && err.response.data.messages
          ? err.response.data.messages.error
          : "Error al consultar el producto.";
      setError(msg);
      setBuscado(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid pt-4">
      {/* Encabezado */}
      <div className="my-4 text-center container">
        <h4 className="fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
          Consultar Costos Reales
        </h4>
      </div>

      {/* Botón volver */}
      <div className="container mb-4">
        <button
          className="btn btn-secondary btn-sm text-uppercase"
          onClick={() => navigate("/ver-fichas-tecnicas-gerente-general")}
        >
          <BsArrowLeft className="h5 m-0 p-0 pe-1" />
          Volver
        </button>
      </div>

      {/* Buscador */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <Form onSubmit={handleBuscar}>
              <Form.Label className="fw-bold text-uppercase">
                Digitar codigo relix
              </Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Ej: REL-001"
                  value={codigoRelix}
                  onChange={(e) => setCodigoRelix(e.target.value)}
                  autoFocus
                />
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading || !codigoRelix.trim()}
                >
                  <BsSearch className="me-1" />
                  {loading ? "Buscando..." : "Buscar"}
                </Button>
              </InputGroup>
            </Form>
          </div>
        </div>

        {/* Resultados */}
        {buscado && (
          <div className="mt-3">
            {error ? (
              <div className="alert alert-warning text-uppercase fw-bold">
                {error}
              </div>
            ) : resultados.length === 0 ? (
              <div className="alert alert-warning text-uppercase fw-bold">
                No se encontraron resultados para el código{" "}
                <strong>"{codigoRelix}"</strong>
              </div>
            ) : (
              <>
                <p className="text-success fw-bold text-uppercase">
                  {resultados.length} resultado(s) encontrado(s)
                </p>
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    columns={columns}
                    rows={resultados}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                  />
                </Box>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConsultarCostosReales;
