import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { profileService } from "../../../api/profileService";
import type { UpdateProfilePayload } from "../../../api/profileService";
import ChangePasswordForm from "../../../components/admin-components/ChangePasswordForm";
import { getUserInitials } from "../../../types/user.types";
import type { Gender } from "../../../types/user.types";
import { User as UserIcon, Mail, Save, X } from "lucide-react";
import { toast } from "react-toastify";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  gender: Gender;
  image: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  image?: string;
}

export default function ProfileSettings() {
  const { user: contextUser, refreshUser } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "male" as Gender,
    image: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (contextUser) {
      setFormData({
        firstName: contextUser.firstName || "",
        lastName: contextUser.lastName || "",
        phone: contextUser.phone || "",
        gender: contextUser.gender || "male",
        image: contextUser.image || "",
      });
    }
  }, [contextUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (e.g., +1234567890)";
    }

    if (
      formData.image &&
      !formData.image.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)
    ) {
      newErrors.image = "Please enter a valid image URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const payload: UpdateProfilePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        gender: formData.gender,
        image: formData.image || undefined,
      };

      await profileService.updateProfile(payload);

      // Refresh user data in context
      await refreshUser();

      toast.success("Profile updated successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (contextUser) {
      setFormData({
        firstName: contextUser.firstName || "",
        lastName: contextUser.lastName || "",
        phone: contextUser.phone || "",
        gender: contextUser.gender || "male",
        image: contextUser.image || "",
      });
      setErrors({});
    }
  };

  if (!contextUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const initials = getUserInitials(contextUser);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account information and security
          </p>
        </div>

        {/* Profile Information Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UserIcon className="text-blue-600" size={28} />
              Personal Information
            </h2>
            <p className="text-gray-600 mt-1">
              Update your personal details and profile picture
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Preview */}
            <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
              <div className="relative">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-100"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center ring-4 ring-gray-100">
                    <span className="text-3xl font-bold text-white">
                      {initials}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Profile Picture
                </h3>
                <p className="text-sm text-gray-600">
                  Enter an image URL for your profile picture
                </p>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.firstName
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.lastName
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={contextUser.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <Mail
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Email cannot be changed
                </p>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.phone
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="+1234567890"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Image URL */}
              <div className="md:col-span-2">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Profile Image URL
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.image
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Enter a valid image URL (jpg, jpeg, png, gif, webp)
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSaving}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                  isSaving
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <Save size={20} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Section */}
        <ChangePasswordForm userId={contextUser.id} />
      </div>
    </div>
  );
}
