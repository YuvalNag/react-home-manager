import * as actionType from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

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
        "לחם ומאפים": { imageName: 'bakery.jpg' },
        "כלי בית": { imageName: 'bakery.jpg' }
    },
    currentBranch: {},
    location: null,
    chosenBranches: {},
    optionalBranches: {}
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.SAVE_LOCATION: return saveLocation(state, action)
        case actionType.FETCH_BRANCHES_SUCCESS: return fetchBranchesSuccess(state, action)
        case actionType.FETCH_CART_PRODUCTS_SUCCESS: return fetchCartProductsSuccess(state, action)
        case actionType.CURRENT_BRANCH_CHANGED: return currentBranchChanged(state, action)
        case actionType.UPDATE_CHOSEN_BRANCHES: return updateChosenBranches(state, action)




        default:
            return state;
    }
}

const fetchBranchesSuccess = (state, action) => {
    if (action.chosenBranches) {//merge new all chosen branches 
        const newChosenBranches = action.chosenBranches
        for (const key in state.chosenBranches) {
            if (state.chosenBranches.hasOwnProperty(key)) {
                const branch = state.chosenBranches[key];
                const isInitial = branch === null
                if (!isInitial && !branch.isChosen) {
                    newChosenBranches[key] = branch;
                }
            }
        }
        return updateObject(state, { chosenBranches: newChosenBranches })
    }
    else {
        const newOptionalBranches = action.optionalBranches
        for (const key in state.chosenBranches) {
            if (state.chosenBranches.hasOwnProperty(key)) {
                const branch = state.chosenBranches[key];
                if (branch.isChosen) {//remove from optional already chosen branches
                    delete newOptionalBranches[key];
                }
            }
        }
        return updateObject(state, { optionalBranches: newOptionalBranches })
    }
}
const saveLocation = (state, action) => {
    return updateObject(state, { location: action.location })
}
const fetchCartProductsSuccess = (state, action) => {

    const branchesWithCarts = { ...state.chosenBranches }

    for (const key in branchesWithCarts) {
        if (action.carts.hasOwnProperty(key)) {
            const cart = action.carts[key];
            branchesWithCarts[key].cart = cart;
        }
    }
    return updateObject(state, { chosenBranches: branchesWithCarts });
}

const currentBranchChanged = (state, action) => {
    const allChosenBranches = state.chosenBranches;
    const currentBranch = { [action.branchId]: allChosenBranches[action.branchId] };
    return updateObject(state, { currentBranch: currentBranch });
}
const updateChosenBranches = (state, action) => {
    return updateObject(state, { chosenBranches: action.chosenBranches });
}
export default reducer