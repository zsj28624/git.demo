<template>
  <ListPage
    ref="page"
    title="订单管理"
    api="/api/engine/order/list"
    :model="this"
    :beforeLoad="beforeLoad"
    @on-load="onLoadData"
  >
    <OrderTabs tabvalue="all"></OrderTabs>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
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
          <td style="min-width: 100px">
            <Input v-model="queryForm.orderId" placeholder="订单编号" @keyup.enter.native="query"></Input>
          </td>
          <td>
            <Input
              v-model="queryForm.tenantOrderId"
              style="min-width: 100px"
              placeholder="租户订单编号"
              @on-enter="query"
            />
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
          <td>
            <Select
              clearable
              v-model="queryForm.notifyStatus"
              placeholder="业务同步状态"
              style="width: 120px"
              @on-change="query"
            >
              <Option
                v-for="item in notifyStatusOption"
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
        </tr>
        <tr style="height: 35px;">
          <td>
            <Input
              v-model="queryForm.memberKeyWord"
              placeholder="会员编号、名称"
              @keyup.enter.native="query"
            ></Input>
          </td>
          <td>
            <Input v-model="queryForm.titleKeyWord" placeholder="标题、内容" @keyup.enter.native="query"></Input>
          </td>
          <td colspan="3">
            <Button @click="query" type="primary" icon="ios-search">查询</Button>&nbsp;
            <Button @click="reset" type="default">重置</Button>&nbsp;
            <Button @click="exportDown" type="info" icon="ios-download-outline">导出</Button>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <div style="color:#999;">
              合计：
              <span style="font-size: 14px;color:#495060;">{{report.orderCount}}</span>
              单，
              <span style="font-size: 14px;color:#cf4e4a;">{{report.orderAmount}}</span>
              元，待同步
              <span
                style="font-size: 14px;color:#495060;"
              >{{notifySyncCount.waitSync}}</span>
              单，超时
              <span
                style="font-size: 14px;color:#495060"
              >{{notifySyncCount.timeout}}</span>
              单
              <span style="width:30px;display: inline-block;">&nbsp;</span>
              同步中：
              <span
                style="font-size: 12px;color:#495060"
              >{{notifyPerfor.activeCount}}</span> /
              <span
                style="font-size: 12px;color:#495060"
              >{{notifyPerfor.taskCount - notifyPerfor.completedTaskCount}}</span>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <Detail ref="orderDetail"></Detail>
    <Log ref="log"></Log>
  </ListPage>
</template>
<script>     
import ListPage from '@/components/page/ListPage';
import page from '@/assets/js/page';
import OrderTabs from '@/components/page/OrderTabs';
import Detail from '@/components/order/OrderDetail';
import Log from '@/components/order/Log';

export default {
  components: {
    ListPage, OrderTabs, Detail, Log
  },
  data() {
    let that = this;
    return {
      tabName: '1',
      columns: [{
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
        title: '租户订单编号',
        key: 'tenantOrderId',
        width: 150,
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
      }, {
        title: '支付流水ID',
        key: 'orderPayId',
        align: 'center',
        width: 100,
        render: (h, params) => {
          var row = params.row;
          if (row.orderPayId) {
            return h('label', row.orderPayId);
          } else {
            return '';
          }
        }
      }, {
        title: '支付流水编号',
        key: 'outerId',
        align: 'center',
        width: 180,
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
        title: '业务同步状态',
        key: 'notifyStatus',
        align: 'center',
        width: 100,
        render: (h, params) => {
          var row = params.row;
          var text = "";
          switch (row.notifyStatus) {
            case 1:
              text = "待同步";
              break;
            case 2:
              text = "已同步";
              break;
            case 3:
              text = "超时";
              break;
            default:
              break;
          }
          return h('label', text);
        }
      },
      // {
      //   title: '退款状态',
      //   key: 'refundStatus',
      //   align: 'center',
      //   width: 90,
      //   render: (h, params) => {
      //     var row = params.row;
      //     var text = "";
      //     switch (row.refundStatus) {
      //       case 1://1.退款中 2.退款成功 3.退款失败
      //         text = "退款中";
      //         break;
      //       case 2:
      //         text = "退款成功";
      //         break;
      //       case 3:
      //         text = "退款失败";
      //         break;
      //       default:
      //         break;
      //     }
      //     return h('label', text);
      //   }
      // },
      {
        title: '操作',
        width: 130,
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
          btns.push(h('span', { domProps: { innerHTML: '&nbsp;&nbsp;' } }));
          btns.push(h('Button', {
            props: {
              size: 'small',
              type: 'info'
            },
            on: {
              click: () => {
                this.doNotify(row)
              }
            }
          }, '同步'));
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
      notifySyncCount: {
        waitSync: 0,//待同步
        timeout: 0//超时
      },
      notifyPerfor: {//同步任务
        "activeCount": 0,
        "taskCount": 0,
        "queueSize": 0,
        "largestPoolSize": 0,
        "poolSize": 0,
        "corePoolSize": 0,
        "completedTaskCount": 0,
        "maximumPoolSize": 0
      },
      report: {//合计
        orderCount: 0,
        orderAmount: 0,
      },
      total: 0,
      routeQuery: {//传入参数
        status: '',
        notifyStatus: '',
        createTime: [page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())],
      },
      queryParam: {},
      queryForm: {
        memberKeyWord: '',
        titleKeyWord: '',
        tenantId: '',
        tenantName: '',
        orderId: '',
        tenantOrderId: '',
        status: '',
        notifyStatus: '',
        createTime: [page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())],
        page: '',
        pageSize: '',
      },
      loading: 0,
      statusOption: [
        { code: 1, text: '创建' },
        { code: 2, text: '已支付' },
        // { code: 8, text: '已退款' },
        { code: 9, text: '关闭' },
      ],
      notifyStatusOption: [
        { code: 1, text: '待同步' },
        { code: 2, text: '已同步' },
        { code: 3, text: '超时' }
      ],
    }
  },
  mounted: function () {
    if (this.$route.query.status) {
      this.routeQuery.status = parseInt(this.$route.query.status);
    }
    if (this.$route.query.notifyStatus) {
      this.routeQuery.notifyStatus = parseInt(this.$route.query.notifyStatus);
    }
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
        this.report.orderCount = comp.apiRult.data.total;

        this.notifySyncCount.waitSync = 0;
        this.notifySyncCount.timeout = 0;
        var sysncCountResult = comp.apiRult.data.notifySyncCount;
        if (sysncCountResult) {
          for (let i = 0; i < sysncCountResult.length; i++) {
            if (sysncCountResult[i].notifyStatus == 1) {//待同步
              this.notifySyncCount.waitSync = sysncCountResult[i].notifyCount;
            }
            if (sysncCountResult[i].notifyStatus == 3) {//超时
              this.notifySyncCount.timeout = sysncCountResult[i].notifyCount;
            }
          }
        }
      }
      this.loadNotifyPerfor();
    },
    query() {
      this.$refs.page.query();
    },
    reset: function () {
      Object.assign(this.queryForm, {
        orderId: '',
        tenantOrderId: '',
        tenantId: '',
        tenantName: '',
        status: this.routeQuery.status,
        createTime: this.routeQuery.createTime,
        notifyStatus: this.routeQuery.notifyStatus,
        memberKeyWord: '',
        titleKeyWord: '',
      });
      this.query();
    },
    goOrderDetail: function (row) {
      this.$refs.orderDetail.open(row.orderId);
    },
    showLog: function (row) {
      this.$refs.log.open(row.orderId);
    },
    //同步
    doNotify(row) {
      this.$Modal.confirm({
        title: '同步确认',
        content: '<p>确定同步吗？</p>',
        onOk: () => {
          this.loding = 1;
          this.$http.post('/api/engine/order/notify', { 'orderId': row.orderId }).then((res) => {
            this.loading = 0;
            if (res.data.code === 0) {
              this.$Message.success("操作成功");
              this.$refs.page.load();
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
    //退款
    doRefund(row) {
      this.$Modal.confirm({
        title: '退款确认',
        content: '<p>确定退款吗？</p>',
        onOk: () => {
          var orderPayId = row.orderPayId;
          this.loding = 1;
          this.$http.post('/api/engine/order/refund', { 'orderPayId': orderPayId }).then((res) => {
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
    //导出
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
    //加载同步状态
    loadNotifyPerfor() {
      this.loading = 1;
      var api = "/api/engine/report/summary/notifyperfor";
      var form = {};
      this.$http.post(api, form).then((res) => {
        if (res.data.code === 0) {
          var data = res.data.data;
          this.notifyperfor = data;
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.$Message.error("请求失败，请重新发送")
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