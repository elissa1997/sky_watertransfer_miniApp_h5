<template>
  <div id="WaterVol">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "WaterVol",
  props: {},
  components: {},
  data() {
    return {}
  },
  methods: {},
  mounted() {
    if (this.$hasPermission(this.$store.state.user.info.type, 'AE')) {
      this.$router.push({path: '/command/watervol/list'})
    }else{
      this.$router.push({path: '/command/watervol/add'})
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#WaterVol{}
</style>