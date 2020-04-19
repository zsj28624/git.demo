<template>
  <ListPage ref="page" title="项目信息库" api="/api/engine/project/list" 
  :model="this" :beforeLoad="beforeLoad" @onCurrentRowChange="curRowChg">
    <div class="page-tools" slot="page-tools">
      <table cellpadding="0" cellspacing="0">
        <tr>  
            <!-- <td>
              <Button  @click="add" icon="md-add" style="background-color: #2db7f5;color: #fff; " >添加项目</Button>
            </td> 
            <td>
              <Button  @click="download" icon="ios-download-outline" v-power="'xmgl.xmxxk.download'" style="background-color: #2db7f5;color: #fff; ">导入项目</Button>
            </td>-->
            <td>
              <UploadButton @on-upload="importExcel"></UploadButton>
            </td>
            <td>
              <Button  @click="distribution" icon="compose" v-power="'xmgl.xmxxk.distribution'" style="background-color: #2db7f5;color: #fff; ">分配项目</Button>
            </td>
            <td>
              <Button @click="exportDownModel" type="info" icon="ios-download-outline">下载模板</Button>
          </td>
        </tr> 
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.name"  placeholder="项目名称" style="width: 170px;"  @on-enter="query"/>
          </td>
          <td>
            <Input v-model="queryForm.operatorName"  placeholder="负责人" style="width: 170px;"  @on-enter="query"/>
          </td>
          <td>
            <Select v-model="queryForm.deptId" style="width: 170px;" placeholder="所属部门">
              <Option v-for="item in dept" :value="item.id" :key="item.id">{{ item.deptName }}</Option>
            </Select>
          </td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.stockinTime"
              split-panels
              placeholder="入库日期"
              style="width: 180px;"
              :clearable="true"
              ::transfer="true"
            ></DatePicker>
          </td> 
        </tr>
        <br />
        <tr>
          <td>
            <Select v-model="queryForm.projectStatus" style="width: 170px;" placeholder="保护期">
              <Option v-for="item in protect" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </td>
          <td>
            <Select v-model="queryForm.step" style="width: 170px;" placeholder="项目阶段">
              <Option v-for="item in step" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </td>
          <td>
            <Select v-model="queryForm.requirementType" style="width: 170px;" placeholder="需求类型">
              <Option v-for="item in type" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.projectTraceTime"
              split-panels
              placeholder="跟进日期"
              style="width: 180px;"
              :clearable="true"
              ::transfer="true"
            ></DatePicker>
          </td>    
          <td>
            <Button @click="query"  type="primary" icon="ios-search">查询</Button>
            <Button @click="reset"  type="default">重置</Button>
          </td>
        </tr>
      </table>
    </div>
    <ChangePeople ref="ChangePeople" @on-save="query"></ChangePeople>
  </ListPage> 
</template>
<script>    
  import ListPage from '@/components/page/ListPage';
  import DataRowOperate from '@/components/commons/DataRowOperate';
  import ChangePeople from '@/components/project/project/ChangePeople';
  import SelArea from '@/components/selarea/index';
  import areajs from '@/assets/js/area';
  import page from '@/assets/js/page';
  import UploadButton from '@/components/upload/UploadButton';

  export default {
    components: {
      ListPage,
      DataRowOperate,
      ChangePeople,
      SelArea,
      UploadButton
    },
    data() {
      let that = this;
      return {
        tabName:'1',
        columns: [
          {
            title:'操作',
            width: 100,
            align: 'center',
            render:(h,params)=>{
              var row = params.row;
              return h(DataRowOperate,{
                props:{
                  btns:[{
                    key:'edit',
                    disabled:!this.$user.hasPower('xmgl.xmxxk.edit'),
                  },
                  /*{
                    key:'delete',
                    disabled:row.step !='待入库'||!this.$user.hasPower('xmgl.xmxxk.delete'),
                  },*/
                  ]
                },
                on:{
                  click:(key)=>{
                    if(key=="edit"){
                      this.rowCommand("编辑",params);
                    }
                    if(key=="delete"){
                      this.rowCommand("删除",params);
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
            title: '项目阶段',
            key: 'step',
            width:120,
          }, 
          {
            title: '保护期',
            key: 'projectStatus',
            width:120,
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
          page.table.initDateColumn({
            title: '入库时间',
            key: 'stockinTime',
          }),
          {
            title: '跟进次数',
            key: 'projectTraceNumber',
            width:120,
          },
          {
            title: '延期次数',
            key: 'defermentNumber',
            width:120,
          },
          page.table.initDateColumn({
            title: '最近跟进日期',
            key: 'projectTraceTime',
          }),
          {
            title: '意向区域',
            key: 'campusName',
            width:150,
          },
          {
            title: '负责人',
            key: 'operatorName',
            width:120,
          },
          {
            title: '所属部门',
            key: 'deptName',
            width:120,
          }
        ],
        protect: [{code:'保护',text:'保护'},{code:'可支配',text:'可支配'}],
        step: [{code:'待入库',text:'待入库'},{code:'意向',text:'意向'},{code:'重点项目',text:'重点项目'},{code:'正式签约',text:'正式签约'}],
        type: [{code:'用地',text:'用地'},{code:'购房',text:'购房'},{code:'租赁',text:'租赁'}],
        dept: [],
        list: [],
        total:0,
        queryParam: {},
        queryForm: {
          name: '',
          isStockIn:true,//是否入库
          operatorName:'',
          deptId:null,
          projectStatus:'',
          step:'',
          requirementType:'',
          projectTraceTime:[],
          stockinTime:[],
        },
        selection: [],
        curRow:{},
        loading: 0
      }
    },
    mounted: function () {
      this.query();
      this.loadDept();
    },
    computed: {},
    methods: {
      beforeLoad(){
        var queryParam = this.$refs.page.queryParam;
        queryParam.stockinTimeStart = '';
        queryParam.stockinTimeEnd = '';
        queryParam.projectTraceTimeStart = '';
        queryParam.projectTraceTimeEnd = '';
        delete queryParam.stockinTime;
        delete queryParam.projectTraceTime;
        if (this.queryForm.stockinTime.length > 0) {
          queryParam.stockinTimeStart = page.formatDate(this.queryForm.stockinTime[0]);
        }
        if (this.queryForm.stockinTime.length > 1) {
          queryParam.stockinTimeEnd = page.formatDate(this.queryForm.stockinTime[1]);
        }
        if (this.queryForm.projectTraceTime.length > 0) {
          queryParam.projectTraceTimeStart = page.formatDate(this.queryForm.projectTraceTime[0]);
        }
        if (this.queryForm.projectTraceTime.length > 1) {
          queryParam.projectTraceTimeEnd = page.formatDate(this.queryForm.projectTraceTime[1]);
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
          isStockIn:true,
          operatorName:'',
          deptId:null,
          projectStatus:'',
          step:'',
          requirementType:'',
          projectTraceTime:[],
          stockinTime:[],
        });
        this.query();
      },
      select: function (selection) {
        this.selection = selection;
      },
      exportDownModel() {
        window.open(this.$http.defaults.baseURL + '/templete/产业园项目信息模板.xlsx');
      },
      curRowChg(row){
        if(row!=null){
           this.curRow = row;
        }else{
          this.curRow = null;
        }
      },
      rowCommand: function (name, params) {
        if (name === '编辑') {
          this.$router.push({ path: "/project/edit?projectId="+ params.row.id });
          return;
        }
        if (name === '删除') {
          this.$Modal.confirm({
            title: '删除确认',
            content: '<p>确定删除该功能点吗？</p>',
            closable:true,
            onOk: () => {
              let that = this;
              this.$http.post('/api/engine/project/delete',{id:params.row.id}).then((res) => {
                if (res.data.code === 0) {
                  this.query();
                  this.$Message.success("删除成功");
                } else {
                  this.$Message.error(res.data.message)
                }
              }).catch((error) => {
                this.$Message.error(error.message)
              });
            }
          });
        }
        this.query();
      },
      goBack: function () {
        this.$router.go(-1);
      },
      add: function () {
        this.$router.push({ path: "/project/edit" });
      },
      distribution: function () {
        if(this.curRow){
          this.$refs.ChangePeople.open(this.curRow);
        }else{
          this.$Message.error("请选择项目！");
        }
      },
      download: function () {
        //this.$refs.Edit.open({});
      },
      importExcel(fileId) {
        this.$http.post('/api/engine/project/import', {fileId: fileId}).then((res) => {
          if (res.data.code === 0) {
            if(res.data.data.add>0){
              this.$Message.success("导入成功, 添加:" + res.data.data.add + " 条");
              this.reset();
            }
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

</style>
