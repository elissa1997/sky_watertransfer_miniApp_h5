<template>
  <div id="addInspection">
      <van-field v-model="formData.urgeUnitName" label="巡查单位" readonly/>
      <van-field :value="`已选择${formData.unitstrs.length}个单位，点击选择单位`" label="被巡查站点" placeholder="选择被巡查站点" readonly clickable @click="showPopup(true)"/>
      <van-field v-model="formData.problem" label="巡查问题" placeholder="填写巡查中发现的问题" type="textarea" maxlength="50"/>
      <van-field label="文件上传">
        <template #input>
          <van-uploader v-model="formData.fileList"/>
        </template>
      </van-field>

      <div class="btnGroup">
        <van-button type="primary" block @click="addConfirml">确定添加</van-button>
        <van-button type="default" block style="margin-top: 10px" @click="addCancel">取消并返回</van-button>
      </div>

      <van-popup v-model="popup.show" round position="bottom">
        <van-picker
          title="选择被巡查单位"
          show-toolbar
          :columns="inspectionUnitList"
          value-key="unitname"
          @confirm="inspectionUnitPick"
          @cancel="popup.show = false"
        />
      </van-popup>

  </div>
</template>

<script>
import { Button, Field, Uploader, Popup, Picker } from 'vant';
import { receiveUnit } from "@/network/command/receiveUnit.js";
import { publish } from "@/network/command/inspection.js";

export default {
  name: "addInspection",
  props: {},
  components: {
    [Button.name]: Button,
    [Field.name]: Field,
    [Uploader.name]: Uploader,
    [Popup.name]: Popup,
    [Picker.name]: Picker
  },
  data() {
    return {
      regCd: this.$store.state.command.regData.reg_cd,
      popup: {
        show: false
      },
      inspectionUnitList: [],
      formData: {
        urgeUnitCode: this.$store.state.user.info.unitCode_,
        urgeUnitName: this.$store.state.user.info.unitName_,
        problem: undefined,
        fileList: [],
        unitstrs: []
      }
    }
  },
  methods: {
    showPopup(display) {
      this.popup.show = display;
    },


    // unitChange(data) {
    //   this.formData.unitstrs = data;
    // },

    async getInspectionUnit() {
      await receiveUnit(this.getinspectionUnit__params).then(res => {
        if (res.data && res.data.length) {
          this.inspectionUnitList = res.data;
        }   
      })
    },

    inspectionUnitPick(data) {
      this.formData.unitstrs = [];
      this.formData.unitstrs.push(
        data.unitcode+","+data.unitname+"#"
      )
      console.log(data)
      this.popup.show = false;
    },

    // 确认添加
    addConfirml() {
      const formDataObj = new FormData();
      formDataObj.append('regCd', this.regCd);
      formDataObj.append('problem', this.formData.problem);
      formDataObj.append('unitstrs', this.formData.unitstrs.join(""));
      formDataObj.append('urgeUnitCode', this.$store.state.user.info.unitCode_);
      formDataObj.append('urgeUnitName', this.$store.state.user.info.unitName_);
      this.formData.fileList.forEach(file => {
        formDataObj.append('file', file.file);
      });
      publish({ action: "doAdd" }, formDataObj).then(res => {
        if (res.code === "1") {
          this.$notify({ type: 'success', message: '添加巡查记录成功' });
          this.$router.go(-1);
        }
      })
    },

    // 取消返回
    addCancel() {
      this.$router.go(-1);
    }
  },
  async mounted() {
    this.getInspectionUnit();
  },
  computed: {
    getinspectionUnit__params: function () {
      return {
        action: "transferUnitList",
        parent_unitcode : this.$store.state.user.info.unitCode_,
      }
    },
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#addInspection{
  margin-top: 10px;
  margin-bottom: 30px;
}

.btnGroup {
  margin: 20px 16px 0px 16px;
}
</style>