import * as actionType from './actions'


const initialState = {
    categoriesInfo: [
        { title: 'Health & Beauty', description: '', imageName: 'healty.jpg' },
        { title: 'Bakery & Pastry', description: '', imageName: 'bakery.jpg' },
        { title: 'Fruits & Vegetables', description: '', imageName: 'fruits_vegetables.jpg' },
        { title: 'Dairy & Cheese', description: '', imageName: 'dairy.jpg' },
        { title: 'Pantry', description: '', imageName: 'pantry.jpg' },
        { title: 'Meat', description: '', imageName: 'meat.jpg' },
        { title: 'Fish', description: '', imageName: 'fish.jpg' },
        { title: 'Drinks & Spirits', description: '', imageName: 'drinks.jpg' }],
    items: [
        "Apples_OserAd_5",
        "Broccoli_OserAd_4",
        "Chicken_OserAd_45",
        "Duck_OserAd_59",
        "Eggs_OserAd_25",
        "Fish_OserAd_50",
        "Granola_OserAd_15",
        "Hash_Browns_OserAd_3"
    ],
    filteredItems: [],
    chosenProduct: {
        amount: 1,
        productInfo: ''
    },
    cart: {
        totalPrice: 0,
        products: [],
        chain: ''
    }
}



const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.SEARCH_INPUT: {
            const { filteredItems, product } = onSearchInputChanged(state.items, state.chosenProduct, action.searchText)
            return {
                ...state,
                filteredItems: filteredItems,
                chosenProduct: product
            }
        }
        case actionType.AMOUNT_INPUT: {
            const chosenProduct = onAmountInputChanged(state.chosenProduct, action.amount)
            return {
                ...state,
                chosenProduct: chosenProduct
            }
        }
        case actionType.ITEM_CLICKED: {
            const chosenProduct = onItemClicked(state.chosenProduct, state.filteredItems, action.itemIndex)

            return {
                ...state,
                chosenProduct: chosenProduct,
                filteredItems: []
            }
        }
        case actionType.ADD_TO_CART: {
            const updatedCart = onAddToCartClicked(state.chosenProduct, state.cart)

            return state

        }

        default:
            return state;
    }
}
const onAddToCartClicked = (product, cart) => {
    const updatedProducts = [...cart.products].concat([product.productInfo + ' ' + product.amount])
    return {

    }
}
const onItemClicked = (product, items, index) => {
    const newChosenProduct = items[index].replace(/_/g, ' ')
    return {
        ...product,
        productInfo: newChosenProduct
    }
}
const onAmountInputChanged = (product, amount) => {
    return {
        ...product,
        amount: amount
    }
}
const onSearchInputChanged = (items, product, searchText) => {
    let filteredItems = []
    if (searchText.trim() !== '') {

        filteredItems = items.filter((item) => item.search(new RegExp(searchText, 'gi')) > -1);
    }

    return {
        filteredItems: filteredItems,
        product: { ...product, productInfo: searchText }
    }
}
export default reducer