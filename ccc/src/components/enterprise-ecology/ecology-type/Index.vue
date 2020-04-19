<template>
  <ListPage ref="page" title="生态分类管理" api="/api/engine/enterprise-ecology/ecology-type/list" 
  :model="this" :beforeLoad="beforeLoad">
    <div class="page-tools" slot="page-tools">
      <table cellpadding="0" cellspacing="0">
        <tr>  
            <td>
              <Button  @click="add" icon="md-add">新增一级生态分类</Button>
            </td>
        </tr>
      </table>
    </div>
    <EcologyTypeEdit ref="EcologyTypeEdit" @on-save="query"></EcologyTypeEdit>
  </ListPage> 
</template>
<script>    
  import ListPage from '@/components/enterprise-ecology/ecology-type/ListPage';
  import DataRowOperate from '@/components/commons/DataRowOperate';
  import EcologyTypeEdit from '@/components/enterprise-ecology/ecology-type/EcologyTypeEdit';

  export default {
    components: {
      ListPage,
      DataRowOperate,
      EcologyTypeEdit,
    },
    data() {
      let that = this;
      return {
        tabName:'1',
        columns: [
          {
            title:'操作',
            width: 200,
            align: 'center',
            render:(h,params)=>{
              var row = params.row;
              var text = '';
              if(row.parentId == 0){
                text = '增加二级分类';
              }
              return h(DataRowOperate,{
                props:{
                  btns:[{
                    key:'edit',
                  },
                  {
                    key:'delete',
                  },
                  {
                    key:'two',
                    text:text,
                  }]
                },
                on:{
                  click:(key)=>{
                    if(key=="edit"){
                      this.rowCommand("编辑",params);
                    }
                    if(key=="delete"){
                      this.rowCommand("删除",params);
                    }
                    if(key=="two"){
                      this.rowCommand("增加二级分类",params);
                    }
                  }
                }
              });
            }
          },
          {
            title: '序号',
            width: 100,
            type:'index',
            align: 'center',
          },
          {
            title: '生态分类名称',
            key: 'name',
            width:250,
            render:(h,params)=>{
              var row = params.row;
              var name = "";
              if(row.parentId==0){
                name = row.name;
              }else{
                name = "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"+row.name;
              }
              return h('span',name);
            }
          },
          {
            title: '标签名称',
            key: 'tags',
            align: 'left',
            minWidth:100,
          },
          {
            title: '排序',
            key: 'seq',
            align: 'center',
            maxWidth:120,
          },
        ],
        list: [],
        total:0,
        queryParam: {},
        queryForm: {
          name: '',
          page: '',
          pageSize: ''
        },
        selection: [],
        loading: 0
      }
    },
    mounted: function () {
      this.query();
    },
    computed: {},
    methods: {
      goTab(index){
        var pages = ['/admin','/role']; 
        this.$router.push({path:pages[index]});
      },
      beforeLoad(){

      },
      query() {
        this.$refs.page.query();
      },
      reset: function () {
        // 清空条件
        this.queryForm.name = '';
        this.query();
      },
      select: function (selection) {
        this.selection = selection;
      },
      rowCommand: function (name, params) {
        if (name === '编辑') {
          this.$refs.EcologyTypeEdit.open({id:params.row.id,parentId:params.row.parentId,isTwo:false});
          return;
        }
        if (name === '增加二级分类') {
          this.$refs.EcologyTypeEdit.open({id:params.row.id,parentId:params.row.parentId,isTwo:true});
          return;
        }
        if (name === '删除') {
          this.$Modal.confirm({
            title: '删除确认',
            content: '<p>确定删除该生态分类吗？</p>',
            closable:true,
            onOk: () => {
              let that = this;

              this.$http.post('/api/engine/enterprise-ecology/ecology-type/getCorpEcologyTypeTag',{id:params.row.id}).then((res) => {
                if (res.data.code === 0) {
                  if(res.data.total>0){
                    this.$Message.error('该生态分类已被占用，不能删除!');
                  }else{
                    this.$http.post('/api/engine/enterprise-ecology/ecology-type/del',{id:params.row.id}).then((res) => {
                      if (res.data.code === 0) {
                        this.query();
                        this.$Message.success("删除成功");
                      } else {
                        this.$Message.error(res.data.message)
                      }
                    }).catch((error) => {
                      this.$Message.error(error.message)
                    });
                  }
                } else {
                  this.$Message.error(res.data.message)
                }
              }).catch((error) => {
                this.$Message.error(error.message)
              });
            }
          });
        }
        this.query();
      },
      goBack: function () {
        this.$router.go(-1);
      },
      exportDown(){
        this.$refs.page.exportDown();
      }, 
      add: function () {
        this.$refs.EcologyTypeEdit.open({});
        this.query();
      },
    }
  }

</script>

<style type="text/css">

</style>
