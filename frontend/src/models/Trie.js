class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

export default class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let current = this.root;
    for (let char of word.toLowerCase()) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
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

  autocomplete(prefix) {
    const node = this.searchPrefix(prefix);
    if (!node) return [];

    const results = [];

    const dfs = (currentNode, path) => {
      if (currentNode.isEndOfWord) results.push(path);

      for (let char in currentNode.children) {
        dfs(currentNode.children[char], path + char);
      }
    };

    dfs(node, prefix.toLowerCase());
    return results;
  }
}
