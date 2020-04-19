<template>
  <div class="page page-max-bill ecloogy—salesperson">
    <Loading :loading="loading">
      <div class="page-form" style="background:none;">
        <div>
          <!-- <Button icon="ios-add-circle" @click="add" v-show="this.$user.hasPower('gzt.stbmld.tjqyjbxx')" class="option-bars">添加企业基本信息</Button>
          <Button icon="ios-add-circle" @click="add" v-show="this.$user.hasPower('gzt.stbmld.tjqystxx')" class="option-bars">添加企业生态信息</Button>
          <Button icon="ios-add-circle" @click="add" v-show="this.$user.hasPower('gzt.stbmld.tjstqynl')" class="option-bars">添加生态企业能力</Button>
          <Button icon="ios-add-circle" @click="add" v-show="this.$user.hasPower('gzt.stbmld.qygj')" class="option-bars">企业跟进</Button>
          <Button icon="ios-add-circle" @click="add" v-show="this.$user.hasPower('gzt.stbmld.tjqyzs')" class="option-bars">添加企业证书</Button>
          <Button icon="ios-add-circle" @click="add" v-show="this.$user.hasPower('gzt.stbmld.tjqypxjl')" class="option-bars">添加企业培训记录</Button> -->

          <div class="option-bars" v-show="this.$user.hasPower('gzt.stbmld.tjqyjbxx')" @click="add">
            <Icon type="ios-add-circle"/><span>添加企业基本信息</span>
          </div>
          <div class="option-bars" v-show="this.$user.hasPower('gzt.stbmld.tjqystxx')" @click="add">
            <Icon type="ios-add-circle"/><span>添加企业生态信息</span>
          </div>
          <div class="option-bars" v-show="this.$user.hasPower('gzt.stbmld.tjstqynl')" @click="add">
            <Icon type="ios-add-circle"/><span>添加生态企业能力</span>
          </div>
          <div class="option-bars" v-show="this.$user.hasPower('gzt.stbmld.qygj')" @click="add">
            <Icon type="ios-add-circle"/><span>企业跟进</span>
          </div>
          <div class="option-bars" v-show="this.$user.hasPower('gzt.stbmld.tjqyzs')" @click="add">
            <Icon type="ios-add-circle"/><span>添加企业证书</span>
          </div>
          <div class="option-bars" v-show="this.$user.hasPower('gzt.stbmld.tjqypxjl')" @click="add">
            <Icon type="ios-add-circle"/><span>添加企业培训记录</span>
          </div>
        </div>
        <Row style="margin-top:10px;">
          <Col span="12" v-show="this.$user.hasPower('gzt.stbmld.wdkhgj')">
            <!-- 我的客户跟进 -->
            <MyDropFollowUp></MyDropFollowUp>
          </Col>
          <Col span="12" v-show="this.$user.hasPower('gzt.stbmld.wdsq')">
            <!-- 我的申请 -->
            <MyEcologyApply></MyEcologyApply>
          </Col>
        </Row>
        <Row style="margin-top:10px;">
          <Col span="24" v-show="this.$user.hasPower('gzt.stbmld.wddsp')">
            <!-- 我的待审批 -->
            <MyEcologyPendingApproval></MyEcologyPendingApproval>
          </Col>
        </Row>
        <br />
        <MyEcologySalesData :title="title"></MyEcologySalesData>
        <br />
        <MyAddCorp></MyAddCorp>
        <br />
        <EcologyDeptSalesData></EcologyDeptSalesData>
      </div>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import MyEcologySalesData from '@/components/worktable/MyEcologySalesData';
import EcologyDeptSalesData from '@/components/worktable/EcologyDeptSalesData';
import MyAddCorp from '@/components/worktable/MyAddCorp';
import MyDropFollowUp from '@/components/worktable/MyDropFollowUp';
import MyEcologyApply from '@/components/worktable/MyEcologyApply';
import MyEcologyPendingApproval from '@/components/worktable/MyEcologyPendingApproval';

import page from '@/assets/js/page';

export default {

  components: {
    Loading,
    LayoutHor,
    MyEcologySalesData,
    EcologyDeptSalesData,
    MyDropFollowUp,
    MyEcologyApply,
    MyEcologyPendingApproval,
    MyAddCorp,
    page,
  },
  data() {
    return {
      title:"我的销售数据",
      loading: 0,
      show: false,
      isEdit: false,
      isTwo: true,
      parentId: 0,
      list: [],
      corpId: 0,
      tabName: "1",
      total: null,
      listSum: [],
      //表单对象
      formItem: {
        corpId: 0,
        content: "",
        creator: this.$user.userId,
        creatorName: this.$user.trueName,
      },
      listDate: [],
      typeOption: [
        { code: '地域', text: '地域' },
        { code: '生态分类', text: '生态分类' },
        { code: '标签', text: '标签' },
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
      khgjList: [],
      sqColumns: [
        {
          title: '操作',
          width: 60,
          align: 'center',
          render: (h, params) => {
            var row = params.row;
            return h(DataRowOperate, {
              props: {
                btns: [{
                  key: 'edit',
                  text: '去处理'
                },
                ]
              },
              on: {
                click: (key) => {
                  if (key == "edit") {
                    this.rowCommand("去处理", params);
                  }
                }
              }
            });
          }
        },
        {
          title: '序号',
          width: 80,
          type: 'index',
          align: 'center',
        },
        {
          title: '企业名称',
          align: 'center',
          key: 'cropName',
          minWidth: 120,
        },
        {
          title: '分配日期',
          align: 'center',
          key: 'createTime',
          width: 150,
        },
        {
          title: '分配人',
          align: 'center',
          key: 'createTime',
          width: 150,
        },
      ],
      sqList: [],
      dspList: [],
      campusList: [],
    }
  },
  computed: {
  },
  mounted() {
    this.load();
    this.$bus.$emit('on-page-title-change',"工作台");
  },
  methods: {
    dateFormat(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return month + "月" + day + "日";
    },
    add: function () {
      this.$router.push({ path: "/ecology/corp/edit?forward" });
    },
    query(trace) {
      var that = this;
      this.$http.post('/api/engine/trace/list_details?', {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          var list = res.data.data.rows;
          this.total = res.data.data.total;
          this.listSum = res.data.data.listSum;

          var dateList = [];
          for (let i = 0; i < list.length; i++) {
            var item = list[i];
            var ct = dateList.filter(function (obj) {
              return obj.traceDate == item.traceDate
            })
            if (ct.length == 0) {
              var ccc = { traceDate: item.traceDate, detailList: [item] };
              dateList.push(ccc);
            } else {
              ct[0].detailList.push(item);
            }
          }
          that.list = dateList;
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    load() {
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
.ecloogy—salesperson {
}
/* .ecloogy—salesperson button {
  height: 60px;
  font-size: 14px;
  box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  border: 0px;
  color: #135195;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 400;
  min-width: 160px;
} */
.ecloogy—salesperson .option-bars {
  margin-right: 1%;
  margin-bottom: 5px;
  height: 60px;
  width: 15%;
  min-width: 160px;
  display: inline-block;
  line-height: 60px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 400;
  text-align: center;
  color: #135195;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  cursor: pointer;
}
</style>
