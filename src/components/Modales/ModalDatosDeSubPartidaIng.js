import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import clienteAxios from "../../config/axios";

function ModalDatosDeSubPartidaIng({
  show3,
  setShow3,
  fichaTecnica,
  dataModalSubPartidasIng,
}) {
  const handleClose = () => setShow3(false);
  // console.log('haber data',dataModalSubPartidasIng)
  const { idFichatecnica } = fichaTecnica;
  const { modulo, partida, subpartida } = dataModalSubPartidasIng;
  // console.log('haber id  fichaTecnica',idFichatecnica)

  const [dataIng, setDataIng] = useState(null);

  const peticionMostrarDatosSubPartidaIng = async (
    idFichatecnica,
    dataModalSubPartidasIng
  ) => {
    //    console.log('entraste a peticionMostrarDatosPartidaIng')
    try {
      if(idFichatecnica == undefined){
        return;
      }else{
        const { data } = await clienteAxios.post(
          `/datosSubPartidaProyectoIngeniero/${idFichatecnica}`,
          dataModalSubPartidasIng
        );
  
        // console.log("peticionMostrarDatosPartidaIng ==> ", data);
        setDataIng(data);
        return data;
      }
     
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    peticionMostrarDatosSubPartidaIng(idFichatecnica, dataModalSubPartidasIng);
  }, [show3]);

  return (
    <Modal
      show={show3}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-uppercase text-success fw-bold">
          <p>{fichaTecnica.nombreFichatecnica}</p>
          <p>Modulo : {modulo}</p>
          <p>Partida: {partida}</p>
          <p>Subpartida: {subpartida}</p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {dataIng ? (
          <>
            <table className="table">
              <tbody>
                <tr>
                  <td>Partidas:</td>
                  <td className="text-end">{dataIng.PARTIDAS}</td>
                </tr>

                <tr>
                  <td>Subtotal por modulo ($):</td>
                  <td className="text-end">{dataIng.SUBTOTAL_X_MODULO}</td>
                </tr>

                <tr>
                  <td>Descuento total por modulo ($): </td>
                  <td className="text-end">
                    {dataIng.DESCUENTO_TOTAL_X_MODULO}
                  </td>
                </tr>

                <tr>
                  <td>SubTotal con descuento por modulo ($):</td>
                  <td className="text-end">
                    {dataIng.SUBTOTAL_CON_DESCUENTO_X_MODULO}
                  </td>
                </tr>

                <tr>
                  <td>IGV 18%:</td>
                  <td className="text-end"> {dataIng.IGV}</td>
                </tr>

                <tr>
                  <td>Total por modulo ($):</td>
                  <td className="text-end">{dataIng.TOTAL_X_MODULO}</td>
                </tr>

                <tr>
                  <td>Costo diseño por modulo ($):</td>
                  <td className="text-end"> {dataIng.COSTO_DISENO_X_MODULO}</td>
                </tr>

                <tr>
                  <td>Margen total por modulo %:</td>
                  <td className="text-end">{dataIng.MARGEN_TOTAL_X_MODULO}</td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <>SELECIONE UN MODULO Y PARTIDA</>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalDatosDeSubPartidaIng;
