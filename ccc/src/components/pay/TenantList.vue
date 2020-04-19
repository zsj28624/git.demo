<template>
  <ListPage ref="page" :title="pageTitle" :api="api" :model="this" :beforeLoad="beforeLoad">
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.keyword" placeholder="租户名称查询" @keyup.enter.native="query" />
          </td>
          <td>
            <Button @click="query" type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset">重置</Button>
          </td>
          <td>
            <Button size="small" @click="goBack" icon="ios-arrow-back" type="warning">返回</Button>
          </td>
        </tr>
      </table>
    </div>
  </ListPage>
  <!-- </div> -->
</template>
<script>
import ListPage from '@/components/page/ListPage';
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import page from '@/assets/js/page';

export default {
  components: {
    Loading,
    ListPage,
    LayoutHor
  },
  data() {
    let that = this;
    return {
      api: "/api/engine/tenant/list?payId=" + this.$route.query.payId,
      pageTitle: this.$route.query.payNo + ' — 租户列表',
      columns: [
        {
          title: '租户名称',
          key: 'tenantName',
          width: 300
        },
        {
          title: '租户appKey',
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
          title: '状态',
          key: 'status',
          align: 'center',
          width: 60,
          render: (h, params) => {
            var status = params.row.status;
            var setButton = "正常";
            if (status == 2) {
              setButton = "禁用";
            }
            return h('span', { class: 'status-' + status }, setButton);
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
          width: 150
        },


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
    goBack() {
      this.$router.go(-1);
    },
  }
}

</script>
  