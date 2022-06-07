<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <van-button type="primary">主要按钮</van-button>
    {{$store.state.user.info}}
  </div>
</template>

<script>
// @ is an alias to /src
import { Button } from 'vant';


export default {
  name: 'Home',
  components: {
    [Button.name]:Button
  }
}
</script>
