<template>
  <Card>
    <Row style="margin-top:10px;">
      <h3>{{title}}</h3>
      <Col span="12" v-show="this.$user.hasPower('gzt.stbmld.wdxssjdytj') || this.$user.hasPower('gzt.stxsry.wdxssjdytj') || this.$user.hasPower('gzt.boss.wdxssjdytj')">
        <div ref="main1" style="height:500px;width:95%;"></div>
      </Col>
      <Col span="12" v-show="this.$user.hasPower('gzt.stbmld.wdxssjstfltj') || this.$user.hasPower('gzt.stxsry.wdxssjstfltj') || this.$user.hasPower('gzt.boss.wdxssjdytj')">
        <div ref="main2" style="height:500px;width:95%;"></div>
      </Col>
      <!-- <Col span="12" v-show="this.$user.hasPower('gzt.stbmld.wdxssjbqtj') || this.$user.hasPower('gzt.stxsry.wdxssjbqtj') || this.$user.hasPower('gzt.boss.wdxssjdytj')">
        <div ref="main3" style="height:500px;width:95%;"></div>
      </Col> -->
      <Col span="12" v-show="this.$user.hasPower('gzt.stbmld.wdxssjnxsetj') || this.$user.hasPower('gzt.stxsry.wdxssjnxsetj') || this.$user.hasPower('gzt.boss.wdxssjdytj')">
        <div ref="main4" style="height:500px;width:95%;"></div>
      </Col>
      <Col span="12" v-show="this.$user.hasPower('gzt.stbmld.wdxssjzczjtj') || this.$user.hasPower('gzt.stxsry.wdxssjzczjtj') || this.$user.hasPower('gzt.boss.wdxssjdytj')">
        <div ref="main5" style="height:500px;width:95%;"></div>
      </Col>
      <Col span="12" v-show="this.$user.hasPower('gzt.stbmld.wdxssjqydjtj') || this.$user.hasPower('gzt.stxsry.wdxssjqydjtj') || this.$user.hasPower('gzt.boss.wdxssjdytj')">
        <div ref="main6" style="height:500px;width:95%;"></div>
      </Col>
      <Col span="12" v-show="this.$user.hasPower('gzt.stbmld.wdxssjgjzq') || this.$user.hasPower('gzt.stxsry.wdxssjgjzq') || this.$user.hasPower('gzt.boss.wdxssjdytj')">
        <div ref="main7" style="height:500px;width:95%;"></div>
      </Col>
      <Col span="12" v-show="this.$user.hasPower('gzt.stbmld.wdxssjbmtj') || this.$user.hasPower('gzt.stxsry.wdxssjbmtj') || this.$user.hasPower('gzt.boss.wdxssjdytj')">
        <div ref="main8" style="height:500px;width:95%;"></div>
      </Col>
    </Row>
    <!-- <Select v-model="type" style="width: 210px" @on-change="typeChange">
      <Option v-for="item in typeOption" :value="item.code" :key="item.code">{{ item.text }}</Option>
    </Select>-->
  </Card>
</template>
<script>  
import page from '@/assets/js/page';
import areajs from '@/assets/js/area'

export default {
  props:{
    title:{
      type:String,
      defult:"我的销售数据"
    }
  },
  components: {
    page,
  },
  data() {
    return {
      type: '地域',
      loading: 0,
      typeOption: [
        { code: '地域', text: '地域' },
        { code: '生态分类', text: '生态分类' },
        // { code: '标签', text: '标签' },
        { code: '年销售额', text: '年销售额' },
        { code: '注册资金', text: '注册资金' },
        { code: '企业等级', text: '企业等级' },
        { code: '跟进周期', text: '跟进周期' },
        { code: '部门', text: '部门' },
      ],
    }
  },
  computed: {
  },
  mounted() {
    this.load();
  },
  methods: {
    typeChange() {
      this.load();
    },
    load() {
      this.loading = 1;
      this.$http.post('/api/engine/worktable/ecology/mySalesData', {}).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          if (res.data.data) {
            var list = res.data.data;
            list.dy.forEach(e => {
              e.name = areajs.getText(e.name);
            });
            list.gjzq.forEach(e => {
              if(e.name){
                e.name = e.name.length>=10?e.name.substring(0,10):e.name
              }
            });
            list.qydj.forEach(e => {
              if(e.name == null){
                e.name = "未设置";
              }
            });
            // var bqList = [];
            // list.bq.map((item)=>{
            //   item.name.split(",").map((arg)=>{
            //     var bqResult = {};
            //     bqResult.name=arg;
            //     bqResult.value=item.value;
            //     bqList.push(bqResult);
            //   });
            // });
            var zczList = [];

            list.zczj.map((item)=>{
              item.map((it)=>{
                var zczjResult = {};
                zczjResult.name = it.name;
                zczjResult.value = it.value;
                zczList.push(zczjResult);
              });
            });
            setTimeout(() => {
              this.initEchart('pie', '地域', list.dy, this.$refs.main1)
              this.initEchart('pie', '生态分类', list.stfl, this.$refs.main2);
              // this.initEchart('pie', '标签', bqList, this.$refs.main3);
              this.initEchart('pie', '年销售额', list.nxse, this.$refs.main4);
              this.initEchart('pie', '注册资金', zczList, this.$refs.main5);
              this.initEchart('pie', '企业等级', list.qydj, this.$refs.main6);
              this.initEchart('bar', '跟进周期', list.gjzq, this.$refs.main7);
              this.initEchart('pie', '部门', list.bm, this.$refs.main8);
            }, 300);
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
    initEchart(type, xName, list, obj) {
      //获取DOM节点并初始化
      let myChart = this.$echarts.init(obj);
      let name = [];
      let val = [];
      for (var i = 0; i < list.length; i++) {
        name[i] = list[i].name == null ? '' : list[i].name;
        val[i] = list[i].value;
      }
      let option1 = {
        color: ['#97B8FB'],
        //图表标题
        title: {
          text: xName//正标题 
        },
        tooltip: {},
        //图例配置
        legend: {
          data: ['统计'], //这里需要与series内的每一组数据的name值保持一致 
        },
        //轴配置
        xAxis: [
          {
            data: name,
          }
        ],
        //Y轴配置
        yAxis: {},
        //图表Series数据序列配置
        series: [
          {
            name: '统计',
            type: type,
            data: val
          }
        ]
      };

      let option2 = {//饼状图
        color: ['#62DAAB','#7081A0','#F6C022','#E96C5B','#9967BD','#299999','#97B8FB','#BEE0E0', '#D0F4E5', '#F8D2CE','#74CBED','#9967BD','#E0D1EB','#FFE2CA','#FF9EC6','#FCECBD'],
        title: {
          text: xName + '统计',
          left: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 100,
          top: 5,
          bottom: 5,
          data: name,   //这里需要与series内的每一组数据的name值保持一致 
        },
        series: [{
          name: '',
          type: 'pie',
          radius: '35%',
          center: ['40%', '50%'],
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };

      //设置图表的参数
      let option = option1;
      if (type == 'pie') {
        option = option2;
      }
      myChart.clear();
      myChart.setOption(option);
    },
  }
} 
</script>
 