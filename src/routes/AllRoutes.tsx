import { Route, Routes } from "react-router-dom";

import AuthOnlyRoutes from "./AuthOnlyRoutes.tsx";
import UnAuthOnlyRoutes from "./UnAuthOnlyRoutes.tsx";

import Landing from "../pages/Landing/index.tsx";
import PageNotFound from "../pages/PageNotFound/index.tsx";
import Graph from "../pages/Graph/index.tsx";
import Login from "../pages/Login/index.tsx";
import Logout from "../pages/Logout/index.tsx";
import HowToUse from "../pages/HowToUse/index.tsx";
import Settings from "../pages/Settings/index.tsx";

const AllRoutes = (): React.ReactNode => {
  return (
    <Routes>
      {/* Routes that require user to be logged in */}
      <Route element={<AuthOnlyRoutes />}>
        <Route path="/logout" element={<Logout />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/graph" element={<Graph />} />
        {/* <Route path="/playlists" element={<Playlists />} /> */}
      </Route>

      {/* Routes that require user to be logged *out* */}
      <Route element={<UnAuthOnlyRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Common routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/how-to" element={<HowToUse />} />

      {/* 404 */}
      <Route path="/page-not-found" element={<PageNotFound />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AllRoutes;
