<template>
  <div class="page page-max-bill">
    <CorpTabs tabvalue="gzjhd" :corpId="corpId"></CorpTabs>

    <Loading :loading="loading">
      <div class="page-form">
        <Tabs :animated="false" v-model="tabName" class="top" @on-click="goTab">
          <TabPane label="待跟进" name="0"></TabPane>
          <TabPane label="已跟进" name="1"></TabPane>
        </Tabs>
        <div style="height: 10px;"></div>
        <Form
          :model="formItem"
          ref="form"
          :label-width="100"
          :rules="ruleValidate"
          class="form-item"
        >
          <FormItem label="跟进主题" prop="topic">
            <Input v-model="formItem.topic" placeholder style="width: 900px" />
          </FormItem>
          <FormItem label="跟进日期" prop="traceDate">
            <DatePicker
              type="date"
              placeholder="跟进日期"
              v-model="formItem.traceDate"
              style="width: 900px"
              :options="traceDate"
            ></DatePicker>
          </FormItem>
          <FormItem label="跟进结果" prop="traceResult">
            <Input
              v-model="formItem.traceResult"
              type="textarea"
              :autosize="{minRows: 5,maxRows: 10}"
              placeholder
              style="width: 900px"
            />
          </FormItem>
          <FormItem label="下次跟进主题" prop="nextTopic" v-if="formItem.traceResult">
            <Input v-model="formItem.nextTopic" placeholder style="width: 900px" />
          </FormItem>
          <FormItem label="计划跟进日期" prop="planDate" v-if="formItem.traceResult">
            <DatePicker
              type="date"
              placeholder="计划跟进日期"
              v-model="formItem.planDate"
              style="width: 900px"
              :options="planDate"
            ></DatePicker>
          </FormItem>
          <FormItem>
            <Button type="primary" icon="md-checkmark" @click="save">保存</Button>
            <Button @click="reset" style="margin-left: 8px">重置</Button>
          </FormItem>
        </Form>
      </div>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import CorpTabs from '@/components/enterprise-ecology/corp/Tabs';
import page from '@/assets/js/page';

export default {
  components: {
    Loading,
    LayoutHor,
    CorpTabs,
    page,
  },
  data() {
    return {
      loading: 0, 
      isEdit: false,  
      corpId: null,
      tabName: "0",
      //表单对象
      formItem: {
        id: null,
        corpId: null,
        topic: "",
        traceDate: page.formatDate(new Date()),
        traceResult: null,
        nextTopic: '',
        planDate: '',
        creator: this.$user.userId,
        creatorName: this.$user.trueName,
      },
      oriItem: {
        id: null,
        corpId: null,
        topic: "",
        traceDate: page.formatDate(new Date()),
        traceResult: null,
        nextTopic: '',
        planDate: '',
        creator: this.$user.userId,
        creatorName: this.$user.trueName,
      },
      //验证
      ruleValidate: {
        topic: [
          { required: true, message: '跟进主题不能为空' },
        ],
        traceDate: [
          { required: true, message: '跟进日期不能为空' },
        ],
      },
      traceDate: {
          disabledDate (date) {
              return date && date.valueOf() > (new Date().getTime()+24*60*60*1000) - 86400000;
          }
      },
      planDate: {
          disabledDate (date) {
              return date && date.valueOf() < Date.now() - 86400000;
          }
      },
    }
  },
  computed: {
    pageTitle() {
      if (this.isEdit) {
        return "编辑企业客户";
      } else {
        return "添加企业客户";
      }
    },
  },
  mounted() {
    this.corpId = this.$route.query.corpId * 1;
    this.formItem.corpId = this.$route.query.corpId;
    this.query();
  },
  methods: {
    query() {
      this.$http.post("/api/engine/enterprise-ecology/corp/trace/get", { corpId: this.corpId }).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          if (res.data.data.total == -1) {
            this.formItem = res.data.data.rows;
          }
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    goTab(index) {
      var pages = ['/ecology/corp/trace/edit', '/ecology/corp/trace/index'];
      this.goPage(pages[index] + '?corpId=' + this.corpId);
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
      let url = '';
      let msg = '';

      url = '/api/engine/enterprise-ecology/corp/trace/add?';
      msg = '添加成功';

      this.loading = 1;
      if (this.formItem.traceDate != null) {
        this.formItem.traceDate = page.formatDate(this.formItem.traceDate);
      }
      if (this.formItem.planDate != null) {
        this.formItem.planDate = page.formatDate(this.formItem.planDate);
      }
      if (this.formItem.planDate == "") {
        this.formItem.planDate = null;
      }
      this.$http.post(url, this.formItem).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.$Message.success(msg);
          this.query();
          this.goPage('/ecology/corp/trace/index?corpId=' + this.corpId);
          //this.close();
          //this.$emit("on-save");
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
    goPage(page) {
      this.$router.replace({ path: page });
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
