<template>
  <div class="page page-bill page-bill-max">
    <CorpTabs tabvalue="xmgj" :projectId="projectId"></CorpTabs>
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
        <div style="height: 10px;"></div>
        <div class="trace-item" v-bind:key="item.id" v-for="item in list">
          <h3>跟进主题 | {{item.topic}}</h3>
          <div>跟进日期：{{item.traceDate.substr(0, 10)}}</div>
          <div>跟进结果：{{item.traceResult}}</div>
          <div>
            <div v-for="item2 in item.commentList" v-bind:key="item2.id">
              <div class="initial">{{item2.creatorName.substr(0, 1)}}</div>
              <span class="h2">{{item2.creatorName}}</span>
              ：{{item2.content}}
            </div>
          </div>
          <!--
          <div class="input-sub" v-if="item.isInput">
            <Input v-model="item.content" type="textarea" :ref="'txtContent'+item.id" placeholder />
            <div class="btn-group">
              <Button  @click="item.isInput = false">取消</Button>
              <Button type="info" @click="save(item)">发送</Button>
            </div>
          </div>
          <div v-else>
            <div class="input-prompt" @click="swich(item)">请输入评论内容</div>
          </div>
        </div>-->

          <div class="input-sub">
            <table width="100%">
              <colgroup>
                <col width="88%" />
                <col width="12%" />
              </colgroup>
              <tr>
                <td><Input v-model="item.content" type="textarea" :ref="'txtContent'+item.id" :rows="1" placeholder /></td>
                <td v-if="item.content">
                  <div class="btn-group">
                    <Button type="info" @click="save(item)">发送评论</Button>
                  </div>
                </td>
                <td v-else>
                  <div class="btn-group">
                    <Button type="info" @click="save(item)" disabled>发送评论</Button>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="clear"></div> 
      </div>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import CorpTabs from '@/components/project/project/Tabs';
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
      parentId: 0,
      list: [],
      projectId: 0,
      tabName:"1",
      //表单对象
      formItem: {
        projectId: 0,
        content: "",
      },
      project:{},
      //验证
      ruleValidate: {
      }
    }
  },
  computed: {
  },
  mounted() {
    this.projectId = parseInt(this.$route.query.projectId);
    this.formItem.projectId = parseInt(this.$route.query.projectId);
    this.query(this.formItem);
    this.getProject();
  },
  methods: {
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
      var pages = ['/project/traceedit', '/project/trace'];
      this.goPage(pages[index]+'?projectId=' + this.projectId);
    },
    query(trace) {
      this.loading = 1;
      this.$http.post('/api/engine/project/trace/list?', trace).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          /*this.list = res.data.data.rows;
          this.list.map((item)=>{
            item.traceDate=item.traceDate=item.traceDate.length>=10?item.traceDate.substring(0,10):item.traceDate;
          });
          this.loading = 0;*/

          var list = res.data.data.rows;
          list.map((item) => { item.isInput = false; });
          this.list = list;
        } else {
          this.loading = 0;
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    swich(item) {
      item.isInput = true;
    },
    save(item) {
      let url = '';
      let msg = '';
      url = '/api/engine/project/trace/commentAdd?';
      msg = '评论发表成功';
      var from = {
        projectId : item.projectId,
        traceId: item.id,
        content: item.content,
        creator: this.$user.userId,
        creatorName: this.$user.trueName,
      }
      this.$http.post(url, from).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.$Message.success(msg);
          this.formItem.content = "";
          this.query(this.formItem);
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
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

.trace-item {
  width: 49%;
  float: left;
  margin: 5px;
  line-height: 30px;
  padding: 15px 25px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.trace-item .h2 {
  font-weight: bold;
}

.trace-item .initial {
  border-radius: 20px;
  width: 18px;
  height: 18px;
  line-height: 18px;
  background: #0d4580;
  color: #fff;
  display: inline-block;
  text-align: center;
  font-size: 9px;
}

.trace-item .input-sub {
  padding-top: 10px;
}
.trace-item .input-prompt {
  background: rgba(221, 221, 221, 0.274);
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  color: #ddd;
  border-radius: 5px;
}
.clear{
  clear: both;
}
</style>