class Cart {
    constructor(products) {

        this.products = products || [];
        this.price = this.calculatePrice()
    }
    addProducts = (product) => {
        this.products.push(product);
        this.price += (product.isLack ? product.avgPrice : product.price) * product.quantity;
    }
    calculatePrice = () => {
        return this.products.reduce((sum, cur) => sum + cur.price * cur.quantity, 0);
    }
}
export default Cart