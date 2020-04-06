import * as actionType from '../actions/actionTypes'
import { updateObject, insertItem } from '../utility'

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
    currentBranch: { '26': null },
    location: null,
    chosenBranches: { '232': null, '463': null, '26': null },
    closeBranches: {}
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
    if (action.favoriteBranches) {
        const newChosenBranches = action.favoriteBranches//{ ...action.favoriteBranches }
        for (const key in state.chosenBranches) {
            if (state.chosenBranches.hasOwnProperty(key)) {
                const branch = state.chosenBranches[key];
                const isInitial = branch === null
                if (!isInitial && !branch.isFavorite) {
                    newChosenBranches[key] = branch;
                }
            }
        }
        return updateObject(state, { chosenBranches: newChosenBranches })
    }
    else {
        const newChosenBranches = { ...state.chosenBranches }
        const newCloseBranches = action.closeBranches//{ ...action.closeBranches }
        for (const key in state.chosenBranches) {
            if (state.chosenBranches.hasOwnProperty(key)) {
                const branch = state.chosenBranches[key];
                if (branch.isFavorite || branch.isChosen) {//remove duplicate in close branches and favorites branches
                    delete newCloseBranches[key];
                }
                if (branch.isChosen && !branch.isFavorite) {//remove old close and chosen branches
                    delete newChosenBranches[key];
                }
            }
        }
        return updateObject(state, { closeBranches: newCloseBranches, chosenBranches: newChosenBranches })
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