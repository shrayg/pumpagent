import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DiscontinuedModal from "./DiscontinuedModal";
import {
  PROJECT_DISCONTINUED,
  isDiscontinuedRoute,
} from "../../utils/navigation";

export const DISCONTINUED_STATE_KEY = "discontinued";

const DiscontinuedGuard = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const close = useCallback(() => setOpen(false), []);

  // Capture phase runs before React Router's Link handler, which skips
  // navigation once the event is default-prevented.
  useEffect(() => {
    if (!PROJECT_DISCONTINUED) return;
    const handleClick = (event) => {
      if (event.defaultPrevented) return;
      const anchor = event.target.closest?.("a[href]");
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (!isDiscontinuedRoute(url.pathname)) return;
      event.preventDefault();
      setOpen(true);
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    if (!location.state?.[DISCONTINUED_STATE_KEY]) return;
    setOpen(true);
    navigate(`${location.pathname}${location.search}`, {
      replace: true,
      state: null,
    });
  }, [location, navigate]);

  return <DiscontinuedModal open={open} onClose={close} />;
};

export default DiscontinuedGuard;
