export const mixin = {
  methods: {
    // 提示信息
    notify (title, type) {
      this.$notify({
        title: title,
        type: type
      })
    },
    // 根据相对地址获取绝对地址
    getUrl (url) {
      return `${this.$store.state.HOST}/${url}`
    },
    // 获取性别中文
    transformSex (value) {
      switch (value) {
        case 0:
          return '女'
        case 1:
          return '男'
        case 2:
          return '组合'
        case 3:
          return '未知'
      }
    },
    // 获取生日
    transformBirth (value) {
      return String(value).substr(0, 10)
    },
    // 上传图片之前的校验
    beforeAvatorUpload (file) {
      const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png')
      if (!isJPG) {
        this.$message.error('上传头像图片必须是jpg或者png形势')
        return false
      }
      const isLt2M = (file.size / 1024 / 1024) < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能大于2M')
        return false
      }
      return true
    },
    // 上传图片成功之后要做的工作
    handleAvatorSuccess (res) {
      let _this = this
      if (res.code === 1) {
        _this.getData()
        _this.notify('上传成功', 'success')
      } else {
        _this.notify('上传失败', 'error')
      }
    },
    // 弹出删除窗口
    handleDelete (id) {
      this.idx = id
      this.delVisible = true
    },
    // 传递需要删除的项
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log('选中:' + JSON.stringify(this.multipleSelection))
    },
    // 批量删除已选择的项
    delAll () {
      for (let item of this.multipleSelection) {
        this.handleDelete(item.id)
        this.deleSinger()
      }
      this.multipleSelection = []
    }
  }
}
