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
    source: {
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
          this.$router.replace({ path: '/project/myedit?projectId=' + this.projectId+"&source="+this.source });
          break;
        case "zyxmsq":
          this.$router.replace({ path: '/project/myimport?projectId=' + this.projectId+"&source="+this.source });
          break;
        case "qyxx":
          this.$router.replace({ path: '/project/mysign?projectId=' + this.projectId+"&source="+this.source });
          break;
        case "xmgj":
          this.$router.replace({ path: '/project/mytraceedit?projectId=' + this.projectId+"&source="+this.source });
          break;
        default:
          break;
      }
    },
    goBack() {
      if(this.source=='wdsq'){
        this.$router.push({ path: '/project/apply' });
        return;
      }
      this.$router.push({ path: '/project/myproject' });
    },
  }
};
</script>

<style>
.ivu-tabs-bar {
  margin-bottom: 0px;
}
</style>

