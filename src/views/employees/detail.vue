<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <el-form
              ref="userInfoRef"
              :model="userInfo"
              :rules="rules"
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
            >
              <el-form-item label="姓名" prop="username">
                <el-input
                  v-model="userInfo.username"
                  style="width:300px"
                /></el-form-item>
              <el-form-item label="密码" prop="password2">
                <el-input
                  v-model="userInfo.password2"
                  style="width:300px"
                  type="password"
                /></el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="small"
                  @click="saveUser"
                >保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 放置个人详情 -->
            <!-- <user-info /> -->
            <!-- vue.js中内置了一个 组件component 可以任何形式 动态组件-->
            <component :is="userComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <component :is="jopComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
/*
这里有个缺陷，接口中读取的是后端的密文，我们并不能解密，所以当我们没有任何修改就保存时，
会校验失败，因为密文超过了规定的12位长度，为了真的修改密码，我们设定了一个临时的字段
**password2**，用它来存储我们的修改值，最后保存的时候，把**password2**传给**password**
*/
// 导入员工基本信息接口
import { getUserDetailById } from '@/api/user'
// 导入保存员工基本信息接口
import { saveUserDetailById } from '@/api/employees'
import userInfo from './components/user-info'
import jobInfo from './components/job-info'
export default {
  name: '',
  components: {
    userInfo,
    jobInfo
  },
  props: {},
  data() {
    return {
      userComponent: 'userInfo',
      jopComponent: 'jobInfo',
      // 用户信息数据对象
      userInfo: {
        username: '',
        password2: '' // 为什么叫password2 因为读取出来的password是密文
      },
      // 用户的id
      userId: this.$route.params.id,
      // 规则
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度-9位', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    // 调用获取员工信息的方法
    this.getUserDetailById()
  },
  mounted() {},
  methods: {
    // 获取员工的信息方法
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    // 保存修改的信息
    async saveUser() {
      try {
        // 校验表单 提交前
        await this.$refs.userInfoRef.validate()
        // 将新密码的值替换原密码的值
        await saveUserDetailById({
          ...this.userInfo,
          password: this.userInfo.password2
        })
        this.$message.success('保存信息成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
