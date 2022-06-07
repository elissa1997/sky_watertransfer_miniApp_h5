<template>
  <div id="unitTree">
    <van-tabs v-model="active" color="#52b829">
      <van-tab title="接收单位" style="padding: 20px 10px;">
        <div class="level1warp" v-for="item in unit.unitTree" :key="item.id">
          <div class="level1Item">
            <icon-check-one size="20" style="margin-right: 5px" 
            :theme="(item.selected)?'filled':'outline'" :fill="(item.selected)?'#52b829':'#afafaf'"/>
            <div class="text" @click="unitClick(item)">{{item.unitname}}</div>
            <!-- <div class="text" @click="item.selected = !item.selected">{{item.unitname}}</div> -->
            <component :is="(item.collapse)?'icon-left-c':'icon-down-c'" 
              v-if="item.children" theme="outline" size="20" fill="#646566" class="flex-right" 
              @click="item.collapse = !item.collapse"/>
          </div>
          <div class="level2warp" v-if="item.children && !item.collapse">
            <div class="leve21Item" v-for="item2 in item.children" :key="item2.id">
              <icon-check-one size="20" style="margin-right: 5px" 
              :theme="(item2.selected)?'filled':'outline'" :fill="(item2.selected)?'#52b829':'#afafaf'"/>
              <div class="text" @click="unitClick(item2)">{{item2.unitname}}</div>
              <!-- <div class="text" @click="item2.selected = !item2.selected">{{item2.unitname}}</div> -->
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="短信接收人" v-if="unit.sendSMS">
        <div class="contact">
          <van-checkbox-group v-model="selected.contactsList">
            <van-checkbox checked-color="#52b829" icon-size="18px" :name="contact.tel" v-for="(contact, index) in unit.contactsList" :key="index">{{contact.name}}</van-checkbox>
          </van-checkbox-group>
        </div>
      </van-tab>
      <div slot="nav-right" class="sendSMS">发送短信：<van-switch v-model="unit.sendSMS" active-color="#52b829" size="20px" /></div>
    </van-tabs>
  </div>
</template>

<script>
import { Tab, Tabs, Checkbox, CheckboxGroup, Switch } from 'vant';
import { receiveUnit, contacts } from "@/network/command/receiveUnit.js";
import { listToTree, treeToList } from "@/util/listToTree.js";

export default {
  name: "unitTree",
  props: {},
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Switch.name]: Switch
  },
  data() {
    return {
      active: 0,
      unit: {
        sendSMS: true,
        unitTree: undefined,
        tempList: [],
        contactsList: undefined
      },
      selected: {
        unitList: [],
        contactsList: []
      }
    }
  },
  methods: {
    // 获取接收单位列表
    getReceiveUnit() {         
      receiveUnit(this.getReceiveUnit_params).then(res => {
        if (res.data && res.data.length) {
          let temp = res.data.filter(item=>(item.unitcode !== '10011027' && item.unitcode !== '1001' && item.unitcode !== '10011021')).map(ele => {
            return {
              ...ele,
              collapse: true,
              selected: false
            }
          });
          this.unit.tempList = temp;
          this.unit.unitTree = listToTree(temp, "unitcode", "parent_unitcode", "1001")
        }
      })
    },

    unitClick(item) {
      item.selected = !item.selected;
      if (item.selected) {
        // 点击单位加入已选
        this.selected.unitList.push(item);
      }else{
        // 点击单位移除已选
        let deleteIndex = this.selected.unitList.findIndex(ele => ele.unitcode === item.unitcode);
        this.selected.unitList.splice(deleteIndex, 1);
      }

      let unitArray = this.selected.unitList.map(ele => {
        return ele.unitcode
      })

      this.getContacts(unitArray);
    },

    // 获取短信接收人
    getContacts(unitList) {
      let unitCodes = unitList.filter(function(item) {
          return item != "10011027"
      });

      unitCodes = unitCodes.join(",")

      contacts({action: "contactList", unitCodes}).then(res => {
        if (res.code === "1") {
          this.unit.contactsList = [];
          this.unit.contactsList = res.data;
          
          this.selected.contactsList = [];
          this.selected.contactsList = res.data.map(ele => {
            return ele.tel
          });
        }
      })
    },
  },
  mounted() {
    this.getReceiveUnit();
  },
  computed: {
    getReceiveUnit_params: function () {
      return {
        action: "transferUnitList",
        visible: "1",
      }
    },
  },
  watch: {
    'selected.unitList': {
      handler(newVal, oldVal) {
        let stringArray = newVal.map(ele => {
          return `${ele.unitcode},${ele.unitname}#`
        })
        this.$emit('unitChange', stringArray);
      },
      // deep: true
    },
    'selected.contactsList': {
      handler(newVal, oldVal) {
        this.$emit('contactsChange', newVal);
      },
      // deep: true
    },
    'unit.sendSMS': {
      handler(newVal, oldVal){
        if (!newVal) {
          this.selected.contactsList = undefined;
        }
        this.$emit('isSendSMS', newVal);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#unitTree{
  padding: 10px 0;
  overflow-y: auto;
  height: 70vh;
}

.sendSMS {
  display: flex;
  align-items: center;
  margin-right: 5px;
  font-size: 14px;
  color: #646566;
}

.flex-right {
  margin-left: auto;
}

.level1warp {
  
  .level1Item {
    padding: 10px;
    display: flex;
    align-items: center;
    background-color: #ebedf0bb;
    color: #646566;
    border-radius: 5px;
    ::v-deep .i-icon {
      float: left;
    }

    .text {
      font-size: 14px;
      line-height: 24px;
    }
  }

  .leve21Item {
    margin: 5px 10px;
    padding: 5px 7px;
    display: flex;
    align-items: center;
    background-color: #ebedf069;
    color: #646566;

    .text {
      font-size: 14px;
      line-height: 24px;
    }
  }
}

.level1warp:not(:first-of-type) {
  margin-top: 20px;
}

.contact {
  padding: 20px 10px;

  ::v-deep .van-checkbox:not(:first-of-type) {
    margin-top: 10px;
  }

  ::v-deep .van-checkbox__label {
    font-size: 14px;
    color: #646566;
  }
}

</style>