<template>
  <div>
    <div class="page-bar">
      <LayoutHor>
        <div slot="left">
          <Button size="small" @click="goBack" icon="ios-arrow-back" type="warning">返回</Button>
        </div>
        <div class="page-bar-title">{{title}}</div>
      </LayoutHor>
    </div>
    <Tabs @on-click="orderTabsClick" :value="tabvalue" style="margin-top:10px;">
      <TabPane label="入库申请" name="rksq"></TabPane>
      <TabPane label="重要项目申请" name="zyxmsq" :disabled="disabled"></TabPane>
      <TabPane label="签约信息" name="qyxx" :disabled="disabled"></TabPane>
      <TabPane label="项目跟进" name="xmgj" :disabled="disabled"></TabPane>
    </Tabs>
  </div>
</template>

<script>  
import LayoutHor from '@/components/layout/LayoutHor';

export default {
  components: {
    LayoutHor
  },
  props: {
    tabvalue: {
      type: String,
      default: ""
    },
    projectId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      innerCorpId: this.projectId,
      disabled: false,
      title: '项目信息',
    };
  },
  mounted() {
    if (this.innerCorpId == 0 || this.innerCorpId == null) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  },
  watch: {
    projectId(val) {
      this.innerCorpId = val;
      if (this.innerCorpId == 0 || this.innerCorpId == null) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },
  },
  computed: {},
  methods: {
    orderTabsClick(name) {
      if (this.innerCorpId == 0 || this.innerCorpId == null) {
        return;
      }
      switch (name) {
        case "rksq":
          this.$router.replace({ path: '/project/edit?projectId=' + this.projectId });
          break;
        case "zyxmsq":
          this.$router.replace({ path: '/project/import?projectId=' + this.projectId });
          break;
        case "qyxx":
          this.$router.replace({ path: '/project/sign?projectId=' + this.projectId });
          break;
        case "xmgj":
          this.$router.replace({ path: '/project/traceedit?projectId=' + this.projectId });
          break;
        default:
          break;
      }
    },
    goBack() {
      this.$router.push({ path: '/project/project' });
      //this.$router.go(-1);
    },
  }
};
</script>

<style>
.ivu-tabs-bar {
  margin-bottom: 0px;
}
</style>

