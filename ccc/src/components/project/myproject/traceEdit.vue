<template>
  <div class="page page-max-bill">
    <CorpTabs tabvalue="xmgj" :projectId="projectId" :source="source"></CorpTabs>
<br />
    <Loading :loading="loading">
      <div class="page-form">
        <Form
          :model="project"
          ref="form"
          :label-width="150"
          class="form-item"
        >
          <div class="form-sub-title">
            <Icon type="compose"></Icon>
            项目基本信息
          </div>
          <table cellspacing="0" cellpadding="0" style="width:75%;">
            <tr>
              <td>
                <FormItem label="公司全称">
                  {{project.name}}
                </FormItem>
              </td>
              <td>
                <FormItem label="意向区域">
                  {{project.campusName}}
                </FormItem>
              </td>
              <td>
                <FormItem label="项目阶段">
                  {{project.step}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="入库时间">
                  {{project.createTime}}
                </FormItem>
              </td>
              <td>
                <FormItem label="负责人">
                  {{project.operatorName}}
                </FormItem>
              </td>
              <td>
                <FormItem label="所在部门">
                  {{project.deptName}}
                </FormItem>
              </td>
            </tr>
          </table>
          <hr style="width:75%;" />
        </Form>
      </div>
      <Tabs :animated="false" v-model="tabName" class="top" @on-click="goTab">
        <TabPane label="待跟进" name="0"></TabPane>
        <TabPane label="已跟进" name="1"></TabPane>
      </Tabs>
      <br />
      <div class="page-form">
        <Form
          :model="formItem"
          ref="form"
          :label-width="150"
          :rules="ruleValidate"
          class="form-item"
        >
          <FormItem label="跟进主题" prop="topic">
            <Input v-model="formItem.topic" placeholder style="width: 700px;" />
          </FormItem>
          <FormItem label="跟进日期" prop="traceDate">
            <DatePicker
              type="date"
              placeholder="跟进日期"
              v-model="formItem.traceDate"
              style="width: 700px"
              :options="traceDate"
            ></DatePicker>
          </FormItem>
          <FormItem label="跟进结果" prop="traceResult">
            <Input
              v-model="formItem.traceResult"
              type="textarea"
              :autosize="{minRows: 5,maxRows: 10}"
              placeholder
              style="width: 700px"
            />
          </FormItem>
          <FormItem label="下次跟进主题" prop="nextTopic" v-if="formItem.traceResult">
            <Input v-model="formItem.nextTopic" placeholder style="width: 700px;" />
          </FormItem>
          <FormItem label="计划跟进日期" prop="planDate" v-if="formItem.traceResult">
            <DatePicker
              type="date"
              placeholder="计划跟进日期"
              v-model="formItem.planDate"
              style="width: 700px"
              :options="planDate"
            ></DatePicker>
          </FormItem>
          <FormItem>
            <Button type="primary" icon="md-checkmark" @click="save">保存</Button>
            <Button  @click="reset" style="margin-left: 8px">重置</Button>
            <Button  @click="close" style="margin-left: 8px">取消</Button>
          </FormItem>
        </Form>
      </div>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import CorpTabs from '@/components/project/myproject/Tabs';
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
      show: false,
      isEdit: false,
      projectId: 0,
      tabName:"0",
      source:'',//来源页面
      //表单对象
      formItem: {
        id: null,
        projectId: null,
        topic: "",
        traceDate: page.formatDate(new Date()),
        traceResult: '',
        nextTopic: '',
        planDate: null,
        creator : this.$user.userId,
        creatorName : this.$user.trueName,
      },
      oriItem: {
        id: null,
        projectId: null,
        topic: "",
        traceDate: page.formatDate(new Date()),
        traceResult: '',
        nextTopic: '',
        planDate: null,
        creator : this.$user.userId,
        creatorName : this.$user.trueName,
      },
      project:{},
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
  },
  mounted() {
    this.source = this.$route.query.source;
    if(this.$route.query.projectId){
      this.projectId = parseInt(this.$route.query.projectId);
      this.formItem.projectId = parseInt(this.$route.query.projectId);
      this.getProject();
      this.query();
    }
    
  },
  methods: {
    query(){
      this.$http.post("/api/engine/project/trace/get", {projectId:this.projectId}).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          if(res.data.data.total==-1){
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
    getProject() {
      this.loading = 1;
      this.$http.post('/api/engine/project/get', { id: this.projectId }).then((res) => {
        if (res.data.code == 0 && res.data.data != null) {
          this.project = res.data.data[0];
          this.loading = 0;
        } else {
          this.$Message.error(res.data.message);
          this.loading = 0;
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    goTab(index) {
      var pages = ['/project/mytraceedit', '/project/mytrace'];
      this.goPage(pages[index]+'?projectId=' + this.projectId);
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
      url = '/api/engine/project/trace/add?';
      msg = '添加成功';
      this.loading = 1;
      if (this.formItem.traceDate != null) {
        this.formItem.traceDate = page.formatDate(this.formItem.traceDate);
      }
      if (this.formItem.planDate != null) {
        this.formItem.planDate = page.formatDate(this.formItem.planDate);
      }
      this.$http.post(url, this.formItem).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.$Message.success(msg);
          this.$router.push({ path: '/project/mytrace?projectId=' + this.projectId });
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    close() {
      this.show = false;
    },
    reset() {
      $.extend(this.formItem, this.oriItem);
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
