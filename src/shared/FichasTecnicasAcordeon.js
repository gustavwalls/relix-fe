import React from "react";
import { Accordion, Button, Card } from "react-bootstrap";
import { AiOutlineSave } from "react-icons/ai";
function FichasTecnicasAcordeon({
  title,
  fichasTecnicas,
  loading,
  btnVerTabla,
  sitio,
  fichaSeleccionadaId,
}) {
  return (
    <div className="row">
      <Accordion defaultActiveKey="0" className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header className="text-uppercase">
            {title}
          </Accordion.Header>
          <Accordion.Body>
            <div
              className="row p-3"
              style={{ height: "300px", overflow: "auto" }}
            >
              {loading ? (
                <p className="text-uppercase h2 fw-bolder text-primary">
                  Cargando Informacion...
                </p>
              ) : fichasTecnicas.length > 0 ? (
                fichasTecnicas.map((fichaTecnica) => (
                  <div className="col-12 col-md-3 col-lg-3 mb-3" key={fichaTecnica.idFichatecnica}>
                    <Card className={`cambiarcolores${fichaTecnica.idFichatecnica === fichaSeleccionadaId ? " bg-secondary text-white" : ""}`}>
                      <Card.Body>
                        <Card.Title className="text-uppercase">
                          <span>{fichaTecnica.nombreFichatecnica}</span>-{" "}
                          {fichaTecnica.numFichatecnica}
                        </Card.Title>
                        <Card.Subtitle className="mb-2  text-uppercase border border text-center rounded p-2">
                          {fichaTecnica.estadoFichaproyecto}
                        </Card.Subtitle>

                        <Button
                          className="btn btn-success mx-2 py-0 text-uppercase"
                          onClick={() => btnVerTabla(fichaTecnica)}
                        >
                          Ver Lista de Materiales
                        </Button>
                        {sitio == "ingeniero" &&
                          (fichaTecnica.envio_ingeniero_fichatecnica == "0" ? (
                            <>
                              <p className="bg-warning text-dark px-2 rounded text-uppercase mt-3 text-center">
                                Sin guardar
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="bg-primary text-light p-1 rounded text-uppercase mt-3 text-center">
                                Guardado
                              </p>
                            </>
                          ))}
                        {sitio == "backoffice" &&
                          (fichaTecnica.aprobaciongerenteFichatecnica == "0" &&
                          fichaTecnica.aprobaciongerenteFichatecnica == "0" ? (
                            <>
                              <p className="bg-warning text-dark px-2 rounded text-uppercase text-center mt-3">
                                Sin aceptar
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="bg-primary text-light p-1 rounded text-uppercase text-center mt-3">
                                Aceptado
                              </p>
                            </>
                          ))}
                      </Card.Body>
                    </Card>
                  </div>
                ))
              ) : (
                <p className="text-warning">
                  No hay Fichas técnicas para editar
                </p>
              )}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default FichasTecnicasAcordeon;
