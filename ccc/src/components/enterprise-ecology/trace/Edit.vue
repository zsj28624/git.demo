<template>
  <Modal v-model="show" :title="'评论'" :closable="false" :mask-closable="false">
    <div class="page">
      <Loading :loading="loading">
        <div class="page-form">
          <Form
            :model="formItem"
            ref="form"
            :label-width="90"
            :rules="ruleValidate"
            class="form-item"
          >
            <FormItem label="跟进主题：">{{formItem.topic}}</FormItem>
            <FormItem label="跟进项目：">{{formItem.corpName}}</FormItem>
            <FormItem label="跟进日期：">{{formItem.traceDate}}</FormItem>
            <FormItem label="跟进结果：">{{formItem.traceResult}}</FormItem>
            <div class="trace-comment-list">
              <div :key="index" v-for="(obj,index) in formItem.commentList">
                {{obj.creatorName+'：'+obj.content}}
                <span class="date">{{obj.createTime}}</span>
              </div>
              <div class="comment">
                <Input type="textarea" :rows="2" v-model="content" placeholder="请输入评论" />
              </div>
            </div>
            <FormItem>
              <Row>
                <Col span="24" style="text-align: right">
                  <Button type="primary" icon="md-checkmark" @click="save">评论</Button>
                  <Button @click="close" style="margin-left: 8px">取消</Button>
                </Col>
              </Row>
            </FormItem>
          </Form>
        </div>
      </Loading>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import Loading from '@/components/loading';

export default {
  components: {
    Loading,
  },
  data() {
    return {
      loading: 1,
      show: false,
      //表单对象
      formItem: {
        "commentList": [],
        "creator": 1,
        "corpId": 1,
        "creatorName": "",
        "updateTime": "",
        "nextTopic": "",
        "planDate": "",
        "createTime": "",
        "id": 0,
        "topic": "",
        "corpName": "",
        "traceResult": "",
        "traceDate": "",
      },
      content: '',//
      oriItem: {
      },
      //验证
      ruleValidate: {
        content: [
          { required: true, message: '评论不能为空' },
        ],
      }
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    save() {
      if (this.content.trim() == '') {
        this.$Message.error('请输入评论内容');
        return;
      }
      this.saveItem();
    },
    saveItem() {
      var from = {
        corpId: this.formItem.corpId,
        traceId: this.formItem.id,
        content: this.content
      }
      this.$http.post('/api/engine/enterprise-ecology/corp/trace/commentAdd', from).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.$Message.success('评论发表成功');
          this.content = "";
          this.close();
          this.$emit("on-save");
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    open(traceObj) {
      this.loading = 1;
      $.extend(this.formItem, traceObj);
      console.log(this.formItem);
      if (this.formItem.traceDate) {
        this.formItem.traceDate = this.formItem.traceDate.substr(0, 10);
      }
      this.show = true;
      this.loading = 0;
    },
    close() {
      this.show = false;
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
.trace-comment-list {
  background: #f1f1f1;
  line-height: 30px;
  padding: 10px;
  margin-left: 15px;
  margin-bottom: 10px;
}
.trace-comment-list .comment {
  background: #f1f1f1;
  line-height: 30px;
  padding: 10px;
  margin-left: 15px;
}
.trace-comment-list .date {
  float: right;
}
</style>
