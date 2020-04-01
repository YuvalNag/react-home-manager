class Cart {
    constructor(products, lacking) {
        
        this.products = products || [];
        this.lacking = lacking || [];
        this.price = this.calculatePrice()
    }
    calculatePrice = () => {
        return this.products.reduce((sum, cur) => sum + cur.price, 0);
    }
}
export default Cart