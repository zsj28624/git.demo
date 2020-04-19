<template>
  <ListPage
    ref="page"
    title="支付账号"
    api="/api/engine/pay/list"
    :model="this"
    :beforeLoad="beforeLoad"
  >
    <div class="page-tools">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Button @click="add" icon="md-add">添加</Button>
          </td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.keyword" placeholder="标题、支付商户号、appid" @on-enter="query" />
          </td>
          <td>
            <Button @click="query" type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset" type="default">重置</Button>
          </td>
        </tr>
      </table>
    </div>
  </ListPage>
</template>
<script>     
import ListPage from '@/components/page/ListPage';
import DataRowOperate from '@/components/commons/DataRowOperate';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';
export default {
  components: {
    ListPage,
    DataRowOperate,
  },
  data() {
    let that = this;
    return {
      tabName: '1',
      columns: [
        {
          title: 'ID',
          key: 'payId',
          width: 60,
          align: 'center',
        },
        {
          title: '标题',
          key: 'title',
          minWidth: 200,
          render: (h, params) => {
            var row = params.row;
            return h('a', {
              props: {},
              on: {
                click: () => {
                  that.rowCommand("编辑", params)
                }
              }
            }, row.title);
          }
        }, {
          title: '支付类别',
          key: 'payType',
          width: 120,
          render: (h, params) => {
            var row = params.row;
            var text = "";
            switch (row.payType) {
              case 1:
                text = "微信";
                break;
              case 2:
                text = "支付宝";
                break;
              case 3:
                text = "银联";
                break;

              default:
                break;
            }
            return h('label', text);
          }
        },
        {
          title: '商户号',
          key: 'payNo',
          width: 180,
        },
        {
          title: '微信 appid',
          key: 'wxAppId',
          width: 180,
        },
        {
          title: '支付宝 appid',
          key: 'alipayAppId',
          width: 180,
        },
        {
          title: '租户',
          key: 'tenantCount',
          width: 100,
          align: "center",
          render: (h, params) => {
            var row = params.row;
            return h('a', {
              props: {},
              on: {
                click: () => {
                  that.selectTenant(row)
                }
              }
            }, row.tenantCount + " 个租户");
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
          width: 160,
        }
      ],
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        keyword: '',
        page: '',
        pageSize: ''
      },
      selection: [],
      loading: 0
    }
  },
  mounted: function () {
    this.query();
  },
  computed: {},
  methods: {
    goTab(index) {
      var pages = ['/admin', '/provider'];
      this.$router.push({ path: pages[index] });
    },
    beforeLoad() {

    },
    query() {
      this.$refs.page.query();
    },
    reset: function () {
      // 清空条件
      this.queryForm.keyword = '';
      this.query();
    },
    select: function (selection) {
      this.selection = selection;
    },
    rowCommand: function (name, params) {
      if (name === '查看租户') {
        this.selectTenant(params.row);
        return;
      }
      if (name === '编辑') {
        this.update(params.row.payId);
        return;
      }
      if (name === '删除') {
      
      }
    },
    goBack: function () {
      this.$router.go(-1);
    },
    add: function () {
      this.$router.push({ path: '/pay/edit' })
    },
    update: function (id) {
      this.$router.push({
        path: '/pay/edit?id=' + id
      })
    },
    selectTenant: function (row) {
      this.$router.push({
        path: '/pay/tenantList?payId=' + row.payId + '&payNo=' + row.payNo
      })
    }
  }
}

</script>

<style type="text/css">
</style>
