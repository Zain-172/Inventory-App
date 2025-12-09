import { useEffect, useRef, useState } from "react";
import Trie from "../models/Trie";

export default function TrieSearch({value, onChange}) {
  const trieRef = useRef(null);
  const debounceTimer = useRef(null);

  const [input, setInput] = useState(value || "");
  const [focus, setFocus] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const trie = new Trie();

    const words = [
      "apple",
      "application",
      "apply",
      "banana",
      "band",
      "bandwidth",
      "cat",
      "cater",
      "category",
    ];

    words.forEach((w) => trie.insert(w));

    trieRef.current = trie;
  }, []);

  // Debounced search
  const handleDebouncedSearch = (value) => {
    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      if (!value.trim()) {
        setSuggestions([]);
        return;
      }
      const matches = trieRef.current.autocomplete(value);
      setSuggestions(matches);
    }, 300);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    handleDebouncedSearch(value);
    onChange(value);
  };

  const handleSelect = (word) => {
    setInput(word);
    setSuggestions([]);
  };

  return (
    <div className="w-full relative">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setTimeout(() => setFocus(false), 120)}
        className="w-full p-2 bg-[#181818] border rounded mb-3"
      />

      {/* Suggestions (only when focused) */}
      {focus && suggestions.length > 0 && (
        <ul
          className="
            absolute top-[50px] left-0 w-full
            bg-[#111] border border-gray-300 rounded-lg
            py-2 list-none shadow-lg z-10 transition-all max-h-60 overflow-y-auto
          "
        >
          {suggestions.map((word, i) => (
            <li
              key={i}
              onMouseDown={() => handleSelect(word)}
              className="
                px-3 py-2 cursor-pointer
              "
            >
              {word}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
