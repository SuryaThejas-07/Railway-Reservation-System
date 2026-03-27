import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signInWithGoogle } from "@/firebase/auth";
import { LogIn, Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginUser(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md animate-fade-in px-4 py-6 sm:py-10">
      <div className="card-shadow rounded-2xl border bg-card p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <LogIn className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold">Welcome Back</h1>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 sm:py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-medium">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 sm:py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 sm:my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-2 rounded-lg border bg-background py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-foreground transition hover:bg-secondary disabled:opacity-50"
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        <p className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/register" className="font-medium text-primary hover:underline">Register</a>
        </p>

        <p className="mt-2 sm:mt-3 text-center text-xs sm:text-sm text-muted-foreground">
          Forgot password?{" "}
          <a href="/forgot-password" className="font-medium text-primary hover:underline">Reset here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
