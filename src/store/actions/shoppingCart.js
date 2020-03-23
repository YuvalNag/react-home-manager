import * as actionTypes from './actionTypes'
import axios from '../../axios/axios-shoppingCart'
import { reqToServerStart, reqToServerFail, reqToServer } from './reqToServer'



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
const fetchBrunchesSuccess = (brunches) => {
    // brunches.map(brunch => console.log(brunch.Chain.ChainId, brunch.Chain.ChainName));

    return {
        type: actionTypes.FETCH_BRUNCHES_SUCCESS,
        brunches: brunches
    }
}
export const tryFetchBrunches = (location) => {
    return dispatch => {
        dispatch(reqToServerStart())
        dispatch(saveLocation(location))
        let queryParams;
        if (location.lat && location.lon) {
            queryParams = '?coordinates=' + location.lat + ',' + location.lon;
        }
        else if (location.city && location.street) {
            queryParams = '?address=' + location.street + ',' + location.city;
        }

        axios.get('/supermarket/branch' + queryParams + '&limit=' + 10)
            .then(response => {
                dispatch(reqToServer(fetchBrunchesSuccess(response.data.branches)))
            })
            .catch(error => { dispatch(reqToServerFail(error.message)) })
    }
}

const fetchItemsSuccess = (items) => {
    // const chains = {
    //     '7290027600007': 'https://res.cloudinary.com/shufersal/image/upload/f_auto,q_auto/v1551800918/prod/product_images/products_medium/WFN50_M_P_' + item.ItemCode + '_1.png',
    //     '7290172900007': 'https://superpharmstorage.blob.core.windows.net/hybris/products/desktop/small/' + item.ItemCode + '.jpg',
    //     '7290803800003': 'https://yochananof.co.il/wp-content/uploads/2016/07/logo.png',
    //     '7290058140886': 'https://static.rami-levy.co.il/storage/images/' + item.ItemCode + '/small.jpg'
    // }
    return {
        type: actionTypes.FETCH_ITEMS_SUCCESS,
        items: items.map(item => {
            return {
                code: item.ItemCode,
                name: item.ItemName,
                ManufacturerName: item.ManufacturerName,
                Branches: item.ItemBranches,
                isWeighted: item.bIsWeighted && true,
                url: 'https://static.rami-levy.co.il/storage/images/' + item.ItemCode + '/small.jpg'
                // url: 'https://superpharmstorage.blob.core.windows.net/hybris/products/desktop/small/' + item.ItemCode + '.jpg'
            }
        })
    }
}
export const tryFetchItems = (searchTerm, brunches) => {
    return dispatch => {
        console.log(searchTerm);

        if (searchTerm && searchTerm !== '') {

            dispatch(reqToServerStart())
            const queryParams = '?searchTerm=' + searchTerm + brunches.map(brunch => ('&branchIds=' + brunch.id)).join('');
            // const queryParams = '?searchTerm=' + searchTerm +'&branchIds=725&branchIds=718';


            axios.get('/supermarket/item' + queryParams + '&limit=' + 15)
                .then(response => {
                    console.log(response.data);
                    dispatch(reqToServer(fetchItemsSuccess(response.data.items)))
                })
                .catch(error => { dispatch(reqToServerFail(error.message)) })
        }
        else dispatch(fetchItemsSuccess([]))
    }

}

const addItemToCartSuccess = (product) => {
    return {
        type: actionTypes.ADD_ITEM_TO_CART_SUCCESS,
        product: { code: product.item.code, name: product.item.name, quantity: product.quantity },
        category: product.category
    }
}
export const tryAddItemToCart = (product) => {
    return dispatch => {
        console.log(product);

        dispatch(reqToServerStart())
        axios.put('/list/default/item/' + product.item.code, { quantity: product.quantity, category: product.category })
            .then(response => {
                console.log(response.data);
                if (response.data.message === "OK") {
                    dispatch(reqToServer(addItemToCartSuccess(product)))
                }
                else {
                    dispatch(reqToServerFail(response.data.message))
                }
            })
            .catch(error => { dispatch(reqToServerFail(error.message)) })

    }
}

const fetchCartProductsSuccess = (products) => {
    return {
        type: actionTypes.FETCH_CART_PRODUCTS_SUCCESS,
        products: products.map(item => {
            return {
                code: item.ItemCode,
                name: item.ItemName,
                quantity: item.ListItem.quantity,
                category: item.ListItem.category
            };
        })
    };
}
export const tryFetchCartProducts = () => {
    return dispatch => {
        dispatch(reqToServerStart())
        axios.get('/list/default/item')
            .then(response => {
                console.log(response.data);
                dispatch(reqToServer(fetchCartProductsSuccess(response.data.items)))
            })
            .catch(error => { dispatch(reqToServerFail(error.message)) })
    };
}

const deleteItemFromCartSuccess = (product) => {
    return {
        type: actionTypes.DELETE_ITEM_FROM_CART_SUCCESS,
        productCode: product.code,
        category: product.category,
        quantity: product.quantity
    }
}
export const tryDeleteItemFromCart = (product) => {
    return dispatch => {

        dispatch(reqToServerStart())
        axios.delete('/list/default/item/' + product.code)
            .then(response => {
                console.log(response.data);
                if (response.data.message === "OK") {
                    dispatch(reqToServer(deleteItemFromCartSuccess(product)))
                }
                else {
                    dispatch(reqToServerFail(response.data.message))
                }
            })
            .catch(error => { dispatch(reqToServerFail(error.message)) })

    }
}