<template>
  <div class="table">
    <div class="crumbs">歌曲信息</div>
    <div class="container">
      <div class="handler-box">
        <el-input v-model="selectWord" size="mini" placeholder="请输入歌曲名" class="handle-input"></el-input>
        <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
        <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加歌曲</el-button>
      </div>
    </div>
    <el-table size="mini" border style="width:100%" height="680px" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="歌曲图片" width="110" align="center">
        <template slot-scope="scope">
          <div class="song-img">
            <img :src="getUrl(scope.row.pic)" style="width: 100%;"/>
          </div>
          <div class="play" @click="setSongUrl(scope.row.url,scope.row.name)">
            <div v-if="toggle == scope.row.name">
              <svg class="icon">
                <use xlink:href="#icon-zanting"></use>
              </svg>
            </div>
            <div v-if="toggle != scope.row.name">
              <svg class="icon">
                <use xlink:href="#icon-bofanganniu"></use>
              </svg>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="歌名" prop="name" width="120px" align="center"></el-table-column>
      <el-table-column label="专辑" prop="introduction" width="120px" align="center"></el-table-column>
      <el-table-column label="歌词" align="center">
        <template slot-scope="scope">
          <ul style="height:100px;overflow: scroll">
            <li v-for="(item, index) in parseLyric(scope.row.lyric)" :key="index">
              {{ item}}
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column label="资源更新" prop="name" width="120px" align="center">
        <template slot-scope="scope">
          <el-upload style="overflow:hidden;" :show-file-list="false" :action="uploadUrl(scope.row.id)" :before-upload="beforeAvatorUpload"
                     :on-success="handleAvatorSuccess">
            <el-button size="mini">更新图片</el-button>
          </el-upload>
          <br>
          <el-upload style="overflow:hidden;" :show-file-list="false" :action="uploadSongUrl(scope.row.id)" :before-upload="beforeSongUpload"
                     :on-success="handleSongSuccess">
            <el-button size="mini">更新歌曲</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id,scope.row.url)"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div class="minipagination">
      <el-pagination background layout="total,prev,pager,next" :current-page="currentPage" :page-size="pageSize" :total="tableData.length" @current-change="handleCurrentChange"></el-pagination>
    </div>
    <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible"  width="400px" center @close="dialogClose">
      <el-form v-model="registerForm" ref="registerForm" :rules="rules" label-width="80px" action="" id="tf">
        <div>
          <label>歌名</label>
          <el-input type="text" name="name"></el-input>
        </div>
        <div>
          <label>专辑</label>
          <el-input type="text" name="introduction"></el-input>
        </div>
        <div>
          <label>歌词</label>
          <el-input type="text" name="lyric"></el-input>
        </div>
        <div>
          <label>歌曲上传</label>
          <el-input type="file" name="file"></el-input>
        </div>
      </el-form>
      <span slot="footer">
          <el-button size="mini" @click="centerDialogVisible=false">取消</el-button>
          <el-button size="mini" @click="addSong">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改歌曲" :visible.sync="editVisible" width="400px" center>
        <el-form :model="form" ref="form" label-width="80px">
          <el-form-item prop="name" label="歌手-歌曲" size="mini">
            <el-input v-model="form.name" placeholder="歌手-歌名"></el-input>
          </el-form-item>
          <el-form-item prop="introduction" label="专辑" size="mini">
            <el-input v-model="form.introduction" placeholder="专辑"></el-input>
          </el-form-item>
          <el-form-item prop="lyric" label="歌词" size="mini">
            <el-input v-model="form.lyric" placeholder="歌词" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button size="mini" @click="editVisible=false">取消</el-button>
            <el-button size="mini" @click="editSave">确定</el-button>
        </span>
    </el-dialog>

    <el-dialog title="删除歌手" :visible.sync="delVisible" width="400px" center>
      <div align="center">确认删除吗?</div>
      <span slot="footer">
          <el-button size="mini" @click="delVisible=false">取消</el-button>
          <el-button size="mini" @click="deleSong">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import '@/assets/js/iconfont.js'
import {mixin} from '../mixins/index'
import {getSongBysingerId, updateSong, delSong} from '../api/index'

export default {
  mixins: [mixin],
  created () {
    this.singerId = this.$route.query.id
    this.singerName = this.$route.query.name
    this.getData()
  },
  computed: {
    ...mapGetters([
      'isPlay'
    ]),
    // 计算当前搜索结果表里的数据
    data () {
      console.log('computed')
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },
  watch: {
    // 输出框里面的内容发生变化的时候，搜索结果table列表的内容跟着他变化
    selectWord: function () {
      if (this.selectWord === '') {
        this.tableData = this.tempData
      } else {
        this.tableData = []
        for (let item of this.tempData) {
          if (item.name.includes(this.selectWord)) {
            this.tableData.push(item)
          }
        }
      }
    }
  },
  data () {
    return {
      singerId: '', // 歌手id
      singerName: '', // 歌手名
      centerDialogVisible: false,
      delVisible: false,
      editVisible: false,
      registerForm: {
        name: '',
        singerName: '',
        lyric: '',
        introduction: ''
      },
      form: {
        id: '',
        name: '',
        lyric: '',
        introduction: ''
      },
      rules: [],
      tableData: [],
      tempData: [],
      selectWord: '',
      pageSize: 5,
      currentPage: 1,
      idx: 0,
      fileName: '',
      multipleSelection: [],
      toggle: '', // 播放器的图标状态
      currentToggle: ''
    }
  },
  methods: {
    // 添加歌曲
    addSong () {
      let _this = this
      var form = new FormData(document.getElementById('tf'))
      form.append('singerId', this.singerId)
      form.set('name', this.singerName + '-' + form.get('name'))
      if (!form.get('lyric')) {
        form.set('lyric', '[00:00:00]暂无歌词')
      }
      var req = new XMLHttpRequest()
      req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
          let res = JSON.parse(req.response)
          console.log('res:' + JSON.stringify(res.response))
          if (res.code) {
            _this.getData()
            _this.registerForm = {}
            _this.notify(res.msg, 'success')
          } else {
            _this.notify('保存失败', 'error')
          }
        }
      }
      req.open('post', `${_this.$store.state.HOST}/song/add`, false)
      req.send(form)
      _this.centerDialogVisible = false
    },
    editSave () {
      updateSong(this.form).then(res => {
        if (res.code === 1) {
          this.notify(res.msg, 'success')
          this.getData()
        } else {
          this.notify(res.msg, 'error')
          this.getData()
        }
      }).catch(err => {
        console.log(err)
        this.notify('网络故障', 'error')
      })
      this.editVisible = false
    },
    deleSong () {
      delSong(this.idx).then(res => {
        if (res.code === 1) {
          this.notify(res.msg, 'success')
          this.getData()
        }
      }).catch(err => {
        console.log(err)
      })
      this.delVisible = false
    },
    handleEdit (row) {
      this.editVisible = true
      this.form = {
        id: row.id,
        name: row.name,
        introduction: row.introduction,
        lyric: row.lyric
      }
    },
    dialogClose () {
      console.log('closed')
      this.registerForm = {
        name: '',
        singerName: '',
        lyric: '',
        introduction: ''
      }
    },
    getData () {
      getSongBysingerId(this.singerId).then(res => {
        if (res.code === 1) {
          this.tempData = res.data
          this.tableData = res.data
          this.currentPage = 1
        }
      })
    },
    uploadUrl (id) {
      return `${this.$store.state.HOST}/song/updateSongPic?id=${id}`
    },
    uploadSongUrl (id) {
      return `${this.$store.state.HOST}/song/updateSongUrl?id=${id}`
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    parseLyric (text) {
      let lines = text.split('\n')
      console.log('lines.length' + lines.length)
      let pattern = /\[\d{2}:\d{2}.(\d{2}|\d{3})\]/g
      let result = []
      // 对于歌词格式不对的特殊处理
      if (!(/\[.+\]/.test(text))) {
        return [text]
      }
      for (let item of lines) {
        let value = item.replace(pattern, '')
        result.push(value)
      }
      return result
    },
    // 上传歌曲之前的校验
    beforeSongUpload (file) {
      var testMsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (testMsg !== 'mp3') {
        this.$message({
          message: '上传文件只能是mp3格式',
          type: 'error'
        })
        return false
      }
      return true
    },
    // 上传歌曲成功之后要做的工作
    handleSongSuccess (res) {
      if (res.code === 1) {
        this.getData()
        this.notify('上传成功', 'success')
      } else {
        this.notify('上传失败', 'error')
      }
    },
    // 设置播放歌曲
    setSongUrl (url, name) {
      this.toggle = name
      this.$store.commit('setUrl', this.$store.state.HOST + url)
      if (this.isPlay) {
        this.$store.commit('setIsPlay', false)
        if (this.toggle === this.currentToggle) {
          this.toggle = ''
        }
      } else {
        this.$store.commit('setIsPlay', true)
        this.currentToggle = name
      }
    }
  },
  destroyed () {
    this.$store.commit('setIsPlay', false)
  }
}
</script>

<style scoped>
  .handler-box{
    margin-bottom: 20px;
  }
  .song-img{
    width: 100%;
    height: 80px;
    border-radius: 5px;
    margin-bottom: 5px;
    overflow: hidden;
  }
  .handle-input{
    width: 300px;
    display: inline-block;
  }
  .minipagination{
    display: flex;
    justify-content: center;
  }
  .play{
    position: absolute;
    z-index: 100;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    top: 0px;
    left: 0px;
  }
  .icon{
    width: 2em;
    height: 2em;
    color: white;
    fill:currentColor;
    overflow: hidden;
  }
  .play:hover{
    background:#000;
    opacity:.7;
  }
</style>
