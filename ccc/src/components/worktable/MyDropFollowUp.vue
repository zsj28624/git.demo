<template>
  <Card>
    <span slot="title">
      <span class="mytitle">我的客户跟进</span>
      <a style="float: right;">更多></a>
    </span>
    <Table height="250" :columns="khgjColumns" :data="khgjList"></Table>
  </Card>
</template>
<script> 
import page from '@/assets/js/page';
import DataRowOperate from '@/components/commons/DataRowOperate';
export default {
  components: {
    page, DataRowOperate
  },
  data() {
    return {
      khgjList: [],
      khgjColumns: [
        {
          title: '操作',
          width: 80,
          align: 'center',
          render: (h, params) => {
            var row = params.row;
            return h(DataRowOperate, {
              props: {
                btns: [{
                  key: 'edit',
                  text: '去处理'
                },
                ]
              },
              on: {
                click: (key) => {
                  if (key == "edit") {
                    this.rowCommand("去处理", params);
                  }
                }
              }
            });
          }
        },
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center',
        },
        {
          title: '计划名称',
          align: 'left',
          minWidth: 100,
          key: 'topic',
        },
        {
          title: '计划跟进日期',
          align: 'center',
          width: 100,
          key: 'traceDate',
        },
        {
          title: '是否逾期',
          align: 'center',
          width: 80,
          key: 'isOverdue',
        },
        {
          title: '跟进状态',
          align: 'center',
          width: 80,
          key: 'traceStatus',
        },
        {
          title: '跟进企业名称',
          key: 'corpName',
          minWidth: 120,
        },
      ],
    }
  },
  computed: {
  },
  mounted() {
    this.query();
  },
  methods: {
    rowCommand: function (name, params) {
      if (name === '去处理') {
        this.$router.push({ path: "/ecology/corp/trace/edit?corpId=" + params.row.corpId });
        return;
      }
    },
    goMore: function () {
      //this.$router.push({ path: "/ecology/corp/audit?forward" });
    },
    query() {
      var that = this;
      this.$http.post('/api/engine/worktable/ecology/myCorpTraceList', {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          that.khgjList = res.data.data;
          that.khgjList.forEach(e => {
            if(e.traceDate<page.formatDate(new Date())){
              e.isOverdue = "是";
            }else{
              e.isOverdue = "否";
            }
            //e.isOverdue = (e.isOverdue ? '是' : '否');
            e.traceDate = e.traceDate.substring(0, 10);
            
          });
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
  }
}

</script>
 