<template>
  <div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0" width="100%">
        <colgroup>
          <col width="5%" />
          <col width="13%" />
          <col width="13%" />
          <col width="13%" />
          <col width="13%" />
          <col width="13%" />
          <col width="30%" />
        </colgroup>
        <tr>
          <td rowspan="2" w>
            <div slot="left">
              <Button size="small" @click="goBack" icon="ios-arrow-back" type="warning">返回</Button>
            </div>
          </td>
          <td class="headRight">生态企业编号：</td> 
          <td class="tdLift">{{corp.corpNo}}</td>
          <td class="headRight">生态企业名称：</td> 
          <td class="tdLift">{{corp.corpName}}</td>
          <td class="headRight">企业等级：</td> 
          <td class="tdLift">{{corp.level}}</td>
        </tr>
        <tr>
          <td class="headRight">所属生态分类：</td> 
          <td class="tdLift" colspan="5">{{typeText}}</td>
          <!--<table v-for="(item,index) in typeList" width="100%">
        <colgroup>
          <col width="16%" />
          <col width="16%" />
          <col width="16%" />
          <col width="16%" />
          <col width="16%" />
          <col width="auto" />
        </colgroup>
            <tr v-if="index==0">
              <td class="headRight">所属生态分类：</td> 
              <td class="tdLift" >{{item.text}}</td>
              <td class="headRight">标签：</td> 
              <td class="tdLift">{{item.tag}}</td>
              <td></td>
              <td></td>
            </tr>
            <tr v-else>
              <td class="headRight"></td> 
              <td class="tdLift" >{{item.text}}</td>
              <td class="headRight"></td> 
              <td class="tdLift">{{item.tag}}</td>
              <td></td>
              <td></td>
            </tr>
          </table>-->
        </tr>
      </table>
    </div>
    <Tabs @on-click="orderTabsClick" :value="tabvalue" style="margin-top:10px;">
      <TabPane label="企业基本信息" name="jbxx"></TabPane>
      <TabPane label="生态信息" name="stxx" :disabled="disabled"></TabPane>
      <TabPane label="生态企业能力" name="qynl" :disabled="disabled"></TabPane>
      <TabPane label="证书" name="zs" :disabled="disabled"></TabPane>
      <TabPane label="跟踪及活动" name="gzjhd" :disabled="disabled"></TabPane>
      <TabPane label="培训记录" name="pxjl" :disabled="disabled"></TabPane>
      <TabPane label="背景调查" name="bjdc" :disabled="disabled"></TabPane>
      <TabPane label="客户评论" name="khpl" :disabled="disabled"></TabPane>
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
      corp: null,
      list: [],
      typeList: [],
      typeText: "",
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
      if (this.innerCorpId) {
        this.$http.post('/api/engine/enterprise-ecology/corp/get', { "id": this.innerCorpId }).then((res) => {
          if (res.data.code === 0) {
            
            var data = res.data.data;
            this.corp = data;
            var list = data.list;
            //var typeList = [{text:"",tag:""}];
            //var sign = 0;
            var typeText = "";
            for (let i = 0; i < list.length; i++) {
              const type = list[i];
              var brstringList = type.ecologyTypeTag.split("<br/>");
              //list[i].typeList = [{text:"",tagList:[]}];
              //list[i].typeList = [{text:"",tag:""}]
              //var sign = 0;
              for (let j = 0; j < brstringList.length; j++) {
                const element = brstringList[j];
                
                if(typeText==""){
                  typeText = element;
                }else{
                  typeText = typeText + ";" + element
                }
                /*var beforeList = element.split("【");

                var rearList = beforeList[1].split("】");
                //var tag = rearList[0].split(",");

                //list[i].typeList.push({text:beforeList[0],tagList:tag});
                if(sign == 0){
                  list[i].typeList[0].text = beforeList[0];
                  list[i].typeList[0].tag = rearList[0];
                  sign = 1;
                }else{
                  list[i].typeList.push({text:beforeList[0],tag:rearList[0]});
                }
                if(sign == 0){
                  typeList[0].text = beforeList[0];
                  typeList[0].tag = rearList[0];
                  sign = 1;
                }else{
                  typeList.push({text:beforeList[0],tag:rearList[0]});
                }*/
              }
            }
            //this.typeList = typeList;
            this.typeText = typeText;
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
          this.$router.replace({ path: '/ecology/selcorp/edit?corpId=' + this.corpId });
          break;
        case "stxx":
          this.$router.replace({ path: '/ecology/selcorp/ecology?corpId=' + this.corpId });
          break;
        case "qynl":
          this.$router.replace({ path: '/ecology/selcorp/ability?corpId=' + this.corpId });
          break;
        case "zs":
          this.$router.replace({ path: '/ecology/selcorp/certificate?corpId=' + this.corpId });
          break;
        case "gzjhd":
          this.$router.replace({ path: '/ecology/selcorp/trace/index?corpId=' + this.corpId });
          break;
        case "pxjl":
          this.$router.replace({ path: '/ecology/selcorp/trainingRecord?corpId=' + this.corpId });
          break;
        case "bjdc":
          this.$router.replace({ path: '/ecology/selcorp/backgroundCheck?corpId=' + this.corpId });
          break;
        case "khpl":
          this.$router.replace({ path: '/ecology/comment/index?corpId=' + this.corpId });
          break;
        default:
          break;
      }
    },
    goBack() {
      //this.$router.push({ path: '/ecology/uncategorized' });
      this.$router.go(-1);
    },
  }
};
</script>

<style>
.ivu-tabs-bar {
  margin-bottom: 0px;
}

.tdLift{
  text-align: left;
  padding: 5px;
  font-size: 13px;
}

.headRight{
  font-weight:bold;
  text-align: right;
  padding:5px;
  font-size: 13px;
}


</style>

