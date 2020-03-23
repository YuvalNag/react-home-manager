import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../utility'

const initialState = {
    loading: false,
    error: false
}

const reqToServerStart = (state, action) => {
    return updateObject(state, {
        loading: true,
        error: false
    });
}
const reqToServerFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
}
const reqToServerSuccess = (state, action) => {
    return updateObject(state, {
        error: false,
        loading: false
    });
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.REQ_TO_SERVER_START: return reqToServerStart(state, action)
        case actionTypes.REQ_TO_SERVER_SUCCESS: return reqToServerSuccess(state, action)
        case actionTypes.REQ_TO_SERVER_FAIL: return reqToServerFail(state, action)

        default: return state;
    }

}

export default reducer