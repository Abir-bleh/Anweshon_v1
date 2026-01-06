import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clubsApi } from "../api/clubsApi";
import { fileUploadApi } from "../api/fileUploadApi";
import Card, { CardHeader, CardBody } from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CreateClubPage() {
  const navigate = useNavigate();

  // Color presets for clubs
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

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    bannerUrl: "",
    primaryColor: "#10b981",
    secondaryColor: "#1e293b",
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setLoading(true);
    setUploading(true);

    try {
      // Upload files if selected
      let logoUrl = formData.logoUrl;
      let bannerUrl = formData.bannerUrl;

      if (logoFile) {
        try {
          logoUrl = await fileUploadApi.uploadSingle(logoFile);
          logoUrl = `http://localhost:5079${logoUrl}`;
        } catch (uploadErr) {
          setUploading(false);
          setLoading(false);
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
          setLoading(false);
          setError(`Error uploading banner: ${uploadErr.message}`);
          return;
        }
      }

      setUploading(false);

      // Create club
      const res = await clubsApi.create({
        ...formData,
        logoUrl,
        bannerUrl,
        foundedYear: formData.foundedYear
          ? parseInt(formData.foundedYear)
          : null,
      });

      const newId = res.data.id;
      navigate(`/clubs/${newId}`);
    } catch (err) {
      console.error("Create club error", err);
      if (err.response?.status === 403) {
        setError("Only ClubAdmin users can create clubs.");
      } else if (err.response?.status === 401) {
        setError("Please login as ClubAdmin.");
      } else if (err.response?.data) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Failed to create club."
        );
      } else {
        setError("Failed to create club.");
      }
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold">Create New Club</h1>
          <p className="text-slate-400 mt-2">
            Fill in the details to create your club page
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brand-400">
                Basic Information
              </h2>

              <Input
                label="Club Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., BRACU Computer Club"
              />

              <Input
                label="Tagline"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="A short catchy description"
              />

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Tell us about your club..."
                />
              </div>

              <Input
                label="Founded Year"
                name="foundedYear"
                type="number"
                value={formData.foundedYear}
                onChange={handleChange}
                placeholder="e.g., 2020"
              />
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
                        setFormData((prev) => ({
                          ...prev,
                          primaryColor: preset.primary,
                          secondaryColor: preset.secondary,
                        }));
                      }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.primaryColor === preset.primary
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

                {/* Custom Colors */}
                <details className="group">
                  <summary className="cursor-pointer text-sm text-brand-400 hover:text-brand-300 mb-3">
                    Or choose custom colors
                  </summary>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-2">
                        Primary Color
                      </label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          name="primaryColor"
                          value={formData.primaryColor}
                          onChange={handleChange}
                          className="h-10 w-20 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
                        />
                        <input
                          type="text"
                          name="primaryColor"
                          value={formData.primaryColor}
                          onChange={handleChange}
                          className="flex-1 rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2 text-slate-100 text-sm"
                          placeholder="#10b981"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          name="secondaryColor"
                          value={formData.secondaryColor}
                          onChange={handleChange}
                          className="h-10 w-20 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
                        />
                        <input
                          type="text"
                          name="secondaryColor"
                          value={formData.secondaryColor}
                          onChange={handleChange}
                          className="flex-1 rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2 text-slate-100 text-sm"
                          placeholder="#1e293b"
                        />
                      </div>
                    </div>
                  </div>
                </details>
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
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="club@example.com"
              />

              <Input
                label="Website URL"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://your-club-website.com"
              />

              <Input
                label="Facebook URL"
                name="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleChange}
                placeholder="https://facebook.com/yourclub"
              />

              <Input
                label="Instagram URL"
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/yourclub"
              />

              <Input
                label="Meeting Location"
                name="meetingLocation"
                value={formData.meetingLocation}
                onChange={handleChange}
                placeholder="e.g., UB 1234"
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
                disabled={loading || uploading}
                className="flex-1"
              >
                {loading ? "Creating..." : "Create Club"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/clubs")}
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
