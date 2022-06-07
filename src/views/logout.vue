<template>
  <div id="logout">
    <!-- <img :src="require('@/assets/loading.gif')"> -->
    <div class="text">登录过期<br/>跳转至登录页</div>
  </div>
</template>

<script>
export default {
  name: "logout",
  props: {},
  components: {},
  data() {
    return {}
  },
  methods: {},
  mounted() {},
  watch: {}
}
</script>
<style lang="scss" scoped>
#logout{
  height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text {
  color: #07c160;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
}
</style>