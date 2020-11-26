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
          <el-upload :action="uploadUrl(scope.row.id)" :before-upload="beforeAvatorUpload" :on-success="handleAvatorSuccess">
            <el-button size="mini">更新图片</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column label="歌名" prop="name" width="120px" align="center"></el-table-column>
      <el-table-column label="专辑" prop="introduction" width="120px" align="center"></el-table-column>
      <el-table-column label="歌词" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.lyric}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)"></el-button>
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
          <el-button size="mini" @click="submitSong">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除歌手" :visible.sync="delVisible" width="400px" center>
      <div align="center">确认删除吗?</div>
      <span slot="footer">
          <el-button size="mini" @click="delVisible=false">取消</el-button>
          <el-button size="mini" @click="deleSinger">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getAllSinger, updateSinger, setSinger, delSinger} from '../api/index'
import {mixin} from '../mixins/index'

export default {
  mixins: [mixin],
  created () {
    this.getData()
  },
  computed: {
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
      centerDialogVisible: false,
      delVisible: false,
      registerForm: {
        name: '',
        sex: '',
        birth: '',
        location: '',
        introduction: ''
      },
      rules: [],
      tableData: [],
      tempData: [],
      selectWord: '',
      pageSize: 5,
      currentPage: 1,
      idx: 0,
      multipleSelection: []
    }
  },
  methods: {
    submitSinger () {
      if (this.registerForm.id) {
        console.log('update')
        updateSinger(this.registerForm).then(res => {
          if (res.code === 1) {
            this.notify(res.msg, 'success')
            this.getData()
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        console.log('insert')
        setSinger(this.registerForm).then(res => {
          if (res.code === 1) {
            this.notify(res.msg, 'success')
            this.getData()
          }
        }).catch(err => {
          console.log(err)
        })
      }
      this.centerDialogVisible = false
    },
    deleSinger () {
      delSinger(this.idx).then(res => {
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
      this.centerDialogVisible = true
      this.registerForm.id = row.id
      this.registerForm.name = row.name
      this.registerForm.sex = row.sex
      this.registerForm.birth = row.birth
      this.registerForm.location = row.location
      this.registerForm.introduction = row.introduction
    },
    dialogClose () {
      this.registerForm = {
        name: '',
        sex: '',
        birth: '',
        location: '',
        introduction: ''
      }
    },
    getData () {
      this.tableData = []
      this.tempData = []
      getAllSinger().then(res => {
        if (res.code === 1) {
          this.tempData = res.data
          this.tableData = res.data
          console.log('数据初始化:' + JSON.stringify(this.tableData))
        }
      })
    },
    uploadUrl (id) {
      return `${this.$store.state.HOST}/singer/updateSingerPic?id=${id}`
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    // 转向歌曲页面
    songEdit (id, name) {
      this.$router.push({path: `/SongPage`, query: {id, name}})
    }
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
</style>
