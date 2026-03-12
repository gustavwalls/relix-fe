import React from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function ModelDetalleGeneral({ show, setShow, detalleGeneral, fichaTecnica }) {
  const handleClose = () => setShow(false);
  // console.log("haber detalleGeneral en modal =>", detalleGeneral);
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-uppercase text-success fw-bold">
            Detalle general  - {fichaTecnica.nombreFichatecnica}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detalleGeneral.length > 0 && (
            <div className="card my-3 p-3 w-100">
              <div className="card-body">
                <table className="table">
                  <tbody>
                    <tr>
                      <td>SUB-TOTAL VENTA USD:</td>
                      <td className="text-end"> {detalleGeneral[0].SUBTOTAL_X_PROYECTO != null ? (
                    `${detalleGeneral[0].SUBTOTAL_X_PROYECTO.toLocaleString(
                      "en"
                    )}`
                  ) : (
                    <span className="text-danger">No hay Nada</span>
                  )}</td>
                    </tr>

                    <tr>
                      <td> DESCUENTO USD:</td>
                      <td className="text-end">{detalleGeneral[0].DESCUENTO_TOTAL_X_PROYECTO != null ? (
                    `${detalleGeneral[0].DESCUENTO_TOTAL_X_PROYECTO.toLocaleString(
                      "en"
                    )}`
                  ) : (
                    <span className="text-danger">No hay Nada</span>
                  )}</td>
                    </tr>

                    <tr>
                      <td>SUB-TOTAL VENTA CON DESCUENTO USD:{" "}</td>
                      <td className="text-end">{detalleGeneral[0].SUBTOTAL_CON_DESCUENTO_X_PROYECTO !=
                  null ? (
                    detalleGeneral[0].SUBTOTAL_CON_DESCUENTO_X_PROYECTO.toLocaleString(
                      "en"
                    )
                  ) : (
                    <span className="text-danger">No hay Nada</span>
                  )}</td>
                    </tr>

                    <tr>
                      <td>IGV 18%:{" "}</td>
                      <td className="text-end">{detalleGeneral[0].IGV != null ? (
                    ` ${detalleGeneral[0].IGV} `
                  ) : (
                    <span className="text-danger">No hay Nada</span>
                  )}</td>
                    </tr>

                    <tr>
                      <td>TOTAL VENTA USD:{" "}</td>
                      <td className="text-end">{detalleGeneral[0].TOTAL_X_PROYECTO != null ? (
                    `${detalleGeneral[0].TOTAL_X_PROYECTO} `
                  ) : (
                    <span className="text-danger">No hay Nada</span>
                  )}</td>
                    </tr>

                    <tr>
                      <td>  TOTAL COSTO DE DISEÑO USD:{" "}</td>
                      <td className="text-end">{detalleGeneral[0].COSTO_DISENO_X_PROYECTO != null ? (
                    detalleGeneral[0].COSTO_DISENO_X_PROYECTO
                  ) : (
                    <span className="text-danger">No hay Nada</span>
                  )}</td>
                    </tr>

                    <tr>
                      <td>  MARGEN FINAL % :{" "}</td>
                      <td className="text-end">{detalleGeneral[0].MARGEN_TOTAL_X_PROYECTO != null ? (
                    detalleGeneral[0].MARGEN_TOTAL_X_PROYECTO
                  ) : (
                    <span className="text-danger">No hay Nada</span>
                  )}</td>
                    </tr>


                  </tbody>
                </table>

            {/*     <p className="text-dark fw-bold">
                  SUB-TOTAL ($):{" "}
                  {detalleGeneral[0].SUBTOTAL_X_PROYECTO != null ? (
                    `${detalleGeneral[0].SUBTOTAL_X_PROYECTO.toLocaleString(
                      "en"
                    )}`
                  ) : (
                    <span className="text-danger">No hay Nada</span>
                  )}
                </p>
                <p className="text-dark fw-bold">
                  DESCUENTO ($):{" "}
                  {detalleGeneral[0].DESCUENTO_TOTAL_X_PROYECTO != null ? (
                    `${detalleGeneral[0].DESCUENTO_TOTAL_X_PROYECTO.toLocaleString(
                      "en"
                    )}`
                  ) : (
                    <span className="text-danger">No hay Nada</span>
                  )}
                </p>
                <p className="text-dark fw-bold">
                  SUB-TOTAL CON DESCUENTO ($):{" "}
                  {detalleGeneral[0].SUBTOTAL_CON_DESCUENTO_X_PROYECTO !=
                  null ? (
                    detalleGeneral[0].SUBTOTAL_CON_DESCUENTO_X_PROYECTO.toLocaleString(
                      "en"
                    )
                  ) : (
                    <span className="text-danger">No hay Nada</span>
                  )}
                </p>
                <p className="text-dark fw-bold">
                  IGV 18%:{" "}
                  {detalleGeneral[0].IGV != null ? (
                    ` ${detalleGeneral[0].IGV} `
                  ) : (
                    <span className="text-danger">No hay Nada</span>
                  )}
                </p>
                <p className="text-dark fw-bold">
                  TOTAL ($):{" "}
                  {detalleGeneral[0].TOTAL_X_PROYECTO != null ? (
                    `${detalleGeneral[0].TOTAL_X_PROYECTO} `
                  ) : (
                    <span className="text-danger">No hay Nada</span>
                  )}
                </p>
                <p className="text-dark fw-bold">
                  COSTO DISEÑO ($):{" "}
                  {detalleGeneral[0].COSTO_DISENO_X_PROYECTO != null ? (
                    detalleGeneral[0].COSTO_DISENO_X_PROYECTO
                  ) : (
                    <span className="text-danger">No hay Nada</span>
                  )}
                </p>
                <p className="text-dark fw-bold">
                  MARGEN %:{" "}
                  {detalleGeneral[0].MARGEN_TOTAL_X_PROYECTO != null ? (
                    detalleGeneral[0].MARGEN_TOTAL_X_PROYECTO
                  ) : (
                    <span className="text-danger">No hay Nada</span>
                  )}
                </p> */}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModelDetalleGeneral;
