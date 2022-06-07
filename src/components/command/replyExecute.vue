<template>
  <div id="replyExecute">
    <van-cell-group title="联系信息">
      <van-field v-model="formData.executeUnitName" label="执行单位" />
      <van-field v-model="formData.leader" label="负责人" placeholder="请输入负责人" />
      <van-field v-model="formData.connectPeople" label="接令人" placeholder="请输入接令人" />
      <van-field v-model="formData.operator" label="操作人" placeholder="请输入操作人" />
      <van-field v-model="formData.guarder" label="监护人" placeholder="请输入监护人" />
    </van-cell-group>

    <van-cell-group title="操作情况">
      <van-field v-model="formData.receiveDate" label="接令时间" placeholder="请选择接令时间" 
        @click="datetimePicker.show = true;datetimePicker.type = 'datetime';datetimePicker.to = 'receiveDate'"
      />
      <van-field v-model="formData.startDate" label="开始时间" placeholder="请选择开始时间" 
        @click="datetimePicker.show = true;datetimePicker.type = 'datetime';datetimePicker.to = 'startDate'"
      />
      <van-field v-model="formData.completeDate" label="完成时间" placeholder="请选择完成时间" 
        @click="datetimePicker.show = true;datetimePicker.type = 'datetime';datetimePicker.to = 'completeDate'"
      />
      <van-field v-model="formData.operation" label="操作情况" placeholder="请输入操作情况" rows="2" autosize type="textarea"/>
      <van-field label="完成情况">
        <template #input>
          <van-radio-group v-model="formData.completion" direction="horizontal">
            <div>
              <van-radio checked-color="#52b829" icon-size="18px" name="1">准时完成</van-radio>
              <van-radio checked-color="#52b829" icon-size="18px" name="2" style="margin-top: 5px;">延时完成</van-radio>
            </div>
            <div>
              <van-radio checked-color="#52b829" icon-size="18px" name="3">未完成</van-radio>
              <van-radio checked-color="#52b829" icon-size="18px" name="4" style="margin-top: 5px;">其他</van-radio>
            </div>
          </van-radio-group>
        </template>
      </van-field>
      <van-field v-model="formData.abnormal" label="异常情况" placeholder="若无异常情况可留空" rows="2" autosize type="textarea"/>
      <van-field v-model="formData.contacts" label="联系人员" placeholder="请输入联系人员" />
      <van-field v-model="formData.contactTel" label="联系电话" placeholder="请输入联系电话" />
      <van-field label="文件上传">
        <template #input>
          <van-uploader v-model="formData.fileList" :max-count="1"/>
        </template>
      </van-field>
    </van-cell-group>

    <div class="btnGroup">
      <van-button type="primary" block @click="replyConfirml">确定反馈</van-button>
      <van-button type="default" block style="margin-top: 10px" @click="replyCancel">取消并返回</van-button>
    </div>

    <van-popup v-model="datetimePicker.show" position="bottom">
      <dateTimeSelect :type="datetimePicker.type"
        v-if="datetimePicker.show"
        @confirm="dateConfirm"
        @cancel="datetimePicker.show = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { Button, Field, Radio, RadioGroup, CellGroup, Uploader, Popup } from 'vant';
import { publish } from "@/network/command/execute.js"
import dateTimeSelect from "@/components/dateTimeSelect.vue";

export default {
  name: "replyExecute",
  props: {},
  components: {
    [Button.name]: Button,
    [Field.name]: Field,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [CellGroup.name]: CellGroup,
    [Uploader.name]: Uploader,
    [Popup.name]: Popup,
    dateTimeSelect
  },
  data() {
    return {
      replyData: this.$store.state.command.executeData,
      datetimePicker: {
        show: false,
        type: "datetime",
        to: undefined
      },
      formData: {
        executeUnitCode: this.$store.state.user.info.unitCode_,
        executeUnitName: this.$store.state.user.info.unitName_,
        leader: this.$store.state.user.info.realName_,
        connectPeople: this.$store.state.user.info.realName_,
        operator: this.$store.state.user.info.realName_,
        guarder: this.$store.state.user.info.realName_,
        operation: '',
        receiveDate: this.$dayjs().format('YYYY-MM-DD HH:mm'),
        startDate:'',
        completeDate:'',
        completion:'',
        abnormal:'',
        contacts: this.$store.state.user.info.realName_,
        contactTel:'',
        fileList: []
      },
    }
  },
  methods: {

    dateConfirm(value) {
      this.formData[this.datetimePicker.to] = value
      this.datetimePicker.show = false;
    },

    replyConfirml() {
      const formDataObj = new FormData();
      formDataObj.append('orderId', this.replyData.id);
      formDataObj.append('executeUnitCode', this.formData.executeUnitCode);
      formDataObj.append('executeUnitName', this.formData.executeUnitName);
      formDataObj.append('leader', this.formData.leader);
      formDataObj.append('connectPeople', this.formData.connectPeople);
      formDataObj.append('operator', this.formData.operator);
      formDataObj.append('guarder', this.formData.guarder);
      formDataObj.append('operation', this.formData.operation);
      formDataObj.append('receiveDate', this.formData.receiveDate);
      formDataObj.append('startDate', this.formData.startDate);
      formDataObj.append('completeDate', this.formData.completeDate);
      formDataObj.append('completion', this.formData.completion);
      formDataObj.append('abnormal', this.formData.abnormal);
      formDataObj.append('contacts', this.formData.contacts);
      formDataObj.append('contactTel', this.formData.contactTel);
      this.formData.fileList.forEach(file => {
        formDataObj.append('file', file.file);
      });
      publish({ action: "replyInstruction"}, formDataObj).then(res => {
        if (res.code === "1") {
          this.$notify({ type: 'success', message: '调水指令反馈成功' })
          this.$router.go(-1);
        }
      })
    },

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
#replyExecute{
  margin-bottom: 30px;
}

.btnGroup {
  margin: 20px 16px 0px 16px;
}
</style>