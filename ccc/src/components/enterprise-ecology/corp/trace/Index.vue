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
          <!--<div class="input-sub" v-if="item.isInput">
            <Input v-model="item.content" type="textarea" :ref="'txtContent'+item.id" placeholder />
            <div class="btn-group">
              <Button  @click="item.isInput = false">取消</Button>
              <Button type="info" @click="save(item)">发送</Button>
            </div>
          </div>
          <div v-else>
            <div class="input-prompt" @click="swich(item)">请输入评论内容</div>
          </div>-->
          <div class="input-sub">
            <table width="100%">
              <colgroup>
                <col width="88%" />
                <col width="12%" />
              </colgroup>
              <tr>
                <td>
                  <Input
                    v-model="item.content"
                    type="textarea"
                    :ref="'txtContent'+item.id"
                    :rows="1"
                    placeholder
                  />
                </td>
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
      list: [],
      corpId: 0,
      tabName: "1",
      //表单对象
      formItem: {
        corpId: 0,
        content: "",
      },
      //验证
      ruleValidate: {
        corpName: [
          { required: true, message: '生态企业名称不能为空' },
        ],
      }
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
    this.query(this.formItem);
  },
  methods: {
    goTab(index) {
      var pages = ['/ecology/corp/trace/edit', '/ecology/corp/trace/index'];
      this.goPage(pages[index] + '?corpId=' + this.corpId);
    },
    query(trace) {
      this.$http.post('/api/engine/enterprise-ecology/corp/trace/list?', trace).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          var list = res.data.data.rows;
          list.map((item) => { item.isInput = false; });
          this.list = list;
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    swich(item) {
      item.isInput = true
      // this.$nextTick(function () {
      //   this.$refs['txtContent' + item.id].focus();
      // }); 
    },
    save(item) {
      let url = '';
      let msg = '';
      url = '/api/engine/enterprise-ecology/corp/trace/commentAdd?';
      msg = '评论发表成功';
      /*if (this.formItem.traceDate != null) {
        this.formItem.traceDate = page.formatDate(this.formItem.traceDate);
      }
      if (this.formItem.planDate != null) {
        this.formItem.planDate = page.formatDate(this.formItem.planDate);
      }*/
      if (!item.content) {
        this.$Message.error('请填写评论内容');
        return;
      }
      var from = {
        corpId: item.corpId,
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
.clear {
  clear: both;
}
</style>
