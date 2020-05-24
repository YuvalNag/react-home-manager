import axios from 'axios'
import {apiBaseURL} from '../shared/variables'
const instance = axios.create({
    // baseURL: 'https://heifetz.duckdns.org/'
    // baseURL: 'https://housekeeper.duckdns.org/'
    baseURL: apiBaseURL
})


export default instance