import React from "react";
import ImgRelix from "../../img/LogoRelixPeru.jpg";
function Bienvenido() {
  return (
    <div className="container pt-4">
      <div className="my-4 text-center container ">
        <h4 className=" fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
        BIENVENIDO AL PROGRAMA DE GESTION DE PROYECTOS
        </h4>
      </div>
      <hr></hr>
      <div className="w-100 d-flex justify-content-center pt-5">
      <img src={ImgRelix} alt="" className="img-fluid" width="250px" />
      </div>
      
    </div>
  );
}

export default Bienvenido;
