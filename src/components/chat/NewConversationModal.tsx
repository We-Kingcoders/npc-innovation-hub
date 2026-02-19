// // src/components/chat/NewConversationModal.tsx

// import React, { useState, useEffect, useCallback } from "react";
// import { X, Search, Loader2 } from "lucide-react";
// import { getAllUsers } from "../../api/admin/member.api";
// import type { User } from "../../types/user.types";
// import { UserRole } from "../../types/user.types";
// import ChatAvatar from "./ChatAvatar";

// interface NewConversationModalProps {
//   currentUserId: string;
//   onSelect: (user: User) => void;
//   onClose: () => void;
// }

// const NewConversationModal: React.FC<NewConversationModalProps> = ({
//   currentUserId,
//   onSelect,
//   onClose,
// }) => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [search, setSearch] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchUsers = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const all = await getAllUsers();
//       // Exclude current user
//       setUsers(all.filter((u) => u.id !== currentUserId));
//       setError(null);
//     } catch {
//       setError("Failed to load members.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [currentUserId]);

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   // Close on Escape
//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     document.addEventListener("keydown", handler);
//     return () => document.removeEventListener("keydown", handler);
//   }, [onClose]);

//   const filtered = users.filter((u) => {
//     const name = `${u.firstName} ${u.lastName}`.toLowerCase();
//     return name.includes(search.toLowerCase());
//   });

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
//       onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
//     >
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//           <h3 className="text-base font-bold text-gray-800">New Message</h3>
//           <button
//             onClick={onClose}
//             className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X size={16} className="text-gray-500" />
//           </button>
//         </div>

//         {/* Search */}
//         <div className="px-5 py-3 border-b border-gray-100">
//           <div className="relative">
//             <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               autoFocus
//               type="text"
//               placeholder="Search by name..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         {/* List */}
//         <div className="overflow-y-auto max-h-72">
//           {isLoading ? (
//             <div className="flex items-center justify-center py-10">
//               <Loader2 size={20} className="animate-spin text-gray-400" />
//             </div>
//           ) : error ? (
//             <p className="text-center text-sm text-red-500 py-8">{error}</p>
//           ) : filtered.length === 0 ? (
//             <p className="text-center text-sm text-gray-400 py-8">
//               No members found.
//             </p>
//           ) : (
//             <ul className="py-2">
//               {filtered.map((u) => {
//                 const fullName = `${u.firstName} ${u.lastName}`.trim();
//                 const isAdmin = u.role === UserRole.ADMIN;
//                 return (
//                   <li key={u.id}>
//                     <button
//                       type="button"
//                       onClick={() => onSelect(u)}
//                       className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
//                     >
//                       <ChatAvatar
//                         image={u.image}
//                         name={fullName}
//                         size="md"
//                         isOnline={u.isActive}
//                       />
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2">
//                           <span className="font-medium text-gray-800 text-sm truncate">
//                             {fullName}
//                           </span>
//                           {isAdmin && (
//                             <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
//                               Admin
//                             </span>
//                           )}
//                         </div>
//                         <p className="text-xs text-gray-400 truncate">{u.email}</p>
//                       </div>
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewConversationModal;

// src/components/chat/NewConversationModal.tsx

import React, { useState, useEffect, useCallback } from "react";
import { X, Search, Loader2 } from "lucide-react";
import apiClient from "../../api/client";
import { UserRole } from "../../types/user.types";
import type { User } from "../../types/user.types";
import ChatAvatar from "./ChatAvatar";

interface NewConversationModalProps {
  currentUserId: string;
  onSelect: (user: User) => void;
  onClose: () => void;
}

// ── Try multiple endpoints to fetch users ─────────────────────────────────────
// /api/users/users → admin only (403 for members)
// /api/users       → may be member-accessible
// /api/members     → alternative
// /api/chat        → conversations already loaded (last resort: derive users from them)

const str = (v: unknown): string =>
  typeof v === "string" ? v : v == null ? "" : String(v);

const toUser = (raw: unknown): User | null => {
  const u = (raw ?? {}) as Record<string, unknown>;
  if (!u.id && !u._id) return null;
  return {
    id: str(u.id ?? u._id),
    firstName: str(u.firstName),
    lastName: str(u.lastName),
    email: str(u.email),
    image: typeof u.image === "string" ? u.image : null,
    phone: str(u.phone),
    gender: (u.gender as User["gender"]) ?? "other",
    verified: Boolean(u.verified),
    role: (u.role as UserRole) ?? UserRole.MEMBER,
    isActive: Boolean(u.isActive ?? true),
    createdAt: str(u.createdAt),
    updatedAt: str(u.updatedAt),
  };
};

const extractUsers = (data: unknown): User[] => {
  const check = (arr: unknown): User[] | null => {
    if (!Array.isArray(arr)) return null;
    const mapped = arr.map(toUser).filter((u): u is User => u !== null);
    return mapped.length > 0 ? mapped : null;
  };

  if (Array.isArray(data)) return check(data) ?? [];

  const d = (data ?? {}) as Record<string, unknown>;

  // { data: { users: [] } }
  if (d.data && typeof d.data === "object") {
    const inner = d.data as Record<string, unknown>;
    const fromUsers = check(inner.users);
    if (fromUsers) return fromUsers;
    const fromMembers = check(inner.members);
    if (fromMembers) return fromMembers;
    if (Array.isArray(inner)) return check(inner) ?? [];
  }

  const fromUsers = check(d.users);
  if (fromUsers) return fromUsers;
  const fromMembers = check(d.members);
  if (fromMembers) return fromMembers;
  if (Array.isArray(d.data)) return check(d.data) ?? [];

  return [];
};

// Derive users from conversation list (works for members - no extra API call)
const extractUsersFromConversations = (data: unknown): User[] => {
  const items = Array.isArray(data)
    ? data
    : (() => {
        const d = (data ?? {}) as Record<string, unknown>;
        if (Array.isArray(d.data)) return d.data;
        if (d.data && typeof d.data === "object") {
          const inner = d.data as Record<string, unknown>;
          if (Array.isArray(inner.conversations)) return inner.conversations;
        }
        if (Array.isArray(d.conversations)) return d.conversations;
        return [];
      })();

  return items.flatMap((item) => {
    const c = (item ?? {}) as Record<string, unknown>;
    // { user: { id, firstName, ... }, lastMessage, unreadCount }
    if (c.user && typeof c.user === "object") {
      const u = toUser(c.user);
      return u ? [u] : [];
    }
    return [];
  });
};

const ENDPOINTS = ["/api/users", "/api/members", "/api/users/members"];

const fetchMembers = async (currentUserId: string): Promise<User[]> => {
  // Try each member-accessible endpoint first
  for (const endpoint of ENDPOINTS) {
    try {
      const res = await apiClient.get(endpoint);
      const users = extractUsers(res.data);
      if (users.length > 0) {
        return users.filter((u) => u.id !== currentUserId);
      }
    } catch {
      // 403 or 404 — try next
    }
  }

  // Fallback: derive users from conversations list (always works for members)
  try {
    const res = await apiClient.get("/api/chat");
    const users = extractUsersFromConversations(res.data);
    if (users.length > 0) {
      return users.filter((u) => u.id !== currentUserId);
    }
  } catch {
    // ignore
  }

  throw new Error("No member endpoint accessible");
};

// ── Modal ─────────────────────────────────────────────────────────────────────

const NewConversationModal: React.FC<NewConversationModalProps> = ({
  currentUserId,
  onSelect,
  onClose,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchMembers(currentUserId);
      setUsers(result);
    } catch {
      setError(
        "Could not load members. You can still open a conversation by clicking a name in your conversation list.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    load();
  }, [load]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = users.filter((u) => {
    const name = `${u.firstName} ${u.lastName}`.toLowerCase();
    const email = u.email.toLowerCase();
    return (
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase())
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">New Message</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-gray-100">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              autoFocus
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-80">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={20} className="animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="px-5 py-6 text-center">
              <p className="text-sm text-amber-600 mb-2">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">
              {search
                ? "No members match your search."
                : "No other members found."}
            </p>
          ) : (
            <ul className="py-2">
              {filtered.map((u) => {
                const fullName = `${u.firstName} ${u.lastName}`.trim();
                const isAdmin = u.role === UserRole.ADMIN;
                return (
                  <li key={u.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(u)}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <ChatAvatar
                        image={u.image}
                        name={fullName}
                        size="md"
                        isOnline={u.isActive}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800 text-sm truncate">
                            {fullName}
                          </span>
                          {isAdmin && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 truncate">
                          {u.email}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewConversationModal;
