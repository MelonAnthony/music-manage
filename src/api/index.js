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
export const getSongById = (id) => get(`song/selectByPrimaryKey/${id}`)
export const getAllSong = () => get(`song/allSong`)

// ==========歌单相关=====================  updateSongList, setSongList, delSongList
export const getAllSongList = () => get(`songList/allSongList`)
export const updateSongList = (params) => post(`songList/update`, params)
export const setSongList = (params) => post(`songList/insert`, params)
export const delSongList = (id) => get(`songList/delete/${id}`)
export const selectByPrimaryKey = (id) => get(`songList/selectByPrimaryKey/${id}`)

// ==========歌单歌曲相关=====================
export const insertSongList = (params) => post(`ListSong/insert`, params)
export const deleteSongList = (songListId, singerId) => get(`ListSong/delete/${songListId}/${singerId}`)
export const getSongFormListById = (songListId) => get(`ListSong/selectByPrimaryKey/${songListId}`)
export const getallListSong = () => get(`ListSong/allSongList`)
