<template>
  <Card>
    <Row style="margin-top:10px;">
      <h3>部门销售数据</h3>
      <Col span="12" v-show="this.$user.hasPower('gzt.stbmld.bmxssjdytj') || this.$user.hasPower('gzt.stxsry.bmxssjdytj')">
        <Select style="width: 210px" v-model="type" @on-change="typeChange">
          <Option v-for="item in typeOption" :value="item.code" :key="item.code">{{ item.text }}</Option>
        </Select>
        <div ref="main" style="height:400px;width:95%;"></div>
      </Col>
      <Col span="12" v-show="this.$user.hasPower('gzt.stbmld.bmxssjbmxzqy') || this.$user.hasPower('gzt.stxsry.bmxssjbmxzqy')">
        部门新增企业
        <Select style="width: 210px" v-model="time" @on-change="timeChange">
          <Option v-for="item in timeOptin" :value="item.code" :key="item.code">{{ item.text }}</Option>
        </Select>
        <div ref="main2" style="height:400px;width:95%;"></div>
      </Col>
    </Row>
  </Card>
</template>
<script>  
import page from '@/assets/js/page';
import areajs from '@/assets/js/area'

export default {
  components: {
    page,
  },
  data() {
    return {
      type: '地域',
      time: '近半年',
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
      timeOptin: [
        { code: '近半年', text: '近半年' },
        { code: '近一年', text: '近一年' }
      ],
    }
  },
  computed: {
  },
  mounted() {
    this.load();
    this.loadDeptAddCorp();
  },
  methods: {
    typeChange() {
      this.load();
    },
    timeChange() {
      this.loadDeptAddCorp();
    },
    //部门新增企业
    loadDeptAddCorp() {
      this.loading = 1;
      var startTime = '';
      var endTime = page.formatDate(new Date());
      if (this.time == "近半年") {
        startTime = page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 6));
      }
      if (this.time == "近一年") {
        startTime = page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 12));
      }
      this.$http.post('/api/engine/worktable/ecology/deptAddCorp', { 'startTime': startTime, 'endTime': endTime }).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          if (res.data.data) {
            var list = res.data.data;
            setTimeout(() => {
              this.initEchart2('bar', '', list, this.$refs.main2);
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
    load() {
      this.loading = 1;
      this.$http.post('/api/engine/worktable/ecology/deptSalesData', { 'type': this.type }).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          if (res.data.data) {
            var data = res.data.data;
            var list = [];
            // var bqList = [];
            // data.bq.map((item)=>{
            //   item.name.split(",").map((arg)=>{
            //     var bqResult = {};
            //     bqResult.name=arg;
            //     bqResult.value=item.value;
            //     bqList.push(bqResult);
            //   });
            // });
            switch (this.type) {
              case '地域':
                data.dy.forEach(e => {
                  e.name = areajs.getText(e.name);
                });
                list = data.dy;
                break;
              case '生态分类':
                list = data.stfl;
                break;
              // case '标签':
              //   list = bqList;
              //   break;
              case '年销售额':
                list = data.nxse;
                break;
              case '注册资金':
                list = data.zczj;
                break;
              case '企业等级':
                list = data.qydj;
                break;
              case '跟进周期':
                list = data.gjzq;
                break;
              case '部门':
                list = data.bm;
                break;
              default:
                break;
            }
            setTimeout(() => {
              this.initEchart2('pie', this.type, list, this.$refs.main);
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
    initEchart2(type, xName, list, obj) {
      var that = this;
      //获取DOM节点并初始化
      let myChart = this.$echarts.init(obj);
      let name = [];
      let val = [];
      for (var i = 0; i < list.length; i++) {
        name[i] = list[i].name == null ? '' : list[i].name;
        val[i] = list[i].value;
      }

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
          right: 40,
          top: 5,
          bottom: 5,
          data: name,   //这里需要与series内的每一组数据的name值保持一致
        },
        series: [{
          name: '',
          type: 'pie',
          radius: '55%',
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
      let option1 = {
        color: ['#97B8FB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: name,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '新增',
            type: 'bar',
            barWidth: '20%',
            data: val
          }
        ]
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
  