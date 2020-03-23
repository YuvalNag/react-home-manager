import * as actionTypes from './actionTypes'
import { reqToServerStart, reqToServerFail, reqToServer } from './reqToServer'
import axios from 'axios'

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');

    return { type: actionTypes.LOGOUT }
}
const authSuccess = (authData) => {
    localStorage.setItem('token', authData.idToken);
    localStorage.setItem('userId', authData.localId);
    localStorage.setItem('expirationDate', new Date(new Date().getTime() + authData.expiresIn * 1000));
    return {
        type: actionTypes.AUTH_SUCCESS,
        authData: authData
    }
}
const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(
            () => { dispatch(logout()) },
            expirationTime * 1000)
    }
}

export const tryAuth = (email, password, isSignIn) => {
    return dispatch => {
        dispatch(reqToServerStart())
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAhNrHDtf-u1VFfLtzi0DVSaTaZMaHG5Bs'
        if (isSignIn) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAhNrHDtf-u1VFfLtzi0DVSaTaZMaHG5Bs'
        }
        axios.post(url, authData)
            .then(response => {
                dispatch(reqToServer(authSuccess(response.data)))
                dispatch(checkAuthTimeout(response.data.expiresIn))
            })
            .catch(error => {
                dispatch(reqToServerFail(error.response ? error.response.data.error.message : error.message))
            })

    }
}

export const autoLogin = () => {
    return dispatch => {
        const token = localStorage.getItem('token')
        const expirationDate = new Date(localStorage.getItem('expirationDate'))
        const userId = localStorage.getItem('userId')
        if (token && userId && expirationDate > new Date()) {
            const expiresIn = (expirationDate - new Date())/1000
            dispatch(authSuccess({ idToken: token, localId: userId, expiresIn: expiresIn }))
            dispatch(checkAuthTimeout(expiresIn))
        }
        else {
            dispatch(logout())
        }
    }
}