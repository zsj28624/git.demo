<template>
  <Card v-show="this.$user.hasPower('gzt.stbmld.wdxzqy') || this.$user.hasPower('gzt.stxsry.wdxzqy')">
    <Row>
      <h3>我的新增企业</h3>
      <Select style="width: 210px" v-model="time" @on-change="typeChange">
        <Option v-for="item in timeOptin" :value="item.code" :key="item.code">{{ item.text }}</Option>
      </Select>
      <div ref="main" style="height:400px;width:95%;"></div>
    </Row>
  </Card>
</template>
<script>  
import page from '@/assets/js/page';

export default {
  components: {
    page,
  },
  data() {
    return {
      time: '近半年',
      timeOptin: [
        { code: '近半年', text: '近半年' },
        { code: '近一年', text: '近一年' }
      ]
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
      var startTime = '';
      var endTime = page.formatDate(new Date());
      if (this.time == "近半年") {
        startTime = page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 6));
      }
      if (this.time == "近一年") {
        startTime = page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 12));
      }  
      this.$http.post('/api/engine/worktable/ecology/myAddCorp', { 'startTime': startTime, 'endTime': endTime }).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          if (res.data.data) {
            var list = res.data.data;
            this.initEchart2('bar', '', list);
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
    initEchart2(type, xName, list) {
      //获取DOM节点并初始化
      let myChart = this.$echarts.init(this.$refs.main);
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
          text: "", //正标题
          x: "center", //标题水平方向位置
          textStyle: {
            fontSize: 24
          },
        },
        //图例配置
        legend: {
          data: [type], //这里需要与series内的每一组数据的name值保持一致
          y: "bottom"
        },
        calculable: true,
        //轴配置
        xAxis: [
          {
            type: 'category',
            data: name,
            name: xName
          }
        ],
        //Y轴配置
        yAxis: [
          {
            type: 'value',
            splitArea: { show: true },
            name: '数量'
          }
        ],
        //图表Series数据序列配置
        series: [
          {
            name: '统计',
            type: type,
            data: val,
            label: {
              normal: {
                show: true,
                position: 'top',
              }
            },
            barWidth: 30
          }
        ]
      };
      //设置图表的参数
      let option = {
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
      myChart.clear();
      myChart.setOption(option);
    },
    initEchart(obj, temp) {
      var that = this;
      //获取DOM节点并初始化
      let myChart = this.$echarts.init(obj);
      let name = [];
      let val1 = [];
      let val2 = [];
      let val3 = [];
      let val4 = [];
      let val5 = [];
      for (var i = 0; i < temp.length; i++) {
        name[i] = temp[i].name;
        val1[i] = temp[i].value1;
        val2[i] = temp[i].value2;
        val3[i] = temp[i].value3;
        val4[i] = temp[i].value4;
        val5[i] = temp[i].value5;
      }
    }
  }
}
</script> 