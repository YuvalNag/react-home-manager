class TrieNode {

    //Trie node class 
    constructor() {
        this.children = {}
        this.data = null
        //isEndOfWord is True if node represent the end of the word 
        this.isEndOfWord = false
    }
}

class Trie {

    //Trie data structure class 
    constructor() {
        this.root = this.getNode()
    }
    getNode() {

        //Returns new trie node (initialized to NULLs) 
        return new TrieNode()
    }
    insert = (key, data) => {

        //If not present, inserts key into trie 
        //If the key is prefix of trie node,  
        //just marks leaf node 
        let pCrawl = this.root

        for (let level = 0; level < key.length; level++) {
            const char = key[level]
            //if current character is not present 
            if (!pCrawl.children[char]) {
                pCrawl.children[char] = this.getNode()
            }
            pCrawl = pCrawl.children[char]
        }
        //mark last node as leaf
        pCrawl.data = data
        pCrawl.isEndOfWord = true
    }

    isExist = (key) => {
        //Search key in the trie 
        //Returns true if key presents  
        //in trie, else false 
        let pCrawl = this.root
        for (let level = 0; level < key.length; level++) {
            const char = key[level]

            if (!pCrawl.children[char]) {
                return false
            }
            pCrawl = pCrawl.children[char]
        }

        return pCrawl !== undefined && pCrawl.isEndOfWord
    }
    updateData = (key, data) => {
        let pCrawl = this.root
        for (let level = 0; level < key.length; level++) {
            const char = key[level]

            if (!pCrawl.children[char]) {
                return false
            }
            pCrawl = pCrawl.children[char]
        }

        return pCrawl !== undefined && pCrawl.isEndOfWord ? pCrawl.data.branches = pCrawl.data.branches.concat(data.branches) : false
    }
    getData = (key) => {
        const arr = []
        let pCrawl = this.root
        for (let level = 0; level < key.length; level++) {
            const char = key[level]
            pCrawl = pCrawl.children[char]
        }
        if (pCrawl !== undefined) {
            this.getAllChildrenData(pCrawl, arr)
        }
        pCrawl = this.root
        this.getAllChildrenData(pCrawl, arr)
        return arr
    }
    getAllChildrenData = (node, arr) => {
        let pCrawl = node
        if (pCrawl.isEndOfWord) {
            arr.push(pCrawl.data)
            pCrawl.isEndOfWord = false
        }
        for (const char in pCrawl.children) {
            this.getAllChildrenData(pCrawl.children[char], arr)
        }
    }
}

export default Trie