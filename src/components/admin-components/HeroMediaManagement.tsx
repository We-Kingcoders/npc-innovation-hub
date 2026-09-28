// src/components/admin-components/HeroMediaManagement.tsx
//
// Admin management for the homepage hero background (images and/or
// video) - upload UX modeled on HubVideoManagement.tsx (its singleton
// upload/replace/delete flow), extended for a reorderable list. No
// drag-and-drop: nothing else in this frontend uses it, and up/down
// buttons cover the same need without a new dependency.
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  ImageIcon,
  Video as VideoIcon,
  Star,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Trash2,
  Pencil,
} from "lucide-react";
import {
  getAdminHeroMedia,
  uploadHeroMedia,
  updateHeroMediaMetadata,
  activateHeroMedia,
  deactivateHeroMedia,
  setDefaultHeroMedia,
  reorderHeroMedia,
  deleteHeroMedia,
} from "../../api/admin/heroMedia.api";
import type { AdminHeroMedia } from "../../types/heroMedia.types";

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // matches the backend's multer limit

const formatFileSize = (bytes: number): string =>
  bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

interface EditFormState {
  title: string;
  altText: string;
  caption: string;
}

const HeroMediaManagement: React.FC = () => {
  const [items, setItems] = useState<AdminHeroMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    title: "",
    altText: "",
    caption: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAdminHeroMedia();
      setItems(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch hero media";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected && selected.size > MAX_FILE_SIZE_BYTES) {
      toast.error("File must be under 100MB");
      e.target.value = "";
      return;
    }
    setFile(selected);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Choose an image or video file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (title.trim()) formData.append("title", title.trim());
    if (altText.trim()) formData.append("altText", altText.trim());
    if (caption.trim()) formData.append("caption", caption.trim());

    setUploading(true);
    setUploadPercent(0);
    try {
      const created = await uploadHeroMedia(formData, setUploadPercent);
      setItems((prev) => [...prev, created]);
      setFile(null);
      setTitle("");
      setAltText("");
      setCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Hero media uploaded");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload hero media",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (item: AdminHeroMedia) => {
    setBusyId(item.id);
    try {
      const updated = item.isActive
        ? await deactivateHeroMedia(item.id)
        : await activateHeroMedia(item.id);
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update hero media",
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleSetDefault = async (item: AdminHeroMedia) => {
    if (item.isDefault) return;
    setBusyId(item.id);
    try {
      await setDefaultHeroMedia(item.id);
      // Setting a new default unsets the old one server-side (one
      // transaction) - refetching keeps every row's isDefault correct
      // without hand-rolling the same unset-then-set locally.
      await fetchItems();
      toast.success("Default hero media updated");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to set default hero media",
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;

    const reordered = [...items];
    [reordered[index], reordered[target]] = [
      reordered[target],
      reordered[index],
    ];
    setItems(reordered);

    try {
      const updated = await reorderHeroMedia(reordered.map((i) => i.id));
      setItems(updated);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to reorder hero media",
      );
      fetchItems();
    }
  };

  const startEditing = (item: AdminHeroMedia) => {
    setEditingId(item.id);
    setEditForm({
      title: item.title ?? "",
      altText: item.altText ?? "",
      caption: item.caption ?? "",
    });
  };

  const handleSaveMetadata = async (item: AdminHeroMedia) => {
    setBusyId(item.id);
    try {
      const updated = await updateHeroMediaMetadata(item.id, {
        title: editForm.title.trim(),
        altText: editForm.altText.trim(),
        caption: editForm.caption.trim(),
      });
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
      setEditingId(null);
      toast.success("Hero media updated");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update hero media",
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (item: AdminHeroMedia) => {
    if (
      !window.confirm(
        "Remove this hero media? It will no longer appear on the homepage.",
      )
    ) {
      return;
    }
    setBusyId(item.id);
    try {
      await deleteHeroMedia(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success("Hero media deleted");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete hero media",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="ml-0 md:ml-8 p-0 max-w-4xl space-y-6">
      {/* Current media list */}
      <div className="bg-white rounded-2xl border border-mist-300 shadow-sm p-6">
        <h2 className="font-semibold text-navy-800 text-sm mb-4">
          Homepage Hero Media
        </h2>

        {isLoading ? (
          <div className="h-40 bg-mist-100 rounded-xl animate-pulse" />
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-mist-500 py-6 text-center">
            No homepage hero media yet. Upload an image or video to begin
            building the homepage hero experience.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item, index) => {
              const isBusy = busyId === item.id;
              const isEditing = editingId === item.id;

              return (
                <div
                  key={item.id}
                  className="border border-mist-300 rounded-xl overflow-hidden flex flex-col"
                >
                  <div className="relative h-36 bg-mist-100">
                    {item.type === "VIDEO" ? (
                      <video
                        src={item.url}
                        poster={item.thumbnailUrl ?? undefined}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.altText ?? item.title ?? ""}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-navy-800/80 text-white">
                      {item.type === "VIDEO" ? (
                        <VideoIcon className="w-3 h-3" />
                      ) : (
                        <ImageIcon className="w-3 h-3" />
                      )}
                      {item.type}
                    </span>
                    {item.isDefault && (
                      <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-navy-900">
                        <Star className="w-3 h-3 fill-current" />
                        Default
                      </span>
                    )}
                    {!item.isActive && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          Inactive
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 flex-1 flex flex-col gap-2">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              title: e.target.value,
                            }))
                          }
                          placeholder="Title (optional)"
                          className="w-full px-2 py-1.5 text-xs border border-mist-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                        />
                        <input
                          type="text"
                          value={editForm.altText}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              altText: e.target.value,
                            }))
                          }
                          placeholder="Alt text (for accessibility)"
                          className="w-full px-2 py-1.5 text-xs border border-mist-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                        />
                        <input
                          type="text"
                          value={editForm.caption}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              caption: e.target.value,
                            }))
                          }
                          placeholder="Caption (optional)"
                          className="w-full px-2 py-1.5 text-xs border border-mist-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleSaveMetadata(item)}
                            disabled={isBusy}
                            className="flex-1 py-1.5 rounded-lg bg-navy-800 text-white text-xs font-semibold hover:bg-navy-700 disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="flex-1 py-1.5 rounded-lg border border-mist-300 text-navy-700 text-xs font-semibold hover:bg-mist-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-navy-800 truncate">
                          {item.title || "Untitled"}
                        </p>
                        {item.altText && (
                          <p className="text-[11px] text-mist-500 truncate">
                            Alt: {item.altText}
                          </p>
                        )}

                        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
                          <button
                            type="button"
                            onClick={() => handleMove(index, -1)}
                            disabled={index === 0 || isBusy}
                            aria-label="Move earlier"
                            className="p-1.5 rounded-lg border border-mist-300 text-navy-700 hover:bg-mist-100 disabled:opacity-30"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMove(index, 1)}
                            disabled={index === items.length - 1 || isBusy}
                            aria-label="Move later"
                            className="p-1.5 rounded-lg border border-mist-300 text-navy-700 hover:bg-mist-100 disabled:opacity-30"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(item)}
                            disabled={isBusy}
                            aria-label={
                              item.isActive ? "Deactivate" : "Activate"
                            }
                            className="p-1.5 rounded-lg border border-mist-300 text-navy-700 hover:bg-mist-100 disabled:opacity-50"
                          >
                            {item.isActive ? (
                              <Eye className="w-3.5 h-3.5" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetDefault(item)}
                            disabled={isBusy || item.isDefault}
                            aria-label="Set as default"
                            className="p-1.5 rounded-lg border border-mist-300 text-navy-700 hover:bg-mist-100 disabled:opacity-30"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => startEditing(item)}
                            disabled={isBusy}
                            aria-label="Edit metadata"
                            className="p-1.5 rounded-lg border border-mist-300 text-navy-700 hover:bg-mist-100 disabled:opacity-50"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={isBusy}
                            aria-label="Delete"
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload */}
      <div className="bg-white rounded-2xl border border-mist-300 shadow-sm p-6">
        <h2 className="font-semibold text-navy-800 text-sm mb-1">
          Upload Hero Media
        </h2>
        <p className="text-xs text-mist-500 mb-4">
          JPEG, PNG, or WEBP images (up to 10MB), or MP4, WEBM, or MOV videos
          (up to 100MB). New uploads are added to the end of the order, active
          by default.
        </p>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label
              htmlFor="hero-media-file"
              className="block text-sm font-medium text-navy-800 mb-1.5"
            >
              File
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2.5 border border-mist-300 rounded-lg text-left text-sm text-navy-800 hover:bg-mist-100 transition-colors"
            >
              {file
                ? `${file.name} (${formatFileSize(file.size)})`
                : "Click to choose an image or video file"}
            </button>
            <input
              id="hero-media-file"
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <label
              htmlFor="hero-media-title"
              className="block text-sm font-medium text-navy-800 mb-1.5"
            >
              Title (optional)
            </label>
            <input
              id="hero-media-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-mist-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
              placeholder="Students working in the lab"
            />
          </div>

          <div>
            <label
              htmlFor="hero-media-alt"
              className="block text-sm font-medium text-navy-800 mb-1.5"
            >
              Alt text (recommended for images)
            </label>
            <input
              id="hero-media-alt"
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full px-4 py-2.5 border border-mist-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
              placeholder="A short description for screen readers"
            />
          </div>

          <div>
            <label
              htmlFor="hero-media-caption"
              className="block text-sm font-medium text-navy-800 mb-1.5"
            >
              Caption (optional)
            </label>
            <input
              id="hero-media-caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-2.5 border border-mist-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
              placeholder="Internal note about this media"
            />
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full py-3 rounded-lg bg-navy-800 text-white text-sm font-bold hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? `Uploading… ${uploadPercent}%` : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeroMediaManagement;
