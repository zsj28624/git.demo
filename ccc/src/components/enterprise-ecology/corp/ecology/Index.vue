<template>
  <ListPage
    ref="page"
    title
    api="/api/engine/enterprise-ecology/corp/ecology/list"
    :model="this"
    :beforeLoad="beforeLoad"
    @on-load="onLoadData"
  >
    <CorpTabs tabvalue="stxx" :corpId="corpId"></CorpTabs>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
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
            <Button @click="query" type="primary">查询</Button>
          </td>
          <td>
            <Button @click="reset" type="default">重置</Button>
          </td>
          <td>
            <Button
              @click="add"
              type="primary"
              v-if="lastAuditStatus==2||lastAuditStatus==-1"
            >升级企业生态信息</Button>
            <Button type="primary" v-else disabled>升级企业生态信息</Button>
          </td>
        </tr>
      </table>
    </div>
  </ListPage>
</template>
<script>     
import ListPage from '@/components/page/ListPage';
import page from '@/assets/js/page';
import CorpTabs from '@/components/enterprise-ecology/corp/Tabs';

export default {
  components: {
    ListPage, CorpTabs
  },
  data() {
    let that = this;
    return {
      corpId: 0,//企业客户id
      tabName: '1',
      columns: [
        {
          title: '操作',
          width: 120,
          render: (h, params) => {
            var row = params.row;
            var btns = [];
            if (row.auditStatus == 0 || row.auditStatus == 3) {
              btns.push(h('Button', {
                props: {
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.edit(row.id)
                  }
                }
              }, '编辑'));
            } else {
              btns.push(h('Button', {
                props: {
                  size: 'small',
                  disabled: true
                },
              }, '编辑'));
            }

            btns.push(h('span', { domProps: { innerHTML: '&nbsp;&nbsp;' } }));
            btns.push(h('Button', {
              props: {
                size: 'small',
                type: 'warning'
              },
              on: {
                click: () => {
                  this.view(row.id)
                }
              }
            }, '查看'));
            return h('div', btns);
          }
        }, {
          title: '序号',
          width: 100,
          type: 'index',
          align: 'center',
        }, {
          title: '所属生态分类【标签】',
          key: 'ecologyTypeTag',
          align: 'left',
          minWidth:150,
          render: (h, params) => {
            return h('div', {
              domProps: {
                innerHTML: params.row.ecologyTypeTag
              }
            });
          }
        }, {
          title: '企业等级',
          key: 'level',
          width: 150,
        }, {
          title: '有效期',
          align: 'center',
          key: 'validityBeginTime',
          width: 180,
          render: (h, params) => {
            var row = params.row;
            return h('label',
              (row.validityBeginTime && row.validityBeginTime.length >= 10 ? row.validityBeginTime.substring(0, 10) : row.validityBeginTime)
              + ' 至 '
              + (row.validityEndTime && row.validityEndTime.length >= 10 ? row.validityEndTime.substring(0, 10) : row.validityEndTime));
          }
        }, {
          title: '审批状态',
          key: 'auditStatus',
          align: 'center',
          width: 100,
          render: (h, params) => {
            var row = params.row;
            var text = "";
            switch (row.auditStatus) {
              case 0:
                text = "保存";
                break;
              case 1:
                text = "审批中";
                break;
              case 2:
                text = "通过";
                break;
              case 3:
                text = "驳回";
                break;
              default:
                break;
            }
            return h('label', text);
          }
        }, {
          title: '生态管理员',
          key: 'creatorName',
          width: 100,
          align: 'center',
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
        page: '',
        pageSize: '',
      },
      selection: [],
      loading: 0,
      lastAuditStatus: 0,//最后一次审核状态
    }
  },
  mounted: function () {
    this.corpId = this.$route.query.corpId;
    if (this.corpId) {
      this.corpId = parseInt(this.corpId);
      this.query();
    } else {
      this.$Message.error("缺少参数");
      this.$router.go(-1);
    }
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
      queryParam.corpId = this.corpId;
    },
    onLoadData(data) {
      if (data.apiRult && data.apiRult.data && data.apiRult.data.total > 0) {
        this.lastAuditStatus = data.apiRult.data.rows[0].auditStatus;
      } else {
        this.lastAuditStatus = -1;
      }
    },
    query() {
      this.$refs.page.query();
    },
    add: function () {
      this.$router.push({ path: '/ecology/corp/ecology/edit?corpId=' + this.corpId })
    },
    edit: function (id) {
      this.$router.push({ path: '/ecology/corp/ecology/edit?id=' + id + '&corpId=' + this.corpId })
    },
    view: function (id) {
      this.$router.push({ path: '/ecology/corp/ecology/view?id=' + id + '&corpId=' + this.corpId })
    },
    reset: function () {
      Object.assign(this.queryForm, {
        createTime: [],
      });
      this.query();
    },
    select: function (selection) {
      this.selection = selection;
    },
  }
}

</script> 
<style>
.order-row-content {
  color: #999;
}
</style>