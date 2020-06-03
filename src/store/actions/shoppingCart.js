
import * as actionTypes from './actionTypes'
import axios from '../../axios/axios-shoppingCart'
import { reqToServerStart, reqToServerFail, reqToServerSuccess } from './reqToServer'
import Branch from '../../classes/Branch/Branch'
import Product from '../../classes/Product/Product'
import Cart from '../../classes/Cart/Cart'
import { deepClone } from '../../shared/utility'

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
    UPDATE_CHOSEN_BRANCHES: 'UPDATE_CHOSEN_BRANCHES',
    UPDATE_CURRENT_BRANCH: 'UPDATE_CURRENT_BRANCH'
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

const buildBranchesMap = (branches, isChosenBranches) => {
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
            isChosenBranches,
            branch.distance
        )
    };
    return branchesMap;
}
const fetchBranchesSuccess = (branches, isChosenBranches) => {
    const branchesMap = buildBranchesMap(branches, isChosenBranches);
    if (isChosenBranches) {
        return {
            type: actionTypes.FETCH_BRANCHES_SUCCESS,
            chosenBranches: branchesMap
        }
    }
    else {
        return {
            type: actionTypes.FETCH_BRANCHES_SUCCESS,
            optionalBranches: branchesMap
        }
    }
}
export const tryFetchBranches = (location, branches) => {
    return (dispatch, getState) => {
        dispatch(reqToServerStart(loadingTypes.FETCH_BRANCHES))
        let queryParams = '';
        let isChosenBranches = false;
        if (location) {
            dispatch(saveLocation(location))
            if (location.lat && location.lon) {
                queryParams = 'coordinates=' + location.lat + ',' + location.lon;
            }
            else if (location.city && location.street) {
                queryParams = 'address=' + location.street + ',' + location.city;
            }
        }
        if (branches) {
            isChosenBranches = true;
            queryParams += (Object.keys(branches)).map(branchId => ('branchIds=' + branchId)).join('&');
        }

        axios.get('/supermarket/branch?' + queryParams + '&limit=' + 15)
            .then(response => {
                dispatch(fetchBranchesSuccess(response.data.branches, isChosenBranches));
                dispatch(reqToServerSuccess(actionTypes.FETCH_BRANCHES_SUCCESS))
                dispatch(tryFetchCartProducts())
            })

            .catch(error => {
                dispatch(reqToServerFail(error.response ? error.response.data ? error.response.data : error.response : error))
            })
    }
}


export const tryAddItemToCart = (product,cart='default') => {
    return (dispatch, getState) => {

        dispatch(reqToServerStart(loadingTypes.ADD_TO_CART))

        axios.put(`/list/${cart}/item/${product.itemCode}`, { quantity: product.quantity, category: product.category,unlistedQuantity:product.unlistedQuantity })
            .then(response => {
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

            .catch(error => {
                dispatch(reqToServerFail(error.response ? error.response.data ? error.response.data : error.response : error))
            })

    }
}
const buildCartsByBranchId = (products, chosenBranchesIds) => {
    let carts = {};
    for (const branchId of chosenBranchesIds) {
        carts[branchId] = new Cart()
    }

    for (const product of products) {
        const newProduct = new Product(product.ItemCode, product.ItemName, product.ListItem.quantity, product.ListItem.category, product.ManufacturerName,product.bIsWeighted,product.ListItem.unlistedQuantity);
        const temp = [...chosenBranchesIds];
        const avgPrice = product.ItemBranches.reduce((sum, cur) => sum + cur.ItemPrice, 0) / product.ItemBranches.length
        for (const branch of product.ItemBranches) {
            const branchProduct = deepClone(newProduct)
            branchProduct.avgPrice = avgPrice;
            branchProduct.price = branch.ItemPrice;
            carts[branch.BranchId].addProducts(branchProduct)
            temp[temp.findIndex(branchId => branchId === '' + branch.BranchId)] = 0
        }
        const branchesWithLack = temp.filter(branchId => branchId !== 0);
        for (const branchId of branchesWithLack) {
            const lackProduct = deepClone(newProduct)
            lackProduct.avgPrice = avgPrice;
            lackProduct.isLack = true
            carts[branchId].addProducts(lackProduct)
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

                dispatch(fetchCartProductsSuccess(response.data.items, chosenBranchesIds));
                dispatch(reqToServerSuccess(actionTypes.FETCH_CART_PRODUCTS_SUCCESS))
                const branchId = Object.keys(getState().shoppingCart.currentBranch)[0]
                if (branchId) {
                    dispatch(updateCurrentBranchAndCart(branchId))
                }
            })

            .catch(error => {
                dispatch(reqToServerFail(error.response ? error.response.data ? error.response.data : error.response : error))
            })
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
                if (response.data.message === "OK") {
                    const allChosenBranches = getState().shoppingCart.chosenBranches

                    dispatch(tryFetchCartProducts(allChosenBranches))
                    dispatch(reqToServerSuccess(actionTypes.DELETE_ITEM_FROM_CART_SUCCESS))


                }
                else {
                    dispatch(reqToServerFail(response.data.message))
                }
            })

            .catch(error => {
                dispatch(reqToServerFail(error.response ? error.response.data ? error.response.data : error.response : error))
            })

    }
}

const currentBranchChanged = (branchId) => {
    return {
        type: actionTypes.CURRENT_BRANCH_CHANGED,
        branchId: branchId
    }

}
const updateChosenBranches = (newChosenBranches) => {
    return {
        type: actionTypes.UPDATE_CHOSEN_BRANCHES,
        chosenBranches: newChosenBranches
    }

}
export const updateChosenBranchesAndCart = (newChosenBranches) => {

    return (dispatch, getState) => {
        dispatch(reqToServerStart(loadingTypes.UPDATE_CHOSEN_BRANCHES))

        axios.put(`/user/${getState().auth.userId}/branch`, { branchIds: Object.keys(newChosenBranches) })
            .then(response => {

                dispatch(updateChosenBranches(newChosenBranches))
                dispatch(tryFetchCartProducts(newChosenBranches))

            })

            .catch(error => {
                dispatch(reqToServerFail(error.response ? error.response.data ? error.response.data : error.response : error))
            })
    }
}

export const getChosenBranchesAndCart = () => {

    return (dispatch, getState) => {
        dispatch(reqToServerStart(loadingTypes.UPDATE_CHOSEN_BRANCHES))

        axios.get(`/user/${getState().auth.userId}/branch`)
            .then(response => {
                if (response.data.value.length !== 0) {
                    const branchIdsObj = {}
                    response.data.value.forEach(branchId => branchIdsObj[branchId] = null)
                    dispatch(tryFetchBranches(null, branchIdsObj))
                    dispatch(getCurrentBranchAndCart())
                }
            })

            .catch(error => {
                dispatch(reqToServerFail(error.response ? error.response.data ? error.response.data : error.response : error))
            })
    }
}

export const updateCurrentBranchAndCart = (branchId) => {
    // const branchId = branchIdArray[0];
    return (dispatch, getState) => {
        dispatch(reqToServerStart(loadingTypes.UPDATE_CURRENT_BRANCH))
        dispatch(currentBranchChanged(branchId))


        if (getState().shoppingCart.chosenBranches[branchId]) {
            axios.put(`/user/${getState().auth.userId}/currentBranch/${branchId}`, {})
                .then(response => {
                })

                .catch(error => {
                    dispatch(reqToServerFail(error.response ? error.response.data ? error.response.data : error.response : error))
                })
        }
    }
}

export const getCurrentBranchAndCart = () => {

    return (dispatch, getState) => {
        dispatch(reqToServerStart(loadingTypes.UPDATE_CURRENT_BRANCH))

        axios.get(`/user/${getState().auth.userId}/currentBranch`)
            .then(response => {
                dispatch(currentBranchChanged(response.data.value.id))

            })

            .catch(error => {
                dispatch(reqToServerFail(error.response ? error.response.data ? error.response.data : error.response : error))
            })
    }
}