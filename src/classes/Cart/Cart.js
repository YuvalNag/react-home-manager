class Cart {
    constructor(products, lacking) {

        this.products = products || [];
        this.lacking = lacking || [];
        this.price = this.calculatePrice()
    }
    addProducts = (product) => {
        this.products.push(product);
        this.price += product.price;
    }
    calculatePrice = () => {
        return this.products.reduce((sum, cur) => sum + cur.price, 0);
    }
}
export default Cart