<template>
  <div id="My">
    <div class="bgCircle">
      <!-- <div class="bg"></div> -->
    </div>
    <div class="content">
      <div class="title">个人中心</div>

      <div class="card">
        <div class="item">
          <div class="lable">用户名</div>
          <div class="value">{{this.$store.state.user.info.username_}}</div>
        </div>
        <div class="item">
          <div class="lable">真实姓名</div>
          <div class="value">{{this.$store.state.user.info.realName_}}</div>
        </div>
        <div class="item">
          <div class="lable">所属单位</div>
          <div class="value">{{this.$store.state.user.info.unitName_}}</div>
        </div>
      </div>

      <div class="btnWarp">
        <van-button type="primary" block @click="logout">退出登录</van-button>

      </div>

    </div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import { Button } from 'vant';
export default {
  name: "My",
  props: {},
  components: {
    [Button.name]: Button
  },
  data() {
    return {}
  },
  methods: {
    logout() {
      console.log("微信跳转");
      wx.miniProgram.navigateTo({url: '../login/login'});
    }
  },
  mounted() {},
  watch: {}
}
</script>
<style lang="scss" scoped>
#My{
  position: relative;
  width: 100%;
  min-height: 145px;
  overflow: hidden;


}

.bgCircle{

  position: absolute;
  left: -25%;
  width: 150%;
  height: 145px;
  background-color: #52b829;
  border-bottom-left-radius: 100%;
  border-bottom-right-radius: 100%;
  background-image: linear-gradient(0deg, #07e7d5, #08c97f 50%);  /* 渐变 */
  z-index: 1;
  
}


.content {
  position: relative;
  z-index: 10;
  
  .title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: #fff;
    padding: 20px 10px 0px 10px;
  }

  .card{
    margin: 55px 10px 0px 10px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0px 0px 15px #0000001a;
    padding: 10px;
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

  .card:last-of-type {
    margin-bottom: 20px;
  }

  .btnWarp {
    padding: 20px 10px;
  }
}
</style>