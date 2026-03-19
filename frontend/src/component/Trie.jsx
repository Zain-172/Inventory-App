import { useEffect, useRef, useState } from "react";
import Trie from "../models/Trie";

/**
 * Props:
 *  items / words — { key, value }[] | string[]
 *  value         — string | { key, value }
 *  onChange      — fn({ key, value })
 *  placeholder — string
 *  className   — string    — extra classes for the wrapper div
 */
export default function TrieSearch({
  items,
  words = [],
  value,
  onChange,
  placeholder = "Search…",
  className = "",
}) {
  const trieRef = useRef(null);
  const debounceTimer = useRef(null);
  const sourceItems = items ?? words;

  const getDisplayText = (entry) => {
    if (typeof entry === "string") {
      return entry;
    }

    return entry?.key ?? "";
  };

  const createPayload = (entry) => {
    if (typeof entry === "string") {
      return {
        key: entry,
        value: entry,
      };
    }

    return {
      key: String(entry?.key || ""),
      value: entry?.value ?? entry?.key ?? "",
    };
  };

  const isControlled = value !== undefined;
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputValue = isControlled ? getDisplayText(value) : input;

  // Rebuild trie whenever the words list changes
  useEffect(() => {
    const trie = new Trie();
    sourceItems.forEach((item) => trie.insert(item));
    trieRef.current = trie;
  }, [sourceItems]);

  const runSearch = (query) => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (!query.trim() || !trieRef.current) {
        setSuggestions([]);
        return;
      }
      const matches = trieRef.current.autocomplete(query, 8);
      setSuggestions(matches);
      setActiveIndex(-1);
    }, 150);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (!isControlled) {
      setInput(val);
    }
    runSearch(val);
    onChange && onChange({ key: val, value: null });
  };

  const handleSelect = (entry) => {
    const payload = createPayload(entry);

    if (!isControlled) {
      setInput(payload.key);
    }
    setSuggestions([]);
    setActiveIndex(-1);
    setOpen(false);
    onChange && onChange(payload);
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      if (activeIndex >= 0)
        handleSelect(suggestions[activeIndex]);
      else
        handleSelect(suggestions[0]);
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  return (
    <div className={`w-full relative ${className}`}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-neutral-900 dark:border-neutral-600 dark:text-white dark:placeholder-neutral-400 transition-colors"
      />

      {open && suggestions.length > 0 && (
        <ul className="absolute mt-1 w-full border rounded-xl shadow-lg z-10 py-1 list-none bg-white dark:bg-neutral-800 border-gray-200 dark:border-white/20 max-h-52 overflow-y-auto">
          {suggestions.map((entry, i) => (
            <li
              key={`${entry.key}-${entry.value}-${i}`}
              onMouseDown={() => handleSelect(entry)}
              className={`px-3 py-2 cursor-pointer text-sm transition-colors ${
                i === activeIndex
                  ? "bg-green-600 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-neutral-700 border-t border-gray-100 dark:border-white/10"
              }`}
            >
              {entry.key}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
