import { Route, Routes } from "react-router-dom";

import AuthOnlyRoutes from "./AuthOnlyRoutes";
import UnAuthOnlyRoutes from "./UnAuthOnlyRoutes";

import Landing from "../pages/Landing";
import PageNotFound from "../pages/PageNotFound";
import Graph from "../pages/Graph";
import Login from "../pages/Login";
import Logout from "../pages/Logout";

const AllRoutes = () => {
  return (
    <Routes>
      {/* Routes that require user to be logged in */}
      <Route element={<AuthOnlyRoutes />}>
        <Route exact path="/logout" element={<Logout />} />
        <Route exact path="/graph" element={<Graph />} />
        {/* <Route exact path="/playlists" element={<Playlists />} /> */}
      </Route>

      {/* Routes that require user to be logged *out* */}
      <Route element={<UnAuthOnlyRoutes />}>
        <Route exact path="/login" element={<Login />} />
      </Route>

      {/* Common routes */}
      <Route exact path="/" element={<Landing />} />

      {/* 404 */}
      <Route exact path="/page-not-found" element={<PageNotFound />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AllRoutes;
