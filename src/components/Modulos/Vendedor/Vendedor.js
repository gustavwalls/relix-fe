import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
function Vendedor({ vendedor, i, setIdVendedor }) {
  const agarrarIdVendedor = (id) => {
    console.log("haber id vendedor", id);
    setIdVendedor(id);
  };
  return (
    <ListGroup.Item
      action
      href={`#link${i + 1}`}
      className="text-uppercase"
      onClick={() => agarrarIdVendedor(vendedor.idVendedor)}
    >
      {vendedor.nombreVendedor}
    </ListGroup.Item>
  );
}

export default Vendedor;
