class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.entries = [];
  }
}

export default class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  normalizeEntry(entry) {
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
  }

  appendEntry(node, entry) {
    const exists = node.entries.some(
      (item) => item.key === entry.key && item.value === entry.value,
    );

    if (!exists) {
      node.entries.push(entry);
    }
  }

  insert(entry) {
    const normalizedEntry = this.normalizeEntry(entry);
    const normalizedKey = normalizedEntry.key.toLowerCase().trim();

    if (!normalizedKey) {
      return;
    }

    let current = this.root;

    this.appendEntry(current, normalizedEntry);

    for (let char of normalizedKey) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
      this.appendEntry(current, normalizedEntry);
    }

    current.isEndOfWord = true;
  }

  searchPrefix(prefix) {
    let current = this.root;
    for (let char of prefix.toLowerCase()) {
      if (!current.children[char]) return null;
      current = current.children[char];
    }
    return current;
  }

  autocomplete(prefix, limit = 8) {
    const node = this.searchPrefix(prefix);
    if (!node) return [];

    return node.entries.slice(0, limit);
  }
}
