import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../utils/supabase";
import Spinner from "../../assets/Spinner.svg";
import { Helmet } from "react-helmet";
import { LogoMark } from "../Brand/Logo";

const SignIn = () => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [referral, setReferral] = useState(ref || "");
  const navigate = useNavigate();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const savedUsername = localStorage.getItem("cachedUsername");
    if (savedUsername) {
      setUsername(savedUsername.toLowerCase()); // enforce lowercase
      passwordRef.current?.focus();
    }
  }, [isLogin]);

  const handleUsernameChange = (e) => {
    const value = e.target.value.toLowerCase(); // always lowercase
    const clean = value.replace(/[^a-zA-Z0-9]/g, "");
    setUsername(clean);
    localStorage.setItem("cachedUsername", clean);
  };

  const toggleForm = () => setIsLogin(!isLogin);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: username + "@gmail.com",
        password: password,
      });

      if (error) {
        throw new Error(error.message);
      }

      const nav = localStorage.getItem("redirect");
      if (nav) {
        localStorage.removeItem("redirect");
        navigate(nav);
        return;
      }

      navigate("/");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: username + "@gmail.com",
        password,
      });
      if (error) throw new Error(error);

      const request = await fetch("https://api.pumpagent.com/sign-up", {
        method: "POST",
        body: JSON.stringify({
          username,
          data,
          referral,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await request.json();
      if (!response.success) throw new Error(response.error);

      const nav = localStorage.getItem("redirect");
      if (nav) {
        localStorage.removeItem("redirect");
        navigate(nav);
        return;
      }

      navigate("/");
    } catch (err) {
      alert(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-10 px-3 rounded-lg border border-line bg-canvas text-[14px] text-fg placeholder:text-fg-subtle focus:outline-none focus:border-accent-line focus:ring-2 focus:ring-accent-soft transition";

  return (
    <div className="relative flex-1 flex items-center justify-center px-4 py-16 font-normal">
      <Helmet>
        <title>Pump Agent · Sign in</title>
      </Helmet>
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <form
        className="relative w-full max-w-[380px] rounded-2xl border border-line bg-surface p-8 shadow-2xl shadow-black/50"
        onSubmit={(e) => (isLogin ? handleLogin(e) : handleRegister(e))}
      >
        <LogoMark className="w-9 h-9" />
        <h1 className="mt-6 text-2xl text-fg">
          {isLogin ? "Sign in to Pump Agent" : "Create your account"}
        </h1>
        <p className="mt-2 text-[14px] text-fg-muted">
          {isLogin
            ? "Welcome back. Enter your details to continue."
            : "Free forever on the Apprentice tier. No email needed."}
        </p>

        <div className="mt-7 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-fg-muted">Username</span>
            <input
              type="text"
              autoComplete="username"
              placeholder="yourname"
              className={inputClass}
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-fg-muted">Password</span>
            <input
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              placeholder="••••••••"
              className={inputClass}
              value={password}
              ref={passwordRef}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {!isLogin && (
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-fg-muted">
                Referral <span className="text-fg-subtle font-normal">(optional)</span>
              </span>
              <input
                type="text"
                placeholder="Referrer's username"
                className={`${inputClass} ${ref ? "pointer-events-none text-fg-muted" : ""}`}
                value={referral}
                readOnly={!!ref}
                onChange={(e) => setReferral(e.target.value)}
              />
            </label>
          )}
        </div>

        <button
          type="submit"
          className="mt-7 w-full h-10 rounded-lg bg-accent text-accent-ink text-[14px] font-semibold hover:bg-accent-hover disabled:opacity-60 cursor-pointer flex justify-center items-center transition-colors"
          disabled={loading}
        >
          {loading ? <img src={Spinner} alt="Loading" className="w-5 h-5" /> : isLogin ? "Sign in" : "Create account"}
        </button>

        <p className="mt-6 text-center text-[13px] text-fg-muted">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleForm}
            className="font-medium text-accent hover:text-accent-hover cursor-pointer"
            type="button"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
