<template>
  <Card>
    <span slot="title">
      <span class="mytitle">我的申请</span>
      <a style="float: right;" @click="goMore">更多></a>
    </span>
    <Table height="250" :columns="sqColumns" :data="sqList"></Table>
  </Card>
</template>
<script> 
import page from '@/assets/js/page';
import DataRowOperate from '@/components/commons/DataRowOperate';

export default {
  components: {
    page,
    DataRowOperate
  },
  data() {
    return {
      sqList: [],
      sqColumns: [
        {
          title: '操作',
          width: 80,
          align: 'center',
          render: (h, params) => {
            var row = params.row;
            return h(DataRowOperate, {
              props: {
                btns: [{
                  key: 'view',
                  text: '查看'
                },
                ]
              },
              on: {
                click: (key) => {
                  if (key == "view") {
                    this.rowCommand("查看", params);
                  }
                }
              }
            });
          }
        },
        {
          title: '序号',
          width: 50,
          type: 'index',
          align: 'center',
        },
        {
          title: '企业名称',
          align: 'left',
          key: 'corpName',
          minWidth: 130,
        },
        {
          title: '分配日期',
          align: 'center',
          key: 'createTime',
          width: 150,
        },
        {
          title: '分配人',
          align: 'center',
          key: 'manager',
          width: 150,
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
      if (name === '查看') {
        this.$router.push({ path: '/ecology/corp/audit/view?applyId=' + params.row.applyId + '&type=' + params.row.businessTypeValue })
        return;
      }
    },
    goMore: function () {
      this.$router.push({ path: "/ecology/corp/myApply?forward" });
    },
    query() {
      var that = this;
      this.$http.post('/api/engine/worktable/ecology/myApply', {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          that.sqList = res.data.data;
          that.sqList.map((item)=>{
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
 