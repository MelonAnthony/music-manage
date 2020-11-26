<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#334256"
      text-color="#fff"
      :collapse-transition="collapsetransition"
      active-text-color="#20a0ff"
      router
    >
      <template v-for="item in items" v-cloak>
        <template>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </template>
      </template>

    </el-menu>
  </div>
</template>

<style scoped>
  .sidebar{
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    top: 70px;
    overflow-y: scroll;
    background: #334256;
  }
  .sidebar-el-menu:not(.el-menu--collapse){
    width: 150px;
  }
  .sidebar::-webkit-scrollbar{
    width: 0;
  }
  .sidebar > ul{
    height: 100%;
  }
</style>

<script>
import bus from '../assets/js/bus'
export default {
  data () {
    return {
      collapse: false,
      collapsetransition: true,
      items: [
        {
          icon: 'el-icon-news',
          index: 'Info',
          title: '系统首页'
        },
        {
          icon: 'el-icon-edit',
          index: 'Consumer',
          title: '用户管理'
        },
        {
          icon: 'el-icon-edit-outline',
          index: 'Singer',
          title: '歌手管理'
        },
        {
          icon: 'el-icon-document',
          index: 'SongList',
          title: '歌单管理'
        }
      ]
    }
  },
  computed: {
    onRoutes () {
      return this.$route.path.replace('/', '')
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
