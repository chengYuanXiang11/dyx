 <template>
  <div>
    <el-button @click="visible = true">{{ text }}</el-button>
  </div>
</template>
    <script>
export default {
  data() {
    return {
      visible: false,
      loading: false,
      //控制过期
      btnDisabled: true,
      pay: {},
    };
  },
  created() {
    if (/MicroMessenger/.test(window.navigator.userAgent)) {
      this.text = "微信";
    } else if (/AlipayClient/.test(window.navigator.userAgent)) {
      this.text = "支付宝";
    } else {
      this.text = "其他浏览器";
    }
  },
  methods: {},
};
</script>