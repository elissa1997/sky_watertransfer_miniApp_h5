import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/transferrecord'
  },
  {
    path: '/overview',
    name: 'OverView',
    meta: {icon: 'overview'},
    component: () => import('@/views/OverView.vue')
  },
  {
    path: '/livedata',
    name: 'LiveData',
    meta: {icon: 'live'},
    component: () => import('@/views/LiveData.vue')
  },
  {
    path: '/transferrecord',
    name: 'TransferRecord',
    meta: {icon: 'record'},
    component: () => import('@/views/TransferRecord.vue')
  },
  {
    path: '/command',
    name: 'Command',
    component: () => import('@/views/Command/Index.vue'),
    children: [

      {
        path: 'inspection',
        name: 'c-inspection',
        component: () => import('@/views/Command/Inspection.vue'),
        children: [
          {
            path: '',
            redirect: 'list'
          },

          {
            path: 'list',
            name: 'c-i-List',
            meta: {icon: 'record'},
            component: () => import('@/components/command/listInspection.vue'),
          },
          {
            path: 'detail',
            name: 'c-i-Detail',
            meta: {icon: 'record'},
            component: () => import('@/components/command/detailInspection.vue'),
          },
          {
            path: 'add',
            name: 'c-i-Add',
            meta: {icon: 'record'},
            component: () => import('@/components/command/addInspection.vue'),
          },
          {
            path: 'reply',
            name: 'c-i-Reply',
            meta: {icon: 'record'},
            component: () => import('@/components/command/replyInspection.vue'),
          }
        ]
      },

      {
        path: 'execute',
        name: 'c-execute',
        component: () => import('@/views/Command/Execute.vue'),
        children: [
          {
            path: '',
            redirect: 'list'
          },

          {
            path: 'list',
            name: 'c-e-List',
            meta: {icon: 'record'},
            component: () => import('@/components/command/listExecute.vue'),
          },
          {
            path: 'detail',
            name: 'c-e-Detail',
            meta: {icon: 'record'},
            component: () => import('@/components/command/detailExecute.vue'),
          },
          {
            path: 'add',
            name: 'c-e-Add',
            meta: {icon: 'record'},
            component: () => import('@/components/command/addExecute.vue'),
          },
          {
            path: 'reply',
            name: 'c-e-Reply',
            meta: {icon: 'record'},
            component: () => import('@/components/command/replyExecute.vue'),
          }
        ]
      },

      {
        path: 'watervol',
        name: 'c-watervol',
        component: () => import('@/views/Command/WaterVol.vue'),
        children: [
          // {
          //   path: '',
          //   redirect: 'add'
          // },

          {
            path: 'list',
            name: 'c-w-List',
            meta: {icon: 'record'},
            component: () => import('@/components/command/listWaterVol.vue'),
          },
          {
            path: 'update',
            name: 'c-w-Update',
            meta: {icon: 'record'},
            component: () => import('@/components/command/updateWaterVol.vue'),
          },
          {
            path: 'add',
            name: 'c-w-Add',
            meta: {icon: 'record'},
            component: () => import('@/components/command/addWaterVol.vue'),
          },
        ]
      }
    ]
  },
  {
    path: '/my',
    name: 'My',
    meta: {icon: 'my'},
    component: () => import('@/views/My.vue')
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('@/views/logout.vue')
  }
]


const router = new VueRouter({
  base: '/miniapp/',
  mode: 'history',
  routes
})

export default router
