<template>
  <Modal v-model="show" title="日志" :closable="false" :mask-closable="true" width="480">
    <div class="page">
      <Loading :loading="loading">
        <div class="page-form">
          <div v-if="list.length==0" style="text-align: center;line-height: 50px;">暂无数据</div>
          <Timeline>
            <TimelineItem :color="getColor(item.lev)" v-for="item in list" :key="item.orderId">
              <p class="time">{{item.createTime}}</p>
              <p class="content">{{item.content}}</p>
            </TimelineItem>
          </Timeline>
        </div>
      </Loading>
    </div>
    <div slot="footer">
      <Button  @click="close">取消</Button>
    </div>
  </Modal>
</template>
<script>
import Loading from '@/components/loading';

export default {
  components: {
    Loading,
  },
  data() {
    return {
      loading: 1,
      show: false,
      list: []
    }
  },
  methods: {
    open(orderId, orderPayId) {
      this.show = true;
      this.getOrder(orderId, orderPayId);
    },
    getOrder(orderId, orderPayId) {
      this.$http.post('/api/engine/order/log', { 'orderId': orderId, 'orderPayId': orderPayId }).then((res) => {
        if (res.data.code === 0) {
          this.loading = 0;
          this.list = res.data.data;
        } else {
          this.loading = 0;
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    close() {
      this.show = false;
    },
    getColor(lev) {
      var color = "green";
      switch (lev) {
        case 1:
          color = "green";
          break;
        case 2:
          color = "#ff9900";
          break;
        case 3:
          color = "red";
          break;
        default:
          break;
      }
      return color;
    }
  }
} 
</script> 
<style scoped>
.time {
  font-size: 14px;
  font-weight: bold;
}
.content {
  padding-left: 5px;
}
</style>