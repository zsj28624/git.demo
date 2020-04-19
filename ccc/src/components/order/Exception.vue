<template>
  <ListPage
    ref="page"
    title="订单管理"
    api="/api/engine/order/exceptionList"
    :model="this"
    :beforeLoad="beforeLoad"
    @on-load="onLoadData"
  >
    <OrderTabs tabvalue="exception"></OrderTabs>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.orderId" style="min-width: 100px" placeholder="订单编号" @keyup.enter.native="query"></Input>
          </td>
          <td>
            <Select
              clearable
              filterable
              v-model="queryForm.tenantId"
              @on-change="query"
              style="width: 160px"
              placeholder="租户名称"
            >
              <Option
                v-for="item in tenantList"
                :value="item.tenantId"
                :key="item.tenantId"
              >{{ item.tenantName }}</Option>
            </Select>
          </td>
          <td>
            <Select
              clearable
              v-model="queryForm.status"
              @on-change="query"
              style="width: 120px"
              placeholder="订单状态"
            >
              <Option
                v-for="item in statusOption"
                :value="item.code"
                :key="item.code"
              >{{ item.text }}</Option>
            </Select>
          </td>
          <td style="min-width: 60px">创建时间</td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.createTime"
              split-panels
              placeholder="选择日期"
              style="width: 180px"
              :clearable="true"
              ::transfer="true"
            ></DatePicker>
          </td>
          <td>
            <Button @click="query" type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset" type="default">重置</Button>
          </td>
          <td>&nbsp;</td>
          <td>
            <Button @click="exportDown" type="info" icon="ios-download-outline">导出</Button>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <div style="padding-top:10px;color:#999;">
              合计：
              <span style="font-size: 14px;color:#cf4e4a">{{report.orderAmount}}</span> 元
            </div>
          </td>
        </tr>
      </table>
    </div>
    <Detail ref="orderDetail"></Detail>
    <PayOrderDetail ref="orderPayDetail"></PayOrderDetail>
    <Log ref="log"></Log>
  </ListPage>
</template>
<script>     
import Loading from '@/components/loading';
import ListPage from '@/components/page/ListPage';
import page from '@/assets/js/page';
import OrderTabs from '@/components/page/OrderTabs';
import Detail from '@/components/order/OrderDetail';
import PayOrderDetail from '@/components/order/PayOrderDetail';
import Log from '@/components/order/Log';

export default {
  components: {
    ListPage, OrderTabs, Detail, Log, PayOrderDetail, Loading
  },
  data() {
    let that = this;
    return {
      tabName: '1',
      columns: [{
        title: '支付流水ID',
        key: 'orderPayId',
        align: 'center',
        width: 100,
      }, {
        title: '支付流水编号',
        width: 180,
        key: 'outerId',
        render: (h, params) => {
          var row = params.row;
          return h('div', [h('a', {
            on: {
              click: () => {
                this.goOrderPayDetail(row)
              }
            }
          }, row.outerId)]);
        }
      }, {
        title: '订单编号',
        width: 170,
        key: 'orderId',
        render: (h, params) => {
          var row = params.row;
          return h('div', [h('a', {
            on: {
              click: () => {
                this.goOrderDetail(row)
              }
            }
          }, row.orderId)]);
        }
      }, {
        title: '租户名称',
        key: 'tenantName',
        width: 150,
      }, {
        title: '会员编号（名称）',
        key: 'memberId',
        width: 150,
        render: (h, params) => {
          var row = params.row;
          var text = row.memberId + '（' + row.memberName + '）';
          return h('span', text);
        }
      }, {
        title: '标题、内容',
        key: 'title',
        minWidth: 200,
        render: (h, params) => {
          var row = params.row;
          return h('div', { style: "padding:8px 0px;" }, [h('div', row.title), h('div', { 'class': "order-row-content" }, row.content)]);
        }
      }, {
        title: '支付金额(元)',
        key: 'amount',
        align: 'right',
        width: 100,
      }, {
        title: '订单状态',
        key: 'status',
        align: 'center',
        width: 100,
        render: (h, params) => {
          var row = params.row;
          var text = "";
          switch (row.status) {
            //状态 1.创建 2.已支付  8.已退款 9.关闭
            case 1:
              text = "创建";
              break;
            case 2:
              text = "已支付";
              break;
            // case 8:
            //   text = "已退款";
            //   break;
            case 9:
              text = "关闭";
              break;
            default:
              break;
          }
          return h('label', text);
        }
      },
      {
        title: '支付方式',
        key: 'payType',
        align: 'center',
        width: 80,//类型（1.微信 2.支付宝）
        render: (h, params) => {
          var row = params.row;
          var text = "";
          if (row.payType == 1) {
            text = "微信";
          }
          if (row.payType == 2) {
            text = "支付宝";
          }
          return h('label', text);
        }
      },
      {
        title: '操作',
        width: 60,
        align: 'center',
        fixed: 'right',
        render: (h, params) => {
          var row = params.row;
          var btns = [];
          btns.push(h('Button', {
            props: {
              size: 'small'
            },
            on: {
              click: () => {
                this.showLog(row)
              }
            }
          }, '日志'));
          // btns.push(h('span', { domProps: { innerHTML: '&nbsp;&nbsp;' } }));
          // btns.push(h('Button', {
          //   props: {
          //     size: 'small',
          //     type: 'warning'
          //   },
          //   on: {
          //     click: () => {
          //       this.doRefund(row)
          //     }
          //   }
          // }, '退款'));
          return h('div', btns);
        }
      },
      {
        title: '创建时间',
        key: 'createTime',
        align: 'center',
        width: 160,
      }
      ],
      tenantList: [],
      list: [],
      report: { orderAmount: 0 },
      total: 0,
      routeQuery: {//传入参数
        createTime: [page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())],
      },
      queryParam: {},
      queryForm: {
        tenantId: '',
        tenantName: '',
        orderId: '',
        status: '',
        createTime: [page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())],
        page: '',
        pageSize: '',
      },
      selection: [],
      loading: 1,
      statusOption: [
        { code: 1, text: '创建' },
        { code: 2, text: '已支付' },
        // { code: 8, text: '已退款' },
        { code: 9, text: '关闭' },
      ],
    }
  },
  mounted: function () {
    if (this.$route.query.startTime) {
      this.routeQuery.createTime = [this.$route.query.startTime, this.$route.query.endTime]
    }
    Object.assign(this.queryForm, this.routeQuery);
    this.queryTenantList();
    this.query();
  },
  computed: {},
  methods: {
    beforeLoad() {
      var queryParam = this.$refs.page.queryParam;
      queryParam.createTimeStart = '';
      queryParam.createTimeEnd = '';
      delete queryParam.createTime;
      if (this.queryForm.createTime.length > 0) {
        queryParam.createTimeStart = page.formatDate(this.queryForm.createTime[0]);
      }
      if (this.queryForm.createTime.length > 1) {
        queryParam.createTimeEnd = page.formatDate(this.queryForm.createTime[1]);
      }
    },
    onLoadData(comp) {
      if (comp.apiRult && comp.apiRult.data.sum) {
        this.report.orderAmount = comp.apiRult.data.sum.amountSum || 0;
      }
    },
    query() {
      this.$refs.page.query();
    },
    reset: function () {
      Object.assign(this.queryForm, {
        orderId: '',
        tenantId: '',
        tenantName: '',
        status: '',
        createTime: this.routeQuery.createTime
      });
      this.query();
    },
    select: function (selection) {
      this.selection = selection;
    },
    goOrderDetail: function (row) {
      this.$refs.orderDetail.open(row.orderId);
    },
    goOrderPayDetail: function (row) {
      this.$refs.orderPayDetail.open(row.orderPayId);
    },
    showLog: function (row) {
      this.$refs.log.open(row.orderId, row.orderPayId);
    },
    doRefund(row) {
      this.$Modal.confirm({
        title: '退款确认',
        content: '<p>确定退款吗？</p>',
        onOk: () => {
          this.loading = 1;
          this.$http.post('/api/engine/order/refund', { 'orderPayId': row.orderPayId }).then((res) => {
            this.loading = 0;
            if (res.data.code === 0) {
              this.$Message.success("操作成功");
              this.query();
            } else {
              this.$Message.error(res.data.message)
            }
          }).catch((error) => {
            this.loading = 0;
            this.$Message.error(error.toString())
          });
        }
      });
    },
    exportDown() {
      this.$refs.page.exportDown();
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
  }
}

</script> 
<style>
.order-row-content {
  color: #999;
}
</style>