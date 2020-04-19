<template>
  <div class="page payment-text">
    <div class="page-title">支付测试</div>
    <div style="height: 10px;"></div>
    <div class="column-title">1、创建支付订单</div>
    <Card class="tysysinfo-card" style="width:600px;">
      <Form :model="formItem" ref="form" :label-width="100" :rules="ruleValidate" class="form-item">
        <FormItem label="租户">
          <Select v-model="formItem.tenantId" filterable>
            <Option
              v-for="item in tenantList"
              :value="item.tenantId"
              :key="item.tenantId"
            >{{ item.tenantName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="租户订单编号" prop>
          <Input v-model="formItem.tenantOrderId" placeholder="租户订单编号" />如果存在会修改订单
          <Button size="small" @click="createTenantOrderId">生成租户订单编号</Button>
        </FormItem>
        <FormItem label="标题" prop>
          <Input v-model="formItem.title" placeholder />
        </FormItem>
        <FormItem label="内容" prop>
          <Input v-model="formItem.content" placeholder />
        </FormItem>
        <FormItem label="会员ID" prop>
          <Input v-model="formItem.memberId" placeholder />
        </FormItem>
        <FormItem label="会员名称" prop>
          <Input v-model="formItem.memberName" placeholder />
        </FormItem>
        <FormItem label="金额" prop>
          <Input v-model="formItem.amount" placeholder />
        </FormItem>
        <FormItem label="后台通知地址" prop>
          <Input v-model="formItem.notify" placeholder="后台通知地址" />
        </FormItem>
        <FormItem label="浏览器返回地址" prop>
          <Input v-model="formItem.redirect" placeholder="浏览器返回地址" />
        </FormItem>
        <FormItem label="base地址" prop>
          <Input v-model="formItem.baseUrl" placeholder="base地址" />
        </FormItem>
        <FormItem label prop>
          <Button type="info" @click="run">生成订单</Button>
        </FormItem>
        <FormItem label="返回值">
          <Input v-model="response" type="textarea" :rows="6" placeholder />
        </FormItem>
        <FormItem label prop>
          <Button type="info" @click="openPay">打开支付</Button>
        </FormItem>
      </Form>
    </Card>
    <div class="column-title">2、订单查询</div>
  </div>
</template>
<script>
import Loading from '@/components/loading';

export default {
  components: {
    Loading,
  },
  data() {
    return {
      loading: 0,
      testParams: '{}',
      responseType: 'json',
      response: '',
      tenantList: [],//租户列表
      formItem: {
        orderId: '',
        tenantId: '',
        tenantOrderId: '',//租户订单编号
        title: '会员续费',
        content: '续费1个月',
        memberId: '1',
        memberName: '张三',
        amount: '0.01',
        notify: 'http://www.baidu.com',//
        redirect: 'http://www.baidu.com',
        baseUrl: 'http://pay.tunnel.lyarc.com/corp'
      },
      unifiedPayPage: '',//打开支付页面地址
      oriItem: {},
      ruleValidate: {
        value: [
          {
            required: true,
            whitespace: true,
            message: "系统配置路径不能为空",
            trigger: "change"
          }
        ],
      }
    }
  },
  mounted: function () {
    this.queryTenantList();
  },
  computed: {

  },
  methods: {
    run() {
      if (this.formItem.tenantId == '') {
        this.$Message.error('请选择租户');
        return;
      }
      this.loading = 1;
      this.response = "request ...";
      var form = {};
      this.$http.post('/api/engine/pay/testCreateOrder', this.formItem).then((res) => {
        this.loading = 0;
        if (res.data.code === 0 && res.data.data != null && res.data.data.order != null) {
          this.formItem.orderId = res.data.data.order.orderId;
          this.unifiedPayPage = res.data.data.order.unifiedPayPage;
        }
        if (typeof (res.data) == "string") {
          this.responseType = 'text';
          this.response = res.data;
        } else {
          this.responseType = 'json';
          this.response = JSON.stringify(res.data, null, 4);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    openPay() {
      if (this.formItem.orderId && this.unifiedPayPage) {
        window.open(this.formItem.baseUrl + this.unifiedPayPage, '_blank');
      } else {
        this.$Message.error('没有找到订单号');
      }
    },
    //租户列表
    queryTenantList() {
      this.loading = 1;
      this.$http.post("/api/engine/tenant/all", {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            this.tenantList = res.data.data;
          }
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("操作失败！")
      });
    },
    createTenantOrderId() {
      this.formItem.tenantOrderId = this.getDateTime();//this.uuid();
    },
    uuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "";

      var uuid = s.join("");
      return uuid;
    },
    getDateTime() {
      var time = new Date();
      return time.getFullYear() + '' + (time.getMonth() + 1) + '' + time.getDate() + '' + time.getHours() + '' + time.getMinutes() + '' + time.getSeconds();
    }
  }
}

</script> 
<style>
.payment-text .column-title {
  padding: 10px 0;
  font-size: 14px;
}

.payment-text .ivu-form-item {
  margin-bottom: 4px;
}
</style>