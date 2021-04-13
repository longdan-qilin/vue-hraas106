<template>
  <div>
    <!-- 放置一个svg的图标 -->
    <svg-icon icon-class="fullscreen" style="color: #fff; width: 20px; height: 20px" @click="changeScreen" />
  </div>
</template>

<script>
// 导入全屏插件
import screenfull from 'screenfull'
export default {
  name: '',
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
    changeScreen() {
      if (!screenfull.isEnabled) {
        // 此时全屏不可用
        this.$message.warning('此时全屏不可用')
        return
      }
      // document.documentElement.requestFullscreen()  原生js调用
      //   如果可用 就可以全屏
      screenfull.toggle()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
