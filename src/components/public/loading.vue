<template>
  <div id="loading">
    <van-overlay :show="show">
      <div class="wrapper" >
        <van-loading size="24px" vertical>加载中...</van-loading>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { Overlay, Loading } from 'vant'

export default {
  name: "loading",
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  components: {
    [Overlay.name]: Overlay,
    [Loading.name]: Loading
  },
  data() {
    return {}
  },
  methods: {},
  mounted() {},
  watch: {}
}
</script>
<style lang="scss" scoped>
#loading{}

.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>