<template>
  <div calss="page">
    <Loading :loading="loading">
      <div class="page-form" style="background:none;">
        <table cellspacing="0" cellpadding="0" class="mytables">
          <tr>
            <td class="td1">
              <tr>
                <td class="td2">
                  {{corp.corpTotal}}
                </td>
                <td >
                  
                </td>
                <td rowspan="2">
                  <div class="line"></div>
                </td>
                <td  rowspan="2">
                  <tr><td class="td3">{{corp.lastYearCorpTotal}}</td></tr>
                  <tr><td class="td5">去年同期</td></tr>
                </td>
              </tr>
              <tr>
                <td class="td4">
                  生态企业总数
                </td>
                <td>
                 <span class="span1" v-if="corpEarning">▲&nbsp;{{corpPercent}}</span><span class="span2" v-else>▼&nbsp;{{corpPercent}}</span>
                </td>
              </tr>
            </td>
            <td class="td6">
              
            </td>
            <td class="td1">
              <tr>
                <td class="td2">
                  {{corp.cMonthFollowCount}}
                </td>
                <td >
                  
                </td>
                <td rowspan="2">
                  <div class="line"></div>
                </td>
                <td  rowspan="2">
                  <tr><td class="td3">{{corp.lastYearFollowCount}}</td></tr>
                  <tr><td class="td5">去年同期</td></tr>
                </td>
              </tr>
              <tr>
                <td class="td4">
                 本月跟进企业总数 
                </td>
                <td>
                 <span class="span1" v-if="followEarning">▲&nbsp;{{followPercent}}</span><span class="span2" v-else>▼&nbsp;{{followPercent}}</span>
                </td>
              </tr>
            </td>
            <td class="td6">
              
            </td>
            <td class="td1">
              <tr>
                <td class="td2">
                  {{formItem.importSum}}
                </td>
                <td >
                  
                </td>
                <td rowspan="2">
                  <div class="line"></div>
                </td>
                <td  rowspan="2">
                  <tr><td class="td3">{{formItem.lastImportSum}}</td></tr>
                  <tr><td class="td5">上月</td></tr>
                </td>
              </tr>
              <tr>
                <td class="td4">
                  本月产业园重点项目数
                </td>
                <td>
                 <span class="span1" v-if="importEarning">▲&nbsp;{{importPercent}}</span><span class="span2" v-else>▼&nbsp;{{importPercent}}</span> 
                </td>
              </tr>
            </td>
            <td class="td6"> 
            </td>
            <td class="td1">
              <tr>
                <td class="td2">
                  {{formItem.signSum}}
                </td>
                <td >
                </td>
                <td rowspan="2">
                  <div class="line"></div>
                </td>
                <td  rowspan="2">
                  <tr><td class="td3">{{formItem.lastSignSum}}</td></tr>
                  <tr><td class="td5">上月</td></tr>
                </td>
              </tr>
              <tr>
                <td class="td4">
                  本月产业园签约项目数
                </td>
                <td>
                 <span class="span1" v-if="signEarning">▲&nbsp;{{signPercent}}</span><span class="span2" v-else>▼&nbsp;{{signPercent}}</span> 
                </td>
              </tr>
            </td>
          </tr>
        </table>
        <br/>
        <div >
          <Row>
            <Col >
              <Card >
                  <span slot="title"><span class="mytitle">我的待办</span><a @click="goMore" style="float: right;">更多></a></span>
                  <Table height="250" :columns="columns1" :data="corpList"></Table>
              </Card>
            </Col>
          </Row>
        </div>
        <div >
          <MyEcologySalesData :title="title"></MyEcologySalesData>
        </div>
        <div >
          <Row>
            <Col >
              <Card >
                <span slot="title"><span class="mytitle">产业园区签约客户数</span></span>
                <Select v-model="queryForm.time" style="width: 220px" @on-change="loadMonthProject">
                  <Option v-for="item in time" :value="item.code" :key="item.code">{{ item.text }}</Option>
                </Select>
                <div ref="main4" style="height:400px;"></div>
              </Card>
            </Col>
          </Row>
        </div>
        <div >
          <Row>
            <Col >
              <Card >
                <span slot="title"><span class="mytitle">近六月产业园销售数据对比</span></span>
                <Select v-model="queryForm.campusId" style="width: 220px" @on-change="campusChange">
                  <Option v-for="item in campusList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                </Select>
                <div ref="main5" style="height:400px;"></div>
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
import floatObj from '@/assets/js/floatObj';
import DataRowOperate from '@/components/commons/DataRowOperate';
import MyEcologySalesData from '@/components/worktable/MyEcologySalesData';

export default {
  components: {
    Loading,
    LayoutHor,
    page,
    DataRowOperate,
    MyEcologySalesData
  },
  data() {
    return {
      title:"生态企业销售数据",
      loading: 0,
      earning:true,
      importEarning:true,
      signEarning:true,
      importPercent:'',
      signPercent:'',
      corpEarning:true,
      followEarning:true,
      corpPercent:'',
      followPercent:'',
      formItem: 
      {
        importSum:0,
        signSum:0,
        lastImportSum:0,
        lastSignSum:0,
        projectList:[],
        signProjectList:[],
      },
      corp: 
      {
        corpTotal:0,
        lastYearCorpTotal:0,
        cMonthFollowCount:0,
        lastYearFollowCount:0,
      },
       queryForm: 
      {
        type1:'',
        type2:'',
        time:'近一个月',
      },
      corpList:[],
      campusList:[],//全部+全部园区
      campusList2:[],//全部园区
      timeStart:null,
      dataArr:[],
      type: [
        { code: '地域', text: '按地域' },
        { code: '生态分类', text: '按生态分类' },
        { code: '标签', text: '按标签' },
        { code: '年销售额', text: '按年销售额' },
        { code: '注册资金', text: '按注册资金' },
        { code: '企业等级', text: '按企业等级' },
        { code: '跟进周期', text: '按跟进周期' },
        { code: '部门', text: '按部门' },
      ],
      time: [
        {code:'近一个月',text:'近一个月'},
        {code:'近两个月',text:'近两个月'},
        {code:'近十二个月',text:'近十二个月'},
        ],
      columns1: [
        {
          title: '操作',
          width: 80,
          align: 'center',
          render: (h, params) => {
            var row = params.row;
            return h(DataRowOperate, {
              props: {
                btns: [{
                  key: 'edit',
                  text: '去审批'
                },
                ]
              },
              on: {
                click: (key) => {
                  if (key == "edit") {
                    this.goAudit(params.row);
                  }
                }
              }
            });
          }
        },
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center',
        },
        {
          title: '企业名称',
          align: 'left',
          key: 'corpName',
          minWidth:200
        },
        {
          title: '所属生态分类',
          align: 'center',
          width: 180,
          key: 'ecologyTypeTag',
        },
        {
          title: '企业等级',
          align: 'center',
          width: 120,
          key: 'level',
        },
        {
          title: '审批业务',
          align: 'center',
          width: 120,
          key: 'businessType',
        },
        {
          title: '提交人',
          key: 'createName',
          width: 100,
        },
        page.table.initDateColumn({
          title: '提交日期',
          key: 'createTime',
          width: 90,
        }),
      ],
    }
  },
  computed: {
  },
  mounted() {
    //this.loadCampus();
    this.loadMonth();
    this.loadProjectNum(); 
    this.loadMonthProject();
    this.loadCorp();
    this.loadCorpNum();
    this.$bus.$emit('on-page-title-change',"工作台");
  },
  methods: {
    goMore: function () {
      this.$router.push({ path: "/ecology/corp/audit?forward" });
    },
    loadMonth(){
      this.dataArr = [];
      var data = new Date();
      var year = data.getFullYear();
      data.setMonth(data.getMonth()+1, 1)//获取到当前月份,设置月份
      for (var i = 0; i < 12; i++) {
          data.setMonth(data.getMonth() - 1);//每次循环一次 月份值减1
          var m = data.getMonth() + 1;
          m = m < 10 ? "0" + m : m;
          this.dataArr.push(data.getFullYear() + "-" + (m)+"-01");
      }
    },
    loadCampus(){
      this.$http.post('/api/engine/campus/campus/listAll', {}).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
           if(res.data.data.total>0){
            this.campusList.push({name:"全部"});
            res.data.data.rows.map((item)=>{
              this.campusList.push(item);
              this.campusList2.push(item);
            })
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
    loadProjectNum(){
      var lastTimeStart='';
      var sixMonthTimeStart='';
      if(this.dataArr){
        this.timeStart = this.dataArr[0];
        lastTimeStart = this.dataArr[1];
        sixMonthTimeStart = this.dataArr[5];
      }
      this.$http.post('/api/engine/project/boss/listcount', {timeStart:this.timeStart,lastTimeStart:lastTimeStart,sixMonthTimeStart:sixMonthTimeStart}).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
             if(res.data.data){
              this.formItem.importSum=res.data.data.importSum;
              this.formItem.signSum=res.data.data.signSum;
              this.formItem.lastImportSum=res.data.data.lastImportSum;
              this.formItem.lastSignSum=res.data.data.lastSignSum;
              var importNumber = this.formItem.importSum-this.formItem.lastImportSum;
              var signNumber = this.formItem.signSum-this.formItem.lastSignSum;
              if(importNumber>0&&this.formItem.lastImportSum>0){
                this.importEarning=true;
                this.importPercent=floatObj.divide(floatObj.multiply(importNumber,100),this.formItem.lastImportSum,1)+"%";
              }else if(importNumber<0&&this.formItem.lastImportSum>0){
                this.importEarning=false;
                this.importPercent=floatObj.divide(floatObj.multiply(importNumber,100),this.formItem.lastImportSum,1)+"%";
              }else{
                this.importEarning=true;
                this.importPercent="0%";
              }
              if(signNumber>0&&this.formItem.lastSignSum>0){
                this.signEarning=true;
                this.signPercent=floatObj.divide(floatObj.multiply(signNumber,100),this.formItem.lastSignSum,1)+"%";
              }else if(signNumber<0&&this.formItem.lastSignSum>0){
                this.signEarning=false;
                this.signPercent=floatObj.divide(floatObj.multiply(signNumber,100),this.formItem.lastSignSum,1)+"%";
              }else{
                this.signEarning=true;
                this.signPercent="0%";
              }
              if(res.data.data.projectList){
                this.formItem.projectList=res.data.data.projectList;
                this.$http.post('/api/engine/campus/campus/listAll', {}).then((res) => {
                  this.loading = 0;
                  if (res.data.code === 0) {
                    if(res.data.data.total>0){
                      this.campusList=[];
                      this.campusList2=[];
                      this.initCampusEchart(res.data.data.rows,this.formItem.projectList);
                      this.campusList.push({name:'全部'});
                      res.data.data.rows.map((item)=>{
                        this.campusList.push({name:item.name});
                        this.campusList2.push(item);
                      })
                      //this.queryForm.campusId=this.campusList[0].name;
                    }
                    this.loading = 0;
                  } else {
                    this.$Message.error(res.data.message)
                  }
                }).catch((error) => {
                  this.loading = 0;
                  this.$Message.error(error.message)
                });
              }
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
    loadMonthProject(){
      if(this.queryForm.time=="近一个月"&&this.dataArr){
        this.timeStart=this.dataArr[0];
      }
      if(this.queryForm.time=="近两个月"&&this.dataArr){
        this.timeStart=this.dataArr[1];
      }
      if(this.queryForm.time=="近十二个月"&&this.dataArr){
        this.timeStart=this.dataArr[11];
      }
      this.$http.post('/api/engine/project/boss/signlistcount', {timeStart:this.timeStart}).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
             if(res.data.data){
              if(res.data.data.signProjectList){
                this.formItem.signProjectList=res.data.data.signProjectList;
                this.$http.post('/api/engine/campus/campus/listAll', {}).then((res) => {
                  this.loading = 0;
                  if (res.data.code === 0) {
                     if(res.data.data.total>0){
                      this.initSignEchart(res.data.data.rows,this.formItem.signProjectList);
                     }
                     this.loading = 0;
                  } else {
                    this.$Message.error(res.data.message)
                  }
                }).catch((error) => {
                  this.loading = 0;
                  this.$Message.error(error.message)
                });
              }
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
    campusChange(item){
      if(item=="全部"){
        this.initCampusEchart(this.campusList2,this.formItem.projectList);
      }else{
        this.initCampusEchart([{name:item}],this.formItem.projectList);
      }
    },
    loadCorp() {
      var that = this;
      this.$http.post('/api/engine/worktable/ecology/myPendingReview', {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          that.corpList = res.data.data;
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    loadCorpNum() {
      var that = this;
      this.$http.post('/api/engine/worktable/boos/corpHeadCount', {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          this.corp.corpTotal=res.data.data.corpTotal;
          this.corp.lastYearCorpTotal=res.data.data.lastYearCorpTotal;
          this.corp.cMonthFollowCount=res.data.data.cMonthFollowCount;
          this.corp.lastYearFollowCount=res.data.data.lastYearFollowCount;
          var corpNumber = this.corp.corpTotal-this.corp.lastYearCorpTotal;
          var followNumber = this.corp.cMonthFollowCount-this.corp.lastYearFollowCount;
          if(corpNumber>0&&this.corp.lastYearCorpTotal>0){
            this.corpEarning=true;
            this.corpPercent=floatObj.divide(floatObj.multiply(corpNumber,100),this.corp.lastYearCorpTotal,1)+"%";
          }else if(corpNumber<0&&this.corp.lastYearCorpTotal>0){
            this.corpEarning=false;
            this.corpPercent=floatObj.divide(floatObj.multiply(corpNumber,100),this.corp.lastYearCorpTotal,1)+"%";
          }else{
            this.corpEarning=true;
            this.corpPercent="0%";
          }
          if(followNumber>0&&this.corp.lastYearFollowCount>0){
            this.followEarning=true;
            this.followPercent=floatObj.divide(floatObj.multiply(followNumber,100),this.corp.lastYearFollowCount,1)+"%";
          }else if(followNumber<0&&this.corp.lastYearFollowCount>0){
            this.followEarning=false;
            this.followPercent=floatObj.divide(floatObj.multiply(followNumber,100),this.corp.lastYearFollowCount,1)+"%";
          }else{
            this.followEarning=true;
            this.followPercent="0%";
          }
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    goAudit(row){
      this.$router.push({ path: '/ecology/corp/audit/audit?applyId=' + row.applyId + '&type=' + row.businessTypeValue })
    },
    initCampusEchart(campusList,projectList) {
      var that =this;
        //获取DOM节点并初始化
        let myChart = this.$echarts.init(this.$refs.main5);
        let name =[this.dataArr[5].substring(0,7),this.dataArr[4].substring(0,7),this.dataArr[3].substring(0,7),this.dataArr[2].substring(0,7),this.dataArr[1].substring(0,7),this.dataArr[0].substring(0,7),];
        let val1=[];
        let val2=[];
        let val3=[];
        for(var i=0;i<campusList.length;i++){
          val3=[];
          val1[i]=campusList[i].name;
          for(var j=0;j<name.length;j++){
            val3[j]=0;
            projectList.map((item)=>{
              if(item.time==name[j]&&item.name==campusList[i].name){
                val3[j]=item.value;
              }
            })
          }
          val2.push(val3);
        }
        let option = {
          color: ['#BEE0E0', '#62DAAB', '#D0F4E5', '#7081A0','#F6C022','#E96C5B','#F8D2CE','#74CBED','#9967BD','#E0D1EB','#FFE2CA','#FF9EC6','#FCECBD','#299999','#97B8FB'],
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'shadow'
              }
          },
          //图例配置
          legend: {
              data:val1,
              type: 'scroll',
              orient: 'vertical',
              right: 5,
              top: 20,
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
              ]
        };
        for(var i=0;i<val1.length;i++){
          option.series.push({
            name: val1[i],
            type: 'bar',
            data: val2[i],
            label: {
              normal: {
                  show: true,
                  position: 'top',
              }
            },
            barWidth : 30,//柱图宽度
            barGap:'0%',//柱图间距
          })
        }
        myChart.setOption(option,true);
      },
      initSignEchart(campusList,projectList) {
        var that =this;
        //获取DOM节点并初始化
        let myChart = this.$echarts.init(this.$refs.main4);
        let name =[];
        let val1=[];
        for(var i=0;i<campusList.length;i++){
          name[i]=campusList[i].name;
          val1[i]=0;
          for(var j=0;j<projectList.length;j++){
            if(projectList[j].name==campusList[i].name){
              val1[i]=projectList[j].value;
              campusList[i].value=projectList[j].value;
            }
          }
        }
        let option = {
          color: ['#BEE0E0', '#62DAAB', '#D0F4E5', '#7081A0','#F6C022','#E96C5B','#F8D2CE','#74CBED','#9967BD','#E0D1EB','#FFE2CA','#FF9EC6','#FCECBD','#299999','#97B8FB'],
          title:{
                text:'签约客户数',
                left: 'center'
            },
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'shadow'
              }
          },
          //图例配置
          legend: {
              type: 'scroll',
              orient: 'vertical',
              right: 5,
              top: 20,
              bottom: 20,
              data:name,
          },
          grid: {
            right: "13%", // 距离左边3%
            top: "10%", // 顶部空出20%的空间，来显示legend
            containLabel: true 
          },
        
          //图表Series数据序列配置
          series: [
                  {
                    name: '签约项目',
                    type: 'pie',
                    data: campusList,
                    radius : '65%',
    　　            center : [ '50%', '50%' ],
                    label : {
              　　　　normal : {
              　　　　　　formatter: '{b}:{c}: ({d}%)',
              　　　　　　textStyle : {
              　　　　　　　　fontWeight : 'normal',
              　　　　　　　　fontSize : 15
              　　　　　　}
              　　　　}
                    },
                    labelLine :{show:true} 
                  },
              ]
        };
        myChart.setOption(option,true);
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
.mytables {
  width:100%;
}
.mytables .td1{
  white-space:nowrap;
  padding: 5px 5px;
  font-size:18px;
  font-weight:normal;
  background: rgba(255,255,255,1);
  width:21% !important;
  height:100px;
  border-radius:8px;
}

.mytables .td2{
  width:130px;
  height:24px;
  font-size:30px;
  font-family:PingFang SC;
  font-weight:bold;
  color:rgba(51,51,51,1);
  line-height:36px;
  padding-right: 10px;
}

.mytables .td3{
  width:31px;
  height:15px;
  font-size:18px;
  font-family:PingFang SC;
  font-weight:bold;
  color:rgba(51,51,51,1);
  line-height:36px;
  padding-left: 10px;
  text-align:center;
}
.mytables .td4{
  width:84px;
  height:14px;
  font-size:14px;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(153,153,153,1);
  line-height:36px;
}
.mytables .td5{
  width:84px;
  height:14px;
  font-size:14px;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(153,153,153,1);
  line-height:36px;
  text-align:center;
  padding-left: 10px;
}
.mytables .td6{
  background-color: #f5f6f7;
  width:1%;
}

.mytitle{
  width:50px;
  white-space:nowrap;
  padding: 10px 10px;
  font-weight:bold;
  font-size:18px;
}
.line{
  width:1px;
  height:46px;
  background:rgba(228,231,234,1);
}

.span1{
  width:44px;
  height:13px;
  font-size:16px;
  font-family:PingFang SC;
  font-weight:bold;
  color:rgba(46,189,23,1);
  line-height:36px;
  padding-right: 10px;
}
.span2{
  width:44px;
  height:13px;
  font-size:16px;
  font-family:PingFang SC;
  font-weight:bold;
  color:rgba(249,9,37,1);
  line-height:36px;
  padding-right: 10px;
}

</style>
