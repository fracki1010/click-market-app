import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router";

export const ScrollToTop = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousPathnameRef = useRef(location.pathname);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "auto";
    }
  }, []);

  useEffect(() => {
    // POP (volver/adelante): dejamos restauración nativa del navegador.
    // PUSH/REPLACE con cambio de ruta: ir al inicio.
    if (
      navigationType !== "POP" &&
      previousPathnameRef.current !== location.pathname
    ) {
      window.scrollTo(0, 0);
    }

    previousPathnameRef.current = location.pathname;
  }, [location.pathname, navigationType]);

  return null;
};
