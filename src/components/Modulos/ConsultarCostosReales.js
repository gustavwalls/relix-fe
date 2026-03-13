import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, InputGroup } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { BsSearch, BsArrowLeft } from "react-icons/bs";
import clienteAxios from "../../config/axios";

const columns = [
  { field: "id", headerName: "N°", width: 60 },
  { field: "codigosoftcomProducto", headerName: "Cód. Softcom", width: 140 },
  { field: "descripcionProducto", headerName: "Descripción", width: 280 },
  { field: "codigoreferenciaProducto", headerName: "Cód. Referencia", width: 140 },
  { field: "undProducto", headerName: "UND", width: 80, align: "center", headerAlign: "center" },
  { field: "marcaProducto", headerName: "Marca", width: 120 },
  { field: "familiaProducto", headerName: "Familia", width: 120 },
  { field: "proveedorProducto", headerName: "Proveedor", width: 150 },
  { field: "costopromedioProducto", headerName: "Costo Promedio $", width: 150, align: "right", headerAlign: "right" },
  { field: "costodisenoProducto", headerName: "Costo Diseño $", width: 140, align: "right", headerAlign: "right" },
  { field: "precioventaunoProducto", headerName: "P. Venta 1 $", width: 120, align: "right", headerAlign: "right" },
  { field: "precioventadosProducto", headerName: "P. Venta 2 $", width: 120, align: "right", headerAlign: "right" },
  { field: "precioventatresProducto", headerName: "P. Venta 3 $", width: 120, align: "right", headerAlign: "right" },
  { field: "precioventacuatroProducto", headerName: "P. Venta 4 $", width: 120, align: "right", headerAlign: "right" },
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
      const mapRow = (item, idx) => ({
        id: idx + 1,
        codigosoftcomProducto: item.codigosoftcomProducto,
        descripcionProducto: item.descripcionProducto,
        codigoreferenciaProducto: item.codigoreferenciaProducto,
        undProducto: item.undProducto,
        marcaProducto: item.marcaProducto,
        familiaProducto: item.familiaProducto,
        proveedorProducto: item.proveedorProducto,
        costopromedioProducto: item.costopromedioProducto,
        costodisenoProducto: item.costodisenoProducto,
        precioventaunoProducto: item.precios ? item.precios.precioventaunoProducto : null,
        precioventadosProducto: item.precios ? item.precios.precioventadosProducto : null,
        precioventatresProducto: item.precios ? item.precios.precioventatresProducto : null,
        precioventacuatroProducto: item.precios ? item.precios.precioventacuatroProducto : null,
      });
      const lista = Array.isArray(data) ? data : [data];
      setResultados(lista.map(mapRow));
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
                  placeholder="Ej:0280020021"
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
                <Box sx={{ height: 300, width: "100%" }}>
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
