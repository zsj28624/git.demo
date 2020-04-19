<template>
  <div class="page report-summary">
    <div class="page-title">
      概览<Spin style="display: inline-block;" v-if="loading"></Spin>
    </div> 
    
    <div class="optionbar">
      <ul>
        <li :class="cur==1?'cur':''" @click="selectOption(1)">
          今日 <span class="count">{{orderCounts.today}}</span> 单
        </li>
        <li :class="cur==2?'cur':''" @click="selectOption(2)">
          昨日 <span class="count">{{orderCounts.yestoday}}</span> 单
        </li>        
        <li :class="cur==3?'cur':''" @click="selectOption(3)">
          本月 <span class="count">{{orderCounts.curMonth}}</span> 单
        </li>
        <li :class="cur==4?'cur':''" @click="selectOption(4)">
          上月 <span class="count">{{orderCounts.lastMonth}}</span> 单
        </li> 
        <li class="cur" v-if="cur==5" @click="selectOption(5)">
          {{selDay}}
        </li> 
        <li class="cur" v-if="cur==6" @click="selectOption(6)">
          {{selMonth}}
        </li> 

        <li @click="loadOptions">
          同步任务：{{notifyPerfor.activeCount}} / {{notifyPerfor.taskCount - notifyPerfor.completedTaskCount}}
        </li>
        
        <!--
        <li class="btn1" @click="selectDay">
          指定日期
        </li>
        <li class="btn1" @click="selectMonth">
          指定月份
        </li>-->
      </ul>
      <div class="clear"></div>
    </div>
    <div style="height: 10px;"></div>
    <div class="column-title">订单量</div>
    <Card dis-hover>        
        <p style="color:#999">
          <span style="font-size: 32px;color:#495060">{{curData.orderCount}}</span> 单 <span style="font-size: 32px;color:#495060">{{curData.orderAmount}}</span> 元  
        </p> 
        <div>
          <Tag type="dot" color="green" @click.native="goPage(1)">已支付 {{curData.orderCountPay}} 单，{{curData.orderAmountPay}} 元</Tag>
          <Tag type="dot" color="blue" @click.native="goPage(2)">待支付 {{curData.orderCountWaitPay}} 单，{{curData.orderAmountWaitPay}} 元</Tag>
          <Tag type="dot" color="yellow" @click.native="goPage(3)">待同步 {{curData.orderCountWaitSync}} 单，{{curData.orderAmountWaitSync}} 元</Tag>
          <Tag type="dot" color="red" @click.native="goPage(4)">异常 {{curData.orderCountErr}} 单，{{curData.orderAmountErr}} 元</Tag>
        </div>
    </Card>
    <div style="height: 10px;"></div>
    <div class="column-title">租户</div>
    <Card dis-hover> 
        <i-table :columns="tenantColumns" 
          :disabled-hover="false" 
          :highlight-row="true" 
          :data="curData.tenantRows"></i-table>
    </Card>
    <div style="height: 10px;"></div>
    <div class="column-title">支付账号</div>
    <Card dis-hover> 
        <i-table :columns="payColumns" 
          :disabled-hover="false" 
          :highlight-row="true" 
          :data="curData.payRows"></i-table>
    </Card>    
  </div>
</template>
<script>
  import page from '@/assets/js/page';
  export default {
    components: { 
    },
    data() {       
      return {
        title:'标题',
        loading:0,
        cur:1,// 1.今日 2.昨天 3.本月 4.上月 5.指定日期 6.指定月份
        selDay:'2019-12-08',
        selMonth:'2019-12',
        selectValue:'2019-12-08',
        orderCounts:{
          today:0,
          yestoday:0,
          curMonth:0,
          lastMonth:0,
        },
        curData:{
          orderCount:0,
          orderAmount:0,
          orderCountPay:0,
          orderAmountPay:0,
          orderCountWaitPay:0,
          orderAmountWaitPay:0,
          orderCountWaitSync:0,
          orderAmountWaitSync:0,
          orderCountErr:0,
          orderAmountErr:0,
          tenantRows:[],
          payRows:[]
        },
        notifyPerfor:{
          "activeCount": 0,
          "taskCount": 0,
          "queueSize": 0,
          "largestPoolSize": 0,
          "poolSize": 0,
          "corePoolSize": 0,
          "completedTaskCount": 0,
          "maximumPoolSize": 0
        },
        tenantColumns:[
          {
            title: '租户',
            key: 'tenantName', 
          },
          {
            title: '已支付',
            key: 'title',
            width: 150, 
            render: (h, params) => {
              var row = params.row;
              var text = row.orderCountPay + ' 单，' + row.orderAmountPay + ' 元'; 
              return h('span', text);
            }
          },
          {
            title: '待支付',
            key: 'title',
            width: 150, 
            render: (h, params) => {
              var row = params.row;
              var text = row.orderCountWaitPay + ' 单，' + row.orderAmountWaitPay + ' 元'; 
              return h('span', text);
            }
          },
          {
            title: '待同步',
            key: 'title',
            width: 150, 
            render: (h, params) => {
              var row = params.row;
              var text = row.orderCountWaitSync + ' 单，' + row.orderAmountWaitSync + ' 元'; 
              return h('span', text);
            }
          }
        ],
        
        payColumns:[
          {
            title: '支付账号',
            key: 'title', 
          },
          {
            title: '已支付',
            key: 'title',
            width: 150, 
            render: (h, params) => {
              var row = params.row;
              var text = row.orderCountPay + ' 单，' + row.orderAmountPay + ' 元'; 
              return h('span', text);
            }
          },
          {
            title: '待支付',
            key: 'title',
            width: 150, 
            render: (h, params) => {
              var row = params.row;
              var text = row.orderCountWaitPay + ' 单，' + row.orderAmountWaitPay + ' 元'; 
              return h('span', text);
            }
          },
          {
            title: '异常(重复支付）',
            key: 'title',
            width: 150, 
            render: (h, params) => {
              var row = params.row;
              var text = row.orderCountErr + ' 单，' + row.orderAmountErr + ' 元'; 
              return h('span', text);
            }
          }
        ],  
      }
    },
    mounted: function () {
      this.load();
    },
    computed: {},
    methods: {
      load(){
        this.loadOptions(); 
      },
      loadOptions(){
        return;
        this.loading = 1;
        var api = "/api/engine/report/summary/index";
        var form = {};
        this.$http.post(api,form).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) { 
            this.loading = 0;
            var data = res.data.data;
            this.orderCounts = data;
            this.loadData();
            this.loadNotifyPerfor();
          } else {
            this.loading = 0;
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error("请求失败，请重新发送")
        });
      },
      loadData(){
        this.loading = 1;
        var api = "/api/engine/report/summary/query";
        var form = {type:this.cur,select:this.selectValue};
        this.$http.post(api,form).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) { 
            this.loading = 0;
            var data = res.data.data;
            this.curData = data;
            this.cur = form.type;
            this.selectValue = form.select;             
          } else {
            this.loading = 0;
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error("请求失败，请重新发送")
        });
      },
      loadNotifyPerfor(){
        this.loading = 1;
        var api = "/api/engine/report/summary/notifyperfor";
        var form = {};
        this.$http.post(api,form).then((res) => { 
          if (res.data.code === 0) {  
            var data = res.data.data; 
            this.notifyperfor = data;             
          } else { 
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {　
          this.$Message.error("请求失败，请重新发送")
        });
      }, 
      selectOption(cur){
        this.cur = cur;
        this.loadOptions(); 
      },
      selectDay(){
        this.cur = 5;
      },
      selectMonth(){
        this.cur = 6;
      },
      goPage(type){
        var query = ""
        if(this.cur == 1){
          query = "&startTime=" + page.formatDate(new Date()) + "&endTime=" + page.formatDate(new Date());
        }
        if(this.cur == 2){
          query = "&startTime=" + page.formatDate(new Date(new Date().getTime()-60*60*24*1000)) + "&endTime=" + page.formatDate(new Date(new Date().getTime()-60*60*24*1000));
        }
        if(this.cur == 3 || this.cur == 4){
          var start = new Date(new Date().setDate(1));
          var end = new Date(start.getFullYear() + (start.getMonth() == 11?1:0),start.getMonth() == 11?0:start.getMonth()+1,1);
          end = new Date(end.getTime() - 60*60*24*1000)

          if(this.cur == 4){
            end = new Date(start.getTime()-60*60*24*1000)
            start = new Date(end.getFullYear(),end.getMonth(),1);
          }
          
          query = "&startTime=" + page.formatDate(start) + "&endTime=" + page.formatDate(end);
        }  
        if(type == 1){
          this.$router.push({path:'/order?forward&status=2' + query});
          return;
        }
        if(type == 2){
          this.$router.push({path:'/order?forward&status=1' + query});
          return;
        }
        if(type == 3){
          this.$router.push({path:'/order?forward&notifyStatus=1' + query});
          return;
        }
        if(type == 4){
          this.$router.push({path:'/order/exception?forward' + query});
          return;
        }        
      }
    }
  }

</script>

<style type="text/css">
  .report-summary .optionbar{
    margin-top: 20px;
  }

  .report-summary .optionbar ul{
    list-style: none;
  }
  .report-summary .optionbar li{
    display: inline-block;
    float: left;
    margin-right: 10px;
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
    font-size: 14px;
    border:1px solid #ed3f14;
    border-radius: 3px;
    cursor: pointer;
  }
  .report-summary .optionbar li:hover{
    background-color: #ed3f14;
    color: white;
  }

  .report-summary .optionbar .cur{
    background-color: #ed3f14;
    color: white;
  }

  .report-summary .optionbar .btn{
    background-color: #2d8cf0;
    color: white;
    border:1px solid #2d8cf0;
  }
  .report-summary .optionbar .btn:hover{
    background-color: #2d8cf0;
    color: white;
    border:1px solid #2d8cf0;
  }

  .report-summary .optionbar .count{
    font-size: 18px;
  }

  .report-summary .column-title{
    padding: 10px 0;font-size: 14px;
  }

  .clear{
    clear: both;
  }
</style>
