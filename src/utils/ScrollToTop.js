import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  let { pathname } = useLocation();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    return () => { };
  }, [pathname]);

  return null;
}

export default ScrollToTop;
