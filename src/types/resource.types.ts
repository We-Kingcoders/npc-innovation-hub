/**
 * Resource Types
 *
 * Type definitions for resource management system
 */

// ==================== ENUMS ====================

export enum ResourceCategory {
  FRONTEND = "Frontend",
  BACKEND = "Backend",
  CYBERSECURITY = "Cybersecurity",
}

export enum ResourceType {
  VIDEO = "Video",
  DOCUMENTATION = "Documentation",
  BOOK = "Book",
  OTHER = "Other",
}

export enum ResourceDifficulty {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
}

// ==================== CORE TYPES ====================

export interface ResourceUser {
  firstName: string;
  lastName: string;
  image: string | null;
}

export interface Resource {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  type: string;
  difficulty: string;
  url: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  author: string;
  isPaid: boolean;
  price: string;
  platform: string | null;
  tags: string[];
  isFeatured: boolean;
  isHosted: boolean;
  duration: number;
  upvotes: number;
  createdAt: string;
  updatedAt: string;
  User: ResourceUser;
}

// ==================== API RESPONSE TYPES ====================

export interface PaginatedResourcesResponse {
  status: string;
  results: number;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: {
    resources: Resource[];
  };
}

export interface SingleResourceResponse {
  status: string;
  data: {
    resource: Resource;
    userInteraction: {
      hasUpvoted: boolean;
      hasSaved: boolean;
    };
  };
}

export interface ResourceApiResponse {
  status: string;
  message?: string;
  data?: {
    resource: Resource;
  };
}

// ==================== REQUEST PAYLOAD TYPES ====================

export interface CreateResourcePayload {
  title: string;
  description: string;
  category: string;
  type: string;
  difficulty: string;
  url?: string;
  imageUrl?: string;
  videoUrl?: string;
  author: string;
  isPaid: boolean;
  price?: string;
  platform?: string;
  tags: string[];
  isFeatured?: boolean;
  isHosted?: boolean;
  duration?: number;
}

export interface UpdateResourcePayload {
  title?: string;
  description?: string;
  category?: string;
  type?: string;
  difficulty?: string;
  url?: string;
  imageUrl?: string;
  videoUrl?: string;
  author?: string;
  isPaid?: boolean;
  price?: string;
  platform?: string;
  tags?: string[];
  isFeatured?: boolean;
  isHosted?: boolean;
  duration?: number;
}

// ==================== QUERY PARAMS ====================

export interface ResourceQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  type?: string;
  difficulty?: string;
  search?: string;
}

// ==================== PAGINATION ====================

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
