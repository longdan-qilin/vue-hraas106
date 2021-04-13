<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <tree-tools :tree-node="companey" :is-root="true" @addDepts="addDepts" />
        <!-- 放置一个el-tree -->
        <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
        <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <tree-tools slot-scope="{ data }" :tree-node="data" @delDepts="getDepartMents" @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>

    <!-- 添加部门  弹出层组件 -->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartMents" />
  </div>
</template>

<script>
// 引入封装的子组件
import TreeTools from './components/tree-tools'
import AddDept from './components/add-dept'
// 加载组织架构请求接口
import { getDepartMents } from '@/api/departments'
// 导入将列表型的数据转化成树形数据的方法
import { tranListToTreeData } from '@/utils/index'

export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      departs: [],
      defaultProps: {
        label: 'name' // 从这个属性去找内容
      },
      companey: {}, // 就是头部的数据结构
      showDialog: false, // 默认弹出层隐藏
      node: null, // 记录当前点击的node节点
      loading: false // 用来控制进度弹层的显示和隐藏
    }
  },
  created() {
    this.getDepartMents()
  },
  methods: {
    /* 由于treenode属性中没有id，id便是undefined，
    但是通过undefined进行等值判断是寻找不到对应的根节点的，
    所以在传值时，我们将id属性设置为 '' */
    async getDepartMents() {
      this.loading = true
      const result = await getDepartMents()
      this.companey = { name: result.companyName, manager: '负责人', id: '' }
      // 这里定义一个空串  因为 它是根 所有的子节点的数据pid 都是 ""
      this.departs = tranListToTreeData(result.depts, '') // 需要转为树形结构
      this.loading = false
    },
    // 添加部门节点
    addDepts(node) {
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node // 赋值操作的节点
    },
    // 编辑部门节点
    editDepts(node) {
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node // 赋值操作的节点
      /*
          我们需要在这个位置调用子组件的方法
          父组件调用子组件的方法
      */
      this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
