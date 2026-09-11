// src/components/admin-components/HeroMembersManagement.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getHeroMembers,
  getMembersPicker,
  addHeroMember,
  removeHeroMember,
  reorderHeroMembers,
} from "../../api/admin/heroMembers.api";
import type {
  HeroMember,
  MemberPickerOption,
} from "../../types/heroMember.types";

const HeroMembersManagement: React.FC = () => {
  const [heroMembers, setHeroMembers] = useState<HeroMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [pickerResults, setPickerResults] = useState<MemberPickerOption[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerLoading, setPickerLoading] = useState(false);
  // Selecting a member from the dropdown no longer adds them immediately -
  // it just fills this in, so the admin has to deliberately click "Add
  // Member" to confirm. Typing again after selecting clears it, since the
  // search text no longer matches what was picked.
  const [selectedMember, setSelectedMember] =
    useState<MemberPickerOption | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchHeroMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getHeroMembers();
      setHeroMembers(
        Array.isArray(result)
          ? [...result].sort((a, b) => a.order - b.order)
          : [],
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch hero members";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroMembers();
  }, [fetchHeroMembers]);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!search.trim()) {
      setPickerResults([]);
      return;
    }
    searchTimer.current = setTimeout(async () => {
      setPickerLoading(true);
      try {
        const results = await getMembersPicker(search.trim());
        const featuredIds = new Set(heroMembers.map((h) => h.memberId));
        setPickerResults(results.filter((m) => !featuredIds.has(m.id)));
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to search members",
        );
      } finally {
        setPickerLoading(false);
      }
    }, 300);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [search, heroMembers]);

  // Picking a row just selects it - handleConfirmAdd below is what
  // actually adds them, once the admin clicks "Add Member".
  const handleSelect = (member: MemberPickerOption) => {
    setSelectedMember(member);
    setSearch(member.name);
    setPickerOpen(false);
    setPickerResults([]);
  };

  const handleConfirmAdd = async () => {
    if (!selectedMember) return;
    const member = selectedMember;
    setAddingId(member.id);
    try {
      await addHeroMember(member.id);
      toast.success(`${member.name} added to hero section`);
      setSearch("");
      setSelectedMember(null);
      setPickerOpen(false);
      setPickerResults([]);
      await fetchHeroMembers();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add hero member",
      );
    } finally {
      setAddingId(null);
    }
  };

  const handleRemove = async (heroMember: HeroMember) => {
    if (
      !window.confirm(
        `Remove ${heroMember.name} from the hero section? This won't delete their member profile.`,
      )
    ) {
      return;
    }
    setRemovingId(heroMember.id);
    try {
      await removeHeroMember(heroMember.id);
      toast.success(`${heroMember.name} removed from hero section`);
      setHeroMembers((prev) => prev.filter((h) => h.id !== heroMember.id));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to remove hero member",
      );
    } finally {
      setRemovingId(null);
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= heroMembers.length) return;

    const reordered = [...heroMembers];
    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ];
    setHeroMembers(reordered);
    setReordering(true);
    try {
      await reorderHeroMembers(reordered.map((h) => h.id));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save new order",
      );
      // Revert on failure
      await fetchHeroMembers();
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="ml-0 md:ml-8 p-0 max-w-4xl">
      {/* Add member picker */}
      <div className="bg-white rounded-2xl border border-mist-300 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-navy-800 text-sm mb-1">
          Feature a Member
        </h2>
        <p className="text-xs text-mist-500 mb-4">
          Search for a member to add to the landing page hero section.
        </p>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              // The previous selection no longer matches what's typed -
              // require picking again before "Add Member" works.
              setSelectedMember(null);
              setPickerOpen(true);
            }}
            onFocus={() => setPickerOpen(true)}
            placeholder="Search members by name…"
            className="w-full px-4 py-2.5 border border-mist-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
          />
          {pickerOpen && search.trim() && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-mist-300 rounded-lg shadow-lg max-h-72 overflow-y-auto">
              {pickerLoading ? (
                <p className="px-4 py-3 text-sm text-mist-500">Searching…</p>
              ) : pickerResults.length === 0 ? (
                <p className="px-4 py-3 text-sm text-mist-500">
                  No matching members found
                </p>
              ) : (
                pickerResults.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleSelect(member)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-mist-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 overflow-hidden">
                      {member.imageUrl ? (
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        member.name.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy-800 truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-mist-500 truncate">
                        {member.role}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Selected member + confirm - nothing is added to the hero
            section until this button is clicked. */}
        <div className="mt-3 flex items-center gap-3">
          {selectedMember ? (
            <div className="flex items-center gap-2 flex-1 min-w-0 bg-mist-100 rounded-lg px-3 py-2">
              <div className="w-6 h-6 rounded-full bg-navy-700 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0 overflow-hidden">
                {selectedMember.imageUrl ? (
                  <img
                    src={selectedMember.imageUrl}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  selectedMember.name.slice(0, 2).toUpperCase()
                )}
              </div>
              <span className="text-sm font-medium text-navy-800 truncate">
                {selectedMember.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedMember(null);
                  setSearch("");
                }}
                aria-label="Clear selection"
                className="ml-auto text-mist-400 hover:text-mist-600 transition-colors flex-shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <p className="text-xs text-mist-400 flex-1">
              Select a member from the search results above
            </p>
          )}
          <button
            type="button"
            onClick={() => void handleConfirmAdd()}
            disabled={!selectedMember || addingId === selectedMember.id}
            className="px-4 py-2 bg-navy-800 text-white rounded-lg text-sm font-semibold hover:bg-navy-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            {selectedMember && addingId === selectedMember.id
              ? "Adding…"
              : "Add Member"}
          </button>
        </div>
      </div>

      {/* Current hero members */}
      <div className="bg-white rounded-2xl border border-mist-300 shadow-sm p-6">
        <h2 className="font-semibold text-navy-800 text-sm mb-4">
          Currently Featured ({heroMembers.length})
        </h2>

        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-mist-100 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : heroMembers.length === 0 ? (
          <p className="text-sm text-mist-500 py-6 text-center">
            No members are currently featured on the landing page hero section.
          </p>
        ) : (
          <ul className="space-y-3">
            {heroMembers.map((heroMember, index) => (
              <li
                key={heroMember.id}
                className="flex items-center gap-3 p-3 border border-mist-200 rounded-xl"
              >
                <span className="text-xs font-semibold text-mist-500 w-5 text-center flex-shrink-0">
                  {index + 1}
                </span>
                <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 overflow-hidden">
                  {heroMember.imageUrl ? (
                    <img
                      src={heroMember.imageUrl}
                      alt={heroMember.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    heroMember.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-800 truncate">
                    {heroMember.name}
                  </p>
                  <p className="text-xs text-mist-500 truncate">
                    {heroMember.role}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0 || reordering}
                    aria-label={`Move ${heroMember.name} up`}
                    className="p-1.5 rounded-lg text-mist-600 hover:bg-mist-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === heroMembers.length - 1 || reordering}
                    aria-label={`Move ${heroMember.name} down`}
                    className="p-1.5 rounded-lg text-mist-600 hover:bg-mist-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(heroMember)}
                    disabled={removingId === heroMember.id}
                    aria-label={`Remove ${heroMember.name}`}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HeroMembersManagement;
