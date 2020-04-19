<template>
  <ListPage
    ref="page"
    title="无归属企业管理"
    api="/api/engine/enterprise-ecology/corp/list"
    :model="this"
    :beforeLoad="beforeLoad"
  >
    <div class="page-tools" slot="page-tools">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Button @click="selMangager" icon="md-add">分配生态管理员</Button>
          </td>
           <td>
            <Button @click="selMerchants" icon="md-add">分配招商人员</Button>
          </td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.corpName" placeholder="企业名称" @on-enter="query" style="width: 210px"/>
          </td>
          <td>
            <Select v-model="queryForm.ecologyType" style="width: 210px" placeholder="所属生态分类" filterable>
              <Option v-for="item in ecologyType" :value="item.id" :key="item.name">{{ item.name }}</Option>
            </Select>
          </td>
          <td>
            <Input v-model="queryForm.managerName" placeholder="生态管理员" @on-enter="query" style="width: 210px" />
          </td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.createTime"
              split-panels
              placeholder="加入日期"
              style="width: 210px"
              :clearable="true"
              ::transfer="true"
            ></DatePicker>
          </td>
        </tr>
        <br />
        <tr>
          <td>
            <Select v-model="queryForm.level" placeholder="企业级别" style="width: 210px">
              <Option
                v-for="item in level"
                :value="item.argCode"
                :key="item.argCode"
              >{{ item.argText }}</Option>
            </Select>
          </td>
          <td>
            <Select v-model="queryForm.cooperationDirection" placeholder="产业合作方向" style="width: 210px">
              <Option
                v-for="item in cooperationDirection"
                :value="item.argCode"
                :key="item.argCode"
              >{{ item.argText }}</Option>
            </Select>
          </td>
          <td>
            <Input v-model="queryForm.cooperationIntentcity" placeholder="意向城市" @on-enter="query" style="width: 210px" />
          </td>
          <td>
            <Button @click="query" type="primary" icon="ios-search">查询</Button>
            <Button @click="reset" type="default">重置</Button>
          </td>
        </tr>
      </table>
    </div>
    <RoleEdit ref="editRole" @on-save="query"></RoleEdit>
    <ChangeManagerEdit ref="ChangeManagerEdit" @on-save="query"></ChangeManagerEdit>
    <MerchantsEdit ref="MerchantsEdit" @on-save="query"></MerchantsEdit>
  </ListPage>
</template>
<script>    
import RoleEdit from '@/components/frame/RoleEdit';
import ListPage from '@/components/page/ListPage';
import DataRowOperate from '@/components/commons/DataRowOperate';
import page from '@/assets/js/page';
import ChangeManagerEdit from '@/components/enterprise-ecology/uncategorized/ChangeManagerEdit';
import MerchantsEdit from '@/components/enterprise-ecology/uncategorized/MerchantsEdit';

export default {
  components: {
    RoleEdit,
    ListPage,
    DataRowOperate,
    page,
    ChangeManagerEdit,
    MerchantsEdit,
  },
  data() {
    let that = this;
    return {
      tabName: '1',
      columns: [
        {
          type: 'selection',
          width: 40,
          align: 'center',
        },
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 50,
        },
        {
          title: '企业名称',
          key: 'corpName',
          align: 'left',
          minWidth: 170,
          render: (h, params) => {
            var row = params.row;
            var btns = [];

            btns.push(h('span', {
              props: {
                size: 'small',
                type: 'warning',
              },
              on: {
                click: () => {
                  this.sel(row.id);
                }
              }
            }, row.corpName));
            return h('a',btns);
          }
        },
        {
          title: '企业级别',
          key: 'level',
          align: 'center',
          minWidth: 100
        },
        {
          title: '企业法人',
          key: 'corporation',
          align: 'center',
          width: 100,
        },
        {
          title: '年销售额（元）',
          key: 'usd',
          align: 'right',
          width: 150,
        },
        {
          title: '企业对接人',
          key: 'contactName',
          align: 'center',
          minWidth: 100
        },
        {
          title: '对接人电话',
          key: 'contactPhone',
          align: 'center',
          width: 100,
        },
        {
          title: '对接人职务',
          key: 'contactPosition',
          align: 'center',
          width: 150,
        },
        {
          title: '注册资金（元）',
          key: 'registeredCapital',
          align: 'right',
          width: 150,
        },
        {
          title: '生态管理员',
          key: 'managerName',
          align: 'center',
          width: 100,
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
        ecologyType:'',
        managerName:'',
        level:'',
        cooperationDirection:'',
        cooperationIntentcity:'',
        createTime:'',
      },
      action: [
        { code: '大型', text: '大型' },
        { code: '中型', text: '中型' },
        { code: '小型', text: '小型' },
      ],
      cooperationDirection:[
        { argCode: '方向1', argText: '方向1' },
        { argCode: '方向2', argText: '方向2' },
        { argCode: '方向3', argText: '方向3' },
      ],
      selection: [],
      loading: 0,
      level: [],
      ecologyType:[],
      cooperationDirection:[],
    }
  },
  mounted: function () {
    this.queryEcologyType();
    this.level = page.$args.getArgGroup("enterprise_level");
    //this.queryArg("enterprise_level");
    this.query();
  },
  computed: {},
  methods: {
    goTab(index) {
      var pages = ['/admin', '/role'];
      this.$router.push({ path: pages[index] });
    },
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
        queryParam.managerSign = 0;
    },
    query() {
      this.$refs.page.query();
    },
    reset: function () {
      // 清空条件
      this.queryForm.ecologyType = null;
      this.queryForm.managerName = '';
      this.queryForm.corpName = '';
      this.queryForm.level = null;
      this.queryForm.createTime = '';
      this.queryForm.cooperationDirection = null;
      this.queryForm.cooperationIntentcity = '';
      this.query();
    },
    rowCommand: function (name, params) {
      if (name === '查看') {
        this.sel(params.row.id);
        return;
      }
    },
    goBack: function () {
      this.$router.go(-1);
    },
    exportDown() {
      this.$refs.page.exportDown();
    },
    add: function () {
      this.$router.push({ path: "/ecology/corp/edit?forward" });
    },
    sel: function (corpId) {
      this.$router.push({ path: "/ecology/selcorp/edit?corpId=" + corpId });
    },
    updateMangager: function(selectList){
      this.$refs.ChangeManagerEdit.openList(selectList);
    },
    updateMerchants: function(selectList){
      this.$refs.MerchantsEdit.openList(selectList);
    },
    updateEcology(corpId){
      this.$router.push({ path: "/ecology/corp/ecology?corpId=" + corpId });
    },
    updateTrace(corpId){
      this.$router.push({ path: "/ecology/corp/trace/edit?corpId=" + corpId });
    },
    queryArg(argGroup) {
      this.$http.post('/api/engine/arg/list?', { argGroup: argGroup }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          if (argGroup == "enterprise_level") {
            this.level = res.data.data;
          }
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    queryEcologyType() {
      this.$http.post('/api/engine/enterprise-ecology/corp/typelist?', {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          var treeList = res.data.data.rows;
          var tree = [{name: "全部",id: "",parentId: 0}];
          treeList.map((row)=>{
            row._checked = false;
            if(this.enableCheckStatus){
              if(typeof(row[this.idPath]) != 'undefined'){
                row._checked = this.checkIds.indexOf(row[this.idPath])>=0;
              }
            }
            if(row.parentId == 0){
              tree.push(row);
              for (var i = 0; i < treeList.length; i++) {
                if(row.id == treeList[i].parentId){
                  tree.push(treeList[i]);
                }
              }
            }
          });
          this.ecologyType = tree;
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    selMangager(){
      var selectList = this.$refs.page.getSelection();
      if(selectList.length==0){
        this.$Message.error('请至少选择一条数据');
        return;
      }
      this.updateMangager(selectList);
    },
    selMerchants(){
      var selectList = this.$refs.page.getSelection();
      if(selectList.length==0){
        this.$Message.error('请至少选择一条数据');
        return;
      }
      this.updateMerchants(selectList);
    },
    selEcology(){
      var selectList = this.$refs.page.getSelection();
      if (selectList.length == 0) {
        this.$Message.error('请选择一条数据');
        return;
      }
      if(selectList.length > 1){
        this.$Message.error('只能选择一条数据');
        return;
      }
      this.updateEcology(selectList[0].id);
    }
  }
}

</script>

<style type="text/css">
</style>
