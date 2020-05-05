class Cart {
    constructor(products, lacking) {

        this.products = products || [];
        this.lacking = lacking || [];
        this.price = this.calculatePrice()
    }
    addProducts = (product) => {
        this.products.push(product);
        this.price += product.price * product.quantity;
    }
    calculatePrice = () => {
        return this.products.reduce((sum, cur) => sum + cur.price * cur.quantity, 0);
    }
}
export default Cart