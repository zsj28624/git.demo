<template>
  <ListPage
    ref="page"
    title="生态数据统计"
    api="/api/engine/enterprise-ecology/corp/count/list"
    :model="this"
    :beforeLoad="beforeLoad"
    @on-load="onLoadData"
  >
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="width: 70px" align="right">统计维度</td>
          <td>
            <Select v-model="queryForm.type" style="width: 220px">
              <Option v-for="item in type" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </td>
          <td style="width: 50px" align="right"></td>
          <td v-if="queryForm.type == '跟进周期'">
            <Select v-model="queryForm.time" style="width: 220px">
              <Option v-for="item in time" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </td>
          <td v-else>
            <DatePicker
              type="daterange"
              v-model="queryForm.time"
              split-panels
              placeholder="查询日期"
              style="width: 220px"
              :clearable="true"
              ::transfer="true"
            ></DatePicker>
          </td>
          <!--<td>
            <Button @click="query" type="primary" icon="ios-search">搜索</Button>
          </td>-->
          <td>
            <Button @click="reset" type="default">重置</Button>
          </td>
          <td>
            <Button @click="choose" type="default">自定义列</Button>
          </td>
        </tr>
      </table>
      <br />
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Select v-model="icon" style="width: 150px">
              <Option v-for="item in icons" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </td>
          <td>
            <Button @click="chooseIcon" type="default">生成图表</Button>
          </td>
          <td>
            <Button @click="closeIcon" type="default">隐藏图表</Button>
          </td>
        </tr>
      </table>
      <div :class="iconClass">
        <div ref="main" style="height:400px"></div>
      </div>
    </div>
    <Transfer ref="Transfer" @on-save="columnsChoose"></Transfer>
  </ListPage>
</template>
<script>    
import ListPage from '@/components/page/ListPage';
import Transfer from '@/components/project/count/Transfer';
import areajs from '@/assets/js/area';
import page from '@/assets/js/page';

export default {
  components: {
    ListPage,
    Transfer,
  },
  data() {
    let that = this;
    return {
      tabName: '1',
      columns: [
        /*{
          title:'操作',
          width: 150,
          align: 'center',
          render:(h,params)=>{
            var row = params.row;
            return h(DataRowOperate,{
              props:{
                btns:[{
                  key:'edit',
                  disabled:!this.$user.hasPower('xmgl.xmxxk.edit'),
                },
                {
                  key:'delete',
                  disabled:row.step !='待入库'||!this.$user.hasPower('xmgl.xmxxk.delete'),
                },
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
        },*/
        {
          title: '序号',
          width: 100,
          type: 'index',
          align: 'center',
        },
        {
          title: '企业名称',
          key: 'corpName',
          minWidth: 200,
        },
        {
          title: '企业级别',
          key: 'level',
          width: 120,
        },
        {
          title: '企业法人',
          key: 'corporation',
          width: 120,
        },
        {
          title: '年销售额（元）',
          key: 'usd',
          width: 120,
        },
        {
          title: '注册资金（元）',
          key: 'registeredCapital',
          width: 120,
        },
        {
          title: '所属地域',
          key: 'fullName',
          width: 120,
        },
        {
          title: '企业对接人',
          key: 'contactName',
          width: 120,
        },
        {
          title: '所属生态分类',
          key: 'ecologyTypeTag',
          width: 120,
          render: (h, params) => {
            return h('div', { domProps: { innerHTML: params.row.ecologyTypeTag } });
          }
        },
      ],
      type: [
        { code: '地域', text: '地域' },
        { code: '部门', text: '部门' },
        { code: '生态分类', text: '生态分类' },
        { code: '年销售额', text: '年销售额' },
        { code: '注册资金', text: '注册资金' },
        { code: '企业等级', text: '企业等级' },
        { code: '跟进周期', text: '跟进周期' },
      ],
      time: [
        { code: '近七日', text: '近七日' },
        { code: '三个月', text: '三个月' },
        { code: '近半年', text: '近半年' },
        { code: '近一年', text: '近一年' }
      ],
      kind: [
        { code: '按所属部门', text: '按所属部门' },
        { code: '按项目阶段', text: '按项目阶段' },
        { code: '按负责人', text: '按负责人' },
        { code: '按行业', text: '按行业' },
        { code: '按园区', text: '按园区' }
      ],
      contact: [
        { code: '包含', text: '包含' },
        { code: '介于', text: '介于' },
        { code: '不包含', text: '不包含' },
        { code: '=', text: '=' },
        { code: '!=', text: '!=' },
        { code: '>', text: '>' },
        { code: '>=', text: '>=' },
        { code: '<', text: '<' },
        { code: '<=', text: '<=' },
      ],
      and: [
        { code: '并且', text: '并且' },
        { code: '或者', text: '或者' },
      ],
      dept: [],
      icons: [
        { code: '柱状图', text: '柱状图' },
        { code: '饼状图', text: '饼状图' },
        { code: '折线图', text: '折线图' },
        /*{code:'条形图',text:'条形图'},*/
        { code: '面积图', text: '面积图' },
        { code: '散点图', text: '散点图' },
      ],
      icon: '',
      listStyle:
      {
        width: '250px',
        height: '300px'
      },
      total: 0,
      queryParam: {},
      queryForm: {
        type: '',
        time: '',
        stockinTimeStart: '',
        stockinTimeEnd: '',
      },
      selection: [],
      isComplex: false,
      curRow: {},
      iconClass: 'iconclose',
      loading: 0,
      listSum: []
    }
  },
  mounted: function () {
    this.query();
  },
  computed: {},
  methods: {
    beforeLoad() {
    },
    onLoadData(data) {
      if (data.apiRult && data.apiRult.data && data.apiRult.data.listSum) {
        this.listSum = data.apiRult.data.listSum;
      }
    },
    query() {
      this.dateFormat();
      this.$refs.page.query();
    },
    dateFormat(){
      this.queryForm.stockinTimeStart = '';
      this.queryForm.stockinTimeEnd = '';
      if (this.queryForm.time != null && this.queryForm.time != '') {
        if (this.queryForm.time == '近七日') {
          this.queryForm.stockinTimeStart = page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7));
          this.queryForm.stockinTimeEnd = page.formatDate(new Date());
        }
        if (this.queryForm.time == '近三个月') {
          this.queryForm.stockinTimeStart = page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 90));
          this.queryForm.stockinTimeEnd = page.formatDate(new Date());
        }
        if (this.queryForm.time == '近半年') {
          this.queryForm.stockinTimeStart = page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 180));
          this.queryForm.stockinTimeEnd = page.formatDate(new Date());
        }
        if (this.queryForm.time == '近一年') {
          this.queryForm.stockinTimeStart = page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 365));
          this.queryForm.stockinTimeEnd = page.formatDate(new Date());
        }
        if (this.queryForm.time.length > 0) {
          this.queryForm.stockinTimeStart = page.formatDate(this.queryForm.time[0]);
        }
        if (this.queryForm.time.length > 1) {
          this.queryForm.stockinTimeEnd = page.formatDate(this.queryForm.time[1]);
        }
      }
    },
    reset: function () {
      // 清空条件
      Object.assign(this.queryForm, {
        type: '',
        time: '',
        stockinTime: [],
      });
      this.query();
    },
    select: function (selection) {
      this.selection = selection;
    },
    curRowChg(row) {
      if (row != null) {
        this.curRow = row;
      } else {
        this.curRow = null;
      }
    },
    goBack: function () {
      this.$router.go(-1);
    },
    choose: function () {
      this.$refs.Transfer.open();
      return;
    },
    columnsChoose: function (item) {
      this.loading = 1;
      if (item.length > 0) {
        item = item.sort();
      }
      this.columns = [{
        title: '序号',
        width: 100,
        type: 'index',
        align: 'center',
      }];
      var title1 = {
        title: '项目名称',
        key: 'name',
        minWidth: 200,
      };
      var title2 = {
        title: '项目阶段',
        key: 'step',
        width: 120,
      };
      var title3 = {
        title: '保护期',
        key: 'projectStatus',
        width: 120,
      };
      var title4 = {
        title: '行业',
        key: 'industry',
        width: 120,
      };
      var title5 = {
        title: '企业所在地',
        key: 'area',
        width: 120,
      };
      var title6 = page.table.initDateColumn({
        title: '入库时间',
        key: 'stockinTime',
      });
      var title7 = {
        title: '意向区域',
        key: 'campusName',
        width: 150,
      };
      var title8 = {
        title: '负责人',
        key: 'operatorName',
        width: 120,
      };
      var title9 = {
        title: '所属部门',
        key: 'deptName',
        width: 120,
      };
      for (var i = 0; i < item.length; i++) {
        if (item[i] == 1) {
          this.columns.push(title1);
        }
        if (item[i] == 2) {
          this.columns.push(title2);
        }
        if (item[i] == 3) {
          this.columns.push(title3);
        }
        if (item[i] == 4) {
          this.columns.push(title4);
        }
        if (item[i] == 5) {
          this.columns.push(title5);
        }
        if (item[i] == 6) {
          this.columns.push(title6);
        }
        if (item[i] == 7) {
          this.columns.push(title7);
        }
        if (item[i] == 8) {
          this.columns.push(title8);
        }
        if (item[i] == 9) {
          this.columns.push(title9);
        }
      }
      this.$refs.page.query();
      this.loading = 0;
    },
    closeIcon() {
      this.iconClass = 'iconclose';
    },
    chooseIcon() {
      this.loading = 1;
      // var list = this.listSum;
      this.dateFormat();

      if (this.queryForm.type != null && this.queryForm.type != '') {
        this.iconClass = 'iconshow';

        this.$http.post('/api/engine/statistics/ecology/summary', { type: this.queryForm.type }).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            if (res.data.data.length > 0) {
              var list = res.data.data;

              if (this.queryForm.type == '年销售额'||this.queryForm.type == '注册资金') {
                var listType = [{name: "1亿以上", value: 0},
                                {name: "5000-9999万元", value: 0},
                                {name: "1000-4999万元", value: 0},
                                {name: "500-999万元", value: 0},
                                {name: "500万元以下", value: 0},];

                list.forEach(e => {
                  if(e.name == "1亿以上"){
                    listType[0].value = e.value;
                  }
                  if(e.name == "5000-9999万元"){
                    listType[1].value = e.value;
                  }
                  if(e.name == "1000-4999万元"){
                    listType[2].value = e.value;
                  }
                  if(e.name == "500-999万元"){
                    listType[3].value = e.value;
                  }
                  if(e.name == "500万元以下"){
                    listType[4].value = e.value;
                  }
                });
                list = listType;
              }

              if (this.queryForm.type == '地域') {
                list.forEach(e => {
                  e.name = areajs.getText(e.name);
                });
              }
              if (this.icon == "柱状图") {
                this.initEchart('bar', this.queryForm.type, list);
              }
              if (this.icon == "折线图") {
                this.initEchart('line', this.queryForm.type, list);
              }
              if (this.icon == "饼状图") {
                this.initEchart('pie', this.queryForm.type, list);
              }
              if (this.icon == "面积图") {
                this.initEchart('line', this.queryForm.type, list);
              }
              if (this.icon == "散点图") {
                this.initEchart('scatter', this.queryForm.type, list);
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
      } else {
        this.$Message.error("请选择统计维度！")
      }
    },

    initEchart(type, xName, list) {
      //获取DOM节点并初始化
      let myChart = this.$echarts.init(this.$refs.main);
      let name = [];
      let val = [];
      for (var i = 0; i < list.length; i++) {
        name[i] = list[i].name == null ? '' : list[i].name;
        val[i] = list[i].value;
      }
      let option1 = {
        //图表标题
        title: {
          text: "生态数据统计", //正标题
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



      let option2 = {//饼状图
        title: {
          text: '统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 5,
          top: 5,
          bottom: 5,
          data: name,   //这里需要与series内的每一组数据的name值保持一致 
        },
        series: [{
          name: '数量',
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          data: list,
          label: {
            normal: {
              formatter: '{b}:{c} ({d}%)',
              textStyle: {
                fontWeight: 'normal',
                fontSize: 15
              }
            }
          },
          labelLine: { show: true }
        }]
      };
      let option3 = {//面积图
        //图表标题
        title: {
          text: "统计", //正标题
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
            areaStyle: {},
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
      let option4 = { //散点图
        xAxis: {},
        yAxis: {},
        series: [{
          symbolSize: 20,
          data: list,
          type: 'scatter'
        }]
      };
      //设置图表的参数
      let option = {};
      if (this.icon == "柱状图") {
        option = option1;
      }
      if (this.icon == "折线图") {
        option = option1;
      }
      if (this.icon == "饼状图") {
        option = option2;
      }
      if (this.icon == "面积图") {
        option = option3;
      }
      if (this.icon == "散点图") {
        option = option4;
      }
      myChart.clear();
      myChart.setOption(option);
    }
  }
}

</script>

<style type="text/css">
.iconshow {
  display: block;
}
.iconclose {
  display: none;
}
</style>
