import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/authApi";
import {
  isValidEmail,
  isValidStudentId,
  isValidPassword,
  isValidBdPhone,
} from "../utils/validators";
import Input from "../components/Input";
import Button from "../components/Button";
import Card, { CardBody, CardHeader } from "../components/Card";
import RuetLogo from "../components/RuetLogo";

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1: Form, 2: OTP Verification, 3: Complete
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [otp, setOtp] = useState("");

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!fullName || fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters.";
    }

    if (!isValidStudentId(studentId)) {
      newErrors.studentId = "Student ID must be exactly 7 digits.";
    }

    if (!department || department.trim().length < 2) {
      newErrors.department = "Department must be at least 2 characters.";
    }

    if (!isValidBdPhone(phone)) {
      newErrors.phone = "Enter an 11-digit BD phone number starting with 01.";
    }

    if (!isValidEmail(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!isValidPassword(password)) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    return newErrors;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setSuccess("");

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await authApi.sendRegistrationOtp({ email });
      setSuccess("OTP sent to your email! Check your inbox.");
      setStep(2);
    } catch (err) {
      console.error("Send OTP error", err);
      setGeneralError(
        err.response?.data || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setGeneralError("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      await authApi.verifyOtp({ email, otp });
      setSuccess("Email verified! Completing registration...");

      // Now register with verified email
      await authApi.register({
        fullName,
        studentId,
        department,
        phone,
        email,
        password,
        role,
      });

      setStep(3);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Verify OTP error", err);
      setGeneralError(err.response?.data || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setGeneralError("");
    setLoading(true);

    try {
      await authApi.sendRegistrationOtp({ email });
      setSuccess("OTP resent to your email!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setGeneralError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12">
      <div className="w-full max-w-2xl animate-fade-in">
        <Card>
          <CardHeader>
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <RuetLogo size="md" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                {step === 1 && "Create Account"}
                {step === 2 && "Verify Email"}
                {step === 3 && "Registration Complete"}
              </h1>
              <p className="mt-2 text-sm text-slate-700">
                {step === 1 && "Join the RUET club community"}
                {step === 2 && "Enter the OTP sent to your email"}
                {step === 3 && "Welcome to Anweshon!"}
              </p>
            </div>
          </CardHeader>

          <CardBody>
            {/* Step 1: Registration Form */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  error={errors.fullName}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="1234567"
                    helperText="7-digit student ID"
                    error={errors.studentId}
                    required
                  />
                  <Input
                    label="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="CSE"
                    error={errors.department}
                    required
                  />
                </div>

                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  helperText="11-digit BD phone number"
                  error={errors.phone}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  autoComplete="email"
                  error={errors.email}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  helperText="Minimum 8 characters"
                  autoComplete="new-password"
                  error={errors.password}
                  required
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Role
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="Student">Student</option>
                    <option value="ClubAdmin">Club Admin</option>
                  </select>
                </div>

                {generalError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {generalError}
                  </div>
                )}

                {success && (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
                    {success}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Sending OTP..." : "Continue"}
                </Button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 text-sm text-slate-900">
                  <p>We sent a 6-digit verification code to:</p>
                  <p className="font-semibold text-brand-700 mt-1">{email}</p>
                </div>

                <Input
                  label="Verification Code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                />

                {generalError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {generalError}
                  </div>
                )}

                {success && (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
                    {success}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Verifying..." : "Verify & Register"}
                </Button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="w-full text-sm text-brand-600 hover:text-brand-700 font-medium"
                >
                  Didn't receive code? Resend OTP
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-sm text-slate-600 hover:text-slate-700"
                >
                  ← Back to registration form
                </button>
              </form>
            )}

            {/* Step 3: Success Message */}
            {step === 3 && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
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
                <h2 className="text-xl font-semibold text-slate-900">
                  Registration Successful!
                </h2>
                <p className="text-slate-700">
                  Your account has been created. Redirecting to login page...
                </p>
              </div>
            )}

            {step === 1 && (
              <div className="mt-6 text-center text-sm text-slate-700">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
