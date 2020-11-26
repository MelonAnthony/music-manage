<template>
  <div class="header">
    <!--折叠图片-->
    <div class="collapse-btn"  @click="switchCollapse">
      <i class="el-icon-menu"></i>
    </div>
    <div class="title">music管理系统</div>
    <div class="header-right">
      <div class="user-avator">
        <img src="../assets/img/user.jpg"/>
      </div>
      <el-dropdown class="user-name" trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{userName}}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出登陆</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="btn-fullscreen" @click="handleFullScreen">
        <el-tooltip :content="fullscreen?'取消全屏':'全屏'" placement="bottom">
          <i class="el-icon-rank"></i>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../assets/js/bus'
export default {
  data () {
    return {
      collapse: false,
      fullscreen: false
    }
  },
  computed: {
    userName () {
      return localStorage.getItem('userName')
    }
  },
  methods: {
    switchCollapse () {
      this.collapse = !this.collapse
      bus.$emit('collapse', this.collapse)
    },
    handleFullScreen () {
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
    handleCommand (command) {
      if (command === 'logout') {
        localStorage.removeItem('username')
        this.$router.push('/')
      }
    }
  }
}
</script>
<style scoped>
  .header{
    position: relative;
    background-color:#253041;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
  }
  .collapse-btn{
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
  }
  .header .title{
    float: left;
    line-height: 70px;
  }
  .header-right{
    float: right;
    display: flex;
    height: 70px;
    align-items: center;
    padding-right: 20px;
  }
  .btn-fullscreen{
    transform:rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
  }
  .user-avator{
    margin-right: 20px;
  }
  .user-avator img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .user-name{
    margin-right: 20px;
    color: #fff;
    cursor: pointer;
  }
</style>
