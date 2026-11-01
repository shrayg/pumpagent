import { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { X } from "lucide-react";
import { GITHUB_REPO_URL } from "../../utils/navigation";

// Keep in sync with the duration-300 transition classes below.
const TRANSITION_MS = 300;

const DiscontinuedModal = ({ open, onClose }) => {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const primaryRef = useRef(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true))
      );
      return () => cancelAnimationFrame(frame);
    }
    setVisible(false);
    const timer = setTimeout(() => setMounted(false), TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    primaryRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center px-4 font-normal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="discontinued-title"
    >
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <section
        className={`relative w-full max-w-[420px] rounded-2xl border border-line bg-surface p-7 shadow-2xl shadow-black/60 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-3 scale-95"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-md text-fg-subtle hover:text-fg hover:bg-surface-2 cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <h2 id="discontinued-title" className="pr-8 text-xl text-fg">
          Sorry, this project has been discontinued
        </h2>
        <p className="mt-3 text-[14px] leading-6 text-fg-muted">
          Pump Agent is no longer supported, so sign-in, sign-up, the
          dashboard, and the apps have been turned off.
        </p>
        <p className="mt-3 text-[14px] leading-6 text-fg-muted">
          The full source code is open source on GitHub. You're free to browse
          it, fork it, and run it yourself.
        </p>

        <a
          ref={primaryRef}
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full h-10 rounded-lg bg-accent text-accent-ink text-[14px] font-semibold hover:bg-accent-hover flex justify-center items-center gap-2 transition-colors"
        >
          <FaGithub className="w-4 h-4" /> View the source on GitHub
        </a>
        <button
          type="button"
          onClick={onClose}
          className="mt-2.5 w-full h-10 rounded-lg text-[14px] font-medium text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer transition-colors"
        >
          Keep browsing
        </button>
      </section>
    </div>
  );
};

export default DiscontinuedModal;
