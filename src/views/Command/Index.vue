<template>
  <div id="Command">
  <!-- <van-grid direction="horizontal" :column-num="3">
    <van-grid-item icon="photo-o" text="调水巡查" :to="{path: '/command/inspection' ,query: $route.query}" />
    <van-grid-item icon="photo-o" text="实施调水" :to="{path: '/command/execute' ,query: $route.query}"/>
    <van-grid-item icon="photo-o" text="文字" />
  </van-grid> -->
  <div class="steps">
    <div class="item" @click="stepChange(0)" :class="{active: step===0}">调水巡查</div>
    <div class="item" @click="stepChange(1)" :class="{active: step===1}">实施调水</div>
    <div class="item" @click="stepChange(2)" :class="{active: step===2}">
      {{($store.state.user.info.type === "E")?'水量信息':'信息上报'}}
    </div>
  </div>

  <router-view/>
  </div>
</template>

<script>

export default {
  name: "Command",
  props: {},
  components: {

  },
  data() {
    return {
      step: 0,
    }
  },
  methods: {
    // 步骤切换
    stepChange(num) {
      this.step = num;
    }
  },
  mounted() {
    // this.regCdObj = this.$route.query.regcd;
  },
  watch: {
    step: {
      handler(newVal, oldVal) {
        if (newVal === 0) { this.$router.push({path: '/command/inspection'})}
        if (newVal === 1) { this.$router.push({path: '/command/execute'})}
        if (newVal === 2) { this.$router.push({path: '/command/watervol'})}
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
#Command{

}

.steps {
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: #505050;
  background-color: #fff;

  .item {
    padding: 10px 0 7px 0;
    border-bottom: 3px solid #52b82900;
    font-size: 14px;
    font-weight: 600;

  }

  .active {
    border-bottom: 3px solid #52b829;
    // background-image: -webkit-linear-gradient(90deg, #51b82966 0, #51b82800 18%, #51b82800 100%);
    // background-image: -moz-linear-gradient(0deg, #51b82966 0, #51b82800 18%, #51b82800 100%);
    // background-image: linear-gradient(0deg, #51b82966 0, #51b82800 18%, #51b82800 100%);
  }
}
</style>