/**
 * User Avatar Component
 *
 * Displays user avatar with fallback to initials if no image is available.
 * Professional, accessible, and responsive.
 */

import React, { useState } from "react";

// ==================== TYPES ====================

interface UserAvatarProps {
  imageUrl: string | null;
  initials: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
}

// ==================== SIZE MAPPINGS ====================

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

// ==================== COMPONENT ====================

const UserAvatar: React.FC<UserAvatarProps> = ({
  imageUrl,
  initials,
  alt,
  size = "md",
}) => {
  const [imageError, setImageError] = useState(false);

  // Show initials if no image or image failed to load
  const showInitials = !imageUrl || imageError;

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex-shrink-0 overflow-hidden ${
        showInitials
          ? "bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center"
          : "bg-gray-200"
      }`}
      title={alt}
    >
      {showInitials ? (
        <span className="font-semibold text-white">{initials}</span>
      ) : (
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
};

export default UserAvatar;
