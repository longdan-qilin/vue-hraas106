<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <el-form ref="addEmployee" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请输入">
          <!-- 遍历只能遍历组件的数据 -->
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请输入部门" @focus="getDepartMents" />
        <el-tree v-show="showTree" v-loading="loading" :data="treeData" :props="{ label: 'name' }" default-expand-all @node-click="selectNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- 底部插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOk">确认</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 加载模块
import { addEmployee } from '@/api/employees'
import { getDepartMents } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import EmployeeEnum from '@/api/constant/employees'

export default {
  name: 'AddEmployless',
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum,
      // 员工数据对象
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      // 验证规则
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空！', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位！' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空！', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误！', trigger: 'blur' }
        ],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空！', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空！', trigger: 'blur' }],
        // 为什么改为change 因为这个是直接选中 2个不是一个组件
        departmentName: [{ required: true, message: '部门不能为空！', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '转正时间不能为空！', trigger: 'blur' }]
      },
      // 接收组织构架数据数组
      treeData: [],
      loading: false, // 控制树的显示或者隐藏进度条
      showTree: false // 控制树形显示和隐藏
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getDepartMents()
  },
  mounted() { },
  methods: {
    // 获取组织构架
    async getDepartMents() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartMents()
      // depts是数组 但不是树形
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    // 节点被点击时的回调
    selectNode(node) {
      // 获取节点的name属性值 赋值给数据 => 部门名称
      this.formData.departmentName = node.name
      // 关闭树形结构
      this.showTree = false
    },
    // 点击确认提交数据
    async btnOk() {
      try {
        await this.$refs.addEmployee.validate()
        // 调用新增接口 新增员工
        await addEmployee(this.formData)
        this.$message.success('新增员工成功！')
        // 通过父组件跟新数据  this.$parent可以拿到父组件的方法以及数据 取代$emit
        // 实际上就是父组件this
        this.$parent.getEmployeeList && this.$parent.getEmployeeList()
        this.$parent.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    // 关闭弹出层功能
    btnCancel() {
      // 清空表单数据
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // 检验表单 重置表单数据
      this.$refs.addEmployee.resetFields()
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
