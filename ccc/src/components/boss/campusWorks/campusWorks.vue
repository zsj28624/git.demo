<template>
  <div calss="page ">
    <Loading :loading="loading">
      <div class="page-form" style="background:none;">
        <Tabs :animated="false" v-model="tabName" class="top" @on-click="load">
          <TabPane label="今日新增" name="0"></TabPane>
          <TabPane label="本周新增" name="1"></TabPane>
          <TabPane label="本月新增" name="2"></TabPane>
        </Tabs>
        <table cellspacing="0" cellpadding="0" class="mytables1">
          <tr>
            <td class="td1">
              <tr>
                <td >
                  意向项目（个）:<span class="fontColor">{{formItem.intentionSum}}</span>
                </td>
              </tr>
            </td>
            <td class="td4">
            
            </td>
            <td class="td1">
              <tr>
                <td >
                  重点项目（个）:<span class="fontColor">{{formItem.importSum}}</span>
                </td>
              </tr>
            </td>
            <td class="td4">
            
            </td>
            <td class="td1">
              <tr>
                <td >
                  签约项目（个）:<span class="fontColor">{{formItem.signSum}}</span>
                </td>
              </tr>
            </td>
            <td class="td4">
            
            </td>
            <td class="td1"> 
              <tr>
                <td >
                  延期申请（次）:<span class="fontColor">{{formItem.defermentSum}}</span>
                </td>
              </tr>
            </td>
            <td class="td4">
            
            </td>
            <td class="td1">
              <tr>
                <td >
                  项目跟进（次）:<span class="fontColor">{{formItem.traceSum}}</span>
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
                <div ref="main1" style="height:400px"></div>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col >
              <Card >
                <span slot="title"><span class="mytitle">{{campusName}}</span></span>
                <div ref="main2" style="height:400px"></div>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col >
              <Card >
                <span slot="title"><span class="mytitle">{{deptName}}</span></span>
                <table cellspacing="0" cellpadding="0" style="width:92%;">
                  <tr>
                    <td style="width:20%;">
                      <div ref="main3" style="height:400px;width:95%;"></div>
                    </td>
                    <td style="width:20%;">
                      <div ref="main4" style="height:400px;width:95%;"></div>
                    </td >
                    <td style="width:20%;">
                      <div ref="main5" style="height:400px;width:95%;"></div>
                    </td>
                    <td style="width:20%;">
                      <div ref="main6" style="height:400px;width:95%;"></div>
                    </td>
                    <td style="width:20%;">
                      <div ref="main7" style="height:400px;width:95%"></div>
                    </td>
                  </tr>
                </table>
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

export default {
  components: {
    Loading,
    LayoutHor,
    page,
  },
  data() {
    return {
      loading: 0,
      tabName:"0",
      iconClass1:'iconshow',
      iconClass2:'iconclose',
      iconClass3:'iconclose',
      boxshow2:false,
      boxshow3:false,
      formItem: 
      {
        intentionSum: 0,
        importSum:0,
        signSum:0,
        defermentSum:0,
        traceSum:0,
      },
      campusName:'',
      campusList:[],
      deptName:'',
      deptList:[],
      peopleList:[],
      timeStart:null,
    }
  },
  computed: {
  },
  mounted() {
    this.load();
    this.$bus.$emit('on-page-title-change',"工作台");
  },
  methods: {
    load(){
      this.loading = 1;
      var intentionList=[];
      var importList=[];
      var signList=[];
      var defermentList=[];
      var traceList=[];
      var campusList=[];
      var now = new Date(); // 当前日期
      var nowDayOfWeek = now.getDay(); // 今天本周的第几天
      var nowDay = now.getDate(); // 当前日
      var nowMonth = now.getMonth(); // 当前月
      var nowYear = now.getYear(); // 当前年
      nowYear += (nowYear < 2000) ? 1900 : 0;
      if(this.tabName=="0"){
        this.timeStart=page.formatDate(new Date());
      }
      if(this.tabName=="1"){
        this.timeStart=page.formatDate(new Date(now.getFullYear(), nowMonth, nowDay + 1 - nowDayOfWeek ));
      }
      if(this.tabName=="2"){
        this.timeStart=page.formatDate(new Date(nowYear, nowMonth, 1));
      }
      this.$http.post('/api/engine/project/campus/listcount', {timeStart:this.timeStart}).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
           if(res.data.data){
            this.formItem.intentionSum=res.data.data.intentionSum;
            this.formItem.importSum=res.data.data.importSum;
            this.formItem.signSum=res.data.data.signSum;
            this.formItem.defermentSum=res.data.data.defermentSum;
            this.formItem.traceSum=res.data.data.traceSum;
            intentionList=res.data.data.intentionList;
            importList=res.data.data.importList;
            signList=res.data.data.signList;
            defermentList=res.data.data.defermentList;
            traceList=res.data.data.traceList;
            campusList=[];
            var temp=[];
            intentionList.map((item)=>{
              temp.push({name:item.name});
            })
            importList.map((item)=>{
              temp.push({name:item.name});
            })
            signList.map((item)=>{
              temp.push({name:item.name});
            })
            defermentList.map((item)=>{
              temp.push({name:item.name});
            })
            traceList.map((item)=>{
              temp.push({name:item.name});
            })
            var arr={};
            temp.map((item)=>{//去重
              if(!arr[item.name]){
                campusList.push(item);
                arr[item.name]=true;
              }
            })
            campusList.map((it)=>{
              it.value1=0;
              it.value2=0;
              it.value3=0;
              it.value4=0;
              it.value5=0;
              intentionList.map((it1)=>{
                if(it.name==it1.name){
                  it.value1=it1.value;
                }
              })
              importList.map((it2)=>{
                if(it.name==it2.name){
                  it.value2=it2.value;
                }
              })
              signList.map((it3)=>{
                if(it.name==it3.name){
                  it.value3=it3.value;
                }
              })
              defermentList.map((it4)=>{
                if(it.name==it4.name){
                  it.value4=it4.value;
                }
              })
              traceList.map((it5)=>{
                if(it.name==it5.name){
                  it.value5=it5.value;
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
    goBack: function () {
      this.$router.go(-1);
    },
    initEchart(temp) {
      var that =this;
        //获取DOM节点并初始化
        let myChart = this.$echarts.init(this.$refs.main1);
        let name =[];
        let val1 =[];
        let val2 =[];
        let val3 =[];
        let val4 =[];
        let val5 =[];
        for(var i=0;i<temp.length;i++){
          name[i]=temp[i].name;
          val1[i]=temp[i].value1;
          val2[i]=temp[i].value2;
          val3[i]=temp[i].value3;
          val4[i]=temp[i].value4;
          val5[i]=temp[i].value5;
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
              data:['意向项目','重点项目','签约项目','延期申请','项目跟进'],
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
                    triggerEvent:true,
                  }
              ],
          //Y轴配置
          yAxis: [
                  {
                    type: 'value',
                    splitArea: { show: true },
                    name:'',
                    triggerEvent:true
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
                  {
                    name: '延期申请',
                    type: 'bar',
                    data: val4,
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
                    name: '项目跟进',
                    type: 'bar',
                    data: val5,
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
        //myChart.clear();
        myChart.on('click',function(params){
          if (params.componentType == "series") {//柱形点击
            if(params.dataIndex!=null){
              //that.initDeptEchart(campusList[params.dataIndex].name);
            }
          }
          if (params.componentType == "xAxis") {//横坐标点击
            if(params.value!=null){
              that.initDept(params.value);
            }
          }
        });
        myChart.getZr().on('click',function(params){//阴影点击
          const pointInPixel= [params.offsetX, params.offsetY];
          if (myChart.containPixel('grid',pointInPixel)) {
              var xIndex=myChart.convertFromPixel({seriesIndex:0},[params.offsetX, params.offsetY])[0];
                if(xIndex!=null) {
                  that.initDept(that.campusList[xIndex].name);
                } 
          }
        });  
        myChart.setOption(option,true);
      },
      initDept(param) {  
       this.campusName=param;
       this.$http.post('/api/engine/project/campus/deptListcount', {timeStart:this.timeStart,campusName:this.campusName}).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          if(res.data.data){
            var deptList=[];
            var temp=[];
            var intentionList=res.data.data.intentionList;
            var importList=res.data.data.importList;
            var signList=res.data.data.signList;
            var defermentList=res.data.data.defermentList;
            var traceList=res.data.data.traceList;
            intentionList.map((item)=>{
              deptList.push({name:item.name});
            })
            importList.map((item)=>{
              deptList.push({name:item.name});
            })
            signList.map((item)=>{
              deptList.push({name:item.name});
            })
            defermentList.map((item)=>{
              deptList.push({name:item.name});
            })
            traceList.map((item)=>{
              deptList.push({name:item.name});
            })
            var arr={};
            deptList.map((item)=>{//去重
              if(!arr[item.name]){
                temp.push(item);
                arr[item.name]=true;
              }
            })
            temp.map((it)=>{
              it.value1=0;
              it.value2=0;
              it.value3=0;
              it.value4=0;
              it.value5=0;
              intentionList.map((it1)=>{
                if(it.name==it1.name){
                  it.value1=it1.value;
                }
              })
              importList.map((it2)=>{
                if(it.name==it2.name){
                  it.value2=it2.value;
                }
              })
              signList.map((it3)=>{
                if(it.name==it3.name){
                  it.value3=it3.value;
                }
              })
              defermentList.map((it4)=>{
                if(it.name==it4.name){
                  it.value4=it4.value;
                }
              })
              traceList.map((it5)=>{
                if(it.name==it5.name){
                  it.value5=it5.value;
                }
              })
            })
            this.deptList=temp;
            this.initDeptEchart(temp);
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
    initDeptEchart(temp) {
      var that =this;
      //获取DOM节点并初始化
      this.loading=1; 
      this.boxshow2=true;     
      let name =[];
      let val1 =[];
      let val2 =[];
      let val3 =[];
      let val4 =[];
      let val5 =[];
      for(var i=0;i<temp.length;i++){
        name[i]=temp[i].name;
        val1[i]=temp[i].value1;
        val2[i]=temp[i].value2;
        val3[i]=temp[i].value3;
        val4[i]=temp[i].value4;
        val5[i]=temp[i].value5;
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
            data:['意向项目','重点项目','签约项目',,'延期申请','项目跟进'],
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
                  triggerEvent:true,
                }
            ],
        //Y轴配置
        yAxis: [
                {
                  type: 'value',
                  splitArea: { show: true },
                  name:'',
                  triggerEvent:true
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
                {
                  name: '延期申请',
                  type: 'bar',
                  data: val4,
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
                  name: '项目跟进',
                  type: 'bar',
                  data: val5,
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
      let myChart = this.$echarts.init(this.$refs.main2);
      myChart.clear();
      myChart.on('click',function(params){
        if (params.componentType == "series") {//柱形点击
          if(params.dataIndex!=null){
            //that.initDeptEchart(campusList[params.dataIndex].name);
          }
        }
        if (params.componentType == "xAxis") {//横坐标点击
          if(params.value!=null){
            that.initPeople(params.value);
          }
        }
      });
      myChart.getZr().on('click',function(params){//阴影点击
        const pointInPixel= [params.offsetX, params.offsetY];
        if (myChart.containPixel('grid',pointInPixel)) {
            var xIndex=myChart.convertFromPixel({seriesIndex:0},[params.offsetX, params.offsetY])[0];
              if(xIndex!=null) {
                that.initPeople(that.deptList[xIndex].name);
              } 
        }
      });  
      myChart.setOption(option);
      this.loading=0;
    },
     initPeople(param) {  
       this.deptName=param;
       this.$http.post('/api/engine/project/campus/peopleListcount', {timeStart:this.timeStart,campusName:this.campusName,deptName:this.deptName}).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          if(res.data.data){
            var peopleList=[];
            var temp=[];
            var intentionList=res.data.data.intentionList;
            var importList=res.data.data.importList;
            var signList=res.data.data.signList;
            var defermentList=res.data.data.defermentList;
            var traceList=res.data.data.traceList;
            this.initPeopleEchart(intentionList,'意向项目',this.$refs.main3,'#62DAAB');
            this.initPeopleEchart(importList,'重点项目',this.$refs.main4,'#7081A0');
            this.initPeopleEchart(signList,'签约项目',this.$refs.main5,'#F6C022');
            this.initPeopleEchart(defermentList,'延期申请',this.$refs.main6,'#E96C5B');
            this.initPeopleEchart(traceList,'项目跟进',this.$refs.main7,'#9967BD');
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
    initPeopleEchart(temp,title,mine,color){
      var that =this;
      //获取DOM节点并初始化
      this.loading=1; 
      this.boxshow3=true;     
      let name =[];
      let val =[];
      for(var i=0;i<temp.length;i++){
        name[i]=temp[i].name;
        val[i]=temp[i].value;
      }
      let option = {
        color: [color],
         title: {
              text: title, //正标题
              x: "center", //标题水平方向位置
              textStyle: {
                  fontSize:15
              },
          },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            right: '13%',
            bottom: '3%',
            containLabel: true
        },
        //轴配置
        xAxis: [
                {
                  type: 'value',
                  splitArea: { show: true },
                  name:'',
                }
            ],
        //Y轴配置

        yAxis: [
                {
                  type: 'category',
                  data: name,
                  inverse: true,
                }
            ],
        //图表Series数据序列配置
        series: [
                {
                  name: '项目',
                  type: 'bar',
                  data: val,
                  label: {
                    normal: {
                        show: true,
                        position: 'insideRight',
                    }
                  },
                  barWidth : 30,//柱图宽度
                  barGap:'0%',//柱图间距
                },
            ]
      };
      let myChart = this.$echarts.init(mine);
      myChart.clear();
      myChart.setOption(option,true);
      this.loading=0;
    },
    goPage(page) {
      this.$router.push({ path: page });
    },
  }
}

</script>

<style type="text/css">
.mytables1 {
  width: 80%;
  margin-left: 15px;
  padding-top: 10px;
}
.mytables1 .td1{
  white-space:nowrap;
  padding: 5px 10px;
  font-size:18px;
  font-weight:normal;
  background: rgba(255,255,255,1);
  width:17% !important;
  height:80px;
  border-radius:8px;
}
.mytables1 .td2{
  text-align: right !important;
  padding-right: 10px;
  width:190px;
}
.mytables1 .td4{
  background-color: #f5f6f7;
  width:2%;
}
.fontColor{
  color:rgba(249,9,37,1);
  padding: 0px 10px;
  font-weight: bold;
  font-size: 25px;
}
</style>
