import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const DarkModeContext = createContext();

// Custom hook to use the DarkMode context
export const useDarkMode = () => {
  return useContext(DarkModeContext);
};

// DarkModeProvider component to wrap your app and provide context
export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Load preference on mount
  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    if (storedMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Whenever darkMode changes, update localStorage + HTML class
  useEffect(() => {
    if (darkMode) {
      localStorage.setItem("darkMode", "true");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.removeItem("darkMode");
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Toggling function
  const toggleColorScheme = () => setDarkMode((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleColorScheme }}>
      {children}
    </DarkModeContext.Provider>
  );
};
