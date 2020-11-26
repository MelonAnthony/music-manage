<template>
  <div>
    <the-header></the-header>
    <the-aside></the-aside>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import TheHeader from './TheHeader'
import TheAside from './TheAside'
import bus from '../assets/js/bus'

export default {
  components: {
    TheHeader,
    TheAside
  },
  data () {
    return {
      collapse: false
    }
  },
  created () {
    // 通过Bus组件进行组件间的通讯，来折叠侧边栏 ($on收到信息)
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  }
}
</script>
