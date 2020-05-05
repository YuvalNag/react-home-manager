import axios from 'axios'

const instance = axios.create({
    // baseURL: 'https://heifetz.duckdns.org/'
    baseURL: 'https://housekeeper.duckdns.org/'
})


export default instance