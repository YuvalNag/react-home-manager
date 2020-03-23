import * as actionTypes from './actionTypes'

export const reqToServerFail = (error) => {
    return {
        type: actionTypes.REQ_TO_SERVER_FAIL,
        error: error
    }
}
export const reqToServerStart = () => {
    return {
        type: actionTypes.REQ_TO_SERVER_START
    }
}
const reqToServerSuccess = () => {
    return {
        type: actionTypes.REQ_TO_SERVER_SUCCESS
    }
}
export const reqToServer = (nextAction) => {
    return dispatch => {
        dispatch(reqToServerSuccess())
        dispatch(nextAction)
    }
}