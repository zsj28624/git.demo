<template>
  <ListPage
    ref="page"
    title="租户管理"
    api="/api/engine/tenant/list"
    :model="this"
    :beforeLoad="beforeLoad"
  >
    <div class="page-tools">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Button @click="add" v-power icon="md-add">添加</Button>
          </td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.keyword" placeholder="租户名称查询" @keyup.enter.native="query"></Input>
          </td>
          <td>
            <Button @click="query" type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset">重置</Button>
          </td>
        </tr>
      </table>
    </div>
  </ListPage>
</template>
<script>
import ListPage from '@/components/page/ListPage';
import DataRowOperateBar from '@/components/commons/DataRowOperateBar';
import Loading from '@/components/loading';
import page from '@/assets/js/page';
import DataRowOperate from '@/components/commons/DataRowOperate';

export default {
  components: {
    DataRowOperateBar,
    Loading,
    ListPage,
    DataRowOperate
  },
  data() {
    let that = this;
    return {
      columns: [
        {
          title: '租户ID',
          key: 'tenantId',
          width: 80,
          align: "center"
        },
        {
          title: '租户名称',
          key: 'tenantName',
          width: 300,
          render: (h, params) => {
            var row = params.row;
            return h('a', {
              props: {

              },
              on: {
                click: () => {
                  that.goEdit(row)
                }
              }
            }, row.tenantName);
          }
        },
        {
          title: '租户AppKey',
          key: 'appKey',
          width: 250
        },
        // {
        //   title: '白名单',
        //   key: 'whiteList',
        //   width: 150
        // },
        {
          title: '描述',
          key: 'description',
          minWidth: 150
        },
        {
          title: '启用',
          key: 'status',
          align: 'center',
          width: 100,
          render: (h, params) => {
            var row = params.row;
            return h('i-switch', {
              props: {
                size: 'small',
                value: row.status == 1,
              },
              on: {
                'on-change': (check) => {
                  if (check) {
                    row.status = 1;
                    that.updateStatus(row);
                  } else {
                    row.status = 2;
                    that.updateStatus(row);
                  }
                }
              }
            });
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
          width: 150
        }
      ],
      queryForm: {
        keyword: '',
        industry: '',
      },
    }
  },
  mounted() {
    this.reset();
  },
  computed: {},
  methods: {
    query() {
      this.$refs.page.query();
    },
    beforeLoad() {

    },
    reset() {
      Object.assign(this.queryForm, {
        keyword: '',
        industry: '',
      });
      this.query();
    },
    add() {
      this.$router.push({ path: '/tenant/edit' })
    },
    goEdit(item) {
      this.$router.push({
        path: '/tenant/edit?id=' + item.tenantId
      })
    },
    //禁用启用
    updateStatus(row) {
      this.$http.post('/api/engine/tenant/status/update', row).then((res) => {
        if (res.data.code === 0) {
          if (row.status == 1) {
            this.$Message.success("启用成功");
          } else {
            this.$Message.success("禁用成功");
          }
          this.$refs.page.load();
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.$Message.error(error.toString())
      });
    },
  }
}

</script>

<style type="text/css">
.customerlist .status-2 {
  color: #ff6600;
}
</style>
