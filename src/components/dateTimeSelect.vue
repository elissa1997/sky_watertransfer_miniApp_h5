<template>
  <div id="dateTimeSelect">
    <van-datetime-picker
      v-if="selectedDateTime"
      v-model="selectedDateTime"
      :formatter="datetimePickerFormatter"
      :type="type"
      @confirm="confirm"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import { DatetimePicker } from 'vant';
export default {
  name: "dateTimeSelect",
  props: {
    type: {
      type: String,
      default: "datetime"
    }
  },
  components: {
    [DatetimePicker.name]: DatetimePicker
  },
  data() {
    return {
      format: "YYYY-MM-DD HH:mm",
      selectedDateTime: undefined
    }
  },
  methods: {
    confirm(value) {
      if (this.type === "time") {
        this.$emit('confirm', value);
      }else{
        this.$emit('confirm', this.$dayjs(value).format(this.format));
      }
    },

    cancel() {
      this.$emit('cancel');
    },

    datetimePickerFormatter(type, val) {
      switch (this.type) {
        case "datetime":

          if (type === 'year') {
            return val + '年';
          }
          if (type === 'month') {
            return val + '月';
          }
          if (type === 'day') {
            return val + '日';
          }
          if (type === 'hour') {
            return val + '时';
          }
          if (type === 'minute') {
            return val + '分';
          }
          return val;
        break;

        case "date":
          if (type === 'year') {
            return val + '年';
          }
          if (type === 'month') {
            return val + '月';
          }
          if (type === 'day') {
            return val + '日';
          }
          return val;
        break;

        case "time":
          this.format = "HH:mm";
          if (type === 'hour') {
            return val + '时';
          }
          if (type === 'minute') {
            return val + '分';
          }
          return val;
        break;
      
        default:
          break;
      }
    },
  },
  created() {
    switch (this.type) {
      case "datetime":
        this.format = "YYYY-MM-DD HH:mm";
        this.selectedDateTime = this.$dayjs().toDate();
      break;
      case "date":
        this.format = "YYYY-MM-DD";
        this.selectedDateTime = this.$dayjs().toDate();
      break;
      case "time":
        this.format = "HH:mm";
        this.selectedDateTime = this.$dayjs().format("HH:mm");
      break;
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#dateTimeSelect{}
</style>