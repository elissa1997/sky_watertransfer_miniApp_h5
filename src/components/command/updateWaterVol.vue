<template>
  <div id="updateWaterVol">
    <div class="warp" v-if="record">
      <van-field v-model="record.unitName" label="测站名称" placeholder="测站名称" readonly>
      </van-field>

      <van-field v-model="formData.upstream_water_level" label="上游水位" placeholder="上游水位" >
        <div slot="extra">(m)</div>
      </van-field>

      <van-field v-model="formData.downstream_water_level" label="下游水位" placeholder="下游水位" >
        <div slot="extra">(m)</div>
      </van-field>

      <van-field v-model="formData.discharge" label="引流量" placeholder="引流量" >
        <div slot="extra">(m³/s)</div>
      </van-field>

      <van-field v-model="formData.open" label="开启情况" placeholder="开启情况" >
      </van-field>

      <van-field v-model="formData.station_ww" label="累计引提水量" placeholder="累计引提水量" >
        <div slot="extra">(万m³)</div>
      </van-field>

      <van-field v-model="formData.ts" label="填报时间" placeholder="填报时间" readonly @click="dateSelectShow=true">
      </van-field>
      

      <!-- {{record}} -->

    </div>

    <div class="btnGroup">
      <van-button type="primary" block @click="updateConfirml">保存修改</van-button>
      <van-button type="default" block style="margin-top: 10px" @click="updateCancel">取消并返回</van-button>
    </div>

    <van-popup v-model="dateSelectShow" round position="bottom">
      <dateTimeSelect @cancel="dateSelectShow=false" @confirm="dateSelectConfirm" type="date"/>
    </van-popup>
  </div>
</template>

<script>
import { Field, Popup, Button } from 'vant';
import { update } from "@/network/command/reportWaterVol.js";
import dateTimeSelect from "@/components/dateTimeSelect.vue";
export default {
  name: "updateWaterVol",
  props: {},
  components: {
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Button.name]: Button,
    dateTimeSelect
  },
  data() {
    return {
      record: this.$store.state.command.waterVolData,
      dateSelectShow: false,
      formData: {
        sw_cd: this.$store.state.command.waterVolData.sw_cd,
        upstream_water_level: this.$store.state.command.waterVolData.upstream_water_level,
        downstream_water_level: this.$store.state.command.waterVolData.downstream_water_level,
        discharge: this.$store.state.command.waterVolData.discharge,
        open: this.$store.state.command.waterVolData.open,
        station_ww: this.$store.state.command.waterVolData.station_ww,
        ts: this.$store.state.command.waterVolData.ts
      }
    }
  },
  methods: {


    dateSelectConfirm(value) {
      this.formData.ts = value;
      this.dateSelectShow = false;
    },

    // 确认修改
    updateConfirml() {
      update(this.update_params, this.update_data).then(res => {
        if (res.code === "1") {
          this.$notify({ type: 'success', message: '修改成功' });
          this.$router.go(-1);
        }
      })
    },

    // 取消返回
    updateCancel() {
      this.$router.go(-1);
    }
  },
  async mounted() {

  },
  computed: {
    update_params: function () {
      return {
        action: "updateStationWwm",
      }
    },
    update_data: function () {
      return this.formData
    },
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#updateWaterVol{}

.warp {
  margin-top: 10px;
}
.btnGroup {
  margin: 20px 16px 0px 16px;
}
</style>