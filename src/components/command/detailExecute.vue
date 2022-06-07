<template>
  <div id="detailExecute" v-if="detailData">
    <van-divider
      content-position="left"
      :style="{ fontSize: '17px', color: '#52b829', borderColor: '#52b829', padding: '0px', marginBottom: '0px' }"
    >
      任务联
    </van-divider>
    <van-cell-group title="基础信息">
      <div class="info">
        <div class="item">
          <div class="lable">指令任务</div>
          <div class="value">{{detailData.orderTask}}</div>
        </div>
        <div class="item">
          <div class="lable">发令单位</div>
          <div class="value">{{detailData.initUnitName}}</div>
        </div>
        <div class="item">
          <div class="lable">指令类型</div>
          <div class="value">
            <span v-if="detailData.orderType === '1'">生产操作</span>
            <span v-if="detailData.orderType === '2'">维修操作</span>
            <span v-if="detailData.orderType === '3'">抢修操作</span>
            <span v-if="detailData.orderType === '4'">应急类</span>
          </div>
        </div>
        <div class="item">
          <div class="lable">执行单位</div>
          <div class="value">{{detailData.executeUnitName}}</div>
        </div>
        <!-- <div class="item">
          <div class="lable">协作部门</div>
          <div class="value">{{detailData.cooperationUnitName}}</div>
        </div> -->
      </div>
    </van-cell-group>

    <van-cell-group title="任务信息">
      <div class="info">
        <div class="item">
          <div class="lable">工程名称</div>
          <div class="value">{{detailData.projectName}}</div>
        </div>
        <div class="item">
          <div class="lable">执行时间</div>
          <div class="value">{{$dayjs(detailData.executeTime).format('YYYY-MM-DD HH:mm')}}</div>
        </div>

      </div>
      <div class="taskWarp">
        <div class="taskRow" v-for="task in detailData.taskList" :key="task.id">
          <div class="item">
            <div class="lable">开停机数</div>
            <div class="value">{{task.onOffNum}}</div>
          </div>
          <div class="item">
            <div class="lable">流量</div>
            <div class="value">{{task.flow}}</div>
          </div>
          <div class="item">
            <div class="lable">水量</div>
            <div class="value">{{task.wv}}</div>
          </div>
        </div>

      </div>
      <div class="info">
        <div class="item">
          <div class="lable">备注</div>
          <div class="value">{{detailData.orderRemark}}</div>
        </div>
        <div class="item">
          <div class="lable">指令人</div>
          <div class="value">{{detailData.orderUser}}</div>
        </div>
        <div class="item">
          <div class="lable">签发人</div>
          <div class="value">{{detailData.issueUser}}</div>
        </div>
      </div>
    </van-cell-group>

    <van-cell-group title="联系信息">
      <div class="info">
        <div class="item">
          <div class="lable">日期</div>
          <div class="value">{{$dayjs(detailData.orderDate).format("YYYY-MM-DD")}}</div>
        </div>
        <div class="item">
          <div class="lable">发令时间</div>
          <div class="value">{{detailData.orderTime}}</div>
        </div>
        <div class="item">
          <div class="lable">调度电话</div>
          <div class="value">{{detailData.orderTel}}</div>
        </div>
        <div class="item">
          <div class="lable">调度传真</div>
          <div class="value">{{detailData.orderFax}}</div>
        </div>
        <div class="item">
        <div class="lable">附件</div>
          <div class="value" style="width: 100%">
            <!-- <img v-if="fileType === 'image'" width="100" height="100" :src="fileSrc" />
            <embed v-if="fileType === 'pdf'" :src="fileSrc" width="100" height="100"> -->
            <fileList :fileList="detailData.sendFileList"/>
          </div>
        </div>
      </div>
    </van-cell-group>

    <van-divider
      content-position="left"
      :style="{ fontSize: '17px', color: '#52b829', borderColor: '#52b829', padding: '0px', marginBottom: '0px' }"
    >
      反馈联
    </van-divider>

    <template v-if="detailData.reply">
    <van-cell-group title="联系信息">
      <div class="info">
        <div class="item">
          <div class="lable">执行单位</div>
          <div class="value">{{detailData.reply.executeUnitName}}</div>
        </div>
        <div class="item">
          <div class="lable">负责人</div>
          <div class="value">{{detailData.reply.leader}}</div>
        </div>
        <div class="item">
          <div class="lable">接令人</div>
          <div class="value">{{detailData.reply.connectPeople}}</div>
        </div>
        <div class="item">
          <div class="lable">操作人</div>
          <div class="value">{{detailData.reply.operator}}</div>
        </div>
        <div class="item">
          <div class="lable">监护人</div>
          <div class="value">{{detailData.reply.guarder}}</div>
        </div>
      </div>
    </van-cell-group>

    <van-cell-group title="操作情况">
      <div class="info">
        <div class="item">
          <div class="lable">完成情况</div>
          <div class="value">
            <span v-if="detailData.reply.completion === '1'">准时完成</span>
            <span v-if="detailData.reply.completion === '2'">延时完成</span>
            <span v-if="detailData.reply.completion === '3'">未完成</span>
            <span v-if="detailData.reply.completion === '4'">其他</span>
          </div>
        </div>
        <div class="item">
          <div class="lable">操作情况</div>
          <div class="value">{{detailData.reply.operation}}</div>
        </div>
        <div class="item">
          <div class="lable">接令时间</div>
          <div class="value">{{$dayjs(detailData.reply.receiveDate).format("YYYY-MM-DD HH:mm:ss")}}</div>
        </div>
        <div class="item">
          <div class="lable">开始时间</div>
          <div class="value">{{$dayjs(detailData.reply.startDate).format("YYYY-MM-DD HH:mm:ss")}}</div>
        </div>
        <div class="item">
          <div class="lable">完成时间</div>
          <div class="value">{{$dayjs(detailData.reply.completeDate).format("YYYY-MM-DD HH:mm:ss")}}</div>
        </div>
        <div class="item">
          <div class="lable">异常情况</div>
          <div class="value">{{detailData.reply.abnormal || '无异常'}}</div>
        </div>
        <div class="item">
          <div class="lable">联系人员</div>
          <div class="value">{{detailData.reply.contacts}}</div>
        </div>
        <div class="item">
          <div class="lable">联系电话</div>
          <div class="value">{{detailData.reply.contactTel}}</div>
        </div>

        <div class="item">
          <div class="lable">附件</div>
          <div class="value" style="width: 100%;">
            <!-- <img v-if="replyFileType === 'image'" width="100" height="100" :src="replyFileSrc" />
            <embed v-if="replyFileType === 'pdf'" :src="replyFileSrc" width="100" height="100"> -->
            <fileList :fileList="detailData.reply.replyFileList"/>

          </div>
        </div>
      </div>
    </van-cell-group>
    </template>

    <van-empty v-else description="暂未反馈" style="background-color: #fff; margin-top: 16px"/>


    <div class="btnGroup">
      <van-button type="default" block @click="addCancel">返回</van-button>
    </div>
  </div>
</template>

<script>
import { Divider, Button, Field, CellGroup, Empty } from 'vant';
import fileList from "@/components/fileList.vue";

export default {
  name: "detailExecute",
  props: {},
  components: {
    [Divider.name]: Divider,
    [Button.name]: Button,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Empty.name]: Empty,
    fileList
  },
  data() {
    return {
      detailData: this.$store.state.command.executeData,
    }
  },
  methods: {

    // 取消
    addCancel() {
      this.$router.go(-1);
    }
  },
  async mounted() {
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#detailExecute{
  margin-bottom: 30px;
}

.info {
  .item {
    position: relative;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 24px;
    .lable {
      width: 100px;
      color: #646566;

    }
  
    .lable::after{
      content: "：";
    }
  
    .value {
      color: #969799;
      max-width: calc(100% - 100px);
    }
  }

  .item:not(:last-of-type)::after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 16px;
    bottom: 0;
    left: 16px;
    border-bottom: 1px solid #ebedf0;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
  }
}

.taskWarp {
  position: relative;
  padding: 10px 16px;
}

.taskRow {
  display: flex;
  border: 1px solid #f7f8fa;
  .item {
    padding: 10px 16px;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    line-height: 24px;
    width: 30%;
    
    .lable {
      width: 100px;
      color: #646566;
    }

    .lable::after{
      content: "：";
    }
  
    .value {
      color: #969799;
    }
  }

}
.taskRow:not(:last-of-type) {
  margin-bottom: 10px;
}

.btnGroup {
  margin: 20px 16px 0px 16px;
}
</style>