
import * as actionTypes from './actionTypes'
import axios from '../../axios/axios-shoppingCart'
import { reqToServerStart, reqToServerFail, reqToServerSuccess } from './reqToServer'
import { groupBy, deepClone } from '../utility'
import Branch from '../../classes/Branch/Branch'
import Product from '../../classes/Product/Product'
import Cart from '../../classes/Cart/Cart'

export const loadingTypes = {
    INIT: undefined,
    FETCH_BRANCHES: 'FETCH_BRANCHES',
    // FETCH_BRANCHES: 'FETCH_BRANCHES_DONE',
    FETCH_ITEMS: 'FETCH_ITEMS',
    // FETCH_ITEMS: 'FETCH_ITEMS_DONE',
    ADD_TO_CART: 'ADD_TO_CART',
    // ADD_TO_CART: 'ADD_TO_CART_DONE',
    FETCH_CART: 'FETCH_CART',
    // FETCH_CART: 'FETCH_CART_DONE',
    DELETE_FROM_CART: 'DELETE_FROM_CART',
    // DELETE_FROM_CART: 'DELETE_FROM_CART_DONE',
}

// const setItems = (items) => {
//     return {
//         type: actionTypes.SET_ITEMS,
//         items: items
//     }
// }
// export const loadItems = () => {
//     return dispatch => {
//         const items = require(`../../assets/item.json`);
//         dispatch(setItems(items))
//     }
// }
const saveLocation = (location) => {
    return {
        type: actionTypes.SAVE_LOCATION,
        location: location
    }
}

const buildBranchesMap = (branches, isFavorite) => {
    const branchesMap = {}
    for (const branch of branches) {
        branchesMap[branch.id] = new Branch(
            branch.id,
            branch.StoreId,
            branch.StoreName,
            branch.Address,
            branch.City,
            branch.lat,
            branch.lng,
            branch.SubChainName,
            branch.Chain.UserName,
            isFavorite,
            isFavorite
        )
    };
    return branchesMap;
}
const fetchBranchesSuccess = (branches, isFavorite) => {
    const branchesMap = buildBranchesMap(branches, isFavorite);
    if (isFavorite) {
        return {
            type: actionTypes.FETCH_BRANCHES_SUCCESS,
            favoriteBranches: branchesMap
        }
    }
    else {
        return {
            type: actionTypes.FETCH_BRANCHES_SUCCESS,
            closeBranches: branchesMap
        }
    }
}
export const tryFetchBranches = (location, branches) => {
    return dispatch => {
        dispatch(reqToServerStart(loadingTypes.FETCH_BRANCHES))
        dispatch(saveLocation(location))
        let queryParams = '';

        if (location) {
            if (location.lat && location.lon) {
                queryParams = 'coordinates=' + location.lat + ',' + location.lon;
            }
            else if (location.city && location.street) {
                queryParams = 'address=' + location.street + ',' + location.city;
            }
        }
        if (branches) {
            queryParams += (Object.keys(branches)).map(branchId => ('branchIds=' + branchId)).join('&');
        }
        axios.get('/supermarket/branch?' + queryParams + '&limit=' + 15)
            .then(response => {
                dispatch(fetchBranchesSuccess(response.data.branches, branches ? true : false));
                dispatch(reqToServerSuccess(actionTypes.FETCH_BRANCHES_SUCCESS))
                dispatch(tryFetchCartProducts())
            })
            .catch(error => { dispatch(reqToServerFail(error.message)) })
    }
}

// const fetchItemsSuccess = (items) => {
//     const products = items.map(item => {
//         return {
//             code: item.ItemCode,
//             name: item.ItemName,
//             ManufacturerName: item.ManufacturerName,
//             Branches: item.ItemBranches,
//             isWeighted: item.bIsWeighted && true,
//             url: 'https://static.rami-levy.co.il/storage/images/' + item.ItemCode + '/small.jpg'
//             // url: 'https://superpharmstorage.blob.core.windows.net/hybris/products/desktop/small/' + item.ItemCode + '.jpg'
//         }
//     });

//     return {
//         type: actionTypes.FETCH_ITEMS_SUCCESS,
//         items: products,
//         filteredItems: products
//     }
// }
// const resetItems = () => {
//     return {
//         type: actionTypes.FETCH_ITEMS_SUCCESS,
//         items: [],
//         filteredItems: []
//     }
// }
// const filterItemsSuccess = (items, searchTerm) => {
//     // const chains = {
//     //     '7290027600007': 'https://res.cloudinary.com/shufersal/image/upload/f_auto,q_auto/v1551800918/prod/product_images/products_medium/WFN50_M_P_' + item.ItemCode + '_1.png',
//     //     '7290172900007': 'https://superpharmstorage.blob.core.windows.net/hybris/products/desktop/small/' + item.ItemCode + '.jpg',
//     //     '7290803800003': 'https://yochananof.co.il/wp-content/uploads/2016/07/logo.png',
//     //     '7290058140886': 'https://static.rami-levy.co.il/storage/images/' + item.ItemCode + '/small.jpg'
//     // }
//     return {
//         type: actionTypes.FETCH_ITEMS_SUCCESS,
//         filteredItems: filterItems(items, searchTerm),
//         items: items
//     }
// }
// const filterItems = (items, searchText) => {
//     let filteredItems = []
//     if (searchText.trim() !== '' && items) {

//         filteredItems = items.filter((item) => item.name.search(new RegExp(searchText, 'gi')) > -1);
//     }
//     return filteredItems
// }
// const cancelToken = CancelToken;
// let cancel;
// export const tryFetchItems = (searchTerm = '', branches = [], withPrices = false) => {

//     return (dispatch, getState) => {
//         if (searchTerm.trim() === '') {
//             dispatch(resetItems())
//         }
//         else if (searchTerm.length >= 1 || getState().shoppingCart.filteredItems.length === 0) {
//             console.log(searchTerm);
//             cancel && cancel()
//             dispatch(reqToServerStart(loadingTypes.FETCH_ITEMS))
//             const queryParams = '?searchTerm=' + searchTerm + (branches && branches.map(brunch => ('&branchIds=' + brunch.id)).join(''));
//             // const queryParams = '?searchTerm=' + searchTerm +'&branchIds=725&branchIds=718';
//             axios.get('/supermarket/item' + queryParams + '&limit=' + 10 + '&price=' + withPrices, {
//                 cancelToken: new cancelToken(function executor(c) {
//                     // An executor function receives a cancel function as a parameter
//                     cancel = c;
//                 })
//             })
//                 .then(response => {
//                     console.log(response);

//                     const products = (response && response.data.items) || []
//                     dispatch(fetchItemsSuccess(products));
//                     dispatch(reqToServerSuccess(actionTypes.FETCH_ITEMS_SUCCESS))
//                 })
//                 .catch(error => {

//                     dispatch(reqToServerFail(error.message))

//                 })

//         }
//         else {
//             dispatch(filterItemsSuccess(getState().shoppingCart.items, searchTerm))
//         }


//     }

// }

// const addItemToCartSuccess = (product) => {
//     const newProduct = new Product(product.item.code, product.item.name, product.quantity, product.category, product.item.ManufacturerName)
//     return {
//         type: actionTypes.ADD_ITEM_TO_CART_SUCCESS,
//         product: newProduct
//     }
// }
export const tryAddItemToCart = (product) => {
    return (dispatch, getState) => {
        console.log(product);

        dispatch(reqToServerStart(loadingTypes.ADD_TO_CART))
        axios.put('/list/default/item/' + product.item.code, { quantity: product.quantity, category: product.category })
            .then(response => {
                console.log(response.data);
                if (response.data.message === "OK") {
                    // dispatch(addItemToCartSuccess(product))
                    // dispatch(reqToServerSuccess(actionTypes.ADD_ITEM_TO_CART_SUCCESS))
                    const allChosenBranches = getState().shoppingCart.chosenBranches
                    dispatch(tryFetchCartProducts(allChosenBranches))

                }
                else {
                    dispatch(reqToServerFail(response.data.message))
                }
            })
            .catch(error => { dispatch(reqToServerFail(error.message)) })

    }
}
const buildCartsByBranchId = (products, chosenBranchesIds) => {
    let carts = {};
    for (const branchId of chosenBranchesIds) {
        carts[branchId] = new Cart()
    }

    for (const product of products) {
        const newProduct = new Product(product.ItemCode, product.ItemName, product.ListItem.quantity, product.ListItem.category, product.ManufacturerName);
        const temp = [...chosenBranchesIds];
        for (const branch of product.ItemBranches) {
            newProduct.price = branch.ItemPrice;
            carts[branch.BranchId].addProducts(newProduct)
            temp[temp.findIndex(branchId => branchId == branch.BranchId)] = 0
        }
        const branchesWithLack = temp.filter(branchId => branchId !== 0);
        for (const branchId of branchesWithLack) {
            carts[branchId].lacking.push(newProduct)
        }
    }

    return carts;
}
const fetchCartProductsSuccess = (products, chosenBranchesIds) => {
    const carts = buildCartsByBranchId(products, chosenBranchesIds);

    return {
        type: actionTypes.FETCH_CART_PRODUCTS_SUCCESS,
        carts: carts
    };
}
export const tryFetchCartProducts = (chosenBranches) => {
    return (dispatch, getState) => {
        dispatch(reqToServerStart(loadingTypes.FETCH_CART))
        let chosenBranchesIds;
        if (chosenBranches) {
            chosenBranchesIds = Object.keys(chosenBranches)
        }
        else {
            chosenBranchesIds = Object.keys(getState().shoppingCart.chosenBranches)
        }

        const queryParams = '?price=' + true + (chosenBranchesIds).map(branchId => ('&branchIds=' + branchId)).join('');

        axios.get('/list/default/item' + queryParams)
            .then(response => {
                console.log(response.data);

                dispatch(fetchCartProductsSuccess(response.data.items, chosenBranchesIds));
                dispatch(reqToServerSuccess(actionTypes.FETCH_CART_PRODUCTS_SUCCESS))
                dispatch(currentBranchChanged(Object.keys(getState().shoppingCart.currentBranch)))

            })
            .catch(error => { dispatch(reqToServerFail(error.message)) })
    };
}

// const deleteItemFromCartSuccess = (product) => {
//     return {
//         type: actionTypes.DELETE_ITEM_FROM_CART_SUCCESS,
//         productCode: product.code,
//         category: product.category,
//         quantity: product.quantity
//     }
// }
export const tryDeleteItemFromCart = (product) => {
    return (dispatch, getState) => {

        dispatch(reqToServerStart(loadingTypes.DELETE_FROM_CART))
        axios.delete('/list/default/item/' + product.code)
            .then(response => {
                console.log(response.data);
                if (response.data.message === "OK") {
                    const allChosenBranches = getState().shoppingCart.chosenBranches

                    dispatch(tryFetchCartProducts(allChosenBranches))
                    dispatch(reqToServerSuccess(actionTypes.DELETE_ITEM_FROM_CART_SUCCESS))


                }
                else {
                    dispatch(reqToServerFail(response.data.message))
                }
            })
            .catch(error => { dispatch(reqToServerFail(error.message)) })

    }
}

export const currentBranchChanged = (branchId) => {
    return {
        type: actionTypes.CURRENT_BRANCH_CHANGED,
        branchId: branchId[0]
    }

}
const updateChosenBranches = (newChosenBranches) => {
    return {
        type: actionTypes.UPDATE_CHOSEN_BRANCHES,
        chosenBranches: newChosenBranches
    }

}
export const updateChosenBranchesAndCart = (newChosenBranches) => {
    return dispatch => {
        dispatch(updateChosenBranches(newChosenBranches))
        dispatch(tryFetchCartProducts(newChosenBranches))


    }
}