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
      className={`fixed bottom-5 right-5 bg-tile w-75 z-5000 rounded-md border border-gray-800 flex flex-col justify-start items-start p-4 transition-opacity duration-300 ease-in-out ${
        showBanner
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      aria-live="polite"
      role="dialog"
      aria-label="Cookie consent banner"
    >
      <span className="text-[16px] text-gray-300 text-center">
        We use cookies to improve our website's performance and UX. By using our
        website and our products, you agree to our use of cookies.
      </span>
      <div className="flex justify-between w-full items-center mt-4">
        <button
          className="text-[14px] text-white bg-gray-500 hover:bg-gray-400 hover:opacity-100 opacity-80 p-2 rounded-sm cursor-pointer"
          onClick={handleDecline}
          aria-label="Decline cookies"
        >
          Decline
        </button>
        <button
          className="text-[14px] text-white bg-green-900 hover:bg-green-700 transition p-2 rounded-sm cursor-pointer"
          onClick={handleAccept}
          aria-label="Accept cookies"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
