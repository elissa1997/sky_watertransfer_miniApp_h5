<template>
  <div id="LiveData">
    <van-tabs v-model="active" color="#52b829">
      <div slot="nav-right" class="refresh"><van-button type="primary" @click="getLiveData">刷新</van-button></div>
      <van-tab title="大型闸站信息">

        <!-- 闸站卡片 -->
        <template v-if="!liveData.gate.length">
          <div class="card">
            <div class="head">
              <span class="name">加载中...</span>
            </div>

            <div class="data">
              <van-skeleton title :row="3" />
            </div>
            
          </div>
        </template>
        <template v-else>
          <div class="card" v-for="gate in liveData.gate" :key="gate.FID">
            <div class="head">
              <span class="name">{{gate.name}}</span>
              <span class="time">{{gate.tm}}</span>
            </div>

            <div class="data">

              <div class="item">
                <span class="label">闸上水位</span>
                <span class="value">{{gate.z}}</span>
              </div>
              <div class="item">
                <span class="label">闸下水位</span>
                <span class="value">{{gate.dwz}}</span>
              </div>
              <div class="item">
                <span class="label">流量</span>
                <span class="value">{{gate.q}}</span>
              </div>
              <div class="item valignTop">
                <span class="label">闸门</span>
                <span class="value">{{gate.gateH}}</span>
              </div>
            </div>
            
          </div>
        </template>

      </van-tab>

      <van-tab title="泵站信息">

        <!-- 泵站卡片 -->
        <template v-if="!liveData.pump.length">
          <div class="card">
            <div class="head">
              <span class="name">加载中...</span>
            </div>

            <div class="data">
              <van-skeleton title :row="3" />
            </div>
            
          </div>
        </template>
        <template v-else>
          <div class="card" v-for="pump in liveData.pump" :key="pump.FID">
            <div class="head">
              <span class="name">{{pump.name}}</span>
              <span class="time">{{pump.tm}}</span>
            </div>

            <div class="data">

              <div class="item">
                <span class="label">上游水位</span>
                <span class="value">{{pump.z}}</span>
              </div>
              <div class="item">
                <span class="label">下游水位</span>
                <span class="value">{{pump.dwz}}</span>
              </div>
              <div class="item">
                <span class="label">流量</span>
                <span class="value">{{pump.mpQi}}</span>
              </div>
              <div class="item">
                <span class="label">水量</span>
                <span class="value">{{pump.mpQacc}}</span>
              </div>
              <div class="item">
                <span class="label">开机台数</span>
                <span class="value">{{pump.omcn}}</span>
              </div>
              <div class="item valignTop">
                <span class="label">开机功率</span>
                <span class="value">{{pump.omPwr}}</span>
              </div>
            </div>
            
          </div>
        </template>

      </van-tab>

    </van-tabs>

  </div>
</template>

<script>
import { Skeleton, Tab, Tabs, Button } from 'vant';
import { live } from "@/network/liveData.js";

export default {
  name: "LiveData",
  props: {},
  components: {
    [Skeleton.name]: Skeleton,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Button.name]: Button
  },
  data() {
    return {
      active: 0,
      liveData: {
        gate: [],
        pump: [],
      }
    }
  },
  methods: {
    getLiveData() {
      this.liveData.gate = [];
      this.liveData.pump = [];
      let gate = live(this.getLiveData_params.gate);
      let pump = live(this.getLiveData_params.pump);
      Promise.all([gate, pump]).then(res => {
        res[0].source.forEach(element => {
          this.liveData.gate.push(element.attributes);
        });
        this.formatGateStationList();
        this.resortGateStationList();
        res[1].source.forEach(element => {
          this.liveData.pump.push(element.attributes);
        });
        this.formatPumpStationList();
        this.resortPumpStationList();
      });
    },

    // 格式化闸站数据
    formatGateStationList() {
      this.liveData.gate.map(ele => {
        ele.tm = this.$dayjs(ele.tm).format("MM-DD HH:mm");
        ele.z = parseFloat(ele.z).toFixed(2) + "m";
        ele.dwz = parseFloat(ele.dwz).toFixed(2) + "m";
        ele.q = parseFloat(ele.q).toFixed(2) + "m³/s";
        return ele;
      })
    },

    // 手动指定闸站顺序
    resortGateStationList() {
      let manual = ["何巷闸","新胡洼闸","西坝口闸"].reverse();
      manual.forEach(name => {
        this.liveData.gate.map((item,index) => {
          if(item.name == name){
              this.liveData.gate.unshift(this.liveData.gate.splice(index , 1)[0]);
          }
        })
      })
    },
    // 格式化泵站数据
    formatPumpStationList() {
      this.liveData.pump.map(ele => {
        ele.tm = (ele.tm !== "-")?this.$dayjs(ele.tm).format("MM-DD HH:mm"):"-";
        ele.z = (ele.z !== "-")?parseFloat(ele.z).toFixed(2) + "m":"-";
        ele.dwz = (ele.dwz !== "-")?parseFloat(ele.dwz).toFixed(2) + "m":"-";
        ele.mpQi = (ele.mpQi !== "-")?parseFloat(ele.mpQi).toFixed(2) + "m³/s":"-";
        ele.mpQacc = (ele.mpQacc !== "-")?(parseFloat(ele.mpQacc)/10000).toFixed(2) + "万m³":"-";
        ele.omcn = (ele.omcn !== "-")?ele.omcn + "台":"-";
        ele.omPwr = (ele.omPwr !== "-")?ele.omPwr + "kW":"-";
        return ele;
      })
    },

    // 手动指定泵站顺序
    resortPumpStationList() {
      // this.liveData.pump.sort((a,b)=>{
      //   let t1 = this.$dayjs(a.tm, 'MM-DD HH:mm');
      //   let t2 = this.$dayjs(b.tm, 'MM-DD HH:mm');
      //   return t2-t1;
      // })
      let manual = ["固镇泵站","娄宋泵站","宿州泵站","四铺泵站","侯王泵站","贾窝泵站","岱山口泵站"].reverse();
      manual.forEach(name => {
        this.liveData.pump.map((item,index) => {
          if(item.name == name){
              this.liveData.pump.unshift(this.liveData.pump.splice(index , 1)[0]);
          }
        })
      })
    },

  },
  mounted() {
    this.getLiveData();
  },
  computed: {
    getLiveData_params: function (params) {
      return {
        gate: {
          "action": "getAllJsonS4",
          "line_cd": "7f73d92fd9bc4d6fad84f2311d96fbaf",
          "level": 30
        },
        pump: {
          "action": "getAllJsonB4",
          "line_cd": "7f73d92fd9bc4d6fad84f2311d96fbaf",
          "level": 30
        }
      }
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#LiveData{
  margin-bottom: 30px;
}

.refresh {
  display: flex;
  align-items: center;
  margin-right: 5px;
  font-size: 14px;
  color: #646566;

  ::v-deep .van-button {
    height: 30px;
    line-height: 1;
  }
}

.card {
  margin: 10px 10px 0px 10px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0px 0px 15px #0000000d;

  .head {
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

  .data {
    padding: 10px;
    .item {
      font-size: 14px;
      line-height: 28px;
      display: flex;
      align-items: center;
      // justify-content: space-between;
      .label {
        min-width: 90px;
        color: #353535;
      }
      .value {
        max-width: calc(100% - 90px);
        color: #868e96;
      }
    }

    .valignTop {
      align-items: flex-start;

    }
  }
}
</style>