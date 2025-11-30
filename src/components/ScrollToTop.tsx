import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import React from "react";

function ScrollToTop(): null {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
}

export default ScrollToTop;
