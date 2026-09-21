// src/components/ui/TopbarSearch.tsx
//
// The Topbar search box in both Admin and Member was purely decorative -
// no value, no onChange, no way to actually search anything. This is the
// shared dropdown shell: each caller feeds it real search results from
// its own domains (Admin: resources/projects/members: Member:
// resources/projects) and this component owns the input, debounce,
// dropdown rendering, and outside-click/Escape handling.
import React, { useEffect, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";

export interface SearchResultItem {
  id: string;
  label: string;
  sublabel?: string;
  onSelect: () => void;
}

export interface SearchSection {
  key: string;
  label: string;
  items: SearchResultItem[];
}

interface TopbarSearchProps {
  placeholder: string;
  loading?: boolean;
  sections: SearchSection[];
  onSearch: (query: string) => void;
  onSubmit: (query: string) => void;
  minChars?: number;
  debounceMs?: number;
}

const TopbarSearch: React.FC<TopbarSearchProps> = ({
  placeholder,
  loading = false,
  sections,
  onSearch,
  onSubmit,
  minChars = 2,
  debounceMs = 300,
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < minChars) {
      onSearch("");
      return;
    }
    const timer = setTimeout(() => onSearch(trimmed), debounceMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      e.currentTarget.blur();
    } else if (e.key === "Enter") {
      const trimmed = query.trim();
      if (trimmed.length >= minChars) {
        onSubmit(trimmed);
        setOpen(false);
      }
    }
  };

  const totalResults = sections.reduce((sum, s) => sum + s.items.length, 0);
  const showDropdown = open && query.trim().length >= minChars;

  return (
    <div className="relative w-full" ref={containerRef}>
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-mist-500 pointer-events-none"
        size={18}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 bg-white border border-mist-300 rounded-xl text-sm text-navy-800 placeholder:text-mist-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 transition-all duration-200"
      />

      {showDropdown && (
        <div className="absolute left-0 right-0 mt-2 max-w-md bg-white rounded-xl shadow-2xl border border-mist-300 overflow-hidden z-50">
          {loading && (
            <div className="flex items-center justify-center py-8 text-mist-400">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}

          {!loading && totalResults === 0 && (
            <div className="px-4 py-6 text-center text-sm text-mist-500">
              No results for &quot;{query.trim()}&quot;
            </div>
          )}

          {!loading &&
            sections.map(
              (section) =>
                section.items.length > 0 && (
                  <div
                    key={section.key}
                    className="border-b border-mist-200 last:border-b-0"
                  >
                    <p className="px-4 pt-3 pb-1 text-xs font-bold text-mist-500 uppercase tracking-wide">
                      {section.label}
                    </p>
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          item.onSelect();
                          setOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 hover:bg-mist-100 transition-colors"
                      >
                        <p className="text-sm font-medium text-navy-800 truncate">
                          {item.label}
                        </p>
                        {item.sublabel && (
                          <p className="text-xs text-mist-500 truncate">
                            {item.sublabel}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                ),
            )}
        </div>
      )}
    </div>
  );
};

export default TopbarSearch;
