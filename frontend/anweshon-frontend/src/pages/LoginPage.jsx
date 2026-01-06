import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/authApi";
import Input from "../components/Input";
import Button from "../components/Button";
import Card, { CardBody, CardHeader } from "../components/Card";
import RuetLogo from "../components/RuetLogo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authApi.login(email, password);

      const { token, expiration, userId, roles } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiration", expiration);
      localStorage.setItem("userId", userId);
      localStorage.setItem("roles", JSON.stringify(roles));

      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
      console.error("Login error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12">
      <div className="w-full max-w-md animate-fade-in">
        <Card>
          <CardHeader>
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <RuetLogo size="md" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-slate-700">
                Sign in to access your club dashboard
              </p>
            </div>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                autoComplete="email"
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="rounded-lg bg-red-950/30 border border-red-500/50 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-700">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-brand-400 hover:text-brand-300 transition-colors"
              >
                Create one
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
