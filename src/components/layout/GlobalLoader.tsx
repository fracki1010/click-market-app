import { useState, useEffect } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingComponent } from "./LoadingComponent";

export const GlobalLoader = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const loading = isFetching > 0 || isMutating > 0;
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (loading) {
      // Retraso de 200ms antes de mostrar para evitar parpadeos en cargas rápidas
      timeout = setTimeout(() => setShow(true), 200);
    } else {
      setShow(false);
    }

    return () => clearTimeout(timeout);
  }, [loading]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[99999] pointer-events-auto"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <LoadingComponent />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
