// src/components/admin-components/AlumniManagement.tsx
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  getAlumniList,
  createAlumni,
  updateAlumni,
  deleteAlumni,
} from "../../api/admin/alumni.api";
import type { Alumni } from "../../types/alumni.types";
import { MEMBER_ROLES } from "../../types/member.types";

const EMPTY_FORM = { name: "", role: "" };

const AlumniManagement: React.FC = () => {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAlumni = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAlumniList();
      setAlumni(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch alumni";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startEdit = (entry: Alumni) => {
    setEditingId(entry.id);
    setForm({ name: entry.name, role: entry.role });
    setImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim()) {
      toast.error("Name and role are required");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateAlumni(editingId, {
          name: form.name.trim(),
          role: form.role.trim(),
          image,
        });
        setAlumni((prev) =>
          prev.map((a) => (a.id === editingId ? updated : a)),
        );
        toast.success("Alumni entry updated");
      } else {
        const created = await createAlumni({
          name: form.name.trim(),
          role: form.role.trim(),
          image,
        });
        setAlumni((prev) => [created, ...prev]);
        toast.success("Alumni entry created");
      }
      resetForm();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save alumni entry",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entry: Alumni) => {
    if (
      !window.confirm(
        `Delete ${entry.name} from the alumni list? This can't be undone.`,
      )
    ) {
      return;
    }
    setDeletingId(entry.id);
    try {
      await deleteAlumni(entry.id);
      setAlumni((prev) => prev.filter((a) => a.id !== entry.id));
      toast.success(`${entry.name} removed from alumni`);
      if (editingId === entry.id) resetForm();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete alumni entry",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="ml-0 md:ml-8 p-0 max-w-4xl space-y-6">
      {/* Create / edit form */}
      <div className="bg-white rounded-2xl border border-mist-300 shadow-sm p-6">
        <h2 className="font-semibold text-navy-800 text-sm mb-4">
          {editingId ? "Edit Alumni Entry" : "Add Alumni Entry"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="alumni-name"
                className="block text-sm font-medium text-navy-800 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="alumni-name"
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-2.5 border border-mist-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label
                htmlFor="alumni-role"
                className="block text-sm font-medium text-navy-800 mb-1.5"
              >
                Role
              </label>
              <select
                id="alumni-role"
                value={form.role}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, role: e.target.value }))
                }
                className="w-full px-4 py-2.5 border border-mist-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
              >
                <option value="">Select a role</option>
                {MEMBER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="alumni-image"
              className="block text-sm font-medium text-navy-800 mb-1.5"
            >
              Photo (optional)
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2.5 border border-mist-300 rounded-lg text-left text-sm text-navy-800 hover:bg-mist-100 transition-colors"
            >
              {image ? image.name : "Click to choose a photo"}
            </button>
            <input
              id="alumni-image"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-navy-800 text-white text-sm font-bold hover:bg-navy-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : editingId ? "Update Entry" : "Add Entry"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="px-6 py-2.5 rounded-lg bg-mist-100 text-navy-800 text-sm font-bold hover:bg-mist-200 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Alumni list */}
      <div className="bg-white rounded-2xl border border-mist-300 shadow-sm p-6">
        <h2 className="font-semibold text-navy-800 text-sm mb-4">
          Alumni ({alumni.length})
        </h2>

        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-mist-100 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : alumni.length === 0 ? (
          <p className="text-sm text-mist-500 py-6 text-center">
            No alumni entries yet. Add one above.
          </p>
        ) : (
          <ul className="space-y-3">
            {alumni.map((entry, index) => {
              // Defensive backstop: a malformed entry should degrade to a
              // broken-looking row, not take down the whole page.
              if (!entry) return null;
              const name = entry.name ?? "Unknown";

              return (
                <li
                  key={entry.id ?? index}
                  className="flex items-center gap-3 p-3 border border-mist-200 rounded-xl"
                >
                  <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 overflow-hidden">
                    {entry.imageUrl ? (
                      <img
                        src={entry.imageUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-800 truncate">
                      {name}
                    </p>
                    <p className="text-xs text-mist-500 truncate">
                      {entry.role ?? "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(entry)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-navy-700 hover:bg-mist-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(entry)}
                      disabled={deletingId === entry.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      {deletingId === entry.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AlumniManagement;
