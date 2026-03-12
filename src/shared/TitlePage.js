import React from "react";

export default function TitlePage({title}) {
  return (
    <div className="container-fluid pt-4">
      <div className="my-4 text-center container ">
        <h4 className=" fw-bold border border-secondary rounded p-3 shadow mb-2 bg-body text-uppercase">
          {title}
        </h4>
      </div>
    </div>
  );
}
