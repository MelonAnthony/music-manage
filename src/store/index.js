import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    HOST: 'http://localhost:8888',
    isPlay: false,
    url: '',
    id: ''
    // HOST: 'http://182.61.21.222:8888'
  },
  // 取值
  getters: {
    isPlay: state => state.isPlay,
    url: state => state.url,
    id: state => state.id
  },
  // 设置值
  mutations: {
    setIsPlay: (state, isPlay) => { state.isPlay = isPlay },
    setUrl: (state, url) => { state.url = url },
    setId: (state, id) => { state.id = id }
  }
})

export default store
