<template>
  <div id="listExecute">
    <div class="add">
      <van-button type="primary" block @click="toAdd" v-if="$hasPermission($store.state.user.info.type, 'A')">
        <icon-add-one slot="icon" theme="outline" size="20" fill="#fff" :strokeWidth="3"/>下达调水指令
      </van-button>
    </div>
    <loading :show="loading"/>
    <div class="card" v-for="record in executeData" :key="record.id">
      <div v-if="$store.state.user.info.unitCode_ === record.executeUnitCode || $hasPermission($store.state.user.info.type, 'AE')">
        <div class="info">
          <div class="item">
            <div class="lable">发令单位</div>
            <div class="value">{{record.initUnitName}}</div>
          </div>
          <div class="item">
            <div class="lable">指令任务</div>
            <div class="value">{{record.orderTask}}</div>
          </div>

          <div class="item">
            <div class="lable">执行单位</div>
            <div class="value">{{record.executeUnitName}}</div>
          </div>
          <div class="item">
            <div class="lable">执行时间</div>
            <div class="value">{{$dayjs(record.executeTime).format('YYYY-MM-DD HH:mm')}}</div>
          </div>


          <div class="item">
            <div class="lable">状态</div>
            <div class="value">
              <van-tag :type="(record.zt === '0')?'warning':'success'">{{(record.zt === '0')?'未反馈':'已反馈'}}</van-tag>
            </div>
          </div>
          <div class="item">
            <div class="lable">发令时间</div>
            <div class="value">{{ $dayjs(record.orderDate).format('YYYY-MM-DD')}} {{record.orderTime}}</div>
          </div>
        </div>
        <div class="operate">
          <van-button size="small" type="primary" plain @click="toDetail(record)" style="width:  calc(50% - 10px)">
            <icon-preview-open slot="icon" theme="outline" size="20" fill="#07c160" :strokeWidth="3"/>详情
          </van-button>
          <van-button size="small" type="info" plain @click="toReply(record)" v-if="$hasPermission($store.state.user.info.type, 'BCD') && (record.zt === '0')" style="width:  calc(50% - 10px)">
            <icon-email-push slot="icon" theme="outline" size="20" fill="#1989fa" :strokeWidth="3"/>反馈
          </van-button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { Button, Tag } from 'vant';
import loading from "@/components/public/loading.vue";
import { executeList } from "@/network/command/execute.js";

export default {
  name: "listExecute",
  props: {},
  components: {
    [Button.name]: Button,
    [Tag.name]: Tag,
    loading
  },
  data() {
    return {
      regCd: this.$store.state.command.regData.reg_cd,
      loading: false,
      executeData:[]
    }
  },
  methods: {


    getExecuteList() {
      executeList(this.getExecuteList_params).then(res => {
        if (res.code === "1") {
          this.executeData = res.data;
        }
      }).finally(() => {
        this.loading = false;
      })
    },

    // 函数名统一refreshByClose，供子弹窗关闭后刷新使用
    refreshByClose(){
      this.getExecuteList()
      // console.log("刷新操作");
    },

    toDetail(record) {
      this.$store.commit("command/setExecuteData", record);
      this.$router.push({ name: "c-e-Detail" })
    },
    toReply(record) {
      this.$store.commit("command/setExecuteData", record);
      this.$router.push({ name: "c-e-Reply" })
    },
    toAdd() {
      this.$router.push({path: '/command/execute/add'})
    }
  },
  async mounted() {
    this.getExecuteList();
  },
  computed: {
    getExecuteList_params: function (params) {
      if (this.$store.state.user.info.type === "A") {
        return {
          "action": "instructionList",
          "regCd": this.regCd,
        // "instructionRef.unitCode": this.$store.state.user.info.unitCode_
        }
      }else {
        return {
          "action": "instructionList",
          "regCd": this.regCd,
          "instructionRef.unitCode": this.$store.state.user.info.unitCode_
        }
      }
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#listExecute{
  margin-bottom: 30px;
}
.add {
  margin: 10px 10px 0px 10px;
}
.card {
  margin: 10px 10px 0px 10px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0px 0px 15px #0000000d;
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

  .operate {
    padding: 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    // border-bottom: 1px solid #ebedf0;
  }
}
</style>