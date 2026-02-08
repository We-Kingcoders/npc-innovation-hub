import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { profileService } from "../../../api/profileService";
import {
  getUserFullName,
  getUserInitials,
  formatUserDate,
  getUserStatusLabel,
  getUserStatusColor,
} from "../../../types/user.types";
import type { User } from "../../../types/user.types";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Shield,
  Activity,
  Users,
} from "lucide-react";

export default function ViewProfile() {
  const { user: contextUser } = useAuth();
  const [user, setUser] = useState<User | null>(contextUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const profileData = await profileService.getProfile();
      setUser(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const fullName = getUserFullName(user);
  const initials = getUserInitials(user);
  const statusLabel = getUserStatusLabel(user);
  const statusColor = getUserStatusColor(user);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">View your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section with Avatar */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 relative">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={fullName}
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center ring-4 ring-white shadow-xl">
                    <span className="text-4xl font-bold text-blue-600">
                      {initials}
                    </span>
                  </div>
                )}
                <div
                  className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${
                    user.isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>

              {/* Name and Role */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {fullName}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                    <Shield size={16} />
                    {user.role}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${statusColor} text-sm font-medium`}
                  >
                    <Activity size={16} />
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Mail size={18} className="text-gray-400" />
                  Email Address
                </label>
                <p className="text-lg text-gray-900 font-medium">
                  {user.email}
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Phone size={18} className="text-gray-400" />
                  Phone Number
                </label>
                <p className="text-lg text-gray-900 font-medium">
                  {user.phone || "Not provided"}
                </p>
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <UserIcon size={18} className="text-gray-400" />
                  First Name
                </label>
                <p className="text-lg text-gray-900 font-medium">
                  {user.firstName}
                </p>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <UserIcon size={18} className="text-gray-400" />
                  Last Name
                </label>
                <p className="text-lg text-gray-900 font-medium">
                  {user.lastName}
                </p>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Users size={18} className="text-gray-400" />
                  Gender
                </label>
                <p className="text-lg text-gray-900 font-medium capitalize">
                  {user.gender}
                </p>
              </div>

              {/* Account Created */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Calendar size={18} className="text-gray-400" />
                  Account Created
                </label>
                <p className="text-lg text-gray-900 font-medium">
                  {formatUserDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Last updated: {formatUserDate(user.updatedAt)}
            </p>
            <a
              href="/admin/profile/settings"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Edit Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
