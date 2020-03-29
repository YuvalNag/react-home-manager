class Chain {
    constructor(chainName, chainEnglishName, branches, chainId) {
        this.chainName = chainName;
        this.chainEnglishName = chainEnglishName;
        this.branches = this.buildBranchesMap(branches);
        this.id = chainId;
    }
    buildBranchesMap = (branches) => {
        const branchesMap = {}
        branches.map(branch => branchesMap[branch.id] = branch)
        return branchesMap;
    }

}
export default Chain