<template>
  <div id="detailInspection" v-if="detailData">
    <van-cell-group title="巡查信息">
      <div class="info">

        <div class="item">
          <div class="lable">被巡查站点</div>
          <div class="value">{{detailData.receiveUnitName}}</div>
        </div>

        <div class="item">
          <div class="lable">巡查时间</div>
          <div class="value">{{$dayjs(detailData.urgeTime).format('YYYY-MM-DD HH:mm')}}</div>
        </div>

        <div class="item">
          <div class="lable">巡查问题</div>
          <div class="value">{{detailData.problem}}</div>
        </div>

        <div class="item">
          <div class="lable">附件查看</div>
          <div class="value" style="width: 100%;">
            <fileList :fileList="detailData.sendFileList"/>
          </div>
        </div>
        
      </div>
    </van-cell-group>

    <van-cell-group title="反馈信息">
      <div class="info" v-if="detailData.status === '1'">

        <div class="item">
          <div class="lable">反馈内容</div>
          <div class="value">{{detailData.replyContent}}</div>
        </div>

        <div class="item">
          <div class="lable">反馈时间</div>
          <div class="value">{{$dayjs(detailData.replyTime).format('YYYY-MM-DD HH:mm')}}</div>
        </div>

        <div class="item">
          <div class="lable">附件查看</div>

          <div class="value">
            <fileList :fileList="detailData.replyFileList"/>
          </div>
        </div>
        
      </div>

      <van-empty v-else description="暂未反馈" />
      
    </van-cell-group>

    <div class="btnGroup">
      <van-button type="default" block @click="addCancel">返回</van-button>
    </div>
    <!-- {{detailData.id}} -->
  </div>
</template>

<script>
import { Button, Field, CellGroup, Empty } from 'vant';
import fileList from '@/components/fileList.vue';

export default {
  name: "detailInspection",
  props: {},
  components: {
    [Button.name]: Button,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Empty.name]: Empty,
    fileList
  },
  data() {
    return {
      detailData: this.$store.state.command.inspectionData,
      fileSrc: undefined,
      fileType: undefined,
      replyFileSrc: undefined,
      replyFileType: undefined,
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
#detailInspection{
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
      width: calc(100% - 100px);
      color: #969799;
      
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

.btnGroup {
  margin: 20px 16px 0px 16px;
}
</style>