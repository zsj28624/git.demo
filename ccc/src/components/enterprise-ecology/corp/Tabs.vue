<template>
  <div class="corp-edit-tabs">
    <div class="page-bar">
      <LayoutHor>
        <div slot="left">
          <Button size="small" @click="goBack" icon="ios-arrow-back" type="warning">返回</Button>
        </div>
        <div class="page-bar-title" style="text-align: left;padding-left: 30px;">{{title}}</div>
      </LayoutHor>
    </div>
    <div class="page-panel tabs-noline"> 
      <Tabs @on-click="orderTabsClick" :animated="false" :value="tabvalue">
        <TabPane label="企业基本信息" name="jbxx"></TabPane>
        <TabPane label="生态信息" name="stxx" :disabled="disabled"></TabPane>
        <TabPane label="生态企业能力" name="qynl" :disabled="disabled"></TabPane>
        <TabPane label="证书" name="zs" :disabled="disabled"></TabPane>
        <TabPane label="跟踪及活动" name="gzjhd" :disabled="disabled"></TabPane>
        <TabPane label="培训记录" name="pxjl" :disabled="disabled"></TabPane>
        <TabPane label="背景调查" name="bjdc" :disabled="disabled"></TabPane>
      </Tabs>
    </div>
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
    corpId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      innerCorpId: this.corpId,
      disabled: false,
      title: '',
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
    corpId(val) {
      this.innerCorpId = val;
      if (this.innerCorpId == 0 || this.innerCorpId == null) {
        this.disabled = true;
      } else {
        this.disabled = false;
        this.getTitle();
      }
    },
  },
  computed: {},
  methods: {
    getTitle() {
      var that = this;
      if (this.innerCorpId) {
        this.$http.post('/api/engine/enterprise-ecology/corp/get', { "id": this.innerCorpId }).then((res) => {
          if (res.data.code === 0) {
            var data = res.data.data;
            that.title = data.corpName + " (" + data.corpNo + ")";
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
      }
    },
    orderTabsClick(name) {
      if (this.innerCorpId == 0 || this.innerCorpId == null) {
        return;
      }
      switch (name) {
          case "jbxx":
            this.$router.replace({ path: '/ecology/corp/edit?corpId=' + this.corpId });
            break;
          case "stxx":
            this.$router.replace({ path: '/ecology/corp/ecology?corpId=' + this.corpId });
            break;
          case "qynl":
            this.$router.replace({ path: '/ecology/corp/ability?corpId=' + this.corpId });
            break;
          case "zs":
            this.$router.replace({ path: '/ecology/corp/certificate?corpId=' + this.corpId });
            break;
          case "gzjhd":
            this.$router.replace({ path: '/ecology/corp/trace/edit?corpId=' + this.corpId });
            break;
          case "pxjl":
            this.$router.replace({ path: '/ecology/corp/trainingRecord?corpId=' + this.corpId });
            break;
          case "bjdc":
            if(this.$user.hasPower('qystk.qykhgl.bjdc')){
              this.$router.replace({ path: '/ecology/corp/backgroundCheck?corpId=' + this.corpId });
              break;       
            }else{
              this.$Message.error("暂无权限!");
              return;
            }
          default:
            break;
      }
    },
    goBack() {
      this.$router.go(-1);
    },
  }
};
</script>

<style>
.ivu-tabs-bar {
  margin-bottom: 0px;
}
.tabs-noline .ivu-tabs-bar {
    border-bottom: 2px solid white;
}
.corp-edit-tabs .ivu-tabs-nav-container{
  font-size: 14px;
}
</style>

