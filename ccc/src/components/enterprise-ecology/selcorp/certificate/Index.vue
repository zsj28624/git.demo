<template>
  <div class="page page-bill page-bill-max">
    <CorpTabs tabvalue="zs" :corpId="corpId"></CorpTabs>
    <Loading :loading="loading">
      <div class="baseinfo">
        <div style="height:30px;"></div>
        <Steps :current="1">
          <Step title="申请证书" content></Step>
          <Step title="上传证书" content></Step>
          <Step title="完成" content></Step>
        </Steps>
        <div class="certificate-cue" v-if="auditStatus>0">
          <template v-if="auditStatus==1">证书已提交审核，请耐心等待</template>
          <template v-if="auditStatus==2">证书已审核通过，请上传证书</template>
          <template v-if="auditStatus==3">
            证书已被驳回，请重新提交申请
            <br />
            【驳回原因：{{auditRemark}}】
          </template>
        </div>
        <div class="page-form">
          <Form v-if="step==2" :model="formItem" ref="form" :label-width="170" class="form-item">
            <table cellspacing="0" cellpadding="0">
              <colgroup>
                <col width="33%" />
                <col width="auto" />
                <col width="33%" />
              </colgroup>
              <tr>
                <td>
                  <FormItem label="生态伙伴证书编号">{{formItem.certificateNo}}</FormItem>
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <FormItem label="中国系统生态伙伴证书">
                    <a target="_blank" :href="'/corp/api/file/download?fileId='+formItem.hbzs">
                      <img
                        :src="'/corp/api/file/view?fileId='+formItem.hbzs"
                        style="height: 150px;background: wheat;width: 260px;"
                      />
                    </a>
                    <!--<UploadButton @on-upload="uploadHbzs" text="上传" :readonly="true"></UploadButton>-->
                  </FormItem>
                </td>
                <td>
                  <FormItem label="中国系统PKC兼容认证证书">
                    <a target="_blank" :href="'/corp/api/file/download?fileId='+formItem.pkczs">
                      <img
                        :src="'/corp/api/file/view?fileId='+formItem.pkczs"
                        style="height: 150px;background: wheat;width: 260px;"
                      />
                    </a>
                    <!--<UploadButton @on-upload="uploadPkczs" text="上传" :readonly="true"></UploadButton>-->
                  </FormItem>
                </td>
              </tr>
            </table>
          </Form>
        </div>

        <Modal v-model="show" :closable="false" :mask-closable="false" :transfer="false">
          <div class="page">
            <Loading :loading="loading">
              <div class="page-form">
                <Form
                  :model="formItem"
                  ref="editFormRule"
                  class="form-item"
                  :rules="formRules"
                  label-position="top"
                >
                  <div class="form-sub-title">
                    <Icon type="compose"></Icon>申请证书
                  </div>
                  <FormItem label="中国系统+生态伙伴合作协议/中国系统+生态伙伴" prop="hzjl">
                    <UploadBox v-model="formItem.hzjl" :readonly="false"></UploadBox>
                  </FormItem>
                  <FormItem label="生态伙伴证书编号">
                    <Input v-model="formItem.certificateNo" placeholder="自动生成ST+年月日+3位序列号" />
                  </FormItem>
                  <FormItem>
                    <Button type="primary" icon="md-checkmark" @click="save1">保存</Button>
                    <Button  @click="close" style="margin-left: 8px">取消</Button>
                  </FormItem>
                </Form>
              </div>
            </Loading>
          </div>
          <div slot="footer"></div>
        </Modal>
        <br />
      </div>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import CorpTabs from '@/components/enterprise-ecology/selcorp/Tabs';
import UploadBox from '@/components/upload/Index';
import UploadButton from '@/components/upload/UploadButton';

export default {
  components: {
    Loading, LayoutHor, CorpTabs, UploadBox, UploadButton
  },
  data() {
    return {
      loading: 0,
      corpId: 0,
      show: false,
      step: 1,
      //表单对象
      formItem: {
        corpId: 0,
        hzjl: "",//中国系统+生态伙伴合作协议/中国系统+生态伙伴
        hbzs: '',//中国系统生态伙伴证书
        pkczs: '',//中国系统PKC兼容认证证书
        certificateNo: '',//生态伙伴证书编号
      },

      auditStatus: 0,//审批状态
      auditRemark: '',//审批原因
      oriItem: {},
      //验证
      formRules: {
        hzjl: { required: true, whitespace: true, message: '请上传相关文件', trigger: 'change' },
      }
    }
  },
  computed: {
  },
  mounted() {
    this.corpId = this.$route.query.corpId;
    if (this.corpId) {
      this.corpId = parseInt(this.corpId);
      this.formItem.corpId = this.corpId;
      this.getLasetApply();
    }
  },
  methods: {
    uploadHbzs(fileId) {
      this.formItem.hbzs = fileId;
    },
    uploadPkczs(fileId) {
      this.formItem.pkczs = fileId;
    },
    getLasetApply() {
      var that = this;
      this.loading = 1;
      this.$http.post('/api/engine/enterprise-ecology/corp/certificate/getLastInfo', { "corpId": this.corpId }).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          var data = res.data.data;
          if (data) {
            this.auditStatus = data.auditStatus;
            this.auditRemark = data.auditRemark;
            if (this.auditStatus == 2) {
              this.step = 2;// 
              this.formItem.certificateNo = data.certificateNo;
              this.getInfo();
            }
          }
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    getInfo() {
      var that = this;
      this.loading = 1;
      this.$http.post('/api/engine/enterprise-ecology/corp/getFile', { "corpId": this.corpId, "pageType": "certificate" }).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          var data = res.data.data;
          var hbzs = [], pkczs = [];
          for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            switch (obj.catalog) {
              case "hbzs":
                hbzs.push(obj.fileId);
                break;
              case "pkczs":
                pkczs.push(obj.fileId);
                break;
              default:
                break;
            }
          }
          that.formItem.hbzs = hbzs.join(',');
          that.formItem.pkczs = pkczs.join(',');
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    submitAapply() {
      this.show = true;
    },
    close() {
      this.show = false;
    },
    save1() {//保存证书
      var that = this;
      this.$refs['editFormRule'].validate((valid) => {
        if (valid) {
          let url = '/api/engine/enterprise-ecology/corp/certificate/add ';
          var form = {};
          Object.assign(form, this.formItem);
          form.files = this.formItem.hzjl
          this.loading = 1;
          this.$http.post(url, form).then((res) => {
            this.loading = 0;
            if (res.data.code === 0) {
              this.$Message.success("操作成功！");
              that.auditStatus = 1;
              that.close();
            } else {
              this.$Message.error(res.data.message)
            }
          }).catch((error) => {
            this.loading = 0;
            this.$Message.error(error.message)
          });
        } else {
          return;
        }
      });
    },
    save2() {
      var that = this;
      console.log(this.formItem);
      var param = {};
      param.pageType = 'certificate';
      param.corpId = this.formItem.corpId;
      param.fileIds = [];
      for (var i = 0; i < that.formItem.hbzs.split(',').length; i++) {
        param.fileIds.push({ 'fileId': that.formItem.hbzs.split(',')[i], 'catalog': 'hbzs' });
      }
      for (var i = 0; i < that.formItem.pkczs.split(',').length; i++) {
        param.fileIds.push({ 'fileId': that.formItem.pkczs.split(',')[i], 'catalog': 'pkczs' });
      }
      this.loading = 1;
      this.$http.post('/api/engine/enterprise-ecology/corp/editFile', param).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.$Message.success('操作成功');
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    reset() {
      $.extend(this.formItem, this.oriItem);
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
.certificate-cue {
  font-size: 14px;
  padding: 30px;
  color: #2b85e4;
}
</style>
