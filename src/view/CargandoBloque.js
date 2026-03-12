import React from 'react'
import Spinner from "react-bootstrap/Spinner";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
export default function CargandoBloque() {
  return (
    <div className="d-flex justify-content-center align-content-center flex-column">
    <p className="text-center">Cargando Informacion</p>
    <div className="d-flex justify-content-center">
    <Spinner animation="grow" variant="primary" />
    <Spinner animation="grow" variant="secondary" />
    <Spinner animation="grow" variant="success" />
    </div>
  
  </div>
  )
}
