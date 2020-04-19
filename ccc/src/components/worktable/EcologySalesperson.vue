<template>
  <div class="page page-max-bill ecloogy—salesperson">
    <Loading :loading="loading">
      <div class="page-form" style="background:none;">
        <div>
          <!-- <Button icon="ios-add-circle" @click="add" class="option-bars" >添加企业基本信息</Button>
          <Button icon="ios-add-circle" @click="add" class="option-bars">添加企业生态信息</Button>
          <Button icon="ios-add-circle" @click="add" class="option-bars">添加生态企业能力</Button>
          <Button icon="ios-add-circle" @click="add" class="option-bars">企业跟进</Button>
          <Button icon="ios-add-circle" @click="add" class="option-bars">添加企业证书</Button>
          <Button icon="ios-add-circle" @click="add" class="option-bars">添加企业培训记录</Button> -->

          <div class="option-bars" v-show="this.$user.hasPower('gzt.stxsry.tjqyjbxx')">
            <Icon type="ios-add-circle" @click="add"/><span @click="add">添加企业基本信息</span>
          </div>
          <div class="option-bars" v-show="this.$user.hasPower('gzt.stxsry.tjqystxx')">
            <Icon type="ios-add-circle" @click="add"/><span @click="add">添加企业生态信息</span>
          </div>
          <div class="option-bars" v-show="this.$user.hasPower('gzt.stxsry.tjqystnl')">
            <Icon type="ios-add-circle" @click="add"/><span @click="add">添加生态企业能力</span>
          </div>
          <div class="option-bars" v-show="this.$user.hasPower('gzt.stxsry.qygj')">
            <Icon type="ios-add-circle" @click="add"/><span @click="add">企业跟进</span>
          </div>
          <div class="option-bars" v-show="this.$user.hasPower('gzt.stxsry.tjqyzs')">
            <Icon type="ios-add-circle" @click="add"/><span @click="add">添加企业证书</span>
          </div>
          <div class="option-bars" v-show="this.$user.hasPower('gzt.stxsry.tjqypxjl')">
            <Icon type="ios-add-circle" /><span @click="add">添加企业培训记录</span>
          </div>
        </div>
        <Row style="margin-top:10px;">
          <Col span="12" v-show="this.$user.hasPower('gzt.stxsry.wdkhgj')">
            <MyDropFollowUp></MyDropFollowUp>
          </Col>
          <Col span="12" v-show="this.$user.hasPower('gzt.stxsry.wdsq')">
            <MyEcologyApply></MyEcologyApply>
          </Col>
        </Row>
        <br />
        <MyEcologySalesData :title="title"></MyEcologySalesData>
        <br/>
        <MyAddCorp></MyAddCorp>
      </div>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import MyEcologySalesData from '@/components/worktable/MyEcologySalesData';
import MyDropFollowUp from '@/components/worktable/MyDropFollowUp';
import MyEcologyApply from '@/components/worktable/MyEcologyApply';
import MyAddCorp from '@/components/worktable/MyAddCorp';
import page from '@/assets/js/page';

export default {
  components: {
    Loading,
    LayoutHor,
    MyEcologySalesData,
    MyDropFollowUp,
    MyEcologyApply,
    MyAddCorp,
    page,
  },
  data() {
    return {
      loading: 0,
      title:"我的销售数据"
    }
  },
  computed: {
  },
  mounted() {
    this.$bus.$emit('on-page-title-change',"工作台");
  },
  methods: {
    add: function () {
      this.$router.push({ path: "/ecology/corp/edit?forward" });
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
