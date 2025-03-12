// Libraries
import { createContext, useEffect, useState, type Context } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Styles
import styles from "./App.module.css";

// Assets

// Utils
import ScrollToTop from "./utils/ScrollToTop.tsx";

// Components
import Navbar from "./components/Navbar/index.tsx";

// Routes
import AllRoutes from "./routes/AllRoutes.tsx";
import {
  showErrorToastNotification,
  showInfoToastNotification,
  showWarnToastNotification,
} from "./components/ToastNotification/index.tsx";
import { apiAuthCheck, apiAuthRefresh } from "./api/auth.ts";
import { ReactFlowProvider } from "@xyflow/react";

// Contexts
export const WidthContext: Context<number> = createContext(0);
export const AuthContext: Context<boolean> = createContext(false);
export const RefreshAuthContext: Context<() => Promise<boolean>> =
  createContext(async () => false as boolean); // why is this needed...

function App(): React.ReactNode {
  // States
  const [width, setWidth] = useState(0);
  const [auth, setAuth] = useState(false);

  const refreshAuth = async () => {
    const resp = await apiAuthCheck();
    if (resp === undefined) {
      showErrorToastNotification("Please try again after sometime");
      setAuth(false);
      return false;
    }
    if (resp.status === 200) {
      // Success
      setAuth(true);
      return true;
    }
    if (resp.status >= 500) {
      setAuth(false);
      showErrorToastNotification(resp.data.message);
      return false;
    }
    if (resp.status === 401) {
      // reauth
      const refreshResp = await apiAuthRefresh();
      if (refreshResp === undefined) {
        showErrorToastNotification("Please try again after sometime");
        setAuth(false);
        return false;
      }
      if (refreshResp.status === 200) {
        // Success
        showInfoToastNotification("Refreshed session.");
        setAuth(true);
        return true;
      }
      if (refreshResp.status >= 500) {
        setAuth(false);
        showErrorToastNotification(refreshResp.data.message);
        return false;
      }
      if (refreshResp.status === 401) {
        // not authed
        setAuth(false);
        return false;
      }
      setAuth(false);
      showWarnToastNotification(refreshResp.data.message);
      return false;
    }
    setAuth(false);
    showWarnToastNotification(resp.data.message);
    return false;
  };

  useEffect(() => {
    (async () => {
      await refreshAuth();
    })();
  }, []);

  const updateWindowDimensions = () => {
    setWidth(window.innerWidth);
  };

  // Get window dimensions on resize
  useEffect(() => {
    window.addEventListener("resize", updateWindowDimensions);

    return () => {
      window.removeEventListener("resize", updateWindowDimensions);
    };
  }, []);

  useEffect(() => {
    updateWindowDimensions();
  }, []);

  return (
    <WidthContext.Provider value={width}>
      <AuthContext.Provider value={auth}>
        <RefreshAuthContext.Provider value={refreshAuth}>
          <ReactFlowProvider>
            <div className={styles.app_wrapper}>
              <BrowserRouter>
                <ScrollToTop />
                <Navbar />
                <div className={styles.page_wrapper}>
                  <AllRoutes />
                </div>
              </BrowserRouter>
              <ToastContainer
                position={"bottom-center"}
                theme={"dark"}
                draggable
                closeOnClick
              />
            </div>
          </ReactFlowProvider>
        </RefreshAuthContext.Provider>
      </AuthContext.Provider>
    </WidthContext.Provider>
  );
}

export default App;
