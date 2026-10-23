import { createContext, useContext, useEffect } from "react";

const DarkModeContext = createContext({ darkMode: false, toggleColorScheme: () => {} });

export const useDarkMode = () => useContext(DarkModeContext);

// The app ships a single dark theme. `darkMode` historically meant the light
// variant (it toggles the `dark:` utilities), so it stays false and any stored
// preference from the old toggle is cleared.
export const DarkModeProvider = ({ children }) => {
  useEffect(() => {
    localStorage.removeItem("darkMode");
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <DarkModeContext.Provider value={{ darkMode: false, toggleColorScheme: () => {} }}>
      {children}
    </DarkModeContext.Provider>
  );
};
