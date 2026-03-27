import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { logoutUser } from "@/firebase/auth";
import { useTheme } from "@/hooks/useTheme";
import { Train, Moon, Sun, LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, role } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Train className="h-6 w-6" />
          <span>RailBook</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
            Home
          </Link>
          <Link to="/pnr-status" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
            PNR Status
          </Link>
          {user && (
            <Link to="/dashboard" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
              My Bookings
            </Link>
          )}
          {role === "admin" && (
            <>
              <Link to="/admin" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
                Admin
              </Link>
              <Link to="/stations" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
                Stations
              </Link>
            </>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggle}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground hover:bg-secondary rounded-lg px-3 py-1.5"
              >
                <User className="h-4 w-4" />
                {user.email?.split("@")[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-lg bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive transition hover:bg-destructive/20"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t bg-card px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">Home</Link>
            <Link to="/pnr-status" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">PNR Status</Link>
            {user && (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">My Bookings</Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">Profile</Link>
              </>
            )}
            {role === "admin" && (
              <>
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">Admin</Link>
                <Link to="/stations" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-secondary">Stations</Link>
              </>
            )}
            <div className="flex items-center gap-2 pt-2">
              <button onClick={toggle} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary">
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              {user ? (
                <button onClick={handleLogout} className="text-sm text-destructive">Logout</button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
