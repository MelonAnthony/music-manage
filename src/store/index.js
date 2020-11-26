import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    HOST: 'http://182.61.21.222:8888'
  }
})

export default store
