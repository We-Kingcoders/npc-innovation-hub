// src/components/admin-components/HubVideoManagement.tsx
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  getAdminHubVideo,
  uploadHubVideo,
  deleteHubVideo,
} from "../../api/admin/hubVideo.api";
import type { HubVideo } from "../../types/hubVideo.types";

const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

const formatFileSize = (bytes: number): string =>
  bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const HubVideoManagement: React.FC = () => {
  const [video, setVideo] = useState<HubVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchVideo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAdminHubVideo();
      setVideo(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch hub video";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected && selected.size > MAX_VIDEO_SIZE_BYTES) {
      toast.error("Video must be under 100MB");
      e.target.value = "";
      return;
    }
    setFile(selected);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Choose a video file first");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    if (title.trim()) formData.append("title", title.trim());
    if (description.trim()) formData.append("description", description.trim());

    setUploading(true);
    setUploadPercent(0);
    try {
      const result = await uploadHubVideo(formData, setUploadPercent);
      setVideo(result);
      setFile(null);
      setTitle("");
      setDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Hub video uploaded successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload hub video",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Remove the hub intro video? Visitors will no longer see it on the landing page until a new one is uploaded.",
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      await deleteHubVideo();
      setVideo(null);
      toast.success("Hub video removed");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to remove hub video",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="ml-0 md:ml-8 p-0 max-w-3xl space-y-6">
      {/* Current video */}
      <div className="bg-white rounded-2xl border border-mist-300 shadow-sm p-6">
        <h2 className="font-semibold text-navy-800 text-sm mb-4">
          Current Hub Video
        </h2>

        {isLoading ? (
          <div className="h-56 bg-mist-100 rounded-xl animate-pulse" />
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : !video ? (
          <p className="text-sm text-mist-500 py-6 text-center">
            No hub video has been uploaded yet.
          </p>
        ) : (
          <div className="space-y-3">
            <video
              src={video.videoUrl}
              controls
              className="w-full rounded-xl bg-black max-h-80"
            />
            {video.title && (
              <p className="font-medium text-navy-800">{video.title}</p>
            )}
            {video.description && (
              <p className="text-sm text-mist-600">{video.description}</p>
            )}
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              {deleting ? "Removing…" : "Remove Video"}
            </button>
          </div>
        )}
      </div>

      {/* Upload / replace */}
      <div className="bg-white rounded-2xl border border-mist-300 shadow-sm p-6">
        <h2 className="font-semibold text-navy-800 text-sm mb-1">
          {video ? "Replace Video" : "Upload a Video"}
        </h2>
        <p className="text-xs text-mist-500 mb-4">
          Up to 100MB. Uploading a new video replaces the current one.
        </p>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label
              htmlFor="hub-video-file"
              className="block text-sm font-medium text-navy-800 mb-1.5"
            >
              Video File
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2.5 border border-mist-300 rounded-lg text-left text-sm text-navy-800 hover:bg-mist-100 transition-colors"
            >
              {file
                ? `${file.name} (${formatFileSize(file.size)})`
                : "Click to choose a video file"}
            </button>
            <input
              id="hub-video-file"
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <label
              htmlFor="hub-video-title"
              className="block text-sm font-medium text-navy-800 mb-1.5"
            >
              Title (optional)
            </label>
            <input
              id="hub-video-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-mist-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
              placeholder="Welcome to NPC Innovation Hub"
            />
          </div>

          <div>
            <label
              htmlFor="hub-video-description"
              className="block text-sm font-medium text-navy-800 mb-1.5"
            >
              Description (optional)
            </label>
            <textarea
              id="hub-video-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-mist-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 resize-y"
              placeholder="A short intro to what we do at the hub…"
            />
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full py-3 rounded-lg bg-navy-800 text-white text-sm font-bold hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? `Uploading… ${uploadPercent}%` : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HubVideoManagement;
