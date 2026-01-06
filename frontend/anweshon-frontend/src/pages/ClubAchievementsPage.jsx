import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { achievementsApi } from "../api/achievementsApi";
import { clubsApi } from "../api/clubsApi";
import { fileUploadApi } from "../api/fileUploadApi";
import Button from "../components/Button";
import Card, { CardBody, CardHeader } from "../components/Card";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import { LoadingCard } from "../components/LoadingSpinner";
import Input from "../components/Input";

export default function ClubAchievementsPage() {
  const { id: clubId } = useParams();
  const [club, setClub] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [pendingAchievements, setPendingAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [isExecutive, setIsExecutive] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    achievementDate: "",
    achievementType: "Competition",
    memberName: "",
    imageUrl: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId]);

  const loadData = async () => {
    try {
      const [clubRes, achievementsRes] = await Promise.all([
        clubsApi.getById(clubId),
        achievementsApi.getApprovedAchievements(clubId),
      ]);

      setClub(clubRes.data);
      setAchievements(achievementsRes.data || []);

      // Try to load pending achievements (admin only)
      try {
        const pendingRes = await achievementsApi.getPendingAchievements(clubId);
        setPendingAchievements(pendingRes.data || []);
        setIsExecutive(true);
      } catch {
        // Not an executive, that's okay
        setIsExecutive(false);
      }
    } catch (err) {
      setError("Error loading achievements");
      console.error("Load error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      setSelectedImage(file);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      let imageUrl = formData.imageUrl;

      // Upload image if selected
      if (selectedImage) {
        const uploadedUrl = await fileUploadApi.uploadSingle(selectedImage);
        imageUrl = `http://localhost:5079${uploadedUrl}`;
      }

      await achievementsApi.submitAchievement({
        ...formData,
        imageUrl,
        clubId: parseInt(clubId),
      });

      setSuccess("Achievement submitted successfully!");
      setFormData({
        title: "",
        description: "",
        achievementDate: "",
        achievementType: "Competition",
        memberName: "",
        imageUrl: "",
      });
      setSelectedImage(null);
      setShowForm(false);

      // Reload data
      setTimeout(() => {
        loadData();
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError("Error submitting achievement. Please try again.");
      console.error("Submit error", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (achievementId) => {
    try {
      await achievementsApi.approveAchievement(achievementId);
      setSuccess("Achievement approved!");
      loadData();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Error approving achievement");
      console.error("Approve error", err);
    }
  };

  const handleReject = async (achievementId) => {
    try {
      await achievementsApi.rejectAchievement(achievementId);
      setSuccess("Achievement rejected");
      loadData();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Error rejecting achievement");
      console.error("Reject error", err);
    }
  };

  const handleDelete = async (achievementId) => {
    if (!confirm("Delete this achievement?")) return;

    try {
      await achievementsApi.deleteAchievement(achievementId);
      setSuccess("Achievement deleted");
      loadData();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Error deleting achievement");
      console.error("Delete error", err);
    }
  };

  if (loading) {
    return <LoadingCard message="Loading achievements..." />;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {club?.name} - Achievements
          </h1>
          <p className="mt-2 text-slate-700">
            Showcase your club's accomplishments and awards
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Submit Achievement"}
        </Button>
      </div>

      {(error || success) && (
        <div
          className={`mb-6 rounded-lg p-4 ${
            error
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          {error || success}
        </div>
      )}

      {/* Submit Achievement Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-bold text-slate-900">
              Submit New Achievement
            </h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Achievement Title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., First Place in Programming Contest"
                required
              />

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  placeholder="Describe the achievement..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Achievement Date"
                  type="date"
                  name="achievementDate"
                  value={formData.achievementDate}
                  onChange={handleChange}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Achievement Type
                  </label>
                  <select
                    name="achievementType"
                    value={formData.achievementType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="Competition">Competition</option>
                    <option value="Award">Award</option>
                    <option value="Recognition">Recognition</option>
                    <option value="Publication">Publication</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <Input
                label="Member Name (Optional)"
                type="text"
                name="memberName"
                value={formData.memberName}
                onChange={handleChange}
                placeholder="Name of member(s) who achieved this"
              />

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Achievement Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
                {selectedImage && (
                  <p className="mt-2 text-sm text-slate-600">
                    Selected: {selectedImage.name} (
                    {(selectedImage.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? "Submitting..." : "Submit Achievement"}
              </Button>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Pending Achievements (Admin Only) */}
      {isExecutive && pendingAchievements.length > 0 && (
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Pending Approval ({pendingAchievements.length})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPending(!showPending)}
              >
                {showPending ? "Hide" : "Show"}
              </Button>
            </div>
          </CardHeader>
          {showPending && (
            <CardBody>
              <div className="space-y-4">
                {pendingAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="border border-amber-200 rounded-lg p-4 bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-slate-700 mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                          <span>
                            📅{" "}
                            {new Date(
                              achievement.achievementDate
                            ).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>Type: {achievement.achievementType}</span>
                          {achievement.memberName && (
                            <>
                              <span>•</span>
                              <span>Member: {achievement.memberName}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {achievement.imageUrl && (
                        <img
                          src={achievement.imageUrl}
                          alt={achievement.title}
                          className="w-20 h-20 object-cover rounded-lg ml-4"
                        />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApprove(achievement.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleReject(achievement.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          )}
        </Card>
      )}

      {/* Approved Achievements */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Achievements Showcase
        </h2>
        {achievements.length === 0 ? (
          <EmptyState
            icon={
              <svg
                className="h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            }
            title="No achievements yet"
            description="Submit your club's first achievement to showcase your accomplishments"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardBody>
                  {achievement.imageUrl && (
                    <img
                      src={achievement.imageUrl}
                      alt={achievement.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="mb-3">
                    <Badge variant="brand" size="sm" className="mb-2">
                      {achievement.achievementType}
                    </Badge>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-slate-700 mb-3">
                      {achievement.description}
                    </p>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600 border-t border-slate-200 pt-3">
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(
                        achievement.achievementDate
                      ).toLocaleDateString()}
                    </div>
                    {achievement.memberName && (
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {achievement.memberName}
                      </div>
                    )}
                  </div>
                  {isExecutive && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(achievement.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
