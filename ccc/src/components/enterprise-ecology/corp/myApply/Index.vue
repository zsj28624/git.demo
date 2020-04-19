<template>
  <ListPage
    ref="page"
    title="我的申请"
    api="/api/engine/enterprise-ecology/corp/myApply/list"
    :model="this"
    :beforeLoad="beforeLoad"
  >
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.corpName" placeholder="企业名称" @on-enter="query" />
          </td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.createTime"
              split-panels
              placeholder="提交时间"
              style="width: 180px"
              :clearable="true"
              ::transfer="true"
            ></DatePicker>
          </td>
          <td>
            <Select v-model="queryForm.auditStatus" style="width: 180px" placeholder="审批状态">
              <Option
                v-for="item in auditStatusOption"
                :value="item.code"
                :key="item.code"
              >{{ item.text }}</Option>
            </Select>
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

export default {
  components: {
    ListPage,
    DataRowOperate,
    page,
  },
  data() {
    let that = this;
    return {
      tabName: '1',
      columns: [
        {
          title: '操作',
          width: 150,
          align: 'left',
          render: (h, params) => {
            var row = params.row;
            var btns = [{
              key: 'view',
              text: '查看审批',
            }]
            if (row.auditStatus == 3) {
              btns.push({
                key: 'edit',
                text: '编辑',
              })
            }
            return h(DataRowOperate, {
              props: {
                btns: btns
              },
              on: {
                click: (key) => {
                  if (key == "edit") {
                    this.rowCommand("编辑", params);
                  }
                  if (key == "view") {
                    this.rowCommand("查看审批", params);
                  }
                }
              }
            });
          }
        },
        {
          title: '序号',
          width: 100,
          type: 'index',
          align: 'center',
        },
        {
          title: '企业编号',
          key: 'corpNo',
          align: 'left',
          width: 100,
        },
        {
          title: '企业名称',
          key: 'corpName',
          align: 'center',
          width: 150,
        },
        {
          title: '企业生态分类标签',
          key: 'corporation',
          align: 'center',
          minWidth: 150,
        },
        {
          title: '企业等级',
          key: 'companySize',
          align: 'center',
          width: 100
        },
        {
          title: '审批业务',
          key: 'businessType',
          align: 'center',
          width: 120,
        },
        {
          title: '提交时间',
          key: 'createTime',
          align: 'center',
          width: 200
        },
        {
          title: '审批状态',
          key: 'auditStatus',
          align: 'center',
          width: 100,
          render: (h, params) => {
            var row = params.row;
            var text = "";
            switch (row.auditStatus) {
              case 1:
                text = "待审批";
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
        }
      ],
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        corpName: '',
        page: '',
        pageSize: '',
        createTimeStart: '',
        createTimeEnd: '',
        auditStatus: null,
        createTime:'',
      },
      auditStatusOption: [
        { code: '0', text: '全部' },
        { code: '1', text: '待审批' },
        { code: '2', text: '通过' },
        { code: '3', text: '驳回' },
      ],
      selection: [],
      loading: 0
    }
  },
  mounted: function () {
    this.query();
    this.$bus.$emit('on-page-title-change',"我的申请");
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
      queryParam.managerSign = 1;
    },
    query() {
      this.$refs.page.query();
    },
    reset: function () {
      // 清空条件
      this.queryForm.createTime = '';
      this.queryForm.auditStatus = null;
      this.queryForm.corpName = '';
      this.query();
    },
    select: function (selection) {
      this.selection = selection;
    },
    rowCommand: function (name, params) {
      if (name === '编辑') {
        this.$router.push({ path: '/ecology/corp/ecology/edit?id=' + params.row.applyId + '&corpId=' + params.row.corpId })
        return;
      }
      if (name === '查看审批') {
        this.$router.push({ path: '/ecology/corp/audit/view?applyId=' + params.row.applyId + '&type=' + params.row.businessTypeValue })
        return;
      }
    }
  }
}

</script>

<style type="text/css">
</style>
