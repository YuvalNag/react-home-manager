import * as actionType from '../actions/actionTypes'
import { updateObject, insertItem, removeItem, margeTwoArraysWithImportantProp } from '../utility'

const initialState = {
    categoriesInfo: {
        "פירות וירקות": { imageName: 'fruits_vegetables.jpg' },
        "חלב ביצים וסלטים": { imageName: 'dairy.jpg' },
        "בשר ודגים": { imageName: 'meat.jpg' },
        "אורגני ובריאות": { imageName: 'organic.jpg' },
        "קפואים": { imageName: 'frozen.jpg' },
        "שימורים בישול ואפיה": { imageName: 'cans.jpg' },
        "קטניות ודגנים": { imageName: 'pantry.jpg' },
        "חטיפים ומתוקים": { imageName: 'sweets.jpg' },
        "משקאות": { imageName: 'drinks.jpg' },
        "חד-פעמי ומתכלה": { imageName: 'disposable.jpg' },
        "אחזקת הבית ובעח": { imageName: 'clean.jpg' },
        "טיפוח ותינוקות": { imageName: 'grooming.jpg' },
        "לחם ומאפים": { imageName: 'bakery.jpg' }
    },
    items: [],
    filteredItems: [],
    currentBranch: { id: 18 },
    cart: {
        totalPrice: 0,
        products: []
    },
    location: null,
    chains: [],
    favoriteBranches: [{ id: 145 }, { id: 463 }, { id: 18 }],
    closeBranches: []
}



const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.ADD_ITEM_TO_CART_SUCCESS: return addItemToCartSuccess(state, action)
        case actionType.SAVE_LOCATION: return saveLocation(state, action)
        case actionType.FETCH_BRANCHES_SUCCESS: return fetchBranchesSuccess(state, action)
        case actionType.FETCH_ITEMS_SUCCESS: return fetchItemsSuccess(state, action)
        case actionType.FETCH_CART_PRODUCTS_SUCCESS: return fetchCartProductsSuccess(state, action)
        case actionType.DELETE_ITEM_FROM_CART_SUCCESS: return deleteItemFromCartSuccess(state, action)


        default:
            return state;
    }
}
const fetchItemsSuccess = (state, action) => {
    return updateObject(state, { items: action.items, filteredItems: action.filteredItems })
}
const fetchBranchesSuccess = (state, action) => {
    if (action.favoriteBranches) {
        return updateObject(state, { chains: action.chains, favoriteBranches: action.favoriteBranches })
    }
    else { 
        return updateObject(state, { chains: action.chains, closeBranches: action.closeBranches })
    }
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
    // const products = {};
    // let price = 0;
    // for (const element of action.products) {
    //     price += element.quantity * element.avgPrice;
    //     if (products.hasOwnProperty(element.category)) {
    //         let product = { ...element };
    //         delete product.category;
    //         products[element.category].push(product)
    //     }
    //     else {
    //         products[element.category] = [];
    //         let product = { ...element };
    //         delete product.category;
    //         products[element.category].push(product)
    //     }
    // };
    // const cart = updateObject(state.cart, {
    //     totalPrice: price,
    //     products: products
    // });
    const currentBranch = state.favoriteBranches.find(branch => branch.id === state.currentBranch.id)
    return updateObject(state, { chains: action.chains, currentBranch: currentBranch });

}
const deleteItemFromCartSuccess = (state, action) => {
    const categoryArray = state.cart.products[action.category];
    console.log(categoryArray);
    const [indexOfProduct, price] = categoryArray.filter((product, index) => { if (product.code === action.productCode) return [index, product.avgPrice] })
    console.log(indexOfProduct);

    const updatedCategoryArray = removeItem(categoryArray, indexOfProduct);
    console.log(updatedCategoryArray);
    const updatedProducts = updateObject(state.cart.products, { [action.category]: updatedCategoryArray });
    console.log(updatedProducts);
    if (updatedCategoryArray.length <= 0) {
        delete updatedProducts[action.category]
    }
    const updatedPrice = state.cart.totalPrice - action.quantity * price;
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