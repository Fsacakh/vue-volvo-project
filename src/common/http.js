/**
 * Created by Lijingjing on 17/6/16.
 */
import axios from 'axios'

axios.defaults.headers.common['authorization'] = window.localStorage.getItem('authorization')

export const HTTP = axios.create({
    baseURL: 'https://dcss.volvocars.com.cn/DCSSPlatform'
    // baseURL: 'http://115.159.78.97:8080/DCSSPlatform'
})

export function setAuthorizationToken(token) {
    // console.log('token new: ' + token)
    // console.log('token old: ' + axios.defaults.headers.common['authorization'])
    if (token !== axios.defaults.headers.common['authorization']) {
        axios.defaults.headers.common['authorization'] = `${token}`
    }
}
