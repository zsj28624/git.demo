<template>
  <div class="page page-max-bill trace">
    <Loading :loading="loading">
      <div class="trace-title">
        本周跟进统计：
        <span style="color:#FBA902;font-size:18px; font-weight: bold;">{{listSum.length}}</span> 名销售人员和企业进行了
        <span style="color:#03448D;font-size:18px; font-weight: bold;">{{total}}</span> 次互动
      </div>
      <div class="page-form" style="background-color:#f5f6f7;padding:0px;">
        <div style="height: 100%;margin-right: 353px;">
          <div :key="obj" v-for="obj in list" class="trace-left-item">
            <div class="left-content">
              <div class="date">
                <div v-if="isToday(obj.traceDate)" class="today">今天</div>
                {{dateFormat(obj.traceDate)}}
              </div>
              <div class="content">
                <div class="left-item" :key="item" v-for="item in obj.detailList">
                  <div>
                    <span class="initial">{{item.creatorName.substr(0, 1)}}</span>
                    <span class="title">{{item.creatorName}}</span>
                  </div>
                  <div class="describe">
                    {{item.topic}}
                    <div class="vertical"></div>
                    <Button
                      type="text"
                      @click="add(item)"
                      :size="'large'"
                      icon="ios-chatboxes-outline"
                    >{{item.commentList.length}}</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right-content">
          <div class="right-title">本周客户跟进排行榜</div>
          <div class="right-line"></div>
          <table class="right-table">
            <tr>
              <th>排名</th>
              <th>姓名</th>
              <th>部门</th>
              <th>跟进次数</th>
            </tr>
            <tr :key="item" v-for="(item,index) in listSum">
              <td>
                <span :class="{'pm':index<4}" :style="getPmColor(index)">{{index+1}}</span>
              </td>
              <td :class="{'td-bold':index<4}">{{item.creatorName}}</td>
              <td :class="{'td-bold':index<4}">{{item.deptName}}</td>
              <td :class="{'td-bold':index<4}">{{item.count}}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- <div class="trace-item">
        <h3>跟进主题 | {{'跟进主题'}}</h3>
        <div>跟进项目：{{'跟进项目'}}</div>
        <div>跟进日期：{{'2020-03-24'}}</div>
        <div>跟进结果：{{'跟进结果'}}</div>
    
      </div>-->
      <Edit ref="Edit" @on-save="query"></Edit>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import page from '@/assets/js/page';
import Edit from '@/components/enterprise-ecology/trace/Edit';
export default {
  components: {
    Loading,
    LayoutHor,
    page,
    Edit
  },
  data() {
    return {
      loading: 0,
      list: [],
      corpId: 0,
      total: 0,
      listSum: [],
      //表单对象
      formItem: {
        corpId: 0,
        content: "",
        creator: this.$user.userId,
        creatorName: this.$user.trueName,
      },
      //验证
      ruleValidate: {
        corpName: [
          { required: true, message: '生态企业名称不能为空' },
        ],
      },
      listDate: [],
    }
  },
  computed: {
  },
  mounted() {
    this.corpId = this.$route.query.corpId+"";
    this.formItem.corpId = this.$route.query.corpId+"";
    this.query(this.formItem);
  },
  methods: {
    isToday(str) {
      var d = new Date(str.replace(/-/g, "/"));
      var todaysDate = new Date();
      if (d.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
        return true;
      } else {
        return false;
      }
    },
    add: function (traceInfo) {
      this.$refs.Edit.open(traceInfo);
    },
    dateFormat(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return month + "月" + day + "日";
    },
    getPmColor(index) {
      var value = '';
      switch (index) {
        case 0:
          value = "#F15643";
          break;
        case 1:
          value = "#FF7C00";
          break;
        case 2:
          value = "#FFAC00";
          break;
        default:
          break;
      }
      return {
        background: value
      }
    },
    query(trace) {
      var that = this;
      this.$http.post('/api/engine/trace/list_details?', {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          var list = res.data.data.rows;
          this.total = res.data.data.total;
          this.listSum = res.data.data.listSum;

          var dateList = [];
          for (let i = 0; i < list.length; i++) {
            var item = list[i];
            var ct = dateList.filter(function (obj) {
              return obj.traceDate == item.traceDate
            })
            if (ct.length == 0) {
              var ccc = { traceDate: item.traceDate, detailList: [item] };
              dateList.push(ccc);
            } else {
              ct[0].detailList.push(item);
            }
          }
          that.list = dateList;
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
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
      var from = {
        corpId: item.corpId,
        traceId: item.id,
        content: this.formItem.content,
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
  }
}

</script>

<style type="text/css">
.trace {
  background: #f5f6f7;
}
.trace .trace-title {
  padding-left: 8px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(100, 100, 118, 1);
  line-height: 36px;
}
.trace .trace-left-item {
  padding: 15px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  min-width: 500px;
}
.trace .left-content {
  display: table;
}
.trace .today {
  height: 26px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #fbab11;
}
.trace .date {
  width: 110px;
  text-align: center;
  display: table-cell;
  vertical-align: middle;

  height: 15px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 300;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
}
.trace .content {
  display: inline-block;
  border-left: solid 1px #dbdddf;
  padding-left: 30px;
}
.trace .left-item {
  margin: 10px;
  line-height: 25px;
  font-size: 16px;
  font-family: PingFang SC;
}

.trace .left-item .initial {
  border-radius: 50%;
  width: 25px;
  height: 25px;
  background: #135195;
  color: #fff;
  display: inline-block;
  text-align: center;
}
.trace .left-item .title {
  padding-left: 10px;
  font-weight: bold;
}

.trace .left-item .describe {
  padding-left: 39px;
  color: #666666;
}
.trace .left-item .describe .vertical {
  display: inline-block;
  width: 1px;
  height: 15px;
  margin-left: 15px;
  border-right: 1px solid #d9d9d9;
}
.trace .right-content {
  background: #fff;
  position: absolute;
  top: 57px;
  right: 10px;
  width: 345px;
  box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}
.trace .right-table {
  width: 100%;
  border-collapse: collapse;
}
.trace .right-title {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  margin: 19px;
}
.trace .right-line {
  width: 100%;
  height: 1px;
  background: rgba(228, 231, 234, 1);
}
.trace .right-table th {
  width: 289px;
  height: 14px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  line-height: 36px;
  border-bottom: 1px solid #e4e7ea;
}

.trace .right-table td {
  font-size: 14px;
  text-align: center;
  line-height: 45px;
  font-family: PingFang SC;
  border-bottom: 1px solid #e4e7ea;
}

.trace .right-table .td-bold {
  font-weight: bold;
}
.trace .right-table .pm {
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
</style>
