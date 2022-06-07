<template>
  <div id="app" class="clearfix">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view class="routerView"/>

    <Tabbar v-if="$route.path != '/logout'"/>
  </div>
</template>

<script>
import Tabbar from "@/components/Tabbar.vue";

export default {
  name: "app",
  components: {
    Tabbar
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
#app {
  // margin-top: 0px;
  background-color: $background-gray;
  min-height: calc(100vh - 50px);
  margin-bottom: 50px;
}

.routerView {
}
</style>
