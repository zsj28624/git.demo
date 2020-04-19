<template>
  <Modal v-model="show" title="支付流水" :closable="false" :mask-closable="true" width="480">
    <div class="page order-pay-detail-item">
      <Loading :loading="loading">
        <div class="page-form">
          <Form :model="formItem" :label-width="100" claass="form-item">
            <FormItem label="流水ID">{{formItem.orderPayId}}</FormItem>
            <FormItem label="流水编码">{{formItem.outerId}}</FormItem>
            <FormItem label="订单编码">{{formItem.orderId}}</FormItem>
            <FormItem label="租户名称">{{formItem.tenantName}}</FormItem>
            <FormItem label="会员编号">{{formItem.memberId}}</FormItem>
            <FormItem label="会员名称">{{formItem.memberName}}</FormItem>
            <FormItem label="标题">{{formItem.title}}</FormItem>
            <FormItem label="内容">{{formItem.content}}</FormItem>
            <FormItem label="支付金额(元)">{{formItem.amount}}</FormItem>
            <FormItem label="订单状态">{{getStatusStr(formItem.status)}}</FormItem>
            <FormItem label="支付方式">{{getPayTypeStr(formItem.payType)}}</FormItem>
            <!-- <FormItem label="退款状态">{{getRefundStatus(formItem.refundStatus)}}</FormItem> -->
            <FormItem label="创建时间">{{formItem.createTime}}</FormItem>
          </Form>
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
      //表单对象
      formItem: {
        orderId: '',
        tenantName: '',
        memberId: '',
        memberName: '',
        title: '',
        content: '',
        amount: '',
        status: '',
        outerId: '',
        orderPayStatus: '',
        payType: '',
        notifyStatus: '',
        createTime: '',
      },
    }
  },
  methods: {
    open(orderPayId) {
      this.show = true;
      this.getOrder(orderPayId);
    },
    getOrder(orderPayId) {
      this.$http.post('/api/engine/order/getOrderPay', { 'orderPayId': orderPayId }).then((res) => {
        if (res.data.code === 0) {
          this.loading = 0;
          this.formItem = res.data.data;
        } else {
          this.loading = 0;
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    getStatusStr(status) {
      var str = '';
      switch (status) {
        case 1:
          str = '创建';
          break;
        case 2:
          str = '已支付';
          break;
        case 8:
          str = '已退款';
          break;
        case 9:
          str = '关闭';
          break;

        default:
          break;
      }
      return str;
    },
    getNotifyStatusStr(notifyStatus) {
      var str = '';
      switch (notifyStatus) {
        case 1:
          str = '待通知';
          break;
        case 2:
          str = '已通知';
          break;
        case 3:
          str = '超时';
          break;
        default:
          break;
      }
      return str;
    },
    getPayTypeStr(payType) {
      var str = '';
      switch (payType) {
        case 1:
          str = '微信';
          break;
        case 2:
          str = '支付宝';
          break;
        default:
          break;
      }
      return str;
    },
    getRefundStatus(refundStatus) {
      var str = '';
      switch (refundStatus) {
        case 1:
          str = '待退款';
          break;
        case 2:
          str = '退款成功';
          break;
        case 3:
          str = '退款失败';
          break;
        default:
          break;
      }
      return str;
    },
    close() {
      this.show = false;
    },
  }
} 
</script> 
<style>
.order-pay-detail-item {
  padding: 0px;
}
.order-pay-detail-item .ivu-form-item {
  margin-bottom: 0px;
}
</style>