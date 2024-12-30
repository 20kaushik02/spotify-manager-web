import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AuthContext } from "../App";
import { showWarnToastNotification } from "../components/ToastNotification";

function UnAuthOnlyRoutes() {
  let location = useLocation();
  const auth = useContext(AuthContext);

  const handleRouteRender = () => {
    if (auth !== true) {
      return <Outlet />;
    } else {
      showWarnToastNotification(<p>Already logged in!</p>);
      return <Navigate to={"/graph"} state={{ from: location }} />;
    }
  };

  return handleRouteRender();
}

export default UnAuthOnlyRoutes;
