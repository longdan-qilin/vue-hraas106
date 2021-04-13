<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template v-slot:after>
          <el-button
            type="primary"
            size="small"
            class="el-icon-edit"
            @click="addPermisson('0', 1)"
          >添加菜单</el-button>
        </template>
      </page-tools>

      <!-- row-key 指定id为唯一属性的标识 -->
      <el-table border :data="list" row-key="id">
        <el-table-column label="菜单名称" prop="name" />
        <el-table-column label="权限标识" align="center" prop="code" />
        <el-table-column label="描述" align="center" prop="description" />
        <el-table-column label="操作" align="center">
          <template v-slot="{ row }">
            <!-- type=1 页面访问权限 2是功能权限 -->
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermisson(row.id, 2)"
            >添加</el-button>
            <el-button
              type="text"
              @click="editPermisson(row.id)"
            >编辑</el-button>
            <el-button
              type="text"
              @click="delPermisson(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加和编辑的弹出层 -->
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancle">
      <el-form ref="permissonRef" label-width="120px" :rules="rules" :model="formData">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>

      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnOk">确认</el-button>
          <el-button size="small" @click="btnCancle">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 导入接口
import {
  getPermissionList,
  addPermission,
  updatePermission,
  delPermission,
  getPermissionDetail
} from '@/api/permisson'
import { tranListToTreeData } from '@/utils/index'
export default {
  data() {
    return {
      // 接收所有权限点列表
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      // 将权限列表 转化为树形结构
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    // 删除权限
    async delPermisson(id) {
      try {
        await this.$confirm('确认删除权限吗？')
        await delPermission(id)
        this.getPermissionList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    btnOk() {
      this.$refs.permissonRef.validate().then(() => {
        if (this.formData.id) {
          return updatePermission(this.formData)
        }
        return addPermission(this.formData)
      }).then(() => {
        //  提示消息
        this.$message.success('操作成功')
        this.getPermissionList()
        this.showDialog = false
      })
    },
    btnCancle() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      // 重置校验
      this.$refs.permissonRef.resetFields()
      this.showDialog = false
    },
    // 添加权限
    addPermisson(pid, type) {
      // 将父节点id 还有添加的类型赋值
      this.formData.pid = pid
      this.formData.type = type
      // 展开弹出层
      this.showDialog = true
    },
    // 编辑权限
    async editPermisson(id) {
      // 根据id获取详情
      this.formData = await getPermissionDetail(id)
      // 展开弹出层
      this.showDialog = true
    }
  }
}
</script>

<style></style>
