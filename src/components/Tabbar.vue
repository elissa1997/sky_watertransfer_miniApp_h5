<template>
  <div id="Tabbr">
    <van-tabbar v-model="active" :safe-area-inset-bottom="true">
      <!-- <van-tabbar-item name="home" @click="gotowx">
        <span>主页</span>
        <template #icon>
          <icon-home theme="outline" size="24"/>
        </template>
      </van-tabbar-item> -->
      <van-tabbar-item name="overview" @click="goto('/overview')">
        <span>概览</span>
        <template #icon>
          <icon-page-template theme="outline" size="24"/>
        </template>
      </van-tabbar-item>
      <van-tabbar-item name="live" @click="goto('/livedata')">
        <span>实时数据</span>
        <template #icon>
          <icon-electrocardiogram theme="outline" size="24"/>
        </template>
      </van-tabbar-item>
      <van-tabbar-item name="record" @click="goto('/transferrecord')">
        <span>调水记录</span>
        <template #icon>
          <icon-list-view theme="outline" size="24"/>
        </template>
      </van-tabbar-item>
      <van-tabbar-item name="my" @click="goto('/my')">
        <span>我的</span>
        <template #icon>
          <icon-user theme="outline" size="24"/>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant';
import wx from 'weixin-js-sdk'
export default {
  name: "Tabbr",
  props: {},
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
  },
  data() {
    return {
      active: 1
    }
  },
  methods: {
    goto(path) {
      this.$router.replace({
        path
      })
    },


  },
  mounted() {

  },
  watch: {
   $route: {
     handler:  function (val, oldVal){
       if (this.active !== val.meta.icon) {
         this.active = val.meta.icon
       }
     },
     deep:  true
   }
  }
}
</script>
<style lang="scss" scoped>
#Tabbr{
}

::v-deep .van-tabbar--fixed {
  box-shadow: 0px 2px 10px #00000021;
}
</style>