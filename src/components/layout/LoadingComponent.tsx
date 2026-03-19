import { motion } from "framer-motion";

import Logo from "../../assets/Recurso 1.svg";

export const LoadingComponent = () => {
  return (
    <div className="flex-col gap-4 w-full h-svh flex items-center justify-center bg-background transition-colors">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
        <img
          alt="Logo"
          className="w-24 h-24 object-contain relative z-10"
          src={Logo}
        />
      </motion.div>
    </div>
  );
};
