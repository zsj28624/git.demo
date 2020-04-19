<template>
  <div class="page page-bill page-bill-max">
    <CorpTabs tabvalue="bjdc" :corpId="corpId"></CorpTabs>
    <Loading :loading="loading">
      <div class="baseinfo">
        <div style="height:30px;"></div>
        <Form
          ref="form"
          class="page-form"
          label-position="top"
          :model="formItem"
          :rules="formRules"
        >
          <table cellspacing="0" cellpadding="0">
            <colgroup>
              <col width="33%" />
              <col width="auto" />
              <col width="33%" />
            </colgroup>
            <tr>
              <td colspan="2">
                <FormItem label="中国系统生态伙伴背景调查报告" prop>
                  <UploadBox v-model="formItem.files" :readonly="true"></UploadBox>
                </FormItem>
              </td>
              <td></td>
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
        files: "",
      },
      oriItem: {
        id: null,

      },
      //验证
      formRules: {

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
    getInfo() {
      var that = this;
      this.loading = 1;
      this.$http.post('/api/engine/enterprise-ecology/corp/getFile', { "corpId": this.corpId, "pageType": "backgroundCheck" }).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          var data = res.data.data;
          var dcbg = [];
          for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            switch (obj.catalog) {
              case "dcbg":
                dcbg.push(obj.fileId);
                break;
              default:
                break;
            }
          }
          that.formItem.files = dcbg.join(',');
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    save() {
      this.saveItem();
      // this.$refs['form'].validate((valid) => {
      //   if (valid) {
      //     this.saveItem();
      //   } else {
      //     return;
      //   }
      // });
    },
    saveItem() {
      var that = this;
      var param = {};
      param.corpId = this.formItem.corpId;
      param.pageType = 'backgroundCheck';
      param.fileIds = [];
      for (var i = 0; i < that.formItem.files.split(',').length; i++) {
        param.fileIds.push({ 'fileId': that.formItem.files.split(',')[i], 'catalog': 'dcbg' });
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
