// src/types/alumni.types.ts
// Admin-side alumni CRUD. For the public read-only shape, see
// src/api/member/alumni.api.ts's AlumniSummary.

export interface Alumni {
  id: string;
  name: string;
  role: string;
  imageUrl: string | null;
  memberId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AlumniResponse {
  status: string;
  message?: string;
  data: { alumni: Alumni };
}

export interface AlumniListResponse {
  status: string;
  data: { alumni: Alumni[] };
}

export interface CreateAlumniPayload {
  name: string;
  role: string;
  image?: File | null;
}

export interface UpdateAlumniPayload {
  name?: string;
  role?: string;
  image?: File | null;
}
