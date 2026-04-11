// src/types/profile.types.ts

export interface UserProfile {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  phone: string;
  gender: string;
  verified: boolean;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface UserProfileResponse {
  status: string;
  data: UserProfile;
}

export interface UserMeResponse {
  status: string;
  data: {
    user: UserProfile;
  };
}
