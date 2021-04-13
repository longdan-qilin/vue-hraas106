<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <el-row>
      <!-- el-checkbox-group代表的是当前用户所拥有的角色 需要绑定当前用户所拥有的角色 -->
      <el-checkbox-group v-model="roleIds">
        <!-- label与数组中的元素值相对应，如果存在指定的值则为选中状态，否则为不选中。 -->
        <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
    </el-row>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 获取角色列表
import { getRoleList } from '@/api/setting'
// 员工分配角色权限接口
import { assignRole } from '@/api/employees'
// 获取员工基本信息
import { getUserDetailById } from '@/api/user'
export default {
  name: 'AssignRole',
  components: {},
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      // 用户的id 用来确认那个用户 后面分配权限
      type: String,
      default: null
    }
  },
  data() {
    return {
      roleList: [], // 负责存储当前所有的角色id
      roleIds: [] // 这个数组负责储存 当前用户所拥有的角色id
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getRoleList() // 调用角色列表的函数
  },
  mounted() { },
  methods: {
    // 获取角色列表
    async getRoleList() {
      // 参数传入只需要10页数据就够了
      const { rows } = await getRoleList({ page: 1, pagesize: 10 })
      this.roleList = rows
    },
    // 获取员工基本信息
    async getUserDetailById(id) {
      // 为什么只有第一次拿到了 后面拿不到呢 因为 props传值 是异步的
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    // 点击提交数据
    async btnOk() {
      await assignRole({ id: this.userId, roleIds: this.roleIds })
      this.$emit('update:showRoleDialog', false)
    },
    // 关闭弹出层 取消的方法
    async btnCancel() {
      this.roleIds = [] // 清空原来的数据
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
