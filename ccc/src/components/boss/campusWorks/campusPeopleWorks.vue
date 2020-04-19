<template>
  <div class="page ">
    <Loading :loading="loading">
      <div class="page-form" style="background:none;">
      <Row>
        <Col v-show="this.$user.hasPower('gzt.cyxsry.wdxmsj')">
          <Card>
              <span slot="title"><span class="mytitle">我的项目数据</span></span>
              <table cellspacing="0" cellpadding="0" class="mytables2">
              <tr>
                <td >
                  项目总数:<a @click="goProject(1)" style="margin: 4px 16px;">{{formItem.projectSum}}</a>
                </td>
                <td >
                  保护期项目:<a @click="goProject(2)" style="margin: 4px 16px;">{{formItem.protectSum}}</a>
                </td>
                <td >
                  入库阶段项目:<a @click="goProject(3)" style="margin: 4px 16px;">{{formItem.intentionSum}}</a>
                </td>
                <td >
                  重点项目:<a @click="goProject(4)" style="margin: 4px 16px;">{{formItem.importSum}}</a>
                </td>
                <td >
                  签约阶段项目:<a @click="goProject(5)" style="margin: 4px 16px;">{{formItem.signSum}}</a>
                </td>
              </tr>
            </table>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col >
          <Card >
            <span slot="title"><span class="mytitle">我的快捷入口</span></span>
              <table cellpadding="0" cellspacing="0" class="mytables2">
                <tr>  
                    <td >
                      <div class="option-bars" v-show="this.$user.hasPower('gzt.cyxsry.wdxm')">
                        <Button  @click="myProject(1)" v-power="''"  icon="ios-add-circle">我的项目</Button>
                      </div>
                    </td>
                    <td>
                      <div class="option-bars" v-show="this.$user.hasPower('gzt.cyxsry.rksq')">
                        <Button  @click="myProject(2)" v-power="''"  icon="ios-add-circle">入库申请</Button>
                      </div>
                    </td>
                    <td>
                      <div class="option-bars" v-show="this.$user.hasPower('gzt.cyxsry.zdxmsq')">
                        <Button  @click="myProject(3)" v-power="''" icon="ios-add-circle">重点项目申请</Button>
                      </div>
                    </td>
                    <td>
                      <div class="option-bars" v-show="this.$user.hasPower('gzt.cyxsry.xmqy')">
                        <Button  @click="myProject(4)" v-power="''" icon="ios-add-circle" >项目签约</Button>
                      </div>
                    </td>
                    <td>
                      <div class="option-bars" v-show="this.$user.hasPower('gzt.cyxsry.wdsq')">
                        <Button  @click="myProject(5)" v-power="''" icon="ios-add-circle" >我的申请</Button>
                      </div>
                    </td>
                </tr> 
              </table>
          </Card>
        </Col>
      </Row>
      <div >
        <Row>
          <Col v-show="this.$user.hasPower('gzt.cyxsry.wddb')">
            <Card >
                <span slot="title"><span class="mytitle">我的待办</span><a @click="goMessage" style="float: right;">更多></a></span>
                <Table height="410" :columns="columns1" :data="messageList"></Table>
            </Card>
          </Col>
        </Row>
      </div>
      <div >
        <Row>
          <Col v-show="this.$user.hasPower('gzt.cyxsry.zjxm')">
            <Card >
                <span slot="title"><span class="mytitle">最近项目</span></span>
                <Table height="230" :columns="columns2" :data="projectList"></Table>
            </Card>
          </Col>
        </Row>
      </div>
      <div >
        <Row>
          <Col v-show="this.$user.hasPower('gzt.cyxsry.wdxssj')">
            <Card >
              <span slot="title"><span class="mytitle">我的销售数据</span></span>
              <Select v-model="queryForm.step" style="width: 220px;" @on-change="stepChange">
                <Option v-for="item in step" :value="item.code" :key="item.code">{{ item.text }}</Option>
              </Select>
              <div ref="main" style="height:400px;"></div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import page from '@/assets/js/page';
import DataRowOperate from '@/components/commons/DataRowOperate';

export default {
  components: {
    Loading,
    LayoutHor,
    page,
    DataRowOperate
  },
  data() {
    return {
      loading: 0,
      formItem: 
      {
        projectSum:0,
        protectSum:0,
        intentionSum: 0,
        importSum:0,
        signSum:0,
      },
       queryForm: 
      {
        step:'',
        timeStart:'',
      },
      messageList:[],
      projectList:[],
      campusList:[],
      timeStart:null,
      step: [
        {code:'全部',text:'全部'},
        {code:'意向项目套数',text:'意向项目套数'},
        {code:'重点项目套数',text:'重点项目套数'},
        {code:'签约项目套数',text:'签约项目套数'}
      ],
      time: [
        {code:'七天',text:'七天'},
        {code:'月度',text:'月度'},
        {code:'季度',text:'季度'},
        {code:'年度',text:'年度'}
        ],
      columns1: [
        {
            title: '序号',
            width: 100,
            type:'index',
            align: 'center',
          }, 
        {
            title: '提醒内容',
            align:'left',
            key:'content',
            minWidth:250,
        },
        {
            title: '发送时间',
            align:'center',
            key:'createTime',
            width: 180,
        },
      ],
      columns2: [
        {
          title:'操作',
          width: 150,
          align: 'center',
          render:(h,params)=>{
            var row = params.row;
            return h(DataRowOperate,{
              props:{
                btns:[{
                  key:'edit',
                  text:'跟进'
                },
                ]
              },
              on:{
                click:(key)=>{
                  if(key=="edit"){
                    this.goTrace(row);
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
        page.table.initDateColumn({
          title: '入库日期',
          key: 'stockinTime',
        }),
        page.table.initDateColumn({
          title: '最近跟进日期',
          key: 'projectTraceTime',
        }),
        {
          title: '意向区域',
          key: 'campusName',
          width:150,
        },
      ],
    }
  },
  computed: {
  },
  mounted() {
    this.load();
    this.loadMessage();
    this.loadRecentProject();
    this.queryForm.step='全部';
    this.query();
    this.$bus.$emit('on-page-title-change',"工作台");
  },
  methods: {
    load(){
      this.$http.post('/api/engine/project/campus/projectList', {operator:this.$user.userId}).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
             if(res.data.data){
              this.formItem.projectSum=res.data.data.projectSum;
              this.formItem.protectSum=res.data.data.protectSum;
              this.formItem.intentionSum=res.data.data.intentionSum;
              this.formItem.importSum=res.data.data.importSum;
              this.formItem.signSum=res.data.data.signSum;
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
    loadMessage(){
      this.$http.post('/api/engine/message/list', {receiver:this.$user.userId,read:0}).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
           if(res.data.data.total>0){
            this.messageList=res.data.data.rows;
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
    loadRecentProject(){
      this.$http.post('/api/engine/project/list', {operator:this.$user.userId,pageSize:5}).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
           if(res.data.data.total>0){
            this.projectList=res.data.data.rows;
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
    goTrace(row){
      this.$router.push({path:'/project/trace/traceedit?projectId='+ row.id});
    },
    query(){
      this.loading = 1;
      var intentionList=[];
      var importList=[];
      var signList=[];
      var campusList=[
      {time:page.formatDate(new Date(new Date().getTime()-1000*60*60*24*6))},
      {time:page.formatDate(new Date(new Date().getTime()-1000*60*60*24*5))},
      {time:page.formatDate(new Date(new Date().getTime()-1000*60*60*24*4))},
      {time:page.formatDate(new Date(new Date().getTime()-1000*60*60*24*3))},
      {time:page.formatDate(new Date(new Date().getTime()-1000*60*60*24*2))},
      {time:page.formatDate(new Date(new Date().getTime()-1000*60*60*24*1))},
      {time:page.formatDate(new Date)}
      ];
      var timeStart=page.formatDate(new Date(new Date().getTime()-1000*60*60*24*6));
      this.$http.post('/api/engine/project/campus/mylistcount', {timeStart:timeStart,operator:this.$user.userId}).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
           if(res.data.data){
            intentionList=res.data.data.intentionList;
            importList=res.data.data.importList;
            signList=res.data.data.signList;
            campusList.map((it)=>{
              it.value1=0;
              it.value2=0;
              it.value3=0;
              intentionList.map((it1)=>{
                if(it.time==it1.time){
                  it.value1=it1.value;
                }
              })
              importList.map((it2)=>{
                if(it.time==it2.time){
                  it.value2=it2.value;
                }
              })
              signList.map((it3)=>{
                if(it.time==it3.time){
                  it.value3=it3.value;
                }
              })
            })
            this.campusList=campusList;
            this.initEchart(campusList);
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
    stepChange(item){
      if(item!=''){
        this.initEchart(this.campusList);
      }
    },
    initEchart(temp) {
      var that =this;
        //获取DOM节点并初始化
        let myChart = this.$echarts.init(this.$refs.main);
        let name =[];
        let val1 =[];
        let val2 =[];
        let val3 =[];
        for(var i=0;i<temp.length;i++){
          name[i]=temp[i].time;
          val1[i]=temp[i].value1;
          val2[i]=temp[i].value2;
          val3[i]=temp[i].value3;
        }
        let option = {
          color: ['#62DAAB','#7081A0','#F6C022','#E96C5B','#9967BD','#299999','#97B8FB','#BEE0E0', '#D0F4E5', '#F8D2CE','#74CBED','#9967BD','#E0D1EB','#FFE2CA','#FF9EC6','#FCECBD'],
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'shadow'
              }
          },
          //图例配置
          legend: {
              data:['意向项目','重点项目','签约项目',],
              type: 'scroll',
              orient: 'vertical',
              right: 10,
              top: 50,
              bottom: 20,
          },
          grid: {
            right: "13%", // 距离左边3%
            top: "10%", // 顶部空出20%的空间，来显示legend
            containLabel: true 
          },
          //calculable: true,
          //轴配置
          xAxis: [
                  {
                    type: 'category',
                    data: name,
                  }
              ],
          //Y轴配置
          yAxis: [
                  {
                    type: 'value',
                    splitArea: { show: true },
                    name:'',
                  }
              ],
          //图表Series数据序列配置
          series: [
                  {
                    name: '意向项目',
                    type: 'bar',
                    data: val1,
                    label: {
                      normal: {
                          show: true,
                          position: 'top',
                      }
                    },
                    barWidth : 30,//柱图宽度
                    barGap:'0%',//柱图间距
                  },
                  {
                    name: '重点项目',
                    type: 'bar',
                    data: val2,
                    label: {
                      normal: {
                          show: true,
                          position: 'top',
                      }
                    },
                    barWidth : 30,//柱图宽度
                    barGap:'0%',//柱图间距
                  },
                  {
                    name: '签约项目',
                    type: 'bar',
                    data: val3,
                    label: {
                      normal: {
                          show: true,
                          position: 'top',
                      }
                    },
                    barWidth : 30,//柱图宽度
                    barGap:'0%',//柱图间距
                  },
              ]
        };
        if(this.queryForm.step=="全部"){
          option.series=[
            {
              name: '意向项目',
              type: 'bar',
              data: val1,
              label: {
                normal: {
                    show: true,
                    position: 'top',
                }
              },
              barWidth : 30,//柱图宽度
              barGap:'0%',//柱图间距
            },
            {
              name: '重点项目',
              type: 'bar',
              data: val2,
              label: {
                normal: {
                    show: true,
                    position: 'top',
                }
              },
              barWidth : 30,//柱图宽度
              barGap:'0%',//柱图间距
            },
            {
              name: '签约项目',
              type: 'bar',
              data: val3,
              label: {
                normal: {
                    show: true,
                    position: 'top',
                }
              },
              barWidth : 30,//柱图宽度
              barGap:'0%',//柱图间距
            },
          ]
        }
        if(this.queryForm.step=="意向项目套数"){
          option.series=[
            {
              name: '意向项目',
              type: 'bar',
              data: val1,
              label: {
                normal: {
                    show: true,
                    position: 'top',
                }
              },
              barWidth : 30,//柱图宽度
              barGap:'0%',//柱图间距
            }
          ]
        }
        if(this.queryForm.step=="重点项目套数"){
          option.series=[
            {
              name: '重点项目',
              type: 'bar',
              data: val2,
              label: {
                normal: {
                    show: true,
                    position: 'top',
                }
              },
              barWidth : 30,//柱图宽度
              barGap:'0%',//柱图间距
            }
          ]
        }
        if(this.queryForm.step=="签约项目套数"){
          option.series=[
            {
              name: '签约项目',
              type: 'bar',
              data: val3,
              label: {
                normal: {
                    show: true,
                    position: 'top',
                }
              },
              barWidth : 30,//柱图宽度
              barGap:'0%',//柱图间距
            }
          ]
        }
        myChart.setOption(option,true);
      },
    myProject(data){
      if(data==1){
        this.$router.push({ path: "/project/myproject" });
        return;
      }
      if(data==2){
        this.$router.push({ path: "/campus/peopleworks/edit" });
        return;
      }
      if(data==3){
        this.$http.post('/api/engine/project/listAll', { operator: this.$user.userId,step:'意向',}).then((res) => {
        this.loading = 0;
          if (res.data.code == 0 ) {
            if(res.data.data.total>0){
              this.$router.push({ path: "/campus/peopleworks/import" });
            }else{
              this.$Message.error("当前无意向项目！");
            }
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        }); 
      }
      if(data==4){
        this.$http.post('/api/engine/project/listAll', { operator: this.$user.userId,step:'重点项目',}).then((res) => {
        this.loading = 0;
          if (res.data.code == 0 ) {
            if(res.data.data.total>0){
              this.$router.push({ path: "/campus/peopleworks/sign" });
            }else{
              this.$Message.error("当前无重点项目！");
            }
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        }); 
      }
      if(data==5){
        this.$router.push({ path: "/project/apply" });
        return;
      }
    },
    goProject(data){
      if(data==1){
        this.$router.push({ path: "/project/myproject" });
        return;
      }
      if(data==2){
        this.$router.push({ path: "/project/myproject?projectStatus=保护" });
        return;
      }
      if(data==3){
        this.$router.push({ path: "/project/myproject?step=意向" });
        return;
      }
      if(data==4){
        this.$router.push({ path: "/project/myproject?step=重点项目" });
        return;
      }
      if(data==5){
        this.$router.push({ path: "/project/myproject?step=正式签约" });
        return;
      }
    },
    goMessage(){
      this.$router.push({ path: "/message" });
      return;
    },
    goBack: function () {
      this.$router.go(-1);
    },
    goPage(page) {
      this.$router.push({ path: page });
    },
  }
}

</script>

<style type="text/css">
.mytables2 {
  width: 60%;
}
.mytables2 td{
  width:50px;
  white-space:nowrap;
  padding: 5px 20px;
  text-align: left;
  font-size:16px;
  
}
.mytables2 td button{
  height:60px;
  width:150px;
  border-radius:6px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 400;
  text-align: center;
  color: #135195;
  line-height: 60px;
  min-width: 160px;
}
.mytables2 .ivu-btn{
  font-family: PingFang SC !important;
  color: #135195;
}
.mytitle{
  width:50px;
  white-space:nowrap;
  padding: 10px 10px;
  font-weight:bold;
  font-size:16px;
  color:#333333;
}

.mydiv .ivu-select .ivu-select-dropdown{
  min-width: 220px;
  position: absolute;
  will-change: top, left;
  transform-origin: center bottom;
  top: auto !important;
  left: 0px;
}

</style>
