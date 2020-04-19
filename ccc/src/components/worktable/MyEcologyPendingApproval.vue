<template>
  <Card>
    <span slot="title">
      <span class="mytitle">我的待审批</span>
      <a style="float: right;" @click="goMore">更多></a>
    </span>
    <Table height="250" :columns="dspColumns" :data="dspList"></Table>
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
      dspList: [],
      dspColumns: [
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
                  text: '去审批'
                },
                ]
              },
              on: {
                click: (key) => {
                  if (key == "edit") {
                    this.rowCommand("去审批", params);
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
          title: '企业名称',
          align: 'left',
          key: 'corpName',
          minWidth:150,
        },
        {
          title: '所属生态分类',
          align: 'center',
          width: 180,
          key: 'ecologyTypeTag',
        },
        {
          title: '企业等级',
          align: 'center',
          width: 120,
          key: 'level',
        },
        {
          title: '审批业务',
          align: 'center',
          width: 120,
          key: 'businessType',
        },
        {
          title: '提交人',
          key: 'createName',
          width: 100,
        },
        {
          title: '提交日期',
          key: 'createTime',
          align: 'center',
          width: 140,
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
      if (name === '去审批') {
        this.$router.push({ path: '/ecology/corp/audit/audit?applyId=' + params.row.applyId + '&type=' + params.row.businessTypeValue })
        return;
      }
    },
    goMore: function () {
      this.$router.push({ path: "/ecology/corp/audit?forward" });
    },
    query() {
      var that = this;
      this.$http.post('/api/engine/worktable/ecology/myPendingReview', {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          that.dspList = res.data.data;
          that.dspList.map((item)=>{
            item.createTime = item.createTime.length>=10?item.createTime.substring(0,10):item.createTime
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
 