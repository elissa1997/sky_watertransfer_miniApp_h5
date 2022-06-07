<template>
  <div id="listWaterVol">
    <div class="selectAndadd">
      <van-button type="info" block @click="station.show = true">
        <div slot="default" class="station">
          <div class="lable">站点选择</div>
          <div class="value">
            <template v-if="station.stationSelected">
              {{station.stationSelected.name}}
            </template>

            <template v-else>
              请点击选择
            </template>
          </div>
        </div>
      </van-button>

      <van-button type="primary" block @click="toAdd" style="margin-top: 10px"  v-if="$hasPermission($store.state.user.info.type, 'BCD')">
        <icon-add-one slot="icon" theme="outline" size="20" fill="#fff" :strokeWidth="3"/>水量上报
      </van-button>
    </div>
    <loading :show="loading"/>

    <!-- {{waterVolData}} -->

    <div class="card" v-for="record in waterVolData" :key="record.id">
      <div class="header">
        <div class="name">
          {{record.unitName}}
        </div>
        <div class="time">
          {{$dayjs(record.ts).format('YYYY-MM-DD')}}
        </div>
      </div>
      <div class="info">
        <div class="item">
          <div class="lable">上游水位</div>
          <div class="value">{{record.upstream_water_level}} m</div>
        </div>
        <div class="item">
          <div class="lable">下游水位</div>
          <div class="value">{{record.downstream_water_level}} m</div>
        </div>
        <div class="item">
          <div class="lable">引流量</div>
          <div class="value">{{record.discharge}} m³/s</div>
        </div>
        <div class="item">
          <div class="lable">开启情况</div>
          <div class="value">{{record.open}}</div>
        </div>
        <div class="item">
          <div class="lable">日水量</div>
          <div class="value">{{parseFloat(record.station_ww).toFixed(2)}} (万m³)</div>
        </div>

      </div>

      <div class="unitGroup">
        <div class="row" v-for="item in record.unitGroup" :key="item.id">
          <div class="item">
            <div class="lable">操作状态</div>
            <div class="value">{{item.operation}}</div>
          </div>
          <div class="item">
            <div class="lable">开机时刻</div>
            <div class="value">{{$dayjs(item.startup_time).format('HH:mm')}}</div>
          </div>
          <div class="item">
            <div class="lable">关机/节点日期</div>
            <div class="value">{{$dayjs(item.shutdown_time).format('MM-DD')}}</div>
          </div>
          <div class="item">
            <div class="lable">关机/节点时刻</div>
            <div class="value">{{$dayjs(item.shutdown_time).format('HH:mm')}}</div>
          </div>
          <div class="item">
            <div class="lable">累计开机</div>
            <div class="value">{{item.hour}}小时{{item.minute}}分钟</div>
          </div>
          <div class="item">
            <div class="lable">机组水量</div>
            <div class="value">{{parseFloat(item.water/10000).toFixed(2)}} (万m³)</div>
          </div>
        </div>
      </div>

      <div class="operate" v-if="$hasPermission($store.state.user.info.type, 'BCD')">
        <van-button plain size="small" block type="info" @click="toUpdate(record)">
          <icon-edit slot="icon" theme="outline" size="20" fill="#1989fa" :strokeWidth="3"/>修改
        </van-button>
      </div>
    </div>


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
import { Button, Tag, Popup, Picker } from 'vant';
import loading from "@/components/public/loading.vue";
import { localData, dictTrans } from "@/util/readLocalData.js"
import { receiveUnit } from "@/network/command/receiveUnit.js";
import { waterVolList } from "@/network/command/reportWaterVol.js"

export default {
  name: "listWaterVol",
  props: {},
  components: {
    [Button.name]: Button,
    [Tag.name]: Tag,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    loading
  },
  data() {
    return {
      loading: false,
      regCd: this.$store.state.command.regData.reg_cd,
      lineCe: this.$store.state.command.regData.line_cd,
      station: {
        show: false,
        stcdDict: undefined,
        stationList: undefined,
        stationSelected: undefined
      },
      waterVolData: []
    }
  },
  methods: {

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
        // this.resortStationList();
        this.station.stationSelected = this.station.stationList[0];
      }
    },

    // 站点确认选择
    stationConfirm(value) {
      this.station.stationSelected = value;
      this.getWaterVol();
      this.station.show = false;
    },

    async getWaterVol() {
      this.loading = true;
      this.waterVolData = [];
      waterVolList(this.getWaterVol_params).then(res => {
        if (res.code === "1" && res.data.length) {
          this.handlerWaterVol(res)
        }
      }).finally(() => {
        this.loading = false;
      })
    },

    toUpdate(record) {
      this.$store.commit("command/setWaterVolData", record);
      this.$router.push({name: 'c-w-Update'})
    },

    toAdd() {
      this.$router.push({name: 'c-w-Add'})
    },


    handlerWaterVol(res) {

      res.data.map(ele => {
        ele.unitName = this.station.stationList.filter(n => n.stcd === ele.station_cd)[0].name
        // console.log(this.waterVolData.findIndex(i => i.sw_cd === ele.sw_cd));
        if (this.waterVolData.findIndex(i => i.sw_cd === ele.sw_cd) === -1) {
          this.waterVolData.push({
            discharge: ele.discharge,
            downstream_water_level: ele.downstream_water_level,
            open: ele.open,
            station_cd: ele.station_cd,
            station_ww: ele.station_ww,
            sw_cd: ele.sw_cd,
            unitName: ele.unitName,
            upstream_water_level: ele.upstream_water_level,
            ts: ele.ts,
            unitGroup: []
          })
        }
          this.waterVolData[this.waterVolData.findIndex(i => i.sw_cd === ele.sw_cd)].unitGroup.push({
            batch_info: ele.batch_info,
            beginTime: ele.beginTime,
            endTime:ele.endTime,
            hour: ele.hour,
            id: ele.id,
            line_cd:ele.line_cd,
            minute: ele.minute,
            operation: ele.operation,
            reg_cd: ele.regCd,
            reg_ext_cd: ele.reg_ext_cd,
            remarks: ele.remarks,
            shutdown_time: ele.shutdown_time,
            startup_time: ele.startup_time,
            water: ele.water,
          })
        
      })

        
    },

  },
  async mounted() {
    this.station.stcdDict = await localData("stcdName");
    await this.getReceiveUnit();
    await this.getWaterVol();
  },
  computed: {
    getReceiveUnit_params: function (params) {
      return {
        action: "transferUnitList",
        line_cd: this.lineCd,
        unitcode: this.$store.state.user.info.unitCode_
      }
    },

    getWaterVol_params: function (params) {
      return {
        action: "stationWwmList",
        reg_cd: this.regCd,
        station_cd: this.station.stationSelected.stcd
      }
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#listWaterVol{
  margin-bottom: 30px;
}

.selectAndadd {
  margin: 10px 10px 0px 10px;
  // display: flex;
  // align-items: center;
  // justify-content: space-between;
}

.station {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .lable {
    // width: 100px;
  }

  .lable::after{
    content: "：";
  }

  .value {
    // color: #969799;
  }
}


.card {
  margin: 10px 10px 0px 10px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0px 0px 15px #0000000d;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ebedf0;
    padding: 10px;
    .name {
      color: #52b829;
      font-weight: 700;
    }
    .time {
      color: #868e96;
    }
  }

  .info {
    padding: 10px;
    border-bottom: 1px solid #ebedf0;

    .item {
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 26px;
      .lable {
        width: 100px;
      }

      .lable::after{
        content: "：";
      }

      .value {
        color: #969799;
      }
    }
  }

  .unitGroup{
    font-size: 14px;
    padding: 10px;
    border-bottom: 1px solid #ebedf0;
    .row{
      display: grid;
      grid-template-columns: repeat(2, 49%);
      grid-row-gap: 5px;
      justify-content: space-between;
      .item {
        display: flex;
        align-items: center;

        // .lable {
        //   width: 100px;
        // }

        .lable::after{
          content: "：";
        }

        .value {
          color: #969799;
        }
      }
    }

    .row:not(:last-of-type) {
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px dashed #e0e0e0;
    }
  }

  .operate {
    padding: 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    // border-bottom: 1px solid #ebedf0;
  }
}
</style>