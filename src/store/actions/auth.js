import * as actionTypes from './actionTypes'
import { reqToServerStart, reqToServerFail, reqToServerSuccess } from './reqToServer'
import axios from '../../axios/axios-shoppingCart'

export const loadingTypes = {
    INIT: undefined,
    SIGNUP: 'SIGNUP',
    LOGIN: 'LOGIN'
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');

    return { type: actionTypes.LOGOUT }
}
const authSuccess = (authData) => {
    setToken(authData.token);
    const expiresIn = authData.expiresIn || 172800
    localStorage.setItem('token', authData.token);
    localStorage.setItem('userId', authData.userId);
    localStorage.setItem('expirationDate', new Date(new Date().getTime() + expiresIn * 1000));
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

export const tryAuth = (email, password, username = '', isSignIn) => {
    return dispatch => {
        const authData = {
            email: email,
            password: password,
            name: username
            // returnSecureToken: true
        }
        let url;
        if (isSignIn) {
            dispatch(reqToServerStart(loadingTypes.LOGIN))
            url = '/user/token'
        }
        else {
            dispatch(reqToServerStart(loadingTypes.SIGNUP))
            url = '/user'
        }
        axios.post(url, authData)
            .then(response => {
                // dispatch(checkAuthTimeout(response.data.expiresIn))
                if (isSignIn) {
                    dispatch(authSuccess(response.data))
                    dispatch(reqToServerSuccess(actionTypes.AUTH_SUCCESS))

                }
                else {
                    dispatch(tryAuth(email, password, username, true))
                }
            })
            .catch(error => {
                dispatch(reqToServerFail(error.response ? error.response.data ? error.response.data : error.response : error))
            })

    }
}

export const autoLogin = () => {
    return dispatch => {
        const token = localStorage.getItem('token')
        const expirationDate = new Date(localStorage.getItem('expirationDate'))
        const userId = localStorage.getItem('userId')
        if (token && userId && expirationDate > new Date()) {
        // if (token && userId) {
            const expiresIn = (expirationDate - new Date()) / 1000
            dispatch(authSuccess({ token: token, userId: userId, expiresIn: expiresIn }))
            dispatch(checkAuthTimeout(expiresIn))
        }
        else {
            dispatch(logout())
        }
    }
}

const setToken = (token) => {
    axios.defaults.headers.common['Authorization'] =
        `Bearer ${token}`;
}