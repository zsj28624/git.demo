<template>
  <div class="page page-bill">
    <div class="page-bar">
      <LayoutHor>
        <div slot="left">
          <Button size="small" @click="goBack" icon="ios-arrow-back" type="warning">返回</Button>
        </div>
        <div class="page-bar-title">审批明细</div>
      </LayoutHor>
    </div>
    <Loading :loading="loading">
      <div class="baseinfo">
        <div class="page-tools"></div>
        <div class="page-form">
          <Form
            :model="ecologyFormItem"
            ref="editFormRule"
            :label-width="120"
            :rules="ruleValidate"
            class="form-item"
            v-if="type==1"
          >
            <h3>企业基本信息</h3>
            <table cellspacing="0" cellpadding="0">
              <colgroup>
                <col width="33%" />
                <col width="auto" />
                <col width="33%" />
              </colgroup>
              <tr>
                <td>
                  <FormItem label="企业法人信息">{{ecologyFormItem.corpName}}</FormItem>
                </td>
                <td>
                  <FormItem label="生态企业对接人">{{ecologyFormItem.contactName}}</FormItem>
                </td>
                <td>
                  <FormItem label="对接人职位">{{ecologyFormItem.contactPosition}}</FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem label="对接人联系电话">{{ecologyFormItem.contactPhone}}</FormItem>
                </td>
                <td>
                  <FormItem label="对接人微信">{{ecologyFormItem.contactWechat}}</FormItem>
                </td>
                <td>
                  <FormItem label="对接人邮箱">{{ecologyFormItem.contactEmail}}</FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem label="注册资金">{{ecologyFormItem.registeredCapital}}</FormItem>
                </td>
                <td>
                  <FormItem label="公司规模">{{ecologyFormItem.companySize}}</FormItem>
                </td>
                <td>
                  <FormItem label="年销售额">{{ecologyFormItem.usd}}</FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem label="企业官网">{{ecologyFormItem.website}}</FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="企业简介">{{ecologyFormItem.profile}}</FormItem>
                </td>
              </tr>
            </table>
            <h3>企业生态信息</h3>
            <table cellspacing="0" cellpadding="0">
              <colgroup>
                <col width="33%" />
                <col width="auto" />
                <col width="33%" />
              </colgroup>
              <tr>
                <td colspan="3">
                  <FormItem label="所属生态分类">
                    <div v-html="ecologyFormItem.ecologyTypeTag"></div>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem label="合作企业等级">{{ecologyFormItem.level}}</FormItem>
                </td>
                <td colspan="2">
                  <FormItem
                    label="合作企业有效期"
                  >{{ecologyFormItem.validityBeginTime+' 至 '+ecologyFormItem.validityEndTime}}</FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="企业业绩">{{ecologyFormItem.achievement}}</FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="代表性案例">{{ecologyFormItem.representativeCases}}</FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="生态企业行为承诺书">
                    <UploadBox v-model="ecologyFormItem.files" :readonly="true"></UploadBox>
                  </FormItem>
                </td>
              </tr>
            </table>
            <table cellspacing="0" cellpadding="0">
              <colgroup>
                <col width="33%" />
                <col width="auto" />
                <col width="33%" />
              </colgroup>
              <tr>
                <td colspan="4">
                  <FormItem label="审批意见" prop>{{auditRemark}}</FormItem>
                </td>
              </tr>
            </table>
          </Form>

          <Form
            :model="certificateFormItem"
            ref="editFormRule"
            :label-width="110"
            :rules="ruleValidate"
            class="form-item"
            v-if="type==2"
          >
            <table cellspacing="0" cellpadding="0">
              <colgroup>
                <col width="33%" />
                <col width="auto" />
                <col width="33%" />
              </colgroup>
              <tr>
                <td>
                  <FormItem label="生态企业编号">{{certificateFormItem.corpNo}}</FormItem>
                </td>
                <td>
                  <FormItem label="生态企业名称">{{certificateFormItem.corpName}}</FormItem>
                </td>
                <td>
                  <FormItem label="企业等级">{{certificateFormItem.level}}</FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="所属生态分类">
                    <div v-html="certificateFormItem.ecologyTypeTag"></div>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem label="申请证书编号">{{certificateFormItem.certificateNo}}</FormItem>
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="中国系统+生态伙伴合作协议/中国系统+生态伙伴战略合作框架协议">
                    <UploadBox v-model="certificateFormItem.files" :readonly="true"></UploadBox>
                  </FormItem>
                </td>
              </tr>
            </table>
            <table cellspacing="0" cellpadding="0">
              <colgroup>
                <col width="33%" />
                <col width="auto" />
                <col width="33%" />
              </colgroup>
              <tr>
                <td colspan="4">
                  <FormItem label="审批意见" prop>{{auditRemark}}</FormItem>
                </td>
              </tr>
            </table>
          </Form>
        </div>
      </div>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import page from '@/assets/js/page';
import UploadBox from '@/components/upload/Index';
export default {
  components: {
    Loading, LayoutHor, UploadBox
  },
  data() {
    var wxKeyContentVali = (rule, value, callback) => {
      if (!value && this.isEdit == 0) {
        return callback(new Error('请导入证书'));
      } else {
        callback()
      }
    }
    return {
      loading: 0,
      applyId: 0,
      type: 0,//1:基本信息 2:证书
      //证书  2
      certificateFormItem: {
        "applyId": 0,
        "creator": 0,
        "auditTime": "",
        "createTime": "",
        "audit": 0,
        "creatorName": "",
        "files": "",
        "auditStatus": 2,
        "corpName": "",
        "certificateNo": "",
        "auditRemark": ''
      },
      //生态信息 1
      ecologyFormItem: {
        id: 0,
        corpId: 0,
        contactName: '',//生态企业对接人
        contactPosition: '', //对接人职位
        contactPhone: '',//对接人联系电话
        contactWechat: '',////对接人微信
        contactEmail: '',//对接人邮箱
        registeredCapital: '',//注册资金
        companySize: '',//公司规模
        usd: '',//年销售额
        website: '',//企业官网
        profile: '',//企业简介

        ecologyTypeTag: '',//所属生态分类标签 
        level: '',//合作企业等级
        validityBeginTime: '',//合作企业有效期开始日期
        validityEndTime: '',//合作企业有效期结束日期
        validityStatic: '1',//有效状态
        achievement: '',//企业业绩
        representativeCases: '',//代表性案例
        auditStatus: 0,
        files: '',
        ecologyTypeTagList: [],//
        cooperationDirection: '',//合作方向
        cooperationIntentcity: '',//合作意向城市
        "auditStatus": 2,
        "corpName": "",
        "certificateNo": "",
        "auditRemark": ''
      },
      auditRemark: '',
      file: null,
      oriItem: {
      },
      //初始加载所有验证
      ruleValidate: {

      },
    }
  },
  computed: {
  },
  watch: {

  },
  mounted() {
    this.applyId = this.$route.query.applyId;
    this.type = this.$route.query.type;
    if (this.applyId && this.type) {
      this.get();
    } else {
    }
  },
  methods: {
    get() {
      var that = this;
      this.loading = 1;
      this.$http.post('/api/engine/enterprise-ecology/corp/audit/get', { 'applyId': this.applyId, 'type': this.type }).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          if (this.type == 1) {
            Object.assign(this.ecologyFormItem, res.data.data);
            if (this.ecologyFormItem.validityBeginTime) {
              this.ecologyFormItem.validityBeginTime = this.ecologyFormItem.validityBeginTime.substr(0, 10);
            }
            if (this.ecologyFormItem.validityEndTime) {
              this.ecologyFormItem.validityEndTime = this.ecologyFormItem.validityEndTime.substr(0, 10);
            }
          }
          if (this.type == 2) {
            console.log(res.data.data);
            Object.assign(this.certificateFormItem, res.data.data);
          }
          this.auditRemark = res.data.data.auditRemark;
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    goBack() {
      this.$router.go(-1);
    },
  }
} 
</script>   