import * as actionType from '../actions/actionTypes'
import { updateObject, insertItem, removeItem } from '../utility'

const initialState = {
    categoriesInfo: [
        { title: "פירות וירקות", description: '', imageName: 'fruits_vegetables.jpg' },
        { title: "חלב ביצים וסלטים", description: '', imageName: 'dairy.jpg' },
        { title: "בשר ודגים", description: '', imageName: 'meat.jpg' },
        { title: "אורגני ובריאות", description: '', imageName: 'organic.jpg' },
        { title: "קפואים", description: '', imageName: 'frozen.jpg' },
        { title: "שימורים בישול ואפיה", description: '', imageName: 'cans.jpg' },
        { title: "קטניות ודגנים", description: '', imageName: 'pantry.jpg' },
        { title: "חטיפים ומתוקים", description: '', imageName: 'sweets.jpg' },
        { title: "משקאות", description: '', imageName: 'drinks.jpg' },
        { title: "חד-פעמי ומתכלה", description: '', imageName: 'disposable.jpg' },
        { title: "אחזקת הבית ובעח", description: '', imageName: 'clean.jpg' },
        { title: "טיפוח ותינוקות", description: '', imageName: 'grooming.jpg' },
        { title: "לחם ומאפים", description: '', imageName: 'bakery.jpg' }],
    items: null,
    filteredItems: [],
    chosenProduct: {
        amount: 1,
        productInfo: ''
    },
    cart: {
        totalPrice: 0,
        products: [],
        chain: ''
    },
    location: null,
    brunches: null
}



const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.ADD_ITEM_TO_CART_SUCCESS: return addItemToCartSuccess(state, action)
        case actionType.SAVE_LOCATION: return saveLocation(state, action)
        case actionType.FETCH_BRUNCHES_SUCCESS: return fetchBrunchesSuccess(state, action)
        case actionType.FETCH_ITEMS_SUCCESS: return fetchItemsSuccess(state, action)
        case actionType.FETCH_CART_PRODUCTS_SUCCESS: return fetchCartProductsSuccess(state, action)
        case actionType.DELETE_ITEM_FROM_CART_SUCCESS: return deleteItemFromCartSuccess(state, action)


        default:
            return state;
    }
}
const fetchItemsSuccess = (state, action) => {
    return updateObject(state, { filteredItems: action.items })
}
const fetchBrunchesSuccess = (state, action) => {
    return updateObject(state, { brunches: action.brunches })
}
const saveLocation = (state, action) => {
    return updateObject(state, { location: action.location })
}
const addItemToCartSuccess = (state, action) => {
    const categoryArray = state.cart.products[action.category] ? state.cart.products[action.category] : [];
    const updatedCategoryArray = insertItem(categoryArray, action.product);
    const updatedProducts = updateObject(state.cart.products, { [action.category]: updatedCategoryArray });
    const updatedPrice = state.cart.totalPrice + action.product.quantity * 4;
    const updatedCart = updateObject(state.cart, {
        totalPrice: updatedPrice,
        products: updatedProducts
    });
    return updateObject(state, { cart: updatedCart });
}
const fetchCartProductsSuccess = (state, action) => {
    const products = {};
    let price = 0;
    for (const element of action.products) {
        price += element.quantity * element.avgPrice;
        if (products.hasOwnProperty(element.category)) {
            let product = { ...element };
            delete product.category;
            products[element.category].push(product)
        }
        else {
            products[element.category] = [];
            let product = { ...element };
            delete product.category;
            products[element.category].push(product)
        }
    };
    const cart = updateObject(state.cart, {
        totalPrice: price,
        products: products
    });
    return updateObject(state, { cart: cart });

}
const deleteItemFromCartSuccess = (state, action) => {
    const categoryArray = state.cart.products[action.category];
    console.log(categoryArray);
    const indexOfProduct = categoryArray.filter((product, index) => { if (product.code === action.productCode) return index })
    console.log(indexOfProduct);

    const updatedCategoryArray = removeItem(categoryArray, indexOfProduct);
    console.log(updatedCategoryArray);
    const updatedProducts = updateObject(state.cart.products, { [action.category]: updatedCategoryArray });
    console.log(updatedProducts);
    if (updatedCategoryArray.length <= 0) {
        delete updatedProducts[action.category]
    }
    const updatedPrice = state.cart.totalPrice - action.quantity * 4;
    const updatedCart = updateObject(state.cart, {
        totalPrice: updatedPrice,
        products: updatedProducts
    });
    console.log(updatedCart);

    if (updatedCategoryArray.length <= 0) {

    }
    return updateObject(state, { cart: updatedCart });
}
// const onAddToCartClicked = (product, cart) => {
//     const updatedProducts = [...cart.products].concat([product.productInfo + ' ' + product.amount])
//     return {

//     }
// }
// const onItemClicked = (product, items, index) => {
//     const newChosenProduct = items[index].replace(/_/g, ' ')
//     return {
//         ...product,
//         productInfo: newChosenProduct
//     }
// }
// const onAmountInputChanged = (product, amount) => {
//     return {
//         ...product,
//         amount: amount
//     }
// }
// const onSearchInputChanged = (items, product, searchText) => {
//     let filteredItems = []
//     if (searchText.trim() !== '') {

//         filteredItems = items.filter((item) => item.ItemName.search(new RegExp(searchText, 'gi')) > -1);
//     }

//     return {
//         filteredItems: filteredItems,
//         product: { ...product, productInfo: searchText }
//     }
// }
export default reducer