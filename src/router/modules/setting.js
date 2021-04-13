import Layout from '@/layout'
//  {  path: '', component: '' }
// 每个子模块 其实 都是外层是layout  组件位于layout的二级路由里面
// 默认导出路由
export default {
  path: '/setting', // 路由路径
  name: 'settings', // 路由名称
  component: Layout, // 组件
  // 配置二级路由的路由表
  children: [{
    path: '', // 当二级路由什么都不写的时候 表示该路由为当前二级路由的默认路由
    name: 'settings', // 路由名称
    component: () => import('@/views/setting'), // 该路由的组件
    // 路由元信息 就是存储数据的对象 我们可以在这里放置一些信息
    meta: {
      // meta里的属性的信息 是随便定义的 这里为什么用title
      // 因为左侧导航栏会读取我们的路由的meta里面的title作为显示菜单名称
      title: '公司设置',
      icon: 'setting'
    }
  }]
}
