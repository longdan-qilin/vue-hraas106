<template>
  <el-dropdown trigger="hover" @command="changeLanguage">
    <div>
      <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="$i18n.locale===&quot;zh&quot;">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="$i18n.locale===&quot;en&quot;">en</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>

</template>

<script>
import Cookie from 'js-cookie'
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
    changeLanguage(type) {
      Cookie.set('language', type) // 切换多语言
      // 设置给本地的插件
      this.$i18n.locale = type
      this.$message.success('切换语言成功！')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
