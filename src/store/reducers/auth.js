import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'
const initialState = {
    token: null,
    email: null,
    refreshToken: null,
    expiresIn: null,
    localId: null,
    registered: null,
    kind: null
}
const authSuccess = (state, action) => {
    return updateObject(state, action.authData)
}
const logout = (state, action) => {
    return updateObject(state, {
        idToken: null,
        email: null,
        refreshToken: null,
        expiresIn: null,
        localId: null,
        registered: null,
        kind: null
    })
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.LOGOUT: return logout(state, action);
        default: return state
    }
}
export default reducer