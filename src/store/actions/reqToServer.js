import * as actionTypes from './actionTypes'

export const reqToServerFail = (error) => {
    return {
        type: actionTypes.REQ_TO_SERVER_FAIL,
        error: error
    }
}
export const reqToServerStart = (loadingType) => {
    return {
        type: actionTypes.REQ_TO_SERVER_START,
        loadingType: loadingType
    }
}
export const reqToServerSuccess = (loadingType) => {
    return {
        type: actionTypes.REQ_TO_SERVER_SUCCESS,
        loadingType: loadingType

    }
}
