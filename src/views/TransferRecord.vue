<template>
  <div id="TransferRecord">
    
    <div class="yearAndBage">
      <div class="year">
        <icon-left-c theme="outline" size="20" fill="#11998e" :strokeWidth="3" @click="yearChange('min')"/>
        <div class="text">{{year}}</div>
        <icon-right-c theme="outline" size="20" fill="#11998e" :strokeWidth="3" @click="yearChange('add')"/>
      </div>
      <div class="bage">
        <div class="item">
          <div class="legend" style="background-color: #00c6ff"></div>
          <div class="text">调水进行中</div>
        </div>

        <div class="item">
          <div class="legend" style="background-color: #38ef7d"></div>
          <div class="text">调水已完成</div>
        </div>
      </div>
    </div>

    <div class="card" v-for="(record,index) in recordList" :key="record.reg_cd">
      <!-- <div class="status">
        <van-tag type="success" v-if="record.status === '6'">已结束</van-tag>
        <van-tag type="primary" v-else>进行中</van-tag>
      </div> -->

      <div class="recordInfo">
        <div :class="['no',(record.status === '7')?'noFinish':'noProcess']">{{index+1}}</div>
        <div class="item">
          <div class="lable">开始时间</div>
          <div class="value">{{record.reg_start_time}}</div>
        </div>

        <div class="item">
          <div class="lable">结束时间</div>
          <div class="value">{{(record.status !== '7')?'——':record.reg_end_time}}</div>
        </div>

        <div class="item">
          <div class="lable">调水总量</div>
          <div class="value">{{record.totalWw}}(万m³)</div>
        </div>


      </div>
      <van-divider />

      <template v-if="record.collapse">
        <div class="dailyWaterVol">
          <div class="tableHead">
            <div v-for="(col,index) in dailyWaterVolume.colums" :key="index" :style="`width: ${col.width}px;`">{{col.title}}</div>
          </div>

          <div class="row" v-for="(row,index) in dailyWaterVolume.data" :key="index">
            <div v-for="(col,index) in dailyWaterVolume.colums" :key="index" :style="`width: ${col.width}px;`">{{row[col.dataIndex]}}</div>
          </div>
          <!-- {{dailyWaterVolume.data}} -->

        </div>
        <van-divider />

      </template>

      <div class="btnArea">
        <van-button type="default" @click="foldItem(record)">
          <component :is="(record.collapse)?'icon-up-c':'icon-down-c'" theme="outline" size="16" fill="#969696" :strokeWidth="3"/>
          每日水量</van-button>
        <van-button type="default" @click="toCommand(record)">调水过程</van-button>
      </div>
      <!-- {{record}} -->

    </div>
    
  </div>
</template>

<script>
import { Divider, Button  } from 'vant';

import { transferRecordList, transferRecordDetail } from "@/network/transferRecord.js";

export default {
  name: "TransferRecord",
  props: {},
  components: {
    [Divider.name]: Divider,
    [Button.name]: Button
  },
  data() {
    return {
      loading: false,
      recordList: [],
      year: this.$dayjs().format("YYYY"),
      dailyWaterVolume: {
        colums: [
          { title: '时间', dataIndex: 'ts', width: '100' },
          { title: '固镇站', dataIndex: 'gzbz', width: '50' },
          { title: '娄宋站', dataIndex: 'lsbz', width: '50' },
          { title: '宿州站', dataIndex: 'szbz', width: '50' },
          { title: '四铺站', dataIndex: 'spbz', width: '50' },
        ],
        data: []
      },
    }
  },
  methods: {
    getTransferRecordList() {
      this.loading = true;
      transferRecordList(this.transferRecordList_params).then(res => {
        if (res.code === "1") {
          this.recordList = res.data.map(ele => {
            ele.reg_start_time = this.$dayjs(ele.reg_start_time).format("MM月DD日");
            ele.reg_end_time = this.$dayjs(ele.reg_end_time).format("MM月DD日");
            ele.collapse = false;
            return ele;
          });
        }
      }).finally(() => {
        this.loading = false;
      })
    },

    getTransferRecordDetail(item) {
      transferRecordDetail(this.transferRecordDetailParams(item)).then(res => {
        this.dailyWaterVolume.data = res.data;
      })
    },

    foldItem(item) {
      item.collapse = !item.collapse;
      this.getTransferRecordDetail(item);
    },

    toCommand(record) {
      this.$store.commit('command/setRegData', record)

      this.$router.push({path: "/command"})
    },

    yearChange(type) {
      if (type === "min") {
        (this.year <= 2020)?null:this.year--
      }

      if (type === "add") {
        (this.year >= Number(this.$dayjs().format('YYYY')))?this.year = Number(this.$dayjs().format('YYYY')):this.year++
      }

      if (type === "thisYear") {
        this.year = Number(this.$dayjs().format('YYYY'))
      }

      this.getTransferRecordList();
    }
  },
  mounted() {
    this.getTransferRecordList();
  },
  computed: {
    transferRecordList_params: function () {
      return {
        action: "regulationList",
        line_cd: "7f73d92fd9bc4d6fad84f2311d96fbaf",
        year: this.year

      }
    },
    transferRecordDetailParams: function () {
      return function(item){
        return {
          action: "regulationStationWwm",
          regCd: item.reg_cd
        }
      }
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#TransferRecord{
  margin-bottom: 30px;
  // 穿透覆盖
  ::v-deep .van-divider {
    margin: 10px 0;
  }
}

.yearAndBage {
  margin: 10px 10px 0px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .year {
    box-shadow: 0px 0px 15px #0000000d;
    background-color: #fff;
    padding: 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    .text {
      line-height: 23px;
      font-size: 20px;
      font-weight: 700;
      margin: 0px 10px;
      background: linear-gradient(61deg, #11998e, #38ef7d);
      color: transparent;
      background-clip: text;
      -webkit-background-clip: text;
    }
  }

  .bage{
    box-shadow: 0px 0px 15px #0000000d;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: calc(100% - 125px - 30px);
    background-color: #fff;
    padding: 10px;
    border-radius: 5px;
    .item {
      display: flex;
      align-items: center;
      .legend{
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
      }
      .text{
        font-size: 14px;
        line-height: 23px;
        color: #646566;
        
      }
    }
  }

}

.card {
  margin: 10px 10px 0px 10px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0px 0px 15px #0000000d;
  position: relative;
  .status {
    position: absolute;
    top: 0px;
    right: 0px;
  }

  .recordInfo{
    display: flex;
    padding-top: 10px;
    justify-content: space-around;
    align-items: center;

    .no {
      // margin-left: 10px;
      width: 20px;
      text-align: center;
      font-size: 25px;
      font-weight: 700;
      color: transparent;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent; 
    }

    .noProcess {
      background-image: -webkit-linear-gradient(0deg,#0072ff,#00c6ff);
    }

    .noFinish {
      background-image: -webkit-linear-gradient(0deg,#11998e,#38ef7d);
    }

    .item {
      width: 85px;
    }

    .lable{
      font-size: 12px;
      color: #969696;
    }
    .value {
      font-size: 16px;
      color: #3d3d3d;
    }
  }

  .dailyWaterVol{
    padding: 0 10px;

    .tableHead {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 15px;
      line-height: 26px;
      // padding: 10px 0;
      color: #646566;
      // font-weight: 700;
      border-bottom: 1px solid #d3d3d3bb;

    }

    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      line-height: 20px;
      padding: 5px 0;
      color: #969799;
    }

    .row:not(:last-of-type) {
      border-bottom: 1px solid #ebedf082;
    }
  }

  .btnArea {
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}
</style>