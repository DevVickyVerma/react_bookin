import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";

export default function Custompages() {
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
}
