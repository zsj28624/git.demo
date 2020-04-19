<template>
  <div class="page page-bill page-bill-max">
    <div class="page-bar">
      <LayoutHor>
        <div slot="left">
          <Button size="small" @click="goBack" icon="ios-arrow-back" type="warning">返回</Button>
        </div>
        <div class="page-bar-title">{{title}}</div>
      </LayoutHor>
    </div>
    <Loading :loading="loading">
      <div class="page-form">
        <Form
          :model="formItem"
          ref="form"
          :label-width="160"
          :rules="ruleValidate"
          class="form-item"
        >
          <div class="form-sub-title">
            <Icon type="compose"></Icon>
            项目基本信息
          </div>
          <table cellspacing="0" cellpadding="0" >
            <colgroup>
              <col width="33%" />
              <col width="auto" />
              <col width="36%" />
            </colgroup>
            <tr>
              <td colspan="3">
                <FormItem label="公司全称" prop="name">
                  {{formItem.name}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <FormItem label="意向园区" prop="campusId">
                  {{formItem.campusName}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td style="width:280px;">
                <FormItem label="创建时间">
                  {{formItem.createTime}}
                </FormItem>
              </td>
              <td>
                <FormItem label="负责人">
                  {{formItem.operatorName}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="所属部门">
                  {{formItem.deptName}}
                </FormItem>
              </td>
              <td>
                <FormItem label="项目阶段">
                  {{formItem.step}}
                </FormItem>
              </td>
              <td>
                <FormItem label="项目状态">
                  {{formItem.projectStatus}}
                </FormItem>
              </td>
            </tr>
          </table>
          <div class="form-sub-title">
            <Icon type="compose"></Icon>
            企业信息
          </div>
          <table cellspacing="0" cellpadding="0" style="width:65%;">
            <tr>
              <td>
                <FormItem label="所属行业" prop="industry">
                  {{formItem.industry}}
                </FormItem>
              </td>
              <td>
                <!-- <FormItem label="企业属性" prop="attribute">
                  {{formItem.attribute}}
                </FormItem> -->
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="注册资本金(万)" prop="nowRegistered">
                  {{formItem.nowRegistered}}
                </FormItem>
              </td>
              <td>
                <FormItem label="当前税收（万）" prop="nowTaxes">
                  {{formItem.nowTaxes}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="当前占地（亩）" prop="nowAcreage">
                  {{formItem.nowAcreage}}
                </FormItem>
              </td>
              <td>
                <FormItem label="项目信息渠道" prop="information">
                  {{formItem.information}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem label="当前问题" prop="question">
                  <Input v-model="formItem.question" type="textarea" readonly style="width:100%" :rows="4"></Input>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem label="企业所在地" prop="area">
                  {{formItem.area}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem label="项目需求类型" prop="requirementType">
                  {{formItem.requirementType}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="占地需求（亩）" prop="preAcreage">
                  {{formItem.preAcreage}}
                </FormItem>
              </td>
              <td>
                <FormItem label="预计投资额（亿）" prop="preRegistered">
                  {{formItem.preRegistered}}
                </FormItem>
              </td> 
            </tr>
            <tr>
              <td>
                <FormItem label="达产产值（亿）" prop="preValue">
                  {{formItem.preValue}}
                </FormItem>
              </td>
              <td>
                <FormItem label="达产税收（万）" prop="preTaxes">
                  {{formItem.preTaxes}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="form-sub-title">
                  <Icon type="compose"></Icon>
                  企业联系人
                </div>
                <FormItem label="" >
                  <Editable ref="editable"
                    :list="list"
                    :editable="false"></Editable>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem label="项目需求说明" prop="introduction">
                  <Input v-model="formItem.introduction" type="textarea" readonly style="width:100%" :rows="4"></Input>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem :label="fileLabel" prop="photo">
                  <UploadBox v-model="photo" readonly style="width:100%"></UploadBox>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem label="审批意见" prop="auditRemark">
                  <Input v-model="formItem.auditRemark" type="textarea"  style="width:100%" :rows="4"></Input>
                </FormItem>
              </td>
            </tr>
          </table>
          
        </Form>
      </div>
      <table class="savebar" cellpadding="0" cellspacing="0" style="width:65%;">
        <tr>
          <td style="text-align: center;">
            <Button type="info" size="large" @click="beforeAudit">通过</Button>
            <Button  size="large" @click="reject" style="margin-left: 15px">驳回</Button>
          </td>
        </tr>
      </table>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import Editable from '@/components/project/myproject/DetailEditable';
import UploadBox from '@/components/upload/Index';
import page from '@/assets/js/page';

export default {
  components: {
    Loading, LayoutHor, Editable,UploadBox
  },
  data() {
    return {
      loading: 0,
      applyId:null,
      list:[{linkMan:'',position:'',phone:''}],
      //表单对象
      formItem: {
        name: '',
        campusId: null,
        campusName: '',
        createTime: null,
        operator: null,
        operatorName: '',
        deptId:null,
        deptName:'',
        step: '',
        projectStatus: '',
        industry: '',
        attribute: '',
        nowRegistered: null,
        nowTaxes: null,
        nowAcreage: null,
        information:'',
        question:'',
        area:'',
        requirementType: '',
        preAcreage: null,
        preRegistered: null,
        preValue: null,
        preTaxes:null,
        lianMan:'',//企业联系人
        introduction: '',
        photo: '',
        auditRemark:'',
        projectDeptId:'',
      },
      oriItem: {
        name: '',
        campusId: null,
        campusName: '',
        createTime: null,
        operator: null,
        operatorName: '',
        deptId:null,
        deptName:'',
        step: '',
        projectStatus: '',
        industry: '',
        attribute: '',
        nowRegistered: null,
        nowTaxes: null,
        nowAcreage: null,
        information:'',
        question:'',
        area:'',
        requirementType: '',
        preAcreage: null,
        preRegistered: null,
        preValue: null,
        preTaxes:null,
        lianMan:'',//企业联系人
        introduction: '',
        photo: '',
        auditRemark:'',
        projectDeptId:'',
      },
      title: '审批中心-审批',
      photo:'',
      fileLabel:'附件',
      //验证
      ruleValidate: {
        name: [
          { required: true, message: '公司全称不能为空' },
        ],
      }
    }
  },
  computed: {
  },
  mounted() {
    this.applyId = this.$route.query.id;
    if (this.applyId) {
      this.applyId = parseInt(this.applyId);
      this.getProject();
    }
  },
  methods: {
    getProject() {
      this.loading = 1;
      this.$http.post('/api/engine/project/audit/get', { id: this.applyId }).then((res) => {
        if (res.data.code == 0 && res.data.data != null) {
          this.oriItem = res.data.data[0];
          if(this.oriItem.linkMan){
            this.list = eval(this.oriItem.linkMan);
          }
          if(this.oriItem.applyType=="申请入库"){
            this.photo=this.oriItem.photo;
            this.fileLabel="入库附件";
          }else if(this.oriItem.applyType=="申请重点项目"){
            this.photo=this.oriItem.importantFiles;
            this.fileLabel="重点项目附件";
          }else if(this.oriItem.applyType=="申请签约"){
            this.photo=this.oriItem.contractFiles;
            this.fileLabel="签约附件";
          }
          $.extend(this.formItem, this.oriItem);
          
          this.loading = 0;
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    beforeAudit(){
      if(this.formItem.applyType=="申请入库"){
        //查询是否有同名受保护项目
        this.$http.post('/api/engine/project/listAllByProtectStatus', {name:this.formItem.name,projectStatus:"保护"}).then((res) => {
        this.loading = 0;
          if (res.data.code === 0) {
            if(res.data.data.total>0){
              this.$Message.error("已有同名项目正在保护中!");
            }else{
              this.audit();
            }
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
      }else{
        this.audit();
      }
    },
    audit(){
      let url = '';
      let msg = '';
      let text = '';
      url = '/api/engine/project/audit/audit';
      msg = '审批成功';
      if(this.formItem.intentProject==null){
        this.formItem.intentProject=45;
      }
      if(this.formItem.keyProjects==null){
        this.formItem.keyProjects=60;
      }
      if(this.formItem.applyType=="申请入库"){
        this.formItem.status=2;
        this.formItem.projectStatus='保护';
        this.formItem.protectionTime=page.formatDate(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * this.formItem.intentProject));
        this.formItem.step='意向';
        text="您有一条"+this.formItem.name+"项目入库申请已审核通过";
        //增加跟进信息
        if(this.formItem.introduction!=null&&this.formItem.introduction!=''){
          this.$http.post('/api/engine/project/trace/add', {projectId:this.formItem.projectId,traceDate:page.formatDateTime(new Date),traceResult:this.formItem.introduction,creator:this.formItem.operator,creatorName:this.formItem.operatorName,topic:"入库项目需求说明"}).then((res) => {
          this.loading = 0;
            if (res.data.code === 0) {
            } else {
              this.$Message.error(res.data.message)
            }
          }).catch((error) => {
            this.loading = 0;
            this.$Message.error(error.message)
          });
        }
        
      }else if(this.formItem.applyType=="申请重点项目"){
        this.formItem.status=2;
        this.formItem.projectStatus='保护';
        this.formItem.protectionTime=page.formatDate(new Date(new Date(this.formItem.protectionTime).getTime() + 1000 * 60 * 60 * 24 * this.formItem.keyProjects));
        this.formItem.step='重点项目';
        text="您有一条"+this.formItem.name+"重点项目申请已审核通过";
      }else if(this.formItem.applyType=="申请签约"){
        this.formItem.status=2;
        this.formItem.step='正式签约'; 
        text="您有一条"+this.formItem.name+"签约项目申请已审核通过";
      }else if(this.formItem.applyType=="申请延期"){
        this.formItem.status=2;
        this.formItem.projectStatus='保护';
        text="您有一条"+this.formItem.name+"项目延期申请已审核通过";
        if(this.formItem.protectionTime){
          this.formItem.protectionTime=page.formatDate(new Date(new Date(this.formItem.protectionTime).getTime() + 1000 * 60 * 60 * 24 * 60));
        }else{
          this.formItem.protectionTime=page.formatDate(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 60));
        }
      }  
      this.loading = 1;
      //消息提醒设置
      this.formItem.module="产业园业务审批";
      this.formItem.content=text;
      this.formItem.link="/project/myproject";
      this.formItem.powerKey="";
      this.formItem.receiver=this.formItem.applyPeople;
      this.$http.post(url, this.formItem).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.$Message.success(msg);
          this.goBack();
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    reject(){
      let url = '';
      let msg = '';
      let text = '';
      url = '/api/engine/project/audit/reject';
      msg = '驳回成功';
      
      if(this.formItem.auditRemark==''||this.formItem.auditRemark==null){
        this.$Message.error('审批意见不能为空！');
        return;
      }
      if(this.formItem.applyType=="申请入库"){
        this.formItem.status=3;
        this.formItem.step='待入库';
        text="您有一条"+this.formItem.name+"项目入库申请已被驳回，驳回原因是"+this.formItem.auditRemark+"，请重新提交";
      }else if(this.formItem.applyType=="申请重点项目"){
        this.formItem.status=3;
        this.formItem.step='意向';
        text="您有一条"+this.formItem.name+"重点项目申请已被驳回，驳回原因是"+this.formItem.auditRemark+"，请重新提交";
      }else if(this.formItem.applyType=="申请签约"){
        this.formItem.status=3;
        text="您有一条"+this.formItem.name+"签约项目申请已被驳回，驳回原因是"+this.formItem.auditRemark+"，请重新提交";
      }else if(this.formItem.applyType=="申请延期"){
        this.formItem.status=3;
        text="您有一条"+this.formItem.name+"项目延期申请已被驳回，驳回原因是"+this.formItem.auditRemark+"，请重新提交";
      }  

      this.loading = 1;
      //消息提醒设置
      this.formItem.module="产业园业务审批";
      this.formItem.content=text;
      this.formItem.link="/project/myproject";
      this.formItem.powerKey="";
      this.formItem.receiver=this.formItem.applyPeople;
      this.$http.post(url, this.formItem).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.$Message.success(msg);
          this.goBack();
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    goBack: function () {
      this.$router.go(-1);
    },
  }
}

</script>

<style type="text/css">
.form-sub-title {
  font-size: 14px;
  margin: 0 0 12px 18px;
  color: #2b85e4;
}
</style>
