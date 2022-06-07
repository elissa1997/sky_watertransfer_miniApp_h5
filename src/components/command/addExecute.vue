<template>
  <div id="addExecute">
    <loading :show="upLoading"/>
    <van-cell-group title="基础信息">
      <van-field v-model="formData.orderNo" label="指令编号" placeholder="请输入指令编号" />
      <van-field v-model="formData.orderTask" label="指令任务" placeholder="请输入指令任务名" />
      <van-field v-model="formData.initUnitName" label="发令单位" placeholder="自动获取" readonly/>
      <van-field name="radio" label="指令类型">
        <template #input>
          <van-radio-group v-model="formData.orderType" direction="horizontal">
            <van-radio checked-color="#52b829" icon-size="18px" name="1">生产操作</van-radio>
            <van-radio checked-color="#52b829" icon-size="18px" name="2">维修操作</van-radio><br/>
            <van-radio checked-color="#52b829" icon-size="18px" name="3" style="margin-top: 5px;">抢修操作</van-radio>
            <van-radio checked-color="#52b829" icon-size="18px" name="4" style="margin-top: 5px;">应急操作</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field v-model="formData.executeUnitName" label="执行单位" placeholder="请选择执行单位" readonly clickable @click="executeUnitShow = true"/>
      <van-field label="发送短信" >
        <template #input>
          <van-switch v-model="formData.sendFlag" size="24px" active-color="#52b829" inactive-color="#dcdee0"/>
        </template>
      </van-field>
      <!-- <van-field v-model="formData.cooperationUnitName" label="协作部门" placeholder="请选择先选择执行单位，再点击选择协作部门" readonly clickable @click="cooperationUnitShow = true" /> -->
    </van-cell-group>

    <van-cell-group title="任务信息">
      <van-field v-model="formData.projectName" label="工程名称" placeholder="请输入工程名称" />
      <van-field v-model="formData.executeTime" label="执行时间" placeholder="请选择指执行时间" readonly clickable
        @click="datetimePicker.show = true;datetimePicker.type = 'datetime';datetimePicker.to = 'executeTime'"
      />
      <van-field label="任务内容" >
        <template #input>
          <div class="innerCell">
            <div style="display: flex;align-items: center; justify-content: space-around;">
              <van-button type="primary" size="small" plain @click="addTask">添加任务</van-button>
              <van-button type="warning" size="small" plain @click="minTask" :disabled="taskList.length <= 1">减少任务</van-button>
            </div>
            <van-cell-group v-for="(task, index) in taskList" :key="index">
              <van-field v-model="task.onOffNum" label="开停机数" placeholder="请输入开停机数" />
              <van-field v-model="task.flow" label="流量" placeholder="请输入此机组流量" />
              <van-field v-model="task.wv" label="水量" placeholder="请输入此机组水量" />
            </van-cell-group>
          </div>

          <!-- <div>占位符</div> -->
        </template>
      </van-field>
      <van-field v-model="formData.orderUser" label="指令人" placeholder="请输入指令人" />
      <van-field v-model="formData.issueUser" label="签发人" placeholder="请输入签发人" />

    </van-cell-group>
    <van-field v-model="formData.orderRemark" rows="2" autosize label="备注" type="textarea" maxlength="50" placeholder="备注" show-word-limit />

    <van-cell-group title="联系信息">

      <van-field v-model="formData.orderDate" label="日期" placeholder="点击选择日期" 
        @click="datetimePicker.show = true;datetimePicker.type = 'date';datetimePicker.to = 'orderDate'"
      />
      <van-field v-model="formData.orderTime" label="发令时间" placeholder="点击选择发令时间" 
        @click="datetimePicker.show = true;datetimePicker.type = 'time';datetimePicker.to = 'orderTime'"
      />
      <van-field v-model="formData.orderTel" label="调度电话" placeholder="请输入调度电话" />
      <van-field v-model="formData.orderFax" label="调度传真" placeholder="请输入调度传真" />
      <van-field label="文件上传">
        <template #input>
          <van-uploader v-model="formData.fileList"/>
        </template>
      </van-field>
    </van-cell-group>

    <div class="btnGroup">
      <van-button type="primary" block @click="addConfirml" :disabled="upLoading">确定添加</van-button>
      <van-button type="default" block style="margin-top: 10px" @click="addCancel">取消并返回</van-button>
    </div>

    <van-popup v-model="datetimePicker.show" position="bottom">
      <dateTimeSelect :type="datetimePicker.type"
        v-if="datetimePicker.show"
        @confirm="confirm"
        @cancel="datetimePicker.show = false"
      />
    </van-popup>

    <van-popup v-model="executeUnitShow" position="bottom">
      <van-picker
        title="选择执行单位"
        show-toolbar
        :columns="executeUnitList"
        value-key="unitname"
        @confirm="executeUnitPick"
        @cancel="executeUnitShow = false"
      />
    </van-popup>

    <van-popup v-model="cooperationUnitShow" position="bottom">
      <van-picker
        title="选择执行单位"
        show-toolbar
        :columns="cooperationUnitList"
        value-key="unitname"
        @confirm="cooperationUnitPick"
        @cancel="cooperationUnitShow = false"
      />
    </van-popup>
    
  </div>
</template>

<script>
import { Button, Field, Radio, RadioGroup, CellGroup, Popup, Uploader, Picker, Switch } from 'vant';
import { publish } from "@/network/command/execute.js"
import { receiveUnit } from "@/network/command/receiveUnit.js";
import dateTimeSelect from "@/components/dateTimeSelect.vue";
import loading from "@/components/public/loading.vue";
export default {
  name: "addExecute",
  props: {},
  components: {
    [Button.name]: Button,
    [Field.name]: Field,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [CellGroup.name]: CellGroup,
    [Popup.name]: Popup,
    [Uploader.name]: Uploader,
    [Picker.name]: Picker,
    [Switch.name]: Switch,
    dateTimeSelect,
    loading
  },
  data() {
    return {
      value: undefined,
      upLoading: false,
      datetimePicker: {
        show: false,
        type: "datetime",
        to: undefined
      },

      executeUnitShow: false,
      cooperationUnitShow: false,

      formData: {
        regCd: this.$store.state.command.regData.reg_cd,
        orderNo: '',
        orderTask: '',
        initUnitCode: this.$store.state.user.info.unitCode_,
        initUnitName: this.$store.state.user.info.unitName_,
        orderType: "1",
        executeUnitCode: '',
        executeUnitName: '',
        cooperationUnitCode: '',
        cooperationUnitName: '',
        projectName: '',
        executeTime: '',
        orderRemark: '',
        orderUser: this.$store.state.user.info.realName_,
        issueUser: this.$store.state.user.info.realName_,
        orderDate: this.$dayjs().format("YYYY-MM-DD"),
        orderTime: this.$dayjs().format("HH:mm"),
        orderTel: '0551-3918705',
        orderFax: '0552-3918713',
        fileList: [],
        sendFlag: false,
      },
      taskList:[
        {onOffNum: '', flow: '', wv:''}
      ],
      executeUnitList:[],
      cooperationUnitList:[],


    }
  },
  methods: {


   async getExecuteUnit() {
      await receiveUnit(this.getExecuteUnit__params).then(res => {
        if (res.data && res.data.length) {
          this.executeUnitList = res.data;
        }   
      })
    },

    getCooperationUnitList(value) {
      this.executeUnitList.forEach(item => {
        if (item.unitcode === value) {
          this.formData.executeUnitName = item.unitname;
        }
      });
      this.formData.cooperationUnitCode = '';
      this.formData.cooperationUnitName = '';
      this.cooperationUnitList = [];
      receiveUnit({action:"transferUnitList",parent_unitcode:value}).then(res => {
        if (res.data && res.data.length) {
          this.cooperationUnitList = res.data;
        }   
      })
    },

    // 通用日期选择
    confirm(value) {
      this.formData[this.datetimePicker.to] = value
      this.datetimePicker.show = false;
    },

    addTask() {
      this.taskList.push(
        {onOffNum: '', flow: '', wv:''}
      )
    },
    minTask() {
      this.taskList.splice(-1,1);
    },

    executeUnitPick(value) {
      this.formData.executeUnitName = value.unitname;
      this.formData.executeUnitCode = value.unitcode;
      this.executeUnitShow = false;
      if (this.formData.executeUnitCode) {
        this.getCooperationUnitList(this.formData.executeUnitCode);
      }
    },
    cooperationUnitPick(value) {
      this.formData.cooperationUnitName = value.unitname;
      this.formData.cooperationUnitCode = value.unitcode;
      this.cooperationUnitShow = false;
    },
    // 确认添加
    async addConfirml() {
      const formDataObj = new FormData();
      formDataObj.append('regCd', this.formData.regCd);
      formDataObj.append('orderNo', this.formData.orderNo);
      formDataObj.append('orderTask', this.formData.orderTask);
      formDataObj.append('initUnitCode', this.formData.initUnitCode);
      formDataObj.append('initUnitName', this.formData.initUnitName);
      formDataObj.append('orderType', this.formData.orderType);
      formDataObj.append('executeUnitCode', this.formData.executeUnitCode);
      formDataObj.append('executeUnitName', this.formData.executeUnitName);
      formDataObj.append('cooperationUnitCode', this.formData.cooperationUnitCode);
      formDataObj.append('cooperationUnitName', this.formData.cooperationUnitName);
      formDataObj.append('projectName', this.formData.projectName);
      formDataObj.append('executeTime', this.formData.executeTime);
      formDataObj.append('orderRemark', this.formData.orderRemark);
      formDataObj.append('orderUser', this.formData.orderUser);
      formDataObj.append('issueUser', this.formData.issueUser);
      formDataObj.append('orderDate', this.formData.orderDate);
      formDataObj.append('orderTime', this.formData.orderTime);
      formDataObj.append('orderTel', this.formData.orderTel);
      formDataObj.append('orderFax', this.formData.orderFax);
      //短信提醒
      if (this.formData.sendFlag) {
        formDataObj.append('sendFlag', "1");
        formDataObj.append('message', this.SMSContent);
        formDataObj.append('sendUser', this.$store.state.user.info.username_);
      } else {
        formDataObj.append('sendFlag', "0");
      }
      this.formData.fileList.forEach(file => {
        formDataObj.append('file', file.file);
      });
      if (this.taskList.length > 0) {
        let strs = '';
        this.taskList.forEach(item => {
          strs+=item.onOffNum+','+parseFloat(item.flow)+','+parseFloat(item.wv)+'#';
        });
        formDataObj.append('taskstrs', strs);
      }
      this.upLoading = true;
      await publish({ action: "instructionAdd" }, formDataObj).then(res => {
        if (res.code === "1") {
          this.$notify({ type: 'success', message: '下达调水指令成功' });
        }
      }).finally(() => {
        this.$router.go(-1);
        this.upLoading = false;
      })
    },
    // 取消返回
    addCancel() {
      this.$router.go(-1);
    }
  },
  async mounted() {
    this.getExecuteUnit();
  },
  computed: {
    getExecuteUnit__params: function () {
      return {
        action: "transferUnitList",
        parent_unitcode : this.$store.state.user.info.unitCode_,
      }
    },
    SMSContent: function (params) {
      return `您好,${this.$store.state.user.info.unitName_}${this.$store.state.user.info.realName_}在节水调水平台给您单位发送了一条实施调水的指令,请及时查收!`
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#addExecute{
  margin-bottom: 30px;
}

.innerCell {
  ::v-deep .van-field__control--custom {
    flex-direction: column;
  }
  
  ::v-deep .van-cell {
    padding: 10px 15px 10px 5px;
  }

  ::v-deep .van-cell-group:not(:first-of-type) {
    margin-top: 20px;
  }
}

.btnGroup {
  margin: 20px 16px 0px 16px;
}

</style>