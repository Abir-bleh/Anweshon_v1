import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/authApi";
import Input from "../components/Input";
import Button from "../components/Button";
import Card, { CardBody, CardHeader } from "../components/Card";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("email"); // email, code, password, success
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send reset code to email
      await authApi.requestPasswordReset(email);
      setStep("code");
    } catch (err) {
      setError("Error sending reset code. Please check your email.");
      console.error("Request code error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    // Code verification happens during password reset, so just move to next step
    setStep("password");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      // Reset password
      await authApi.resetPassword(email, code, newPassword);
      setStep("success");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError("Error resetting password. Please try again.");
      console.error("Reset password error", err);
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
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-500">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Reset Password
              </h1>
            </div>
          </CardHeader>

          <CardBody>
            {step === "success" ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <svg
                      className="h-8 w-8 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  Password Reset Successful!
                </p>
                <p className="text-slate-700">Redirecting to login page...</p>
              </div>
            ) : (
              <form
                onSubmit={
                  step === "email"
                    ? handleRequestCode
                    : step === "code"
                    ? handleVerifyCode
                    : handleResetPassword
                }
                className="space-y-4"
              >
                {step === "email" && (
                  <>
                    <p className="text-sm text-slate-700 mb-4">
                      Enter your email address and we'll send you a reset code.
                    </p>
                    <Input
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </>
                )}

                {step === "code" && (
                  <>
                    <p className="text-sm text-slate-700 mb-4">
                      Enter the reset code sent to {email}
                    </p>
                    <Input
                      label="Reset Code"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="XXXXXX"
                      required
                    />
                  </>
                )}

                {step === "password" && (
                  <>
                    <p className="text-sm text-slate-700 mb-4">
                      Enter your new password
                    </p>
                    <Input
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <Input
                      label="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </>
                )}

                {error && (
                  <div className="rounded-lg bg-red-950/30 border border-red-500/50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-full"
                >
                  {loading
                    ? "Processing..."
                    : step === "email"
                    ? "Send Reset Code"
                    : step === "code"
                    ? "Verify Code"
                    : "Reset Password"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-slate-700">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                Back to login
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
