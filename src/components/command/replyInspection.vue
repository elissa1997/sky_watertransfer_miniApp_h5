<template>
  <div id="replyInspection">
    <!-- {{replyData}} -->
    
    <van-cell-group title="巡查信息" v-if="replyData">
      <div class="info">

        <div class="item">
          <div class="lable">被巡查站点</div>
          <div class="value">{{replyData.receiveUnitName}}</div>
        </div>

        <div class="item">
          <div class="lable">巡查时间</div>
          <div class="value">{{$dayjs(replyData.urgeTime).format('YYYY-MM-DD HH:mm')}}</div>
        </div>

        <div class="item">
          <div class="lable">巡查问题</div>
          <div class="value">{{replyData.problem}}</div>
        </div>

        <div class="item">
          <div class="lable">附件查看</div>
          <div class="value">
            <fileList :fileList="replyData.sendFileList"/>
          </div>
        </div>
        
      </div>
    </van-cell-group>

    <van-cell-group title="反馈信息">
      <van-field v-model="formData.reply" label="整改情况" placeholder="填写针对问题的整改情况" type="textarea" maxlength="50"/>
      <van-field label="文件上传">
        <template #input>
          <van-uploader v-model="formData.fileList"/>
        </template>
      </van-field>
    </van-cell-group>

    <div class="btnGroup">
      <van-button type="primary" block @click="replyConfirml">确定反馈</van-button>
      <van-button type="default" block style="margin-top: 10px" @click="replyCancel">取消并返回</van-button>
    </div>
  </div>
</template>

<script>
import { Button, Field, Uploader, CellGroup } from 'vant';
import { publish } from "@/network/command/inspection.js";
import fileList from "@/components/fileList.vue";

export default {
  name: "replyInspection",
  props: {},
  components: {
    [Button.name]: Button,
    [Field.name]: Field,
    [Uploader.name]: Uploader,
    [CellGroup.name]: CellGroup,
    fileList
  },
  data() {
    return {
      replyData: this.$store.state.command.inspectionData,
      fileSrc: undefined,
      fileType: undefined,
      formData: {
        reply: undefined,
        fileList: []
      }
    }
  },
  methods: {





    // 确认反馈
    replyConfirml() {
      const formDataObj = new FormData();
      formDataObj.append('id', this.replyData.id);
      formDataObj.append('replyContent', this.formData.reply);
      formDataObj.append('status', "1");
      this.formData.fileList.forEach(file => {
        formDataObj.append('file', file.file);
      });
      publish({ action: "replyUrge"}, formDataObj).then(res => {
        if (res.code === "1") {
          this.$notify({ type: 'success', message: '巡查记录反馈成功' })
          this.$router.go(-1);
        }
      })
    },

    // 取消返回
    replyCancel() {
      this.$router.go(-1);
    }


  },
  async mounted() {
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#replyInspection{
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