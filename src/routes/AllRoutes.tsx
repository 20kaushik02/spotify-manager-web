import { Route, Routes } from "react-router-dom";

import AuthOnlyRoutes from "./AuthOnlyRoutes";
import UnAuthOnlyRoutes from "./UnAuthOnlyRoutes";

import Landing from "../pages/Landing";
import PageNotFound from "../pages/PageNotFound";
import Graph from "../pages/Graph";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import HowToUse from "../pages/HowToUse";

const AllRoutes = () => {
  return (
    <Routes>
      {/* Routes that require user to be logged in */}
      <Route element={<AuthOnlyRoutes />}>
        <Route path="/logout" element={<Logout />} />
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
