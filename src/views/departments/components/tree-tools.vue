<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <!-- 左侧内容 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>
          {{ treeNode.manager }}
        </el-col>
        <!-- 下拉菜单 element -->
        <el-col>
          <el-dropdown @command="operateDepts">
            <span> 操作<i class="el-icon-arrow-down " /> </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <!-- 编辑部门和删除部门只会在子节点上显示 -->
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del" :disabled="!checkPermission('point-user-delete')">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartMents } from '@/api/departments'
// 该组件需要对外开放属性 外部需要提供一个对象 对象里需要有name  manager
export default {
  name: 'TreeTools',
  components: {},
  // props可以用数组来接收属性 也可以用对象来接收
  // props: { props属性: { 配置选项 } }
  props: {
    // 定义一个props属性
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 操作节点调用的方法
    operateDepts(type) {
      if (type === 'add') {
      // 添加子部门的操作
      // 告诉父组件 显示弹层
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        // 修改子部门的操作
        this.$emit('editDepts', this.treeNode)
      } else {
        // 删除子部门的操作
        this.$confirm('您确认要删除该部门吗？').then(() => {
          return delDepartMents(this.treeNode.id) // 返回一个promise对象
        }).then(() => {
          // 跟新数据 通过$emit传递到父组件
          this.$emit('delDepts')
          this.$message.success('删除数据成功！')
        })
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
