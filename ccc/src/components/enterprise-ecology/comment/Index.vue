<template>
  <div class="page page-max-bill">
    <CorpTabs tabvalue="khpl" :corpId="corpId"></CorpTabs>

    <Loading :loading="loading"> 
      <div class="page-form">
        <div style="height: 10px;"></div>
        <div class="comment-item">
          <div class="comment" v-if="this.listsize!=0">
            <div v-for="item2 in list" v-bind:key="item2.id">
              <div class="initial">{{item2.creatorName.substr(0, 1)}}</div>
              <span class="h2">{{item2.creatorName}}</span>
              ：{{item2.content}}
            </div>
          </div>
          <div class="input-sub">
            <table width="100%">
              <colgroup>
                <col width="88%" />
                <col width="12%" />
              </colgroup>
              <tr>
                <td><Input v-model="formItem.content" type="textarea" placeholder/></td>
                <td v-if="this.formItem.content">
                  <div class="btn-group">
                    <Button type="info" @click="save()">发送评论</Button>
                  </div>
                </td>
                <td v-else>
                  <div class="btn-group">
                    <Button type="info" @click="save()" disabled>发送评论</Button>
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <!--<div class="input-sub" v-else>
            <table width="100%">
              <colgroup>
                <col width="88%" />
                <col width="12%" />
              </colgroup>
              <tr>
                <td><div class="input-prompt" @click="swich()">请输入评论内容</div></td>
                <td>
                  <div class="btn-group">
                    <Button type="info" @click="save()" disabled>发送评论</Button>
                  </div>
                </td>
              </tr>
            </table>
          </div>-->
        </div>
        <div class="clear"></div>
      </div>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import CorpTabs from '@/components/enterprise-ecology/selcorp/Tabs';
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
      isTwo: true,
      parentId: 0,
      list: [],
      listsize: 0,
      corpId: 0,
      isInput:false,
      //表单对象
      formItem: {
        corpId: 0,
        content: "",
        module: "corp",
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
    this.corpId = this.$route.query.corpId;
    this.formItem.corpId = this.$route.query.corpId;
    this.query(this.formItem);
  },
  methods: {
    query(comment) {
      this.$http.post('/api/engine/enterprise-ecology/comment/list?', comment).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          var list = res.data.data.rows;
          //list.map((item) => { item.isInput = false; });
          this.list = list;
          this.listsize = res.data.data.total;
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    /*swich() {
      this.isInput = true;
    },
    noswich() {
      this.isInput = false;
    },*/
    save() {
      let url = '';
      let msg = '';
      url = '/api/engine/enterprise-ecology/comment/commentAdd?';
      msg = '评论发表成功';
      if (!this.formItem.content) {
        this.$Message.error('请填写评论内容');
        return;
      }
      var from = {
        corpId: this.corpId,
        content: this.formItem.content,
        creator: this.$user.userId,
        creatorName: this.$user.trueName,
        module : "corp",
      }
      this.$http.post(url, from).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.$Message.success(msg);
          this.formItem.content = "";
          //this.isInput = false;
          //this.noswich();
          this.query(this.formItem);
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    goBack: function () {
      this.$router.go(-1);
    },
    goPage(page) {
      this.$router.push({ path: page });
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

.comment-item {
  width: 60%;
  float: left;
  margin: 5px;
  line-height: 30px;
  padding: 15px 25px;
  /*border: 1px solid #ddd;*/
  border-radius: 5px;
  transform:translateX(25%);
}
.comment-item .h2 {
  font-weight: bold;
}

.comment-item .initial {
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

.comment-item .comment {
  padding:20px;
  border: 1px solid #ddd;
}
.comment-item .input-sub{
  padding-top:20px;
}
.comment-item .input-sub .btn-group {
  /*text-align: right;*/
}
.comment-item .input-sub .btn-group button{
  height: 45px;
}
.comment-item .input-prompt {
  background: rgba(221, 221, 221, 0.274);
  height: 45px;
  line-height: 40px;
  padding-left: 10px;
  color: #ddd;
  border-radius: 5px;
}
.clear{
  clear: both;
}
</style>
