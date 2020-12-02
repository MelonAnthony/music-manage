import {post, get} from './http'

// 判断管理员是否登陆陈功
export const getLoginStatus = (params) => post(`admin/login/status`, params)

// ==========歌手相关=====================
export const getAllSinger = () => get(`singer/allSinger`)
export const setSinger = (params) => post(`singer/insert`, params)
export const updateSinger = (params) => post(`singer/update`, params)
export const delSinger = (id) => get(`singer/delete/${id}`)

// ==========歌曲相关=====================
export const getSongBysingerId = (id) => get(`song/songOfSingerId/${id}`)
export const updateSong = (params) => post(`song/update`, params)
export const delSong = (id) => get(`song/delete/${id}`)
