<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条数据</span>
        <template slot="after">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
          >导入</el-button>
          <el-button
            size="small"
            type="danger"
            @click="excelDate"
          >导出</el-button>
          <el-button
            size="small"
            type="primary"
            @click="showDialog = true"
          >新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 sortable上下排序-->
      <el-card :loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column align="center" label="头像">
            <template v-slot="{ row }" label="头像">
              <img
                v-imagerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto"
                alt=""
                style="border-radios: 50%; width: 100px; height: 100px; padding: 10px"
                @click="showCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" :sort-method="sortable" />
          <el-table-column
            label="聘用形式"
            sortable
            prop="formOfEmployment"
            :formatter="formatEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <!-- 针对入职时间，我们可以采用**作用域插槽**进行处理针对入职时间，
            我们可以采用**作用域插槽**进行处理 -->
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column
            label="账户状态"
            align="center"
            sortable=""
            prop="enableState"
          >
            <template v-slot="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`employees/detail/${row.id}`)"
              >查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteEmployee(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            :current-page="page.page"
            :page-size="page.size"
            :total="page.total"
            layout="prev, pager, next"
            @current-change="changePage"
          />
        </el-row>
      </el-card>

    </div>
    <!-- .sync 修饰符 是子组件改变父组件数据的一个语法糖 -->
    <add-employless :show-dialog.sync="showDialog" />
    <el-dialog
      title="二维码展示"
      :visible.sync="showCodeDialog"
    >
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <assign-role ref="assignRef" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import QrCode from 'qrcode'
// 导入员工综合的列表接口
import { getEmployeeList, delEmployee } from '@/api/employees'
// 导入枚举数据
import EmployeeEnum from '@/api/constant/employees'
import addEmployless from './components/add-employess'
import AssignRole from './components/assign-role'
import { formatDate } from '@/filters'
export default {
  components: {
    addEmployless,
    AssignRole
  },
  data() {
    return {
      loading: false, // 加载进度关闭
      page: {
        page: 1, // 当前页数
        size: 10, // 每页多少条
        total: 0 // 总共条目数
      },
      userId: '',
      showDialog: false, // 默认弹出层隐藏
      list: [], // 获取的员工综合列表数据
      showCodeDialog: false, // 展示二维码弹出层显示与隐藏
      showRoleDialog: false // 展示角色弹出层显示隐藏
    }
  },
  computed: {},
  created() {
    // 调用获取员工综合列表的方法
    this.getEmployeeList()
  },
  methods: {
    // 获取员工综合列表
    async getEmployeeList() {
      // 加载开始
      this.loading = true
      const { rows, total } = await getEmployeeList(this.page)
      this.list = rows
      this.page.total = total
      this.loading = false // 加载进度关闭
    },
    // 切换页数时 更新数据
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 要去找1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除功能
    async deleteEmployee(id) {
      try {
        await this.$confirm('您确认删除该员工吗？')
        await delEmployee(id)
        this.$message.success('删除员工成功！')
        this.getEmployeeList() // 重新渲染
      } catch (error) {
        console.log(error)
      }
    },
    // 导出excel
    excelDate() {
      // 表头对应关系
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        //  excel是引入文件的导出对象
        // 导出  header从哪里来
        // data从哪里来
        // 现在没有一个接口获取所有的数据
        // 获取员工的接口 页码 每页条数    100   1 10000
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total
        })
        console.log(rows)
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data: data,
          filename: '员工资料表',
          multiHeader, // 复杂表头项
          merges // 合并选项
        })

        // excel 是引入文件的 导出对象
        // excel.export_json_to_excel({
        //   header: ['姓名', '工资'], // 表头必填
        //   data: [['张三', 4000], ['李四', 5000]], // 导出的具体数据
        //   filename: '员工工资表', // 导出的文件名
        // })
        /*
          [{username: '张三',mobile: 13112345678}]  => [[]]
          要转化 数据结构 还有和表头的顺序对应上
          要求转出的标题是中文
        */
      })
    },
    /*
        将表头数据和数据进行对应
        [{}] => [[]]
    */
    formatJson(headers, rows) {
      /*
        return rows.map(item => {
          item是一个对象 { mobile：123111, username: '张三'}
          ['手机号', '姓名', '入职日期'。。。。]
          return Object.keys(headers).map(key => {
            return item[headers[key]]
          })
          ['132', '张三', '']
        })

        首先通过map数组方法得到新的数组方法 第一次得到 每一行的数据 username: "hb"
        workNumber: "9000" 第二次遍历取出设置好的对应中文属性名 [headers[key]] 就是每个值也就是对应的英文
        刚好数据rows的对应的英文 就是属性名 item[headers[key]] 因此就对应上了 获取到了 => 值 => 文吉星
      */
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          // 时间日期格式化
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 拿到聘用形式的id 找到对应的id 返回这个对象
            const obj = EmployeeEnum.hireType.find(
              obj => obj.id === item[headers[key]]
            )
            return obj ? obj.value : '未知'
          } else {
            return item[headers[key]]
          }
        })
      })
    },
    // 点击获取二维码
    showCode(url) {
      if (url) {
        this.showCodeDialog = true // 展示弹出层 数据跟新了 但是还没有渲染
        //  因为vue 页面渲染是异步 nextTick 微任务 可以等待页面渲染完了再去跟新数据
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后执行
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url)
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传用户头像')
      }
    },
    // 点击展示弹出层且传值
    editRole(id) {
      this.$refs.assignRef.getUserDetailById(id) // 父组件调用子组件方法
      this.userId = id
      this.showRoleDialog = true
    },
    sortable(a, b) {
      // console.log(a, b)
      return parseInt(a.workNumber) - parseInt(b.workNumber)
    }
  }
}
</script>

<style></style>
