<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                type="primary"
                size="small"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <el-table border="" :data="list">
              <el-table-column
                label="序号"
                width="120"
                type="index"
                align="center"
              />
              <el-table-column
                label="角色名称"
                width="240"
                prop="name"
                align="center"
              />
              <el-table-column label="描述" prop="description" align="center" />
              <el-table-column label="操作" align="center">
                <template v-slot="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                  >分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                  >编辑</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row
              type="flex"
              justify="center"
              style="height: 60px"
              align="middle"
            >
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev, pager, next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              :show-icon="true"
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="企业名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司电话">
                <el-input
                  v-model="formData.companyPhone"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  disabled
                  type="textarea"
                  :rows="3"
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 添加和编辑弹出层 -->
    <el-dialog
      :title="showTitle"
      :visible="showDialog"
      label-width="120px"
      @close="btnCancel"
    >
      <el-form ref="roleFormRef" :model="roleForm" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col>
          <el-button size="small" @click="btnCancel">取 消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="btnOk"
          >确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 分配权限弹出层 -->
    <el-dialog
      v-if="showPermDialog"
      title="分配权限"
      :visible="showPermDialog"
      @close="btnPermCancel"
    >
      <!-- check-strictly父子节点互相不关联  id作为唯一标识-->
      <el-tree
        ref="permTree"
        :data="PermList"
        :props="defaultProps"
        show-checkbox
        check-strictly
        default-expand-all
        node-key="id"
        :default-checked-keys="selectCheck"
      />
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button
            size="small"
            type="primary"
            @click="btnPermOk"
          >确认</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 导入获取角色列表的接口
import {
  getRoleList,
  getCompanyInfo,
  addRole,
  deleteRole,
  getRoleDetail,
  updateRole,
  assignPerm
} from '@/api/setting'
import { mapGetters } from 'vuex'
import { tranListToTreeData } from '@/utils/index'
import { getPermissionList } from '@/api/permisson'
export default {
  data() {
    return {
      list: [], // 承接数组
      page: {
        page: 1, // 默认第几条
        pagesize: 10, // 每页多少条
        toatl: 0 // 总的条数
      },
      formData: {
        /*       name: '', // 公司名称
        companyAddress: '', // 公司地址
        companyPhone: '', // 公司电话
        mailbox: '', // 邮箱
        remarks: '' // 备注 */
      },
      rules: {
        name: [{ required: true, trigger: 'blur', message: '角色名称不能为空' }]
      },
      showDialog: false,
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {
        name: '',
        description: ''
      },
      // 分配权限弹出层显示隐藏
      showPermDialog: false,
      // 接收权限列表的数组
      PermList: [],
      // 定义显示字段的名称 和 子属性的字段名称
      defaultProps: {
        label: 'name'
      },
      // 用来记录当前分配权限的id
      roleId: '',
      // 用来记录当前权限点的标识
      selectCheck: []
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    showTitle() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  created() {
    // 页面初始化调用获取角色列表的方法
    this.getRoleList()
    // 页面初始化调用获取企业信息的方法
    this.getCompanyInfo()
  },
  methods: {
    // 获取角色列表的方法
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      this.page.page = newPage // 将新的默认第几页数赋值给pagesize
      this.getRoleList() // 重新渲染页面
    },
    // 获取企业信息的方法
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 根据id删除角色
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗?')
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新渲染页面
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑功能
    async editRole(id) {
      // 根据ID获取角色详情 切赋值
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true // 先请求数据 在打开弹出层这样不会出现闪烁的问题
    },
    // 点击确认提交数据
    async btnOk() {
      try {
        // 先校验下数据
        await this.$refs.roleFormRef.validate()
        // 只有校验通过的情况下 才会执行await的下方内容
        // roleForm这个对象有id就是编辑 没有id就是新增
        if (this.roleForm.id) {
          // 编辑模式
          await updateRole(this.roleForm)
        } else {
          // 新增模式
          await addRole(this.roleForm)
        }
        // 关闭弹出层
        this.showDialog = false
        // 重新渲染页面
        this.getRoleList()
        this.$message.success('操作成功！')
      } catch (error) {
        console.log(error)
      }
    },
    // 关闭弹出层
    btnCancel() {
      // 数据重置
      this.roleForm = {
        name: '',
        description: ''
      }
      // 重置校验数据
      this.$refs.roleFormRef.resetFields()
      // 关闭弹出层
      this.showDialog = false
    },
    // 点击分配权限
    // 获取权限点数据 在点击的时候调用 获取权限点数据
    async assignPerm(id) {
      // 获取的是树形数据
      this.PermList = tranListToTreeData(await getPermissionList(), '0')
      this.roleId = id
      const { permIds } = await getRoleDetail(id)
      this.selectCheck = permIds
      console.log(this.selectCheck)
      this.showPermDialog = true
    },
    async btnPermOk() {
      // 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
      // 提交数据 角色分配  调用tree的方法getCheckedKeys() 获取选中的节点
      // console.log(this.$refs.permTree.getCheckedKeys())
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    btnPermCancel() {
      // 清空数据
      // this.selectCheck = []
      this.showPermDialog = false
    }
  }
}
</script>

<style></style>
