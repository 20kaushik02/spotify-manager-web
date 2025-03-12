import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AuthContext } from "../App.tsx";
import { showWarnToastNotification } from "../components/ToastNotification/index.tsx";

function UnAuthOnlyRoutes():React.ReactNode {
  let location = useLocation();
  const auth = useContext(AuthContext);

  const handleRouteRender = () => {
    if (auth !== true) {
      return <Outlet />;
    } else {
      showWarnToastNotification(<p>Already logged in!</p>);
      return <Navigate to={"/"} state={{ from: location }} />;
    }
  };

  return handleRouteRender();
}

export default UnAuthOnlyRoutes;
