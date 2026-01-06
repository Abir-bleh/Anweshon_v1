import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { clubPostsApi } from "../api/clubPostsApi";
import { clubsApi } from "../api/clubsApi";
import { fileUploadApi } from "../api/fileUploadApi";
import Button from "../components/Button";
import Card, { CardBody, CardHeader } from "../components/Card";
import EmptyState from "../components/EmptyState";
import { LoadingCard } from "../components/LoadingSpinner";
import Input from "../components/Input";

export default function ClubPhotoGalleryPage() {
  const { id: clubId } = useParams();
  const [club, setClub] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isExecutive, setIsExecutive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId]);

  const loadData = async () => {
    try {
      const [clubRes, postsRes] = await Promise.all([
        clubsApi.getById(clubId),
        clubPostsApi.getClubPosts(clubId),
      ]);

      setClub(clubRes.data);
      setPosts(postsRes.data || []);

      // Check if user is executive or ClubAdmin
      const membership = clubRes.data.membership;
      const roles = JSON.parse(localStorage.getItem("roles") || "[]");
      const isAdmin = roles.includes("ClubAdmin");

      if (isAdmin || (membership && membership.role !== "Member")) {
        setIsExecutive(true);
        // Auto-open form if no photos exist
        if (!postsRes.data || postsRes.data.length === 0) {
          setShowForm(true);
        }
      }
    } catch (err) {
      setError("Error loading gallery");
      console.error("Load error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    // Not needed for single file upload
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedFile) {
      setError("Please select an image file");
      return;
    }

    setSubmitting(true);
    setUploadingFiles(true);

    try {
      // Upload single file
      const uploadedUrl = await fileUploadApi.uploadSingle(selectedFile);
      const fullUrl = uploadedUrl.startsWith("http")
        ? uploadedUrl
        : `http://localhost:5079${uploadedUrl}`;

      // Create post with single image
      await clubPostsApi.createPost({
        clubId: parseInt(clubId),
        title: null,
        description: null,
        postType: "Photo",
        imageUrls: [fullUrl],
        captions: [""],
      });

      setSuccess("Photo uploaded successfully!");
      setSelectedFile(null);
      setShowForm(false);

      // Reload data
      setTimeout(() => {
        loadData();
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.message || "Error uploading photo. Please try again.");
      console.error("Upload error", err);
    } finally {
      setSubmitting(false);
      setUploadingFiles(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!confirm("Delete this post and all its images?")) return;

    try {
      await clubPostsApi.deletePost(postId);
      setSuccess("Post deleted");
      loadData();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Error deleting post");
      console.error("Delete error", err);
    }
  };

  if (loading) {
    return <LoadingCard message="Loading photo gallery..." />;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {club?.name} - Photo Gallery
          </h1>
          <p className="mt-2 text-slate-700">
            Share memorable moments and events from your club
          </p>
        </div>
        {isExecutive && (
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowForm(!showForm)}
            className="shadow-lg"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {showForm ? "Cancel" : "Upload Photos"}
          </Button>
        )}
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

      {/* Add Photos Form - VERY PROMINENT */}
      {showForm && isExecutive && (
        <Card className="mb-8 border-2 border-brand-500 shadow-xl animate-scale-in">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-brand-100 rounded-lg">
                <svg
                  className="h-6 w-6 text-brand-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Upload New Photos
                </h2>
                <p className="text-sm text-slate-600">
                  Select images and add descriptions for each photo
                </p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-brand-50 border-2 border-dashed border-brand-300 rounded-xl p-8">
                <label className="block text-center cursor-pointer">
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-brand-100 rounded-full mb-4">
                      <svg
                        className="h-12 w-12 text-brand-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-slate-900 mb-2">
                      Click to select a photo or drag and drop
                    </p>
                    <p className="text-sm text-slate-600">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {selectedFile && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Selected Photo
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      {/* File Preview */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                          <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* File Info */}
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting || !selectedFile}
                className="w-full"
              >
                {submitting ? "Uploading Photo..." : "Upload Photo"}
              </Button>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Photo Gallery */}
      <div>
        {posts.length === 0 ? (
          <div className="space-y-6">
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
              title="No photos yet"
              description={
                isExecutive
                  ? "Start building your photo gallery by adding memorable moments"
                  : "This club hasn't shared any photos yet"
              }
            />
            {isExecutive && !showForm && (
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowForm(true)}
                  className="shadow-xl animate-pulse-glow"
                >
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Upload Your First Photos
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {posts.map((post) =>
              post.images.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer bg-slate-100"
                >
                  <img
                    src={image.imageUrl}
                    alt={image.caption || "Club photo"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onClick={() => window.open(image.imageUrl, "_blank")}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />

                  {/* Delete button for executives */}
                  {isExecutive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(post.id);
                      }}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-600 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete photo"
                    >
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Photo info overlay */}
                  {(image.caption || post.createdAt) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {image.caption && (
                        <p className="text-white text-sm font-medium mb-1 truncate">
                          {image.caption}
                        </p>
                      )}
                      <p className="text-white/80 text-xs">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
