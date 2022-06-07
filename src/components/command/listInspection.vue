<template>
  <div id="listInspection">
    <div class="add">
      <van-button type="primary" block @click="toAdd"  v-if="$hasPermission($store.state.user.info.type, 'A')">
        <icon-add-one slot="icon" theme="outline" size="20" fill="#fff" :strokeWidth="3"/>添加巡查记录
      </van-button>
    </div>
    <loading :show="loading"/>
    <div class="card" v-for="record in inspectionData" :key="record.id">
      <div v-if="$store.state.user.info.unitCode_ === record.receiveUnitCode || $hasPermission($store.state.user.info.type, 'AE')">
        <div class="info">
          <div class="item">
            <div class="lable">巡查单位</div>
            <div class="value">{{record.urgeUnitName}}</div>
          </div>
          <div class="item">
            <div class="lable">被巡查站点</div>
            <div class="value">{{record.receiveUnitName}}</div>
          </div>
          <div class="item">
            <div class="lable">巡查内容</div>
            <div class="value">{{record.problem}}</div>
          </div>
          <div class="item">
            <div class="lable">状态</div>
            <div class="value">
              <van-tag :type="(record.status === '0')?'warning':'success'">{{(record.status === '0')?'未反馈':'已反馈'}}</van-tag>
              <!-- {{record.status}} -->
            </div>
          </div>
          <div class="item">
            <div class="lable">巡查时间</div>
            <div class="value">{{ $dayjs(record.urgeTime).format('YYYY-MM-DD HH:mm')}}</div>
          </div>
        </div>
        <div class="operate">
          <van-button size="small" type="primary" plain @click="toDetail(record)" style="width: calc(50% - 10px)">
            <icon-preview-open slot="icon" theme="outline" size="20" fill="#07c160" :strokeWidth="3"/>详情
          </van-button>
          <van-button size="small" type="info" plain v-if="$hasPermission($store.state.user.info.type, 'BCD') && record.status === '0'" @click="toReply(record)" style="width:  calc(50% - 10px)">
            <icon-email-push slot="icon" theme="outline" size="20" fill="#1989fa" :strokeWidth="3"/>反馈
          </van-button>
        </div>

      </div>
      <!-- {{record}} -->
    </div>
  </div>
</template>

<script>
import { Button, Tag } from 'vant';
import loading from "@/components/public/loading.vue";
import { inspectionList } from "@/network/command/inspection.js";

export default {
  name: "listInspection",
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
      inspectionData:[]
    }
  },
  methods: {

    // 获取巡查列表
    getInspectionList() {
      // debugger
      this.loading = true;
      inspectionList(this.getInspectionList_params).then(res => {
        if (res.code === "1") {
          this.inspectionData = res.data;
        }
      }).finally(() => {
        this.loading = false;
      })
    },

    // 函数名统一refreshByClose，供子弹窗关闭后刷新使用
    refreshByClose(){
      this.getInspectionList();
    },

    toDetail(record) {
      this.$store.commit("command/setInspectionData", record);
      this.$router.push({ name: "c-i-Detail" })
    },
    toReply(record) {
      this.$store.commit("command/setInspectionData", record);
      this.$router.push({ name: "c-i-Reply" })
    },
    toAdd() {
      this.$router.push({path: '/command/inspection/add'})
    }
  },
  async mounted() {
    this.getInspectionList();
  },
  computed: {
    getInspectionList_params: function (params) {
      return {
        action: "list",
        regCd: this.regCd
      }
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#listInspection{
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
        width: calc(100% - 100px);
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