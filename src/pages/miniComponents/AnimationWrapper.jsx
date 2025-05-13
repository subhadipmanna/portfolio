import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom"; // Replace Next.js usePathname

export default function AnimationWrapper({ children }) {
  const location = useLocation(); // Get current path

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname} // Ensure animation runs on route change
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
