import React from "react";
import Spinner from "react-bootstrap/Spinner";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
function Cargando() {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleBackdropClick = (event) => {
    event.stopPropagation();
  };
  return (
    <Modal
      open={open}
      onClose={null}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onClick={handleBackdropClick}
    >
      <Box sx={style}>
        <div id="modal-modal-description" sx={{ mt: 2 }}>
          <div className="d-flex justify-content-center align-content-center flex-column">
            <p className="text-center">Sistema de Gestion de Proyectos RELIX</p>
            <div className="d-flex justify-content-center">
            <Spinner animation="grow" variant="primary" />
            <Spinner animation="grow" variant="secondary" />
            <Spinner animation="grow" variant="success" />
            </div>
          
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default Cargando;
