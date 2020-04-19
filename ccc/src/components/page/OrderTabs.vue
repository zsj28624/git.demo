<template>
  <Tabs type="card" @on-click="orderTabsClick" :value="tabvalue" style="margin-top:10px;">
    <TabPane label="支付订单" name="all"></TabPane>
    <TabPane label="支付流水" name="pay"></TabPane>
    <TabPane label="异常流水" name="exception"></TabPane>
  </Tabs>
</template>

<script>  
export default {
  props: {
    tabvalue: {
      type: String,
      default: ""
    },
  },
  data() {
    return {};
  },
  mounted() { },
  computed: {},
  methods: {
    orderTabsClick: function (name) {
      switch (name) {
        case "all":
          this.$router.push({ path: '/order' });
          break;
        case "pay":
          this.$router.push({ path: '/order/payStream' });
          break;
        case "exception":
          this.$router.push({ path: '/order/exception' });
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style>
.ivu-tabs-bar {
  margin-bottom: 0px;
}
</style>

