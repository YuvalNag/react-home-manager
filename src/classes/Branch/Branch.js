class Branch {
    constructor(id, storeId, storeName, address, city, lat, lng, subChainName, chainName, isChosen, distance) {
        this.id = id;
        this.storeId = storeId;
        this.storeName = storeName;
        this.address = address;
        this.city = city;
        this.lat = lat;
        this.lng = lng;
        this.subChainName = subChainName;
        this.chainName = chainName;
        this.isChosen = isChosen;
        this.distance = (distance && distance.toFixed(2)) || '';
    }
}
export default Branch