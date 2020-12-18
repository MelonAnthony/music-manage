<template>
  <div class="table">
    <div class="container">
      <div class="handler-box">
        <el-input v-model="selectWord" size="mini" placeholder="请输入歌曲名" class="handle-input"></el-input>
        <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
        <el-button type="primary" size="mini" @click="addSongToList">添加歌曲</el-button>
      </div>
    </div>
    <el-table size="mini" border style="width:100%" height="680px" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="歌手-歌名" prop="name" align="center"></el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible"  width="500px" center @close="dialogClose">
      <el-table
        ref="multipleTable"
        :data="songData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="歌名">
        </el-table-column>
        <el-table-column
          prop="introduction"
          label="专辑"
          width="120"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button @click="submitSongToList">添加</el-button>
        <el-button @click="toggleSelection()">取消选择</el-button>
      </div>
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
import {deleteSongList, getSongFormListById, getSongById, getAllSong, insertSongList} from '../api/index'
import {mixin} from '../mixins/index'

export default {
  mixins: [mixin],
  created () {
    this.songListId = this.$route.query.id
    this.getData()
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
        songId: ''
      },
      rules: [],
      tableData: [],
      tempData: [],
      selectWord: '',
      songListId: '',
      pageSize: 5,
      currentPage: 1,
      idx: 0,
      multipleSelection: [],
      listSongIdArray: [],
      songData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }]
    }
  },
  methods: {
    submitSongToList () {
      let params = {}
      this.multipleSelection.forEach(item => {
        params.songListId = this.songListId
        params.songId = item.id
        insertSongList(params)
      })
      this.centerDialogVisible = false
      this.getData()
    },
    addSongToList () {
      this.centerDialogVisible = true
      this.getSongList()
    },
    getSongList () {
      let _this = this
      getAllSong().then(res => {
        if (res.code === 1) {
          // 从所有歌曲中剔除已经在
          this.songData = res.data.filter(item => {
            return !_this.listSongIdArray.includes(item.id)
          })
        }
        console.log('this songIdArray' + JSON.stringify(this.listSongIdArray))
      })
    },
    deleSongList () {
      deleteSongList(this.idx).then(res => {
        if (res.code === 1) {
          this.notify(res.msg, 'success')
          this.getData()
        }
      }).catch(err => {
        console.log(err)
      })
      this.delVisible = false
    },
    dialogClose () {
      console.log('closed')
      this.multipleSelection = []
    },
    getData () {
      this.tableData = []
      this.tempData = []
      // let _this = this
      getSongFormListById(this.songListId).then(res => {
        if (res.code === 1) {
          res.data.forEach(item => {
            this.getSong(item.songId)
          })
        }
      })
    },
    getSong (id) {
      getSongById(id).then(res => {
        if (res.code === 1) {
          this.tempData.push(res.data)
          this.tableData.push(res.data)
          this.listSongIdArray.push(res.data.id)
        }
      })
    },
    toggleSelection () {
      this.$refs.multipleTable.clearSelection()
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
