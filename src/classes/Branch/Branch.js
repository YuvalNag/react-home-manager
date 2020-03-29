class Branch {
    constructor(id, storeId, storeName, address, city, lat, lng, subChainName, chainId) {
        this.id = id;
        this.storeId = storeId;
        this.storeName = storeName;
        this.address = address;
        this.city = city;
        this.lat = lat;
        this.lng = lng;
        this.subChainName = subChainName;
        this.chainName = chainId;
    }
}
export default Branch