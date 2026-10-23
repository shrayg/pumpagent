import { useState, useEffect } from "react";
import ReactGA from "react-ga4";

const CookieBanner = () => {
  // Synchronously check cookie consent on initial render
  const checkCookieConsent = () => {
    const hasCookieConsent = document.cookie
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .find(
        ([key, value]) =>
          key === "cookieConsent" && (value === "true" || value === "false")
      );
    return hasCookieConsent ? hasCookieConsent[1] === "true" : null;
  };

  const initialShowBanner = checkCookieConsent() === null;

  const [showBanner, setShowBanner] = useState(initialShowBanner);

  const handleAccept = () => {
    document.cookie = "cookieConsent=true; max-age=31536000; path=/";
    setShowBanner(false);
    initTracking();
  };

  const handleDecline = () => {
    document.cookie = "cookieConsent=false; max-age=31536000; path=/";
    setShowBanner(false);
  };

  useEffect(() => {
    // If consent was already given, initialize GA immediately
    if (!initialShowBanner && checkCookieConsent() === true) {
      initTracking();
    }
  }, []);

  const initTracking = () => {
    // Prevent adding GA script multiple times
    if (document.querySelector('script[src*="googletagmanager"]')) return;

    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-KY1PQWP55L";
    script.async = true;
    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", "G-KY1PQWP55L");

      ReactGA.initialize("G-KY1PQWP55L");
    };
    document.head.appendChild(script);
  };

  return (
    <div
      className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[360px] z-[5000] rounded-xl border border-line bg-surface/95 backdrop-blur shadow-2xl shadow-black/60 p-4 font-normal transition-opacity duration-300 ease-in-out ${
        showBanner ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-live="polite"
      role="dialog"
      aria-label="Cookie consent"
    >
      <p className="text-[13px] leading-5 text-fg-muted">
        We use analytics cookies to understand how Pump Agent is used and
        improve it.
      </p>
      <div className="flex justify-end gap-2 mt-3">
        <button
          className="h-8 px-3 rounded-md text-[13px] font-medium text-fg-muted hover:text-fg hover:bg-surface-3 cursor-pointer transition-colors"
          onClick={handleDecline}
        >
          Decline
        </button>
        <button
          className="h-8 px-3 rounded-md text-[13px] font-semibold bg-accent text-accent-ink hover:bg-accent-hover cursor-pointer transition-colors"
          onClick={handleAccept}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
