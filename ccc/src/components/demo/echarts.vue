<template>
  <div class="content-box">
    <!-- vue的ref可以通过this.$refs.获取到DOM节点 -->
    <!-- echart容器div必须设置高度，否则不显示 -->
    <div ref="main" style="height:400px"></div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      words: [
        {
          name: "考研",
          value: 10
        },
        {
          name: "兼职",
          value: 6181
        },
        {
          name: "食堂",
          value: 4386
        },
        {
          name: "家教",
          value: 4055
        },
        {
          name: "大四",
          value: 2467
        },
        {
          name: "研友",
          value: 2244
        },
        {
          name: "论文",
          value: 1898
        },
        {
          name: "专接本",
          value: 1484
        },
        {
          name: "招聘",
          value: 1112
        },
        {
          name: "讲座",
          value: 965
        },
        {
          name: "图书馆",
          value: 847
        },
        {
          name: "租房",
          value: 582
        }
        
      ],
      data:[{"mon":"1月","rain":2.6,"temperature":2.0},
            {"mon":"2月","rain":5.9,"temperature":14.9},
            {"mon":"3月","rain":9.0,"temperature":17.0},
            {"mon":"4月","rain":26.4,"temperature":23.2},
            {"mon":"5月","rain":28.7,"temperature":25.6},
            {"mon":"6月","rain":70.7,"temperature":76.7},
            {"mon":"7月","rain":175.6,"temperature":135.6},
            {"mon":"8月","rain":182.2,"temperature":162.2},
            {"mon":"9月","rain":48.7,"temperature":32.6},
            {"mon":"10月","rain":18.8,"temperature":20.0},
            {"mon":"11月","rain":6.0,"temperature":6.4},
            {"mon":"12月","rain":2.3,"temperature":3.3}
            ],
      mymon:[],
      myhot:[],
      myrain:[],

    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initEchart();
    });
  },
  methods: {
    initEchart() {
      //获取DOM节点并初始化
      let myChart = this.$echarts.init(this.$refs.main);
      for(var i=0;i<this.data.length;i++){
        this.mymon[i]=this.data[i].mon;
        this.myrain[i]=this.data[i].rain;
        this.myhot[i]=this.data[i].temperature;
      }
      let option = {
         //图表标题
        title: {
            text: "ECharts简单线形图表及其配置展示实例", //正标题
            //link: "http://www.stepday.com", //正标题链接 点击可在新窗口中打开
            x: "center", //标题水平方向位置
            //subtext: "From:http://www.stepday.com", //副标题
            //sublink: "http://www.stepday.com", //副标题链接
            //正标题样式
            textStyle: {
                fontSize:24
            },
            //副标题样式
            subtextStyle: {
                fontSize:12,
                color:"red"
            }
        },
        //数据提示框配置
        tooltip: {
            trigger: 'axis' //触发类型，默认数据触发，见下图，可选为：'item' | 'axis' 其实就是是否共享提示框
        },
        //图例配置
        legend: {
            data: ['温度', '降水量'], //这里需要与series内的每一组数据的name值保持一致
            y:"bottom"
        },
        //工具箱配置
        toolbox: {
            show: true, //是否显示工具箱
            feature: {
                mark: false, // 辅助线标志，上图icon左数1/2/3，分别是启用，删除上一条，删除全部
                dataView: { readOnly: true }, // 数据视图，上图icon左数8，打开数据视图
                magicType: {show: true,type:['line', 'bar']},      // 图表类型切换，当前仅支持直角系下的折线图、柱状图转换，上图icon左数6/7，分别是切换折线图，切换柱形图
                restore: true, // 还原，复位原始图表，上图icon左数9，还原
                saveAsImage: true  // 保存为图片，上图icon左数10，保存
            }
        },
        calculable: true,
        //轴配置
        xAxis: [
                {
                    type: 'category',
                    data: this.mymon,
                    name: "月份"
                }
            ],
        //Y轴配置
        yAxis: [
                {
                    type: 'value',
                    splitArea: { show: true },
                    name:"数值"
                }
            ],
        //图表Series数据序列配置
        series: [
                {
                    name: '温度',
                    type: 'line',
                    data: this.myhot
                },
                {
                    name: '降水量',
                    type: 'line',
                    data: this.myrain
                }
            ]
      };

      //设置图表的参数
      myChart.setOption(option);
    }
  }
};
</script>