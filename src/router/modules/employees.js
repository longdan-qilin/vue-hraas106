import Layout from '@/layout'
//  {  path: '', component: '' }
// 每个子模块 其实 都是外层是layout  组件位于layout的二级路由里面
// 默认导出路由
export default {
  path: '/employees', // 路由路径
  name: 'employees', // 路由名称
  component: Layout, // 组件
  // 配置二级路由的路由表
  children: [{
    path: '', // 当二级路由什么都不写的时候 表示该路由为当前二级路由的默认路由
    name: 'employees', // 路由名称
    component: () => import('@/views/employees'), // 该路由的组件
    // 路由元信息 就是存储数据的对象 我们可以在这里放置一些信息
    meta: {
      // meta里的属性的信息 是随便定义的 这里为什么用title
      // 因为左侧导航栏会读取我们的路由的meta里面的title作为显示菜单名称
      title: '员工管理',
      icon: 'people'
    }
  },
  {
    path: 'detail/:id', // query传参 动态理由传参 没有id传进来 可以给id加 'detail/?'
    component: () => import('@/views/employees/detail'), // 该路由的组件
    // 路由元信息 就是存储数据的对象 我们可以在这里放置一些信息
    hidden: true, // 不在左侧菜单显示
    meta: {
      // meta里的属性的信息 是随便定义的 这里为什么用title
      // 因为左侧导航栏会读取我们的路由的meta里面的title作为显示菜单名称
      title: '员工详情', // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      icon: 'people'
    }
  },
  {
    path: 'print/:id',
    component: () => import('@/views/employees/print'),
    hidden: true,
    meta: {
      title: '打印',
      icon: 'people'
    }
  }
  ]
}

// 当你的访问地址 是 /employees的时候 layout组件会显示 此时 你的二级路由的默认组件 也会显示
/* 上述代码中，我们用到了meta属性，该属性为一个对象，里面可放置自定义属性，主要用于读取一些配置和参数，并且值得**`注意`**的是：我们的meta写了二级默认路由上面，
而不是一级路由，因为当存在二级路由的时候，访问当前路由信息访问的就是**`二级默认路由`** */
