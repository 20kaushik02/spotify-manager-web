import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AuthContext } from "../App.tsx";
import { showWarnToastNotification } from "../components/ToastNotification/index.tsx";

function AuthOnlyRoutes():React.ReactNode {
  let location = useLocation();
  const auth = useContext(AuthContext);

  const handleRouteRender = () => {
    if (auth !== true) {
      showWarnToastNotification(<p>Sign in, please!</p>);
      return <Navigate to={"/login"} state={{ from: location }} />;
    } else {
      return <Outlet />;
    }
  };

  return handleRouteRender();
}

export default AuthOnlyRoutes;
