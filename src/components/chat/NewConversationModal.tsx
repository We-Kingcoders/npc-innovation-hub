// // src/components/chat/NewConversationModal.tsx

// import React, { useState, useEffect, useCallback } from "react";
// import { X, Search, Loader2 } from "lucide-react";
// import apiClient from "../../api/client";
// import { UserRole } from "../../types/user.types";
// import type { User } from "../../types/user.types";
// import ChatAvatar from "./ChatAvatar";

// interface NewConversationModalProps {
//   currentUserId: string;
//   onSelect: (user: User) => void;
//   onClose: () => void;
// }

// // ── Normalize a raw object into a User ───────────────────────────────────────
// const str = (v: unknown): string =>
//   typeof v === "string" ? v : v == null ? "" : String(v);

// const toUser = (raw: unknown): User | null => {
//   const u = (raw ?? {}) as Record<string, unknown>;
//   const id = str(u.id ?? u._id);
//   if (!id) return null;
//   return {
//     id,
//     firstName: str(u.firstName),
//     lastName: str(u.lastName),
//     email: str(u.email),
//     image: typeof u.image === "string" ? u.image : null,
//     phone: str(u.phone),
//     gender: (u.gender as User["gender"]) ?? "other",
//     verified: Boolean(u.verified),
//     role: (u.role as UserRole) ?? UserRole.MEMBER,
//     isActive: u.isActive !== false,
//     createdAt: str(u.createdAt),
//     updatedAt: str(u.updatedAt),
//   };
// };

// // ── Unwrap any API envelope into a User[] ────────────────────────────────────
// const extractUsers = (data: unknown): User[] => {
//   const tryArray = (arr: unknown): User[] | null => {
//     if (!Array.isArray(arr) || arr.length === 0) return null;
//     const mapped = arr.map(toUser).filter((u): u is User => u !== null);
//     return mapped.length > 0 ? mapped : null;
//   };

//   if (Array.isArray(data)) return tryArray(data) ?? [];

//   const d = (data ?? {}) as Record<string, unknown>;

//   // { data: { users/members: [] } }
//   if (d.data && typeof d.data === "object" && !Array.isArray(d.data)) {
//     const inner = d.data as Record<string, unknown>;
//     return (
//       tryArray(inner.users) ??
//       tryArray(inner.members) ??
//       tryArray(inner.data) ??
//       tryArray(Object.values(inner)) ??
//       []
//     );
//   }

//   if (Array.isArray(d.data)) return tryArray(d.data) ?? [];

//   return tryArray(d.users) ?? tryArray(d.members) ?? tryArray(d.data) ?? [];
// };

// // ── Derive users from /api/chat conversations (always accessible) ─────────────
// const extractUsersFromChat = (data: unknown): User[] => {
//   let items: unknown[] = [];
//   if (Array.isArray(data)) items = data;
//   else {
//     const d = (data ?? {}) as Record<string, unknown>;
//     if (Array.isArray(d.data)) items = d.data;
//     else if (d.data && typeof d.data === "object") {
//       const inner = d.data as Record<string, unknown>;
//       if (Array.isArray(inner.conversations)) items = inner.conversations;
//     }
//     if (Array.isArray(d.conversations)) items = d.conversations;
//   }
//   return items.flatMap((item) => {
//     const c = (item ?? {}) as Record<string, unknown>;
//     if (c.user && typeof c.user === "object") {
//       const u = toUser(c.user);
//       return u ? [u] : [];
//     }
//     return [];
//   });
// };

// // ── Try endpoints in order ────────────────────────────────────────────────────
// // /api/members is the confirmed working endpoint from the API docs
// const ENDPOINTS = ["/api/members", "/api/users/members", "/api/users"];

// const fetchMembers = async (currentUserId: string): Promise<User[]> => {
//   for (const endpoint of ENDPOINTS) {
//     try {
//       const res = await apiClient.get(endpoint);
//       const users = extractUsers(res.data);
//       if (users.length > 0) {
//         return users.filter((u) => u.id !== currentUserId);
//       }
//     } catch {
//       // 403 / 404 — try next
//     }
//   }

//   // Last resort: extract from existing conversations
//   try {
//     const res = await apiClient.get("/api/chat");
//     const users = extractUsersFromChat(res.data);
//     if (users.length > 0) {
//       return users.filter((u) => u.id !== currentUserId);
//     }
//   } catch {
//     // ignore
//   }

//   throw new Error("No accessible member endpoint found");
// };

// // ── Component ─────────────────────────────────────────────────────────────────

// const NewConversationModal: React.FC<NewConversationModalProps> = ({
//   currentUserId,
//   onSelect,
//   onClose,
// }) => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [search, setSearch] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const load = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const result = await fetchMembers(currentUserId);
//       setUsers(result);
//     } catch {
//       setError("Could not load members list.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [currentUserId]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     document.addEventListener("keydown", handler);
//     return () => document.removeEventListener("keydown", handler);
//   }, [onClose]);

//   const filtered = users.filter((u) => {
//     const name = `${u.firstName} ${u.lastName}`.toLowerCase();
//     return (
//       name.includes(search.toLowerCase()) ||
//       u.email.toLowerCase().includes(search.toLowerCase())
//     );
//   });

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
//       onClick={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
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
//             <Search
//               size={15}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />
//             <input
//               autoFocus
//               type="text"
//               placeholder="Search by name or email..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         {/* List */}
//         <div className="overflow-y-auto max-h-80">
//           {isLoading ? (
//             <div className="flex items-center justify-center py-10">
//               <Loader2 size={20} className="animate-spin text-gray-400" />
//             </div>
//           ) : error ? (
//             <p className="text-center text-sm text-red-500 py-8 px-5">
//               {error}
//             </p>
//           ) : filtered.length === 0 ? (
//             <p className="text-center text-sm text-gray-400 py-8">
//               {search ? "No members match your search." : "No members found."}
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
//                         <p className="text-xs text-gray-400 truncate">
//                           {u.email}
//                         </p>
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

interface NewConversationModalProps {
  currentUserId: string;
  onSelect: (member: MemberItem) => void;
  onClose: () => void;
}

export interface MemberItem {
  id: string;
  name: string;
  role: string;
  imageUrl: string | null;
}

// ── Avatar that generates initials from a full name string ────────────────────
const MemberAvatar: React.FC<{ name: string; imageUrl: string | null }> = ({
  name,
  imageUrl,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  // Generate initials from any name format e.g. "Alain shema" → "AS"
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");

  // Only treat as valid image if it starts with http or / and image hasn't errored
  const hasValidImage =
    !imgFailed &&
    imageUrl &&
    (imageUrl.startsWith("http") || imageUrl.startsWith("/"));

  return (
    <div className="relative w-10 h-10 flex-shrink-0">
      {hasValidImage ? (
        <img
          src={imageUrl!}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0C2340] to-[#3b5998] flex items-center justify-center text-white font-semibold text-sm select-none">
          {initials || "?"}
        </div>
      )}
    </div>
  );
};

// ── Parse /api/members response ───────────────────────────────────────────────
const str = (v: unknown): string =>
  typeof v === "string" ? v : v == null ? "" : String(v);

const parseMembersResponse = (data: unknown): MemberItem[] => {
  const toItem = (raw: unknown): MemberItem | null => {
    const r = (raw ?? {}) as Record<string, unknown>;
    // userId is the actual user ID used for DM routing
    const id = str(r.userId ?? r.id);
    if (!id) return null;
    const name =
      str(r.name) ||
      `${str(r.firstName)} ${str(r.lastName)}`.trim() ||
      "Unknown";
    const imageUrl =
      typeof r.imageUrl === "string" && r.imageUrl
        ? r.imageUrl
        : typeof r.image === "string" && r.image
          ? r.image
          : null;
    return { id, name, role: str(r.role || "Member"), imageUrl };
  };

  const tryArr = (arr: unknown): MemberItem[] | null => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const items = arr.map(toItem).filter((x): x is MemberItem => x !== null);
    return items.length > 0 ? items : null;
  };

  // Direct array
  if (Array.isArray(data)) return tryArr(data) ?? [];

  const d = (data ?? {}) as Record<string, unknown>;

  // { data: { members: [] } }  ← actual shape from your backend
  if (d.data && typeof d.data === "object" && !Array.isArray(d.data)) {
    const inner = d.data as Record<string, unknown>;
    const result =
      tryArr(inner.members) ??
      tryArr(inner.users) ??
      tryArr(inner.data) ??
      // last resort: values of whatever is inside data
      null;
    if (result) return result;
  }

  if (Array.isArray(d.data)) return tryArr(d.data) ?? [];
  return tryArr(d.members) ?? tryArr(d.users) ?? [];
};

// ── Fetch ─────────────────────────────────────────────────────────────────────

const fetchMembers = async (currentUserId: string): Promise<MemberItem[]> => {
  const res = await apiClient.get("/api/members");
  // Debug: log raw response to confirm data arrives
  console.log("[NewConversationModal] /api/members raw:", res.data);
  const members = parseMembersResponse(res.data);
  console.log("[NewConversationModal] parsed members:", members);
  return members.filter((m) => m.id !== currentUserId);
};

// ── Component ─────────────────────────────────────────────────────────────────

const NewConversationModal: React.FC<NewConversationModalProps> = ({
  currentUserId,
  onSelect,
  onClose,
}) => {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchMembers(currentUserId);
      setMembers(result);
    } catch (err) {
      console.error("[NewConversationModal] fetch failed:", err);
      setError("Could not load members. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

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
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <p className="text-center text-sm text-red-500 py-8 px-5">
              {error}
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">
              {search ? "No members match your search." : "No members found."}
            </p>
          ) : (
            <ul className="py-2">
              {filtered.map((m) => {
                const isAdmin = m.role.toLowerCase() === "admin";
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(m)}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <MemberAvatar name={m.name} imageUrl={m.imageUrl} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800 text-sm truncate">
                            {m.name}
                          </span>
                          {isAdmin && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                              Admin
                            </span>
                          )}
                        </div>
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
