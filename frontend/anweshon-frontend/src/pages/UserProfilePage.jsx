import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import Input from "../components/Input";
import Button from "../components/Button";
import Card, { CardBody, CardHeader } from "../components/Card";
import { LoadingCard } from "../components/LoadingSpinner";

export default function UserProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    studentId: "",
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        console.log("Fetching profile for userId:", userId);

        if (!userId) {
          setError("User ID not found. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await authApi.getUserProfile(userId);
        console.log("Profile response:", res.data);

        setProfile(res.data);
        setFormData({
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          phoneNumber: res.data.phoneNumber || "",
          studentId: res.data.studentId || "",
        });
      } catch (err) {
        console.error("Profile fetch error", err);
        console.error("Error details:", err.response?.data);
        setError(
          err.response?.data?.message ||
            err.response?.data ||
            "Error loading profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const userId = localStorage.getItem("userId");
      await authApi.updateUserProfile(userId, formData);
      setSuccess("Profile updated successfully!");
      setProfile(formData);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error updating profile. Please try again.");
      console.error("Profile update error", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingCard message="Loading your profile..." />;
  }

  return (
    <div className="animate-fade-in py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="mt-2 text-slate-700">Update your personal information</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardBody className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-500 text-white font-bold text-2xl">
                  {profile?.fullName?.charAt(0) || "U"}
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                {profile?.fullName || "User"}
              </h2>
              <p className="text-sm text-slate-600 mb-4">{profile?.email}</p>
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Student ID:</span>
                  <span className="font-medium text-slate-900">
                    {profile?.studentId || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Phone:</span>
                  <span className="font-medium text-slate-900">
                    {profile?.phoneNumber || "N/A"}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-slate-900">
                Edit Information
              </h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  disabled
                />

                <Input
                  label="Student ID"
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g., CSE-2023-001"
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+880-XXXXXXXXXX"
                />

                {error && (
                  <div className="rounded-lg bg-red-950/30 border border-red-500/50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
                    {success}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={saving}
                    className="flex-1"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setFormData({
                        fullName: profile?.fullName || "",
                        email: profile?.email || "",
                        phoneNumber: profile?.phoneNumber || "",
                        studentId: profile?.studentId || "",
                      })
                    }
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
