<template>
  <div class="table">
    <div class="container">
      <div class="handler-box">
        <el-input v-model="selectWord" size="mini" placeholder="请输入歌单名" class="handle-input"></el-input>
        <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
        <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加歌单</el-button>
      </div>
    </div>
    <el-table size="mini" border style="width:100%" height="680px" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="歌单图片" width="110" align="center">
        <template slot-scope="scope">
          <div class="songList-img">
            <img :src="getUrl(scope.row.pic)" style="width: 100%;"/>
          </div>
          <el-upload  :action="uploadUrl(scope.row.id)"  :before-upload="beforeAvatorUpload" :on-success="handleAvatorSuccess">
            <el-button size="mini">更新图片</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" width="120px" align="center"></el-table-column>

      <el-table-column label="简介" align="center">
        <template slot-scope="scope">
          <p style="height: 100px;overflow: scroll">{{scope.row.introduction}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="style" label="风格" width="100" align="center"></el-table-column>

      <el-table-column label="歌曲管理" width="110" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="songEdit(scope.row.id)">歌曲管理</el-button>
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

    <el-dialog :title="registerForm.id?'修改歌单':'添加歌单'" :visible.sync="centerDialogVisible"  width="400px" center @close="dialogClose">
      <el-form v-model="registerForm" ref="registerForm"  label-width="80px">
        <el-form-item prop="title" label="标题"  size="mini">
          <el-input v-model="registerForm.title" aria-placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item prop="style" label="风格" size="mini">
          <el-input v-model="registerForm.style" aria-placeholder="风格"></el-input>
        </el-form-item>
        <el-form-item prop="introduction" label="简介" size="mini">
          <el-input v-model="registerForm.introduction" aria-placeholder="简介" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
          <el-button size="mini" @click="centerDialogVisible=false">取消</el-button>
          <el-button size="mini" @click="submitSongList">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除歌单" :visible.sync="delVisible" width="400px" center>
      <div align="center">确认删除吗?</div>
      <span slot="footer">
          <el-button size="mini" @click="delVisible=false">取消</el-button>
          <el-button size="mini" @click="deleSongList">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getAllSongList, updateSongList, setSongList, delSongList} from '../api/index'
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
          if (item.title.includes(this.selectWord)) {
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
      EditmodelTitle: '添加歌单',
      registerForm: {
        id: '',
        title: '',
        style: '',
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
    submitSongList () {
      if (this.registerForm.id) {
        console.log('update')
        updateSongList(this.registerForm).then(res => {
          if (res.code === 1) {
            this.notify(res.msg, 'success')
            this.getData()
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        console.log('insert')
        setSongList(this.registerForm).then(res => {
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
    deleSongList () {
      delSongList(this.idx).then(res => {
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
      this.registerForm.title = row.title
      this.registerForm.introduction = row.introduction
      this.registerForm.style = row.style
    },
    dialogClose () {
      console.log('closed')
      this.registerForm = {
        id: '',
        title: '',
        pic: '',
        style: '',
        introduction: ''
      }
    },
    getData () {
      this.tableData = []
      this.tempData = []
      getAllSongList().then(res => {
        if (res.code === 1) {
          this.tempData = res.data
          this.tableData = res.data
          this.currentPage = 1
          console.log('数据初始化:' + JSON.stringify(this.tableData))
        }
      })
    },
    uploadUrl (id) {
      return `${this.$store.state.HOST}/songList/updateSongListPic?id=${id}`
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    // 转向歌曲页面
    songEdit (id) {
      this.$router.push({path: `/ListSongPage`, query: {id}})
    }
  }
}
</script>

<style scoped>
  .handler-box{
    margin-bottom: 20px;
  }
  .songList-img{
    width: 100%;
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
