<template>
  <div>
    <!-- action 上传的地址 limit 限制上传的图片数量-->
    <!-- file-list是上传的文件列表 可以绑定到上传组件上 让上传组件来显示 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="handlePictureCardPreview"
      :file-list="fileList"
      :class="{ disabled: fileComputed }"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPrecent" :percentage="percent" style="width: 180px" />
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img style="width: 100%" :src="dialogImageUrl">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDrUuLXQl7u9QSGpKbAY9SZRLyWpAOoz9L', // 身份识别ID
  SecretKey: 'mPc7NOBzMUCg3mHXnsLirh05vtJ2enLO' // 身份秘钥
})
export default {
  data() {
    return {
      // 默认弹出层关闭
      showDialog: false,
      dialogImageUrl: '', // 弹出层图片路径
      // 上传的 文件列表
      fileList: [],
      // 当前操作文件的id
      cureentFileUid: '',
      // 进度条的显示与隐藏
      showPrecent: false,
      // 进度条对应的百分比
      percent: 0
    }
  },
  computed: {
    // 设置一个计算属性 如果等于true的时候 表示出现这个属性
    // 如果它为true 表示就不应该显示 + 号上传了
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      console.log(file)
      this.dialogImageUrl = file.url
      // 关闭弹出层
      this.showDialog = true
    },
    // file操作的文件 fileList 操作之后的文件
    handleRemove(file, fileList) {
      //   将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = fileList.filter(item => item.uid !== file.uid)
      // 2种方法度可以
      // this.fileList = fileList
    },
    // 修改文件时触发
    // 此时可以用fileList 因为该方法会进来很多遍 不能每次都去push
    // fileList因为fileList参数是当前传进来的最新参数 我们只需要将其转化成数组即可 需要转化成一个新的数组
    // [] => [...fileList] [] => fileList.map()
    // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    /*
        这里为何暂时不成功 因为现在还没有上传 所以第二次进来的数据 一定是空的
        如果完成上传动作了 第一次进入 和第二次进入的 fileListd 长度应该都是1 应该都有数据
        上传成功 => 数据才能进来 => 腾讯云cos
    */
    beforeUpload(file) {
      // 先检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 检查文件是否超过标准大小
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // 已经确认了当前的上传的文件就是当前这个filel
      this.cureentFileUid = file.uid
      this.showPrecent = true
      return true // 最后一定要return  true
    },
    // 自定义上传动作 有个参数 有个file对象，是我们需要上传到腾讯云服务器的内容
    upload(params) {
      // 如果参数中有file这个对象
      if (params.file) {
        cos.putObject({
          Bucket: 'shui-106-1305072660', /* 必须 */
          Region: 'ap-chongqing', /* 存储桶所在地域，必须字段 */
          Key: params.file.name, /* 文件名必须 */
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          Body: params.file, // 上传文件对象
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
          // 进度的回调函数，进度回调响应对象
          onProgress: params => {
            this.percent = params.percent * 100
            console.log(params)
          }
        }, (err, data) => {
          // data返回数据之后 应该如何处理
          console.log(err || data)
          // 如果响应成功或者没有报错的话 data.statusCode === 200 响应成功
          if (!err && data.statusCode === 200) {
            // 此时说明文件上传成功  要获取成功的返回地址
            // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
            // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
            // 需要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.cureentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
              }
              return item
            })
            // 延时2s后 关闭进度条且重置进度百分比
            setTimeout(() => {
              this.showPrecent = false
              this.percent = 0
            }, 2000)
            // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card  {
  display: none;
}
</style>
