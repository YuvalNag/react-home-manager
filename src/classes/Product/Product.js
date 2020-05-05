class Product {
    constructor(code, name, quantity, category, manufacturerName) {
        this.code = code;
        this.name = name;
        this.quantity = quantity;
        this.category = category;
        this.manufacturerName = manufacturerName;
        this.url=`https://static.rami-levy.co.il/storage/images/${code}/small.jpg`
    }
}

export default Product
