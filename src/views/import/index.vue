<template>
  <upload-excel :on-success="onSuccess" />
</template>

<script>
// 导入批量导入接口
import { importEmployee } from '@/api/employees'

export default {
  name: 'Import',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    async onSuccess({ header, results }) {
      // 如果是导入员工
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // 将results 里的对象取出来 遍历
      const newArr = results.map(item => {
        // 定义一个用来接收的空对象
        var userInfo = {}
        Object.keys(item).forEach(ele => {
          // ele是当前的中文名 找到对应的英文名
          if (userRelations[ele] === 'timeOfEntry' || userRelations[ele] === 'correctionTime') {
            userInfo[userRelations[ele]] = new Date(this.formatDate(item[ele], '/')) // 只有这样, 才能入库
            return
          } else {
            userInfo[userRelations[ele]] = item[ele] // 将原来中文对应的值 (就是数据) 赋值给原来英文对应的值
          }
        })
        // 最终userInfo变成了全是英文
        return userInfo
      })
      // 将转化的数据信息通过接口导入后台
      await importEmployee(newArr)
      this.$message.success('导入excel成功')
      // 跳转返回
      this.$router.back()
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
