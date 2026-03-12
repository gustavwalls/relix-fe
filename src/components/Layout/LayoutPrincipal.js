import React from "react";
import Sidebar from "../../view/Sidebar";

function LayoutPrincipal(props) {
  return (
    <>
      <Sidebar/>
      {/* <Navbar /> */}
      <div style={{ marginBottom: "0px" }} ></div>
      {props.children}
    </>
  );
}

export default LayoutPrincipal;
