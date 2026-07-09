import React, { useEffect, useState } from "react";
import { userAuth } from "../store/01.auth.store";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const base_url = "http://localhost:3000"  //import.meta.env.MODE === "development" ? "http://localhost:3000" :"https://prepai-production-36c8.up.railway.app"
  const { know, knowMe, logOut } = userAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = document.getElementById("auth-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const gap = 32;

      const isDark =
        document.documentElement.classList.contains("dark");

      ctx.fillStyle = isDark
        ? "rgba(255,255,255,0.025)"
        : "rgba(0,0,0,0.04)";

      for (let x = gap; x < canvas.offsetWidth; x += gap) {
        for (let y = gap; y < canvas.offsetHeight; y += gap) {
          ctx.beginPath();
          ctx.arc(x, y, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    resize();
    knowMe();

    window.addEventListener("resize", resize);

    const observer = new MutationObserver(resize);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logOut();
      navigate("/login-signup");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-main flex flex-col justify-between relative overflow-hidden transition-colors duration-150">
      {/* Background */}
      <canvas
        id="auth-canvas"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full h-14 flex items-center px-6">
        <span className="font-mono text-sm font-semibold tracking-tight">
          prepAI
        </span>
      </header>

      {/* Main */}
      <main className="relative z-10 flex items-center justify-center px-6">
        <div className="w-full max-w-sm bg-card border border-line rounded-xl shadow-xl overflow-hidden">
          {/* Window Header */}
          <div className="px-4 py-3 border-b border-line bg-canvas/50 flex items-center justify-between">
            <span className="font-mono text-[11px] text-muted">
              {know?.user ? "session.active" : "login.secure"}
            </span>

            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-line" />
              <span className="w-2 h-2 rounded-full bg-line" />
              <span className="w-2 h-2 rounded-full bg-line" />
            </div>
          </div>

          <div className="p-8">
            {!know?.user ? (
              <>
                {/* Logo Area */}
                <div className="flex flex-col items-center text-center">
                  
                  <h1 className="font-mono text-lg font-semibold">
                    Welcome to prepAI
                  </h1>

                  <p className="font-mono text-xs text-muted mt-2 mb-8 max-w-xs">
                    Sign in with Google to continue.
                  </p>
                </div>

                {/* Google Button */}
                <a
                  href={`${base_url}/auth/google`}
                  className="w-full h-11 border border-line rounded-lg bg-canvas flex items-center justify-center gap-3 hover:opacity-80 transition-all no-underline"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.3 14.7l6.6 4.8C14.7 15 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.3 2.4-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.4 5.5-6.7 7.2l6.2 5.2C38.5 37 44 31.2 44 24c0-1.3-.1-2.4-.4-3.5z"
                    />
                  </svg>

                  <span className="font-mono text-xs font-medium">
                    Continue with Google
                  </span>
                </a>

                <p className="mt-5 text-center font-mono text-[10px] text-muted">
                  Fast. Secure. Simple.
                </p>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full border border-line bg-canvas flex items-center justify-center font-mono text-sm font-semibold uppercase mb-4">
                    {know.user.email?.charAt(0)}
                  </div>

                  <h2 className="font-mono text-lg font-semibold">
                    You're signed in
                  </h2>

                  <p className="font-mono text-xs text-muted mt-2 break-all">
                    {know.user.email}
                  </p>

                  <p className="font-mono text-xs text-muted mt-5 mb-8">
                    Your account is connected.
                  </p>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full h-11 bg-main text-canvas rounded-lg font-mono text-xs font-semibold disabled:opacity-50"
                  >
                    {isLoggingOut
                      ? "Signing out..."
                      : "Sign Out"}
                  </button>
                </div>
              </>
            )}

            <div className="mt-8 pt-5 border-t border-line flex justify-center items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  know?.user
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                }`}
              />

              <span className="font-mono text-[10px] text-muted">
                {know?.user
                  ? "Connected"
                  : "Waiting for sign in"}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full px-6 py-6 text-center">
        <span className="font-mono text-[11px] text-muted">
          © 2026 prepAI
        </span>
      </footer>
    </div>
  );
};

export default Login;