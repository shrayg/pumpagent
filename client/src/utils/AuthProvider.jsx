import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import supabase from "./supabase";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // ← Add this

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const username = session.user.email.split("@")[0];
          setUser(username);
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          setUser("");
        }
        setLoading(false); // ← Always turn off loading at the end
      }
    );

    // Run once on mount to get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const username = session.user.email.split("@")[0];
        setUser(username);
        setAuthenticated(true);
      }
      setLoading(false); // ← Ensure this is run even without any auth change
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        setAuthenticated,
        user,
        userData,
        setUserData,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
