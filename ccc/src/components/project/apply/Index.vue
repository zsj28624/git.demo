<template>
  <ListPage ref="page" title="我的申请" api="/api/engine/project/audit/list" 
  :model="this" :beforeLoad="beforeLoad" @onCurrentRowChange="curRowChg">
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.name"  placeholder="项目名称" style="width: 180px"  @on-enter="query"/>
          </td>
          <td>
            <Select v-model="queryForm.status" style="width: 120px" placeholder="审批状态">
              <Option v-for="item in status" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </td>
          <td>
            <Select v-model="queryForm.applyType" style="width: 120px" placeholder="申请类型">
              <Option v-for="item in applyType" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.createTime"
              split-panels
              placeholder="申请日期"
              style="width: 180px;"
              :clearable="true"
              ::transfer="true"
            ></DatePicker>
          </td>
          <td>
            <Button @click="query"  type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset"  type="default">重置</Button>
          </td>
        </tr>
      </table>
    </div>
    <Edit ref="Edit" @on-save="query"></Edit>
  </ListPage> 
</template>
<script>    
  import ListPage from '@/components/page/ListPage';
  import DataRowOperate from '@/components/commons/DataRowOperate';
  import Edit from '@/components/project/apply/Edit';
  import SelArea from '@/components/selarea/index';
  import areajs from '@/assets/js/area';
  import page from '@/assets/js/page';

  export default {
    components: {
      ListPage,
      DataRowOperate,
      Edit,
      SelArea
    },
    data() {
      let that = this;
      return {
        tabName:'1',
        columns: [
          {
            title:'操作',
            width: 180,
            align: 'center',
            render:(h,params)=>{
              var row = params.row;
              return h(DataRowOperate,{
                props:{
                  btns:[
                  {
                    key:'audit',
                    text:'审批结果',
                    disabled:row.status<2||!this.$user.hasPower('xmgl.wdsq.view'),
                  },
                  {
                    key:'view',
                    text:'查看详情',
                    disabled:!this.$user.hasPower('xmgl.wdsq.goEdit'),
                  }]
                },
                on:{
                  click:(key)=>{
                    if(key=="audit"){
                      this.rowCommand("审批结果",params);
                    }
                    if(key=="view"){
                      this.rowCommand("查看详情",params);
                    }
                  }
                }
              });
            }
          },
          {
            title: '序号',
            width: 100,
            type:'index',
            align: 'center',
          },  
          {
            title: '项目名称',
            key: 'name',
            minWidth:200,
          }, 
          {
            title: '行业',
            key: 'industry',
            width:120,
          }, 
          {
            title: '需求类型',
            key: 'requirementType',
            width:120,
          },
          {
            title: '所属园区',
            key: 'campusName',
            width:150,
          },
          {
            title: '所属部门',
            key: 'deptName',
            width:120,
          },
          {
            title: '审批业务',
            key: 'applyType',
            width:120,
          },
          {
            title: '申请人',
            key: 'applyPeopleName',
            width:120,
          },
          page.table.initDateColumn({
            title: '申请日期',
            key: 'applyTime',
          }),
          page.table.initMapColumn({
            title: '审批状态',
            key: 'status',
            data:{
              '0':'待提交',
              '1':'待审批',
              '2':'通过',
              '3':'驳回',
            }
          }),
        ],
        status: [{code:1,text:'待审批'},{code:2,text:'通过'},{code:3,text:'驳回'}],
        applyType: [{code:'申请入库',text:'申请入库'},{code:'申请重点项目',text:'申请重点项目'},{code:'申请签约',text:'申请签约'},{code:'申请延期',text:'申请延期'}],
        list: [],
        dept: [],
        total:0,
        queryParam: {},
        queryForm: {
          name: '',
          status:null,
          applyPeople:this.$user.userId,
          applyType:'',
          //createTime:[page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())],
          createTime:[],
        },
        selection: [],
        curRow:{},
        loading: 0
      }
    },
    mounted: function () {
      this.query();
      this.loadDept();
      this.$bus.$emit('on-page-title-change',"我的申请");
    },
    computed: {},
    methods: {
      beforeLoad(){
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
      query() {
        this.$refs.page.query();
      },
      loadDept(){
        this.loading = 1;
        this.$http.post('/api/engine/dept/list', {}).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
             if(res.data.data){
              this.dept = res.data.data; 
             }
             this.loading = 0;
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
      },
      reset: function () {
        // 清空条件
        Object.assign(this.queryForm, {
          name: '',
          status:null,
          applyPeople:this.$user.userId,
          applyType:'',
          createTime:[],
        });
        this.query();
      },
      select: function (selection) {
        this.selection = selection;
      },
      curRowChg(row){
        if(row!=null){
           this.curRow = row;
        }else{
          this.curRow = null;
        }
      },
      rowCommand: function (name, params) {
        if (name === '查看详情') {
          this.goEdit(params.row);
          return;
        }
        if (name === '审批结果') {
          this.$refs.Edit.open(params.row);
          return;
        }
        this.query();
      },
      goEdit(row){
        if(row.projectId!=null&&row.projectId!='申请入库'){
          this.$router.push({ path: "/project/myedit?projectId="+ row.projectId+"&source=wdsq"});
          return;
        }
        if(row.projectId!=null&&row.projectId!='申请重点项目'){
          this.$router.push({ path: "/project/myimport?projectId="+ row.projectId+"&source=wdsq" });
          return;
        }
        if(row.projectId!=null&&row.projectId!='申请签约'){
          this.$router.push({ path: "/project/mysign?projectId="+ row.projectId+"&source=wdsq" });
          return;
        }
        if(row.projectId!=null&&row.projectId!='申请延期'){
          this.$router.push({ path: "/project/myedit?projectId="+ row.projectId+"&source=wdsq" });
          return;
        }
      },
      goBack: function () {
        this.$router.go(-1);
      },
    }
  }

</script>

<style type="text/css">

</style>
