import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { clubsApi } from "../api/clubsApi";
import { fileUploadApi } from "../api/fileUploadApi";
import { isClubAdmin } from "../utils/authHelpers";

export default function EditExecutivesPage() {
  const { id } = useParams(); // /clubs/:id/executives/edit
  const [club, setClub] = useState(null);
  const [executives, setExecutives] = useState([]);
  const [members, setMembers] = useState([]);
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
        const [clubRes, execRes, membersRes] = await Promise.all([
          clubsApi.getById(id),
          clubsApi.getExecutives(id),
          clubsApi.getMembers(id),
        ]);

        if (!isMounted) return;
        setClub(clubRes.data);
        setMembers(membersRes.data || []);
        setExecutives(
          (execRes.data || []).map((e, index) => ({
            id: e.id,
            name: e.name,
            position: e.position,
            email: e.email || "",
            phone: e.phone || "",
            photoUrl: e.photoUrl || "",
            displayOrder: e.displayOrder ?? index,
            userId: e.userId || "",
          }))
        );
      } catch (err) {
        console.error("Error loading executives", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [id, token, clubAdmin, navigate]);

  const handleChange = (index, field, value) => {
    setExecutives((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
    );
  };

  const handleAdd = () => {
    if (members.length === 0) {
      alert(
        "No members found. Users must join the club before being added as executives."
      );
      return;
    }
    setExecutives((prev) => [
      ...prev,
      {
        id: 0,
        name: "",
        position: "",
        email: "",
        phone: "",
        photoUrl: "",
        displayOrder: prev.length,
        userId: "",
      },
    ]);
  };

  const handleRemove = (index) => {
    setExecutives((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;

    try {
      const url = await fileUploadApi.uploadSingle(file);
      const fullUrl = `http://localhost:5079${url}`;
      handleChange(index, "photoUrl", fullUrl);
    } catch (err) {
      console.error("Error uploading file", err);
      alert("Failed to upload image");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await clubsApi.upsertExecutives(id, executives);
      navigate(`/clubs/${id}`);
    } catch (err) {
      console.error("Save executives error", err);
      setError("Failed to save executives.");
    } finally {
      setSaving(false);
    }
  };

  if (!token || !clubAdmin) return null;
  if (loading) return <div className="text-slate-900">Loading...</div>;
  if (!club) return <div className="text-slate-900">Club not found.</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">
          Edit executives – {club.name}
        </h1>
        <Link
          to={`/clubs/${id}`}
          className="text-brand-600 hover:text-brand-700 text-sm font-medium"
        >
          ← Back to club
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {executives.map((ex, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 bg-white p-6 space-y-4 shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div className="text-sm font-semibold text-slate-900">
                Executive #{index + 1}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Select Member
                </label>
                <select
                  className="w-full rounded-lg border-2 border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:bg-white"
                  value={ex.userId}
                  onChange={(e) => {
                    const selectedMember = members.find(
                      (m) => m.userId === e.target.value
                    );
                    if (selectedMember) {
                      handleChange(index, "userId", e.target.value);
                      handleChange(
                        index,
                        "name",
                        selectedMember.userName || ""
                      );
                      handleChange(
                        index,
                        "email",
                        selectedMember.userEmail || ""
                      );
                    }
                  }}
                >
                  <option value="">-- Select a member --</option>
                  {members.map((member) => (
                    <option key={member.userId} value={member.userId}>
                      {member.userName || member.userEmail}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Name
                </label>
                <input
                  className="w-full rounded-lg border-2 border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:bg-white"
                  value={ex.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  required
                  readOnly={ex.userId ? true : false}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Role
                </label>
                <select
                  className="w-full rounded-lg border-2 border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:bg-white"
                  value={ex.position}
                  onChange={(e) =>
                    handleChange(index, "position", e.target.value)
                  }
                  required
                >
                  <option value="">-- Select Role --</option>
                  <option value="President">President</option>
                  <option value="General Secretary">General Secretary</option>
                  <option value="Organizing Secretary">
                    Organizing Secretary
                  </option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Executive Leader">Executive Leader</option>
                  <option value="Executive Member">Executive Member</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Email
                </label>
                <input
                  className="w-full rounded-lg border-2 border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:bg-white"
                  value={ex.email}
                  onChange={(e) => handleChange(index, "email", e.target.value)}
                  readOnly={ex.userId ? true : false}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Phone
              </label>
              <input
                className="w-full rounded-lg border-2 border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:bg-white"
                value={ex.phone}
                onChange={(e) => handleChange(index, "phone", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files[0] &&
                  handleFileUpload(index, e.target.files[0])
                }
                className="w-full rounded-lg border-2 border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:bg-white file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-brand-600 file:text-white hover:file:bg-brand-700"
              />
              {ex.photoUrl && (
                <div className="mt-3">
                  <img
                    src={ex.photoUrl}
                    alt={ex.name}
                    className="w-20 h-20 object-cover rounded-lg border border-slate-200 shadow-sm"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Display order
              </label>
              <input
                type="number"
                className="w-full rounded-lg border-2 border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:bg-white"
                value={ex.displayOrder}
                onChange={(e) =>
                  handleChange(index, "displayOrder", Number(e.target.value))
                }
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-slate-100 border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 transition-colors"
        >
          + Add executive
        </button>

        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60 shadow-lg transition-colors"
          >
            {saving ? "Saving..." : "Save executives"}
          </button>
        </div>
      </form>
    </div>
  );
}
