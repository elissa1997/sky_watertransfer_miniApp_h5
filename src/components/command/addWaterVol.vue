<template>
  <div id="addWaterVol">
    <van-notice-bar
      wrapable
      :scrollable="false"
      color="#1989fa" background="#ecf9ff"
    >
      <div slot="default">
        <p><b>上游水位</b>、<b>下游水位</b>、<b>引流量</b>为填报日期 08:00 数据</p>
        <p><b>日水量</b> 为填报日期前一天( 00:00 - 24:00 )累计数据</p>
        <p>若单位下有多个站点，可点击测站名称更换</p>
      </div>
    </van-notice-bar>

    <div class="warp" v-if="station">
      <van-field v-if="station.stationSelected.name" v-model="station.stationSelected.name" label="测站名称" placeholder="点击选择测站" readonly
        @click="station.show = true"
      >
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

      <van-field v-model="formData.station_ww" label="日水量" placeholder="日水量" >
        <div slot="extra">(万m³)</div>
      </van-field>

      <van-field v-model="formData.ts" label="填报时间" placeholder="点击选择填报时间" @click="dateSelectShow=true">
      </van-field>
      
      <!-- {{regCd}}
      <br/>
      {{station}} -->

    </div>

    <div class="btnGroup">
      <van-button type="primary" block @click="addConfirml">确定上报</van-button>
      <van-button type="default" block style="margin-top: 10px" @click="toList">查看已上报记录</van-button>
    </div>

    <van-popup v-model="dateSelectShow" round position="bottom">
      <dateTimeSelect @cancel="dateSelectShow=false" @confirm="dateSelectConfirm" type="date"/>
    </van-popup>

    <van-popup v-model="station.show" round position="bottom" v-if="station.stationList">
      <van-picker
        show-toolbar
        value-key="name"
        :columns="station.stationList"
        @cancel="station.show = false"
        @confirm="stationConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import { Field, Popup, Button, NoticeBar, Picker } from 'vant';
import { publish ,autoWw } from "@/network/command/reportWaterVol.js";
import { receiveUnit } from "@/network/command/receiveUnit.js";
import dateTimeSelect from "@/components/dateTimeSelect.vue";
import { localData, dictTrans } from "@/util/readLocalData.js"

export default {
  name: "addWaterVol",
  props: {},
  components: {
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Button.name]: Button,
    [NoticeBar.name]: NoticeBar,
    [Picker.name]: Picker,
    dateTimeSelect
  },
  data() {
    return {
      lineCd: this.$store.state.command.regData.line_cd,
      regCd: this.$store.state.command.regData.reg_cd,
      dateSelectShow: false,
      station: {
        show: false,
        stcdDict: undefined,
        stationList: undefined,
        stationSelected: {"stcd": "NA", "type": "NA", "name": "获取中"},
      },
      formData: {
        reg_cd: this.$store.state.command.regData.reg_cd,
        station_cd: undefined,
        upstream_water_level: undefined,
        downstream_water_level: undefined,
        discharge: undefined,
        open: undefined,
        station_ww: undefined,
        ts: this.$dayjs().format('YYYY-MM-DD')
      }
    }
  },
  methods: {

    // 日期选择
    dateSelectConfirm(value) {
      this.formData.ts = value;
      this.dateSelectShow = false;
      this.getDataFromTelemetry();
    },

    // 获取当前用户的站点列表
    async getReceiveUnit() {
      this.station.stationList = [];
      if (this.$store.state.user.info) {
        let tempList = undefined;
        await receiveUnit(this.getReceiveUnit_params).then(res => {
          tempList = res.data[0].stationCodeList;
        })

        tempList.forEach(element => {
          let dictItem = dictTrans(this.station.stcdDict, "stcd", element);
          if (dictItem) {
            this.station.stationList.push(dictItem);
          }
        });
        this.station.stationSelected = this.station.stationList[0];
        this.formData.station_cd = this.station.stationSelected.stcd;
      }
    },

    // 站点确认选择
    stationConfirm(value) {
      this.station.stationSelected = value;
      this.formData.station_cd = this.station.stationSelected.stcd;
      this.station.show = false;
    },

    // 从自动监测设备获取数据
    getDataFromTelemetry(){
      this.formData.upstream_water_level = '';
      this.formData.downstream_water_level = '';
      this.formData.discharge = '';
      autoWw(this.getDataFromTelemetry_params).then(res => {
        if (this.station.stationSelected.type === "pump") {
          if (res.status == 200 && res.obj) {
            this.formData.upstream_water_level = res.obj.pPupZ;
            this.formData.downstream_water_level = res.obj.pPuDwZ;
            this.formData.discharge = res.obj.mpQi
          }
        }else{
          if (res.status == 200 && res.obj) {
            this.formData.upstream_water_level = res.obj.upZ;
            this.formData.downstream_water_level = res.obj.dwZ;
            this.formData.discharge = res.obj.gtq
          }
        }
      })
    },

    // 确认修改
    addConfirml() {
      publish(this.publish_params, this.publish_data).then(res => {
        console.log(res);
        if (res.code === "1") {
          this.$notify({ type: 'success', message: '上报成功' });
          this.$router.go(-1);
        }
      })
    },

    // 查看列表
    toList() {
      this.$router.push({name: 'c-w-List'})
    }
  },
  async mounted() {
    this.station.stcdDict = await localData("stcdName");
    await this.getReceiveUnit();
  },
  computed: {
    publish_params: function () {
      return {
        action: "saveStationWwm",
      }
    },
    publish_data: function () {
      return this.formData
    },
    getDataFromTelemetry_params: function (params) {
      return {
        action: (this.station.stationSelected.type === "pump")?"getPumpByStcdTm":"getGateRByStcdTm",
        stcd: this.station.stationSelected.stcd,
        time: this.formData.ts+ " 08"
      }
    },
    getReceiveUnit_params: function (params) {
      return {
        action: "transferUnitList",
        line_cd: this.lineCd,
        unitcode: this.$store.state.user.info.unitCode_
      }
    },
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#addWaterVol{
  ::v-deep .van-notice-bar--wrapable{
    padding: 0 10px;
  }
}

.warp {
  margin-top: 10px;
}
.btnGroup {
  margin: 20px 16px 0px 16px;
}
</style>