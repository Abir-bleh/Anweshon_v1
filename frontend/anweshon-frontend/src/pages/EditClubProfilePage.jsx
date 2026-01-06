import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { clubsApi } from "../api/clubsApi";
import { fileUploadApi } from "../api/fileUploadApi";
import { isClubAdmin } from "../utils/authHelpers";
import Card, { CardHeader, CardBody } from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import LoadingSpinner, { LoadingCard } from "../components/LoadingSpinner";

export default function EditClubProfilePage() {
  const { id } = useParams();
  const [club, setClub] = useState(null);

  // Color presets
  const colorPresets = [
    { name: "Emerald", primary: "#10b981", secondary: "#059669" },
    { name: "Blue", primary: "#3b82f6", secondary: "#2563eb" },
    { name: "Purple", primary: "#a855f7", secondary: "#9333ea" },
    { name: "Rose", primary: "#f43f5e", secondary: "#e11d48" },
    { name: "Orange", primary: "#f97316", secondary: "#ea580c" },
    { name: "Teal", primary: "#14b8a6", secondary: "#0d9488" },
    { name: "Indigo", primary: "#6366f1", secondary: "#4f46e5" },
    { name: "Pink", primary: "#ec4899", secondary: "#db2777" },
  ];

  const [form, setForm] = useState({
    description: "",
    logoUrl: "",
    bannerUrl: "",
    primaryColor: "#10b981",
    secondaryColor: "#059669",
    contactEmail: "",
    websiteUrl: "",
    tagline: "",
    foundedYear: "",
    facebookUrl: "",
    instagramUrl: "",
    meetingLocation: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const clubAdmin = isClubAdmin();

  useEffect(() => {
    if (!token || !clubAdmin) {
      navigate("/login");
      return;
    }

    let isMounted = true;

    async function load() {
      try {
        const res = await clubsApi.getById(id);
        if (!isMounted) return;
        setClub(res.data);
        setForm({
          description: res.data.description || "",
          logoUrl: res.data.logoUrl || "",
          bannerUrl: res.data.bannerUrl || "",
          primaryColor: res.data.primaryColor || "#10b981",
          secondaryColor: res.data.secondaryColor || "#059669",
          contactEmail: res.data.contactEmail || "",
          websiteUrl: res.data.websiteUrl || "",
          tagline: res.data.tagline || "",
          foundedYear: res.data.foundedYear || "",
          facebookUrl: res.data.facebookUrl || "",
          instagramUrl: res.data.instagramUrl || "",
          meetingLocation: res.data.meetingLocation || "",
        });
        setLogoPreview(res.data.logoUrl || "");
        setBannerPreview(res.data.bannerUrl || "");
      } catch (err) {
        console.error("Error loading club profile", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [id, token, clubAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    setUploading(true);

    try {
      // Upload files if selected
      let logoUrl = form.logoUrl;
      let bannerUrl = form.bannerUrl;

      if (logoFile) {
        try {
          logoUrl = await fileUploadApi.uploadSingle(logoFile);
          logoUrl = `http://localhost:5079${logoUrl}`;
        } catch (uploadErr) {
          setUploading(false);
          setSaving(false);
          setError(`Error uploading logo: ${uploadErr.message}`);
          return;
        }
      }

      if (bannerFile) {
        try {
          bannerUrl = await fileUploadApi.uploadSingle(bannerFile);
          bannerUrl = `http://localhost:5079${bannerUrl}`;
        } catch (uploadErr) {
          setUploading(false);
          setSaving(false);
          setError(`Error uploading banner: ${uploadErr.message}`);
          return;
        }
      }

      setUploading(false);

      await clubsApi.updateProfile(id, {
        ...form,
        logoUrl,
        bannerUrl,
        foundedYear: form.foundedYear ? Number(form.foundedYear) : null,
      });
      navigate(`/clubs/${id}`);
    } catch (err) {
      console.error("Update club profile error", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update club profile.");
      }
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (!token || !clubAdmin) return null;
  if (loading) return <LoadingCard message="Loading club profile..." />;
  if (!club)
    return <div className="text-white text-center">Club not found.</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Edit Club Profile</h1>
              <p className="text-slate-400 mt-2">{club.name}</p>
            </div>
            <Link to={`/clubs/${id}`}>
              <Button variant="ghost" size="sm">
                ← Back to club
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brand-400">
                Basic Information
              </h2>

              <Input
                label="Tagline"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                placeholder="A short catchy description"
              />

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Tell us about your club..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Founded Year"
                  name="foundedYear"
                  type="number"
                  value={form.foundedYear}
                  onChange={handleChange}
                  placeholder="e.g., 2020"
                />

                <Input
                  label="Meeting Location"
                  name="meetingLocation"
                  value={form.meetingLocation}
                  onChange={handleChange}
                  placeholder="e.g., UB 1234"
                />
              </div>
            </div>

            {/* Visual Customization */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brand-400">
                Visual Customization
              </h2>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Club Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2.5 text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-600 file:text-white hover:file:bg-brand-500"
                />
                {logoPreview && (
                  <div className="mt-3">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-slate-700"
                    />
                  </div>
                )}
              </div>

              {/* Banner Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Club Banner
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2.5 text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-600 file:text-white hover:file:bg-brand-500"
                />
                {bannerPreview && (
                  <div className="mt-3">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="w-full h-48 object-cover rounded-lg border-2 border-slate-700"
                    />
                  </div>
                )}
              </div>

              {/* Color Presets */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Club Theme Colors
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          primaryColor: preset.primary,
                          secondaryColor: preset.secondary,
                        }));
                      }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        form.primaryColor === preset.primary
                          ? "border-white shadow-lg"
                          : "border-slate-700 hover:border-slate-500"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: preset.secondary }}
                        />
                      </div>
                      <p className="text-xs font-medium text-slate-300">
                        {preset.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact & Social */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brand-400">
                Contact & Social Media
              </h2>

              <Input
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={handleChange}
                placeholder="club@example.com"
              />

              <Input
                label="Website URL"
                name="websiteUrl"
                value={form.websiteUrl}
                onChange={handleChange}
                placeholder="https://your-club-website.com"
              />

              <Input
                label="Facebook URL"
                name="facebookUrl"
                value={form.facebookUrl}
                onChange={handleChange}
                placeholder="https://facebook.com/yourclub"
              />

              <Input
                label="Instagram URL"
                name="instagramUrl"
                value={form.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/yourclub"
              />
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400">
                {error}
              </div>
            )}

            {uploading && (
              <div className="flex items-center gap-3 text-brand-400">
                <LoadingSpinner size="sm" />
                <span>Uploading images...</span>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={saving || uploading}
                className="flex-1"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(`/clubs/${id}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
