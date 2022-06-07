<template>
  <div id="OverView">
    <div class="card overviewCover" @click="openImgPreView('overview')">
      <div class="lable">
        <span>概化图</span>
        <span><icon-zoom-in theme="outline" :strokeWidth="3"/></span>
      </div>
    </div>

    <div class="card planCover" @click="openImgPreView('plan')">
      <div class="lable">
        <span>调水方案</span>
        <span><icon-zoom-in theme="outline" :strokeWidth="3"/></span>
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';
export default {
  name: "OverView",
  props: {},
  components: {},
  data() {
    return {}
  },
  methods: {
    openImgPreView(type) {
      if (type === 'overview') {
        ImagePreview(this.overViewUrl);
      }else if (type === 'plan') {
        ImagePreview(this.planUrl);
      }
    }
  },
  mounted() {
    },
  computed: {
    overViewUrl: function() {
      return [process.env.VUE_APP_DIST+"dist/images/Huai_NorthTransfer_overview_v.jpg"];
    },
    planUrl: function() {
      let planUrl = [];
      let base = process.env.VUE_APP_DIST+"dist/pdf/transfer_plan_img/NO_2019_652_water_transfer_program_"
      for (let i = 1; i <= 12; i++) {
        if (i<10) {
          planUrl.push(base+"0"+i+".jpg");
        }else{
          planUrl.push(base+i+".jpg");
        }
      }
      return planUrl;
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#OverView{
  margin-bottom: 30px;
}

.card {
  margin: 10px 10px 0px 10px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0px 0px 10px #0000004a;
  position: relative;
  .lable {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    position: absolute;
    bottom: 0px;
    width: calc(100% - 30px);
    padding: 20px 15px;
    background-color: #050e073b;
    backdrop-filter: blur(3px);
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    color: rgb(250, 250, 250);
    text-shadow: 0px 0px 5px #00000075;
    align-items: flex-end;
  }
}

.overviewCover {
  background-image: url("/dist/images/Huai_NorthTransfer_overview_cover.jpg");
  background-size: cover;
  background-position: center;

  height: 200px;
  // width: 100%;
}

.planCover {
  background-image: url("/dist/pdf/transfer_plan_img/NO_2019_652_water_transfer_program_01.jpg");
  background-size: cover;
  background-position: center;

  height: 200px;
}
</style>