import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { userAuth } from "../store/01.auth.store";
import Theme from "./theme.jsx";

const Nav = () => {
  const { know, knowMe, logOut } = userAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    knowMe();
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
      setMenuOpen(false);
    }
  };

  // No borders or underlines—just explicit text color contrast changes
  const navClass = ({ isActive }) =>
    `transition-colors ${
      isActive
        ? "text-black dark:text-white font-semibold"
        : "text-muted hover:text-main"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-canvas backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="font-mono text-sm font-semibold tracking-tight text-main"
          >
            prepAI
          </Link>

          <span
            className={`w-1.5 h-1.5 rounded-full ${
              know?.user ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 font-mono text-xs">
          <NavLink to="/features" className={navClass}>
            home/
          </NavLink>

          <NavLink to="/history" className={navClass}>
            history/
          </NavLink>

          <NavLink to="/createNew" className={navClass}>
            create_new/
          </NavLink>

          <NavLink to="/resume" className={navClass}>
            resume_review/
          </NavLink>

          <Theme />

          <div className="flex items-center gap-3 border-l border-line pl-4">
            {know?.user ? (
              <>
                <span className="w-6 h-6 rounded-full bg-card border border-line flex items-center justify-center text-[10px] uppercase font-bold text-muted">
                  {know.user.email?.charAt(0) || "U"}
                </span>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-muted hover:text-main transition-colors disabled:opacity-50"
                >
                  {isLoggingOut ? "..." : "logout()"}
                </button>
              </>
            ) : (
              <Link
                to="/login-signup"
                className="bg-main text-canvas px-3 py-1 rounded text-xs font-medium hover:opacity-90"
              >
                auth
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-3">
          <Theme />

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 text-main"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-[400px]" : "max-h-0"
        }`}
      >
        <div className="border-t border-line bg-canvas px-4 py-4 flex flex-col gap-4 font-mono text-sm">
          <NavLink
            to="/features"
            onClick={() => setMenuOpen(false)}
            className={navClass}
          >
            home/
          </NavLink>

          <NavLink
            to="/history"
            onClick={() => setMenuOpen(false)}
            className={navClass}
          >
            history/
          </NavLink>

          <NavLink
            to="/createNew"
            onClick={() => setMenuOpen(false)}
            className={navClass}
          >
            create_new/
          </NavLink>

          <NavLink
            to="/resume"
            onClick={() => setMenuOpen(false)}
            className={navClass}
          >
            resume_review/
          </NavLink>

          <div className="border-t border-line pt-4">
            {know?.user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-full bg-card border border-line flex items-center justify-center text-[10px] uppercase font-bold text-muted flex-shrink-0">
                    {know.user.email?.charAt(0) || "U"}
                  </span>

                  <span className="text-xs text-muted truncate">
                    {know.user.email}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-muted hover:text-main transition-colors disabled:opacity-50"
                >
                  {isLoggingOut ? "..." : "logout()"}
                </button>
              </div>
            ) : (
              <Link
                to="/login-signup"
                onClick={() => setMenuOpen(false)}
                className="bg-main text-canvas text-center py-2 rounded text-xs font-medium"
              >
                auth
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;