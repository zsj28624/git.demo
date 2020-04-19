<template>
  <ListPage
    ref="page"
    title="项目数据统计"
    api="/api/engine/project/count/list"
    :model="this"
    :beforeLoad="beforeLoad"
    @onCurrentRowChange="curRowChg"
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
          <td>
            <Select v-model="queryForm.time" style="width: 220px">
              <Option v-for="item in time" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </td>
          <td>
            <Button @click="query" type="primary" icon="ios-search">搜索</Button>
          </td>
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
import DataRowOperate from '@/components/commons/DataRowOperate';
import Transfer from '@/components/project/count/Transfer';
import SelArea from '@/components/selarea/index';
import areajs from '@/assets/js/area';
import page from '@/assets/js/page';
import UploadButton from '@/components/upload/UploadButton';

export default {
  components: {
    ListPage,
    DataRowOperate,
    Transfer,
    SelArea,
    UploadButton
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
          title: '项目名称',
          key: 'name',
          minWidth: 200,
        },
        {
          title: '项目阶段',
          key: 'step',
          width: 120,
        },
        {
          title: '保护期',
          key: 'projectStatus',
          width: 120,
        },
        {
          title: '行业',
          key: 'industry',
          width: 120,
        },
        {
          title: '企业所在地',
          key: 'area',
          width: 120,
        },
        page.table.initDateColumn({
          title: '入库时间',
          key: 'stockinTime',
        }),
        {
          title: '意向区域',
          key: 'campusName',
          width: 150,
        },
        {
          title: '负责人',
          key: 'operatorName',
          width: 120,
        },
        {
          title: '所属部门',
          key: 'deptName',
          width: 120,
        }
      ],
      type: [
        { code: '所属部门', text: '所属部门' },
        { code: '项目阶段', text: '项目阶段' },
        { code: '负责人', text: '负责人' },
        { code: '行业', text: '行业' },
        { code: '园区', text: '园区' }
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
      loading: 0
    }
  },
  mounted: function () {
    this.query();
    this.$bus.$emit('on-page-title-change',"项目数据统计");
  },
  computed: {},
  methods: {
    beforeLoad() {
    },
    query() {
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
      }
      this.$refs.page.query();
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
      var list = [];
      if (this.queryForm.type != null && this.queryForm.type != '') {
        this.iconClass = 'iconshow';
        this.$http.post('/api/engine/project/count/listcount', { type: this.queryForm.type }).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            if (res.data.data.rows.length > 0) {
              list = res.data.data.rows;
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
        color: ['#62DAAB','#7081A0','#F6C022','#E96C5B','#9967BD','#299999','#97B8FB','#BEE0E0', '#D0F4E5', '#F8D2CE','#74CBED','#9967BD','#E0D1EB','#FFE2CA','#FF9EC6','#FCECBD'],
        //图表标题
        title: {
          text: "项目统计", //正标题
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
            //boundaryGap: false,
            name: xName
          }
        ],
        //Y轴配置
        yAxis: [
          {
            type: 'value',
            splitArea: { show: true },
            name: '项目数量',
            //inverse: true,
          }
        ],
        //图表Series数据序列配置
        series: [
          {
            name: '项目统计',
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
        color: ['#62DAAB','#7081A0','#F6C022','#E96C5B','#9967BD','#299999','#97B8FB','#BEE0E0', '#D0F4E5', '#F8D2CE','#74CBED','#9967BD','#E0D1EB','#FFE2CA','#FF9EC6','#FCECBD'],
        title: {
          text: '项目统计',
          left: 'center'
        },
        series: [{
          name: '项目数量',
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          data: list,
          label: {
            normal: {
              formatter: '{b}:{c}: ({d}%)',
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
        color: ['#62DAAB','#7081A0','#F6C022','#E96C5B','#9967BD','#299999','#97B8FB','#BEE0E0', '#D0F4E5', '#F8D2CE','#74CBED','#9967BD','#E0D1EB','#FFE2CA','#FF9EC6','#FCECBD'],
        //图表标题
        title: {
          text: "项目统计", //正标题
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
            name: '项目数量'
          }
        ],
        //图表Series数据序列配置
        series: [
          {
            name: '项目统计',
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
        color: ['#62DAAB','#7081A0','#F6C022','#E96C5B','#9967BD','#299999','#97B8FB','#BEE0E0', '#D0F4E5', '#F8D2CE','#74CBED','#9967BD','#E0D1EB','#FFE2CA','#FF9EC6','#FCECBD'],
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
