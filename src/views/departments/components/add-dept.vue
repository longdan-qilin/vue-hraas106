<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      ref="deptForm"
      :rules="rules"
      :model="formData"
      label-width="120px"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width:80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width:80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确认</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  addDepartMents,
  getDepartMents,
  getDepartDetail,
  updateDepartments
} from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'AddDept',
  components: {},
  props: {
    // 需要传入一个props变量来控制 显示或者隐藏
    showDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作的节点
    treeNode: {
      type: Object, // 对象类型
      default: null
    }
  },
  data() {
    // 现在定义一个函数 这个函数目的是 去找 同级部门下 是否有重复的部门名称
    const checkNameRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织结构数据
      //  检查重复规则 需要支持两种 新增模式 / 编辑模式
      const { depts } = await getDepartMents()
      let isRepeat = false
      /* depts是所有部门数据 如何去找技术部所有的子节点 */
      if (this.formData.id) {
        // 有id就是编辑模式
        /* 编辑的数据 在数据库里有 同级部门下 我的名字不能和其他的同级部门的名字进行重复
            首先要找到我的同级部门 this.formData.id 就是我当前的id 我的pid是this.formData.pid
            depts.filter(item => item.pid === this.formData.pid)
        */
        isRepeat = depts
          .filter(
            item =>
              item.pid === this.treeNode.pid && item.id !== this.treeNode.id
          )
          .some(item => item.name === value)
      } else {
        // 新增模式
        isRepeat = depts
          .filter(item => item.pid === this.treeNode.id)
          .some(item => item.name === value)
      }
      isRepeat
        ? callback(new Error(`同级部门下已经拥有${value}的部门`))
        : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织结构数据
      const { depts } = await getDepartMents()
      /* 要求编码 和所有的部门编码都不能重复 由于历史数据有可能 没有code 所以说这里加一个强制性条件 就是value值不为空 */
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式 前置条件就是 自已要排除
        isRepeat = depts.some(
          item => item.id !== this.treeNode.id && item.code === value && value
        )
      } else {
        // 新增模式
        isRepeat = depts.some(item => item.code === value && value)
      }
      isRepeat
        ? callback(new Error(`同级部门下已经拥有${value}的编码`))
        : callback()
    }
    return {
      // 添加对话框的数据对象
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 验证数据的定义规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', tigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            tigger: 'blur'
          },
          { tigger: 'blur', validator: checkNameRepeat }
        ],
        code: [
          { required: true, message: '部门编码不能为空', tigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            tigger: 'blur'
          },
          { tigger: 'blur', validator: checkCodeRepeat }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', tigger: 'blur' }
        ],
        nintroduceame: [
          { required: true, message: '部门介绍不能为空', tigger: 'blur' },
          {
            min: 1,
            max: 300,
            message: '部门名称要求1-300个字符',
            tigger: 'blur'
          }
        ]
      },
      // 员工简单列表数据对象
      peoples: {}
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async getEmployeeSimple() {
      // 获取简单列表数据
      this.peoples = await getEmployeeSimple()
    },
    // 获取部门详情
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
      // 因为我们是父组件调用子组件的方法 先设置了node数据 直接调用方法
      // props传值是异步的 这样防止有时候获取不到数据
    },
    // 确认提交
    btnOK() {
      this.$refs.deptForm.validate(async isOk => {
        if (isOk) {
          // 分清是编辑还是新增
          if (this.formData.id) {
            // 编辑模式 调用编辑接口
            await updateDepartments(this.formData)
          } else {
            // 表示可以提交了 新增模式
            await addDepartMents({ ...this.formData, pid: this.treeNode.id }) // 调用新增接口 添加父部门的id
          }
          this.$emit('addDepts')
          // 子组件 update:固定写法 (update:props名称, 值)
          this.$emit('update:showDialog', false)
        }
      })
    },
    // 弹出层关闭事件
    btnCancel() {
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      // 清空表单里的数据
      this.$refs.deptForm.resetFields()
      // 关闭弹窗
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style lang="less" scoped></style>
