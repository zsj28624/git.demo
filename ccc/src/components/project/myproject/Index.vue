<template>
  <ListPage ref="page" title="我的项目" api="/api/engine/project/list" 
  :model="this" :beforeLoad="beforeLoad" @onCurrentRowChange="curRowChg">
    <div class="page-tools" slot="page-tools">
      <table cellpadding="0" cellspacing="0">
        <tr>  
            <td>
              <Button  @click="add" icon="md-add" v-power="'xmgl.wdxm.add'" style="background-color: #2db7f5;color: #fff; " >添加项目</Button>
            </td>
            <td>
              <Button  @click="minus" icon="minus" v-power="'xmgl.wdxm.minus'" style="background-color: #2db7f5;color: #fff; ">放弃项目</Button>
            </td>
            <td>
            <UploadButton @on-upload="importExcel"></UploadButton>
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
            <Input v-model="queryForm.name"  placeholder="项目名称" style="width: 220px"  @on-enter="query"/>
          </td>
          <td>
            <Select v-model="queryForm.projectStatus" style="width: 220px" placeholder="保护期">
              <Option v-for="item in protect" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </td>
          <td>
            <Select v-model="queryForm.step" style="width: 220px" placeholder="项目阶段">
              <Option v-for="item in step" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </td>
        </tr>
        <br />
        <tr> 
          <td>
            <Select v-model="queryForm.requirementType" style="width: 220px" placeholder="需求类型">
              <Option v-for="item in type" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.stockinTime"
              split-panels
              placeholder="入库日期"
              style="width: 220px"
              :clearable="true"
              ::transfer="true"
            ></DatePicker>
          </td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.projectTraceTime"
              split-panels
              placeholder="跟进日期"
              style="width: 220px"
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
          <td>&nbsp;</td>
        </tr>
      </table>
    </div>
    <!-- <Edit ref="Edit" @on-save="query"></Edit> -->
  </ListPage> 
</template>
<script>    
  import ListPage from '@/components/page/ListPage';
  import DataRowOperate from '@/components/commons/DataRowOperate';
  import Edit from '@/components/project/myproject/Edit';
  import SelArea from '@/components/selarea/index';
  import areajs from '@/assets/js/area';
  import page from '@/assets/js/page';
  import UploadButton from '@/components/upload/UploadButton';

  export default {
    components: {
      ListPage,
      DataRowOperate,
      Edit,
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
            width: 250,
            align: 'center',
            render:(h,params)=>{
              var row = params.row;
              return h(DataRowOperate,{
                props:{
                  btns:[{
                    key:'edit',
                    disabled:row.status ==4||!this.$user.hasPower('xmgl.wdxm.edit'),
                  },
                  {
                    key:'delete',
                    disabled:row.status ==4||row.status ==1||row.step !='待入库'||!this.$user.hasPower('xmgl.wdxm.delete'),
                  },
                  {
                    key:'deferment',
                    text:'申请延期',
                    disabled:row.status ==4||row.step !='意向'||row.defermentStatus ==1||!this.$user.hasPower('xmgl.wdxm.deferment'),
                  },
                  {
                    key:'trace',
                    text:'跟进项目',
                    disabled:row.status ==4||!this.$user.hasPower('xmgl.wdxm.trace'),
                  }]
                },
                on:{
                  click:(key)=>{
                    if(key=="edit"){
                      this.rowCommand("编辑",params);
                    }
                    if(key=="delete"){
                      this.rowCommand("删除",params);
                    }
                    if(key=="deferment"){
                      this.rowCommand("申请延期",params);
                    }
                    if(key=="trace"){
                      this.rowCommand("跟进项目",params);
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
          page.table.initDateColumn({
            title: '最近跟进日期',
            key: 'projectTraceTime',
          }),
          {
            title: '意向园区',
            key: 'campusName',
            width:150,
          }
        ],
        protect: [{code:'保护',text:'保护'},{code:'未保护',text:'未保护'}],
        step: [{code:'待入库',text:'待入库'},{code:'意向',text:'意向'},{code:'重点项目',text:'重点项目'},{code:'正式签约',text:'正式签约'}],
        type: [{code:'用地',text:'用地'},{code:'购房',text:'购房'},{code:'租赁',text:'租赁'}],
        list: [],
        total:0,
        queryParam: {},
        queryForm: {
          name: '',
          projectStatus:'',
          step:'',
          requirementType:'',
          projectTraceTime:[],
          stockinTime:[],
          operator:this.$user.userId
        },
        selection: [],
        curRow:{},
        loading: 0
      }
    },
    mounted: function () {
      var projectStatus = this.$route.query.projectStatus;
      var step = this.$route.query.step;
      if(projectStatus){
        this.queryForm.projectStatus=projectStatus;
      }
      if(step){
        this.queryForm.step=step;
      }
      this.query();
      this.$bus.$emit('on-page-title-change',"我的项目");
      
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
      reset: function () {
        // 清空条件
        Object.assign(this.queryForm, {
          name: '',
          projectStatus:'',
          step:'',
          requirementType:'',
          projectTraceTime:[],
          stockinTime:[],
          operator:this.$user.userId
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
        if (name === '编辑') {
          this.$router.push({ path: "/project/myedit?projectId="+ params.row.id });
          return;
        }
        if (name === '申请延期') {
         this.$Modal.confirm({
            title: '申请项目延期',
            content: '<p>是否申请项目延期</p>',
            closable:true,
            onOk: () => {
              let that = this;
              var row = params.row;
              row.defermentStatus=1;
              this.$http.post('/api/engine/project/update',row).then((res) => {
                if (res.data.code === 0) {
                  if(row.id!=null){
                    var projectId =row.id;
                    var form = {
                      projectId : projectId,
                      applyType : '申请延期',
                      applyPeople : this.$user.userId,
                      applyPeopleName : this.$user.trueName,
                      status : 1,
                      module:"我的项目", //消息提醒设置
                      content:"您有一条"+row.name+"项目延期申请需要审核",
                      link:"/project/audit",
                      powerKey:"spzx.cyyywsp.audit",
                      receiver:null,
                    }
                    this.$http.post('/api/engine/project/audit/add', form).then((res) => {
                      this.loading = 0;
                      if (res.data.code === 0) {
                        this.query();
                        this.$Message.success("申请提交成功");
                      } else {
                        this.$Message.error(res.data.message)
                      }
                    }).catch((error) => {
                      this.loading = 0;
                      this.$Message.error(error.message)
                    });
                  }
                  
                } else {
                  this.$Message.error(res.data.message)
                }
              }).catch((error) => {
                this.$Message.error(error.message)
              });
            }
          });
        }
        if (name === '跟进项目') {
         this.$router.push({path:'/project/trace/traceedit?projectId='+ params.row.id });
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
        
      },
      goBack: function () {
        this.$router.go(-1);
      },
      add: function () {
        this.$router.push({ path: "/project/myedit" });
      },
      minus: function () {
        this.loading=1;
        this.$Modal.confirm({
            title: '放弃项目',
            content: '<p>确定放弃项目吗</p>',
            closable:true,
            onOk: () => {
              let that = this;
              if(this.curRow&&this.curRow.projectStatus=="保护"){
                this.curRow.projectStatus="可支配";
                this.curRow.operator=null;
                this.$http.post('/api/engine/project/update',this.curRow).then((res) => {
                  if (res.data.code === 0) {
                    this.query();
                    this.$Message.success("该项目已放弃！");
                    this.loading=0;
                  } else {
                    this.loading=0;
                    this.$Message.error(res.data.message)
                  }
                }).catch((error) => {
                  this.loading=0;
                  this.$Message.error(error.message)
                });
              }else{
                this.loading=0;
                this.$Message.error("请选择在保护期中的项目!")
              }
            }
          });
        
      },
      exportDownModel() {
        window.open(this.$http.defaults.baseURL + '/templete/产业园项目信息模板.xlsx');
      },
      exportDownModel1() {//弃用
        this.loading = 1;
        this.$http.post('/api/engine/project/list', { _action: 'exportModel' }).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            this.loading = 0;
            var data = res.data.data;
            window.open(this.$http.defaults.baseURL + '/api/file/download?fileId=' + data);
          } else {
            this.loading = 0;
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error("请求失败，请重新发送")
        });
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
