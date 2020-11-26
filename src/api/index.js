import {post, get} from './http'

export const getLoginStatus = (params) => post(`admin/login/status`, params)

export const getAllSinger = () => get(`singer/allSinger`)

export const setSinger = (params) => post(`singer/insert`, params)

export const updateSinger = (params) => post(`singer/update`, params)

export const delSinger = (id) => get(`singer/delete/${id}`)
