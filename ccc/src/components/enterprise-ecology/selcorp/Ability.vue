<template>
  <div class="page page-bill page-bill-max">
    <CorpTabs tabvalue="qynl" :corpId="corpId"></CorpTabs>
    <Loading :loading="loading">
      <div class="baseinfo">
        <div style="height:30px;"></div>
        <Form
          ref="form"
          class="page-form"
          :model="formItem"
          :rules="formRules"
          label-position="top"
        >
          <table cellspacing="0" cellpadding="0">
            <colgroup>
              <col width="45%" />
              <col width="auto" />
            </colgroup>
            <tr>
              <td>
                <FormItem label="中国系统现代数字城市+生态解决方案模板" prop="szcs">
                  <UploadBox v-model="formItem.szcs" :readonly="true"></UploadBox>
                </FormItem>
              </td>
              <td>
                <FormItem label="生态伙伴产品、技术、解决方案白皮书（多个）" prop>
                  <UploadBox v-model="formItem.cpjs" :readonly="true"></UploadBox>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="解决方案、产品报价（存在多条多版本）" prop>
                  <UploadBox v-model="formItem.bj" :readonly="true"></UploadBox>
                </FormItem>
              </td>
              <td>
                <FormItem label="成功案例介绍" prop>
                  <UploadBox v-model="formItem.cgal" :readonly="true"></UploadBox>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="营业执照扫描件" prop="yyzz">
                  <UploadBox v-model="formItem.yyzz" :readonly="true"></UploadBox>
                </FormItem>
              </td>
              <td>
                <FormItem label="法人身份证扫描件" prop>
                  <UploadBox v-model="formItem.frsfz" :readonly="true"></UploadBox>
                </FormItem>
              </td>
            </tr>
          </table>
        </Form>
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
      //表单对象
      formItem: {
        corpId: 0,
        szcs: '',// 中国系统现代数字城市+生态解决方案模板
        cpjs: '',// 生态伙伴产品、技术、解决方案白皮书（多个）
        bj: '',// 解决方案、产品报价（存在多条多版本）
        cgal: '',// 成功案例介绍
        yyzz: '',// 营业执照扫描件
        frsfz: '',// 法人身份证扫描件 
      },
      oriItem: {
        id: null,
      },
      //验证
      formRules: {
        szcs: [
          { required: true, message: '请上传附件', trigger: 'blur,change' }
        ],
        yyzz: [
          { required: true, message: '请上传附件', trigger: 'blur,change' }
        ],
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
      this.getInfo();
    }
  },
  methods: {
    importExcel(fileId) {

    },
    getInfo() {
      var that = this;
      this.loading = 1;
      this.$http.post('/api/engine/enterprise-ecology/corp/getFile', { "corpId": this.corpId, "pageType": "ability" }).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          var data = res.data.data;
          var szcs = [], cpjs = [], bj = [], cgal = [], yyzz = [], frsfz = [];
          for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            switch (obj.catalog) {
              case "szcs":
                szcs.push(obj.fileId);
                break;
              case "cpjs":
                cpjs.push(obj.fileId);
                break;
              case "bj":
                bj.push(obj.fileId);
                break;
              case "cgal":
                cgal.push(obj.fileId);
                break;
              case "yyzz":
                yyzz.push(obj.fileId);
                break;
              case "frsfz":
                frsfz.push(obj.fileId);
                break;
              default:
                break;
            }
          }
          that.formItem.szcs = szcs.join(',');
          that.formItem.cpjs = cpjs.join(',');
          that.formItem.bj = bj.join(',');
          that.formItem.cgal = cgal.join(',');
          that.formItem.yyzz = yyzz.join(',');
          that.formItem.frsfz = frsfz.join(',');
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.saveItem();
        } else {
          return;
        }
      });
    },
    saveItem() {
      var that = this;
      console.log(this.formItem);
      var param = {};
      param.pageType = 'ability';
      param.corpId = this.formItem.corpId;
      param.fileIds = [];
      for (var i = 0; i < that.formItem.szcs.split(',').length; i++) {
        param.fileIds.push({ 'fileId': that.formItem.szcs.split(',')[i], 'catalog': 'szcs' });
      }
      for (var i = 0; i < that.formItem.cpjs.split(',').length; i++) {
        param.fileIds.push({ 'fileId': that.formItem.cpjs.split(',')[i], 'catalog': 'cpjs' });
      }
      for (var i = 0; i < that.formItem.bj.split(',').length; i++) {
        param.fileIds.push({ 'fileId': that.formItem.bj.split(',')[i], 'catalog': 'bj' });
      }
      for (var i = 0; i < that.formItem.cgal.split(',').length; i++) {
        param.fileIds.push({ 'fileId': that.formItem.cgal.split(',')[i], 'catalog': 'cgal' });
      }
      for (var i = 0; i < that.formItem.yyzz.split(',').length; i++) {
        param.fileIds.push({ 'fileId': that.formItem.yyzz.split(',')[i], 'catalog': 'yyzz' });
      }
      for (var i = 0; i < that.formItem.frsfz.split(',').length; i++) {
        param.fileIds.push({ 'fileId': that.formItem.frsfz.split(',')[i], 'catalog': 'frsfz' });
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
</style>
