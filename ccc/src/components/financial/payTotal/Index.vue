<template>
  <ListPage
    ref="page"
    api="/api/engine/order/summary"
    :model="this"
    :beforeLoad="beforeLoad"
    @on-load="onLoadData"
  >
    <div class="page-title" slot="page-title">汇总表</div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.tenantName" placeholder="租户名称" @keyup.enter.native="query"></Input>
          </td>
          <td>
            <Select
              v-model="queryForm.payType"
              placeholder="支付方式"
              style="width: 120px"
              clearable
              @on-change="query"
            >
              <Option
                v-for="item in payTypeOption"
                :value="item.code"
                :key="item.code"
              >{{ item.text }}</Option>
            </Select>
          </td>
          <td>
            <Select
              clearable
              v-model="queryForm.status"
              placeholder="支付状态"
              style="width: 120px"
              @on-change="query"
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
          <td>
            <Button @click="query" type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset">重置</Button>
          </td>
          <td>&nbsp;</td>
          <td>
            <!-- <Button @click="exportDown" type="info" icon="ios-download-outline">导出</Button> -->
          </td>
        </tr>
      </table>
    </div>
  </ListPage>
</template>
<script>
import ListPage from '@/components/page/ListPage';
import ListPageDetail from '@/components/page/ListPageDetail'; 
import UploadBox from '@/components/upload/Index';
import page from '@/assets/js/page';

export default {
  components: {
    ListPage, 
    ListPageDetail,
    UploadBox,
  },
  data() {
    let that = this;
    return {
      curRow: null,
      statusOption: [
        { code: 1, text: '创建' },
        { code: 2, text: '已支付' },
        { code: 8, text: '已退款' },
        { code: 9, text: '关闭' },
      ],
      payTypeOption: [
        { code: 1, text: '微信' },
        { code: 2, text: '支付宝' }
      ],
      notifyStatusOption: [
        { code: 1, text: '待通知' },
        { code: 2, text: '已通知' },
        { code: 3, text: '超时' }
      ],
      columns: [
        {
          title: '序号',
          width: 60,
          type: 'index',
          align: 'center',
        },
        {
          title: '租户名称',
          key: 'tenantName',
          align: 'left',
          width: 180,
        },
        {
          title: '业务订单编码',
          key: 'tenantOrderId',
          align: 'left',
          minWidth: 180,
        },
        {
          title: '支付订单编码',
          key: 'orderId',
          align: 'left',
          width: 170,
        },
        {
          title: '支付流水',
          key: 'outerId',
          align: 'left',
          width: 180
        },
        {
          title: '支付方式',
          key: 'payType',
          align: 'center',//类型（1.微信 2.支付宝）
          width: 100,
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
          title: '支付金额(元)',
          key: 'amount',
          align: 'right',
          width: 110,
        },
        {
          title: '预支付状态',
          key: 'orderPayStatus',
          width: 120,
          render: (h, params) => {
            var row = params.row;
            var text = "";
            switch (row.orderPayStatus) {
              //状态 1.创建 2.已支付 8.已退款 9.关闭
              case 1:
                text = "创建";
                break;
              case 2:
                text = "已支付";
                break;
              case 8:
                text = "已退款";
                break;
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
          title: '业务同步状态',
          key: 'notifyStatus', 
          width: 100,
          render: (h, params) => {
            var row = params.row;
            var text = "";
            switch (row.notifyStatus) {
              case 1:
                text = "待通知";
                break;
              case 2:
                text = "已通知";
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
        {
          title: '通知',
          width: 60,
          align: 'center',
          render: (h, params) => {
            var row = params.row;
            var btns = [];
            if (row.notifyStatus == 3) { 
              btns.push(h('Button', {
                props: {
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.doNotify(row)
                  }
                }
              }, '通知'));
            }
            return h('div', btns);
          }
        },
        {
          title: ' '
        },
      ],
      queryForm: {
        tenantName: '',
        orderId: '',
        status: '',
        payType: '',
        orderPayStatus: '',
        notifyStatus: '',
        createTime: [page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())],
        page: '',
        pageSize: '',
      },
      loading: 0
    }
  },
  mounted: function () {
    this.reset();
  },
  methods: {
    query() {
      this.$refs.page.query();
    },
    beforeLoad() {

    },
    onLoadData(comp) {
      if (comp.apiRult && comp.apiRult.data.sum) {
        var obj = { 'tenantName': '汇总合计：', 'amount': comp.apiRult.data.sum.amountSum };
        comp.apiRult.data.rows.push(obj);
      }
    },
    exportDown() {
      this.$refs.page.exportDown();
    },
    reset: function () {
      Object.assign(this.queryForm, {
        orderId: '',
        tenantName: '',
        status: '',
        payType: '',
        createTime: [page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())],
        orderPayStatus: '',
        notifyStatus: '',
      });
      this.query();
    },
    goPage(page) {
      this.$router.push({ path: page });
    },
    doNotify(row) {
          this.$Modal.confirm({
          title: '通知确认',
          content: '<p>确定通知吗？</p>',
          onOk: () => {
            var orderId = row.orderId;
            this.loding = 1;  
            this.$http.post('/api/engine/order/notify?orderId=' + orderId, {}).then((res) => {
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
  }
}

</script>

<style type="text/css">
</style>
