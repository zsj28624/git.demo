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
                <FormItem label="审批记录" prop="auditRemark">
                  <AuditEditable ref="auditEditable"
                    :list="auditHistory"
                    :editable="false"></AuditEditable>
                </FormItem>
              </td>
            </tr>
          </table>
          
        </Form>
      </div>
      <table class="savebar" cellpadding="0" cellspacing="0" style="width:65%;">
        <tr>
          <td style="text-align: center;">
            <Button  size="large" @click="goBack" style="margin-left: 15px">关闭</Button>
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
import AuditEditable from '@/components/project/audit/AuditDetail';
import UploadBox from '@/components/upload/Index';
import page from '@/assets/js/page';

export default {
  components: {
    Loading, LayoutHor, Editable,UploadBox,AuditEditable
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
      },
      title: '审批中心-查看',
      photo:'',
      fileLabel:'附件',
      auditHistory:[],
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
      this.$http.post('/api/engine/project/audit/get', { id: this.applyId }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          this.oriItem = res.data.data[0];
          $.extend(this.formItem, this.oriItem);
          if(this.formItem.linkMan){
            this.list = eval(this.formItem.linkMan);
          }
          if(this.formItem.applyType=="申请入库"){
            this.photo=this.formItem.photo;
            this.fileLabel="入库附件";
          }else if(this.formItem.applyType=="申请重点项目"){
            this.photo=this.formItem.importantFiles;
            this.fileLabel="重点项目附件";
          }else if(this.formItem.applyType=="申请签约"){
            this.photo=this.formItem.contractFiles;
            this.fileLabel="签约附件";
          }

          this.$http.post('/api/engine/project/audit/history', { projectId: this.formItem.projectId,applyType:this.formItem.applyType }).then((res) => {
            this.loading = 0;
            if (res.data.code == 0 && res.data.data != null) {
              if(res.data.data.total>0){
                this.auditHistory=res.data.data.rows;
              }
            } else {
              this.$Message.error(res.data.message);
            }
          }).catch((error) => {
            this.loading = 0;
            this.$Message.error(error.message)
          });
        } else {
          this.$Message.error(res.data.message);
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
