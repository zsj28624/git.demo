<template>
  <ListPage
    ref="page"
    title="生态业务审批"
    api="/api/engine/enterprise-ecology/corp/audit/list"
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
            <Input v-model="queryForm.creatorName" placeholder="提交人" @on-enter="query" />
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
    <RoleEdit ref="editRole" @on-save="query"></RoleEdit>
    <ChangeManagerEdit ref="ChangeManagerEdit" @on-save="query"></ChangeManagerEdit>
  </ListPage>
</template>
<script>    
import RoleEdit from '@/components/frame/RoleEdit';
import ListPage from '@/components/page/ListPage';
import DataRowOperate from '@/components/commons/DataRowOperate';
import page from '@/assets/js/page';
import ChangeManagerEdit from '@/components/enterprise-ecology/corp/ChangeManagerEdit';

export default {
  components: {
    RoleEdit,
    ListPage,
    DataRowOperate,
    page,
    ChangeManagerEdit,
  },
  data() {
    let that = this;
    return {
      tabName: '1',
      columns: [
        {
          title: '操作',
          width: 100,
          align: 'left',
          render: (h, params) => {
            var row = params.row;
            var btns = [{
              key: 'view',
              text: '查看',
            }]
            if (row.auditStatus == 1) {
              btns.push({
                key: 'edit',
                text: '审批',
              })
            }
            return h(DataRowOperate, {
              props: {
                btns: btns
              },
              on: {
                click: (key) => {
                  if (key == "edit") {
                    this.rowCommand("审批", params);
                  }
                  if (key == "view") {
                    this.rowCommand("查看", params);
                  }
                }
              }
            });
          }
        },
        {
          title: '序号',
          width: 50,
          type: 'index',
          align: 'center',
        },
        {
          title: '企业名称',
          key: 'corpName',
          align: 'left',
          minWidth:200,
        },
        {
          title: '企业生态分类',
          key: 'corporation',
          align: 'center',
          width: 100,
        },
        {
          title: '企业等级',
          key: 'companySize',
          align: 'center',
          minWidth: 100
        },
        {
          title: '审批业务',
          key: 'businessType',
          align: 'right',
          width: 150,
        },
        page.table.initDateColumn({
          title: '提交日期',
          key: 'createTime',
          align: 'center',
        }),
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
        auditStatus: '',
        page: '',
        pageSize: '',
        createTimeStart: '',
        createTimeEnd: '',
        creatorName: '',
      },
      auditStatusOption: [
        { code: '', text: '全部' },
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
    this.$bus.$emit('on-page-title-change',"生态业务审批");
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
      this.queryForm.corpName = '';
      this.queryForm.auditStatus = '';
      this.queryForm.page = '';
      this.queryForm.pageSize = '';
      this.queryForm.createTimeStart = '';
      this.queryForm.createTimeEnd = '';
      this.queryForm.creatorName = '';
      this.query();
    },
    select: function (selection) {
      this.selection = selection;
    },
    rowCommand: function (name, params) {
      if (name === '审批') {
        this.$router.push({ path: '/ecology/corp/audit/audit?applyId=' + params.row.applyId + '&type=' + params.row.businessTypeValue })
        return;
      }
      if (name === '查看') {
        this.$router.push({ path: '/ecology/corp/audit/view?applyId=' + params.row.applyId + '&type=' + params.row.businessTypeValue })
        return;
      }
    }
  }
}

</script>

<style type="text/css">
</style>
