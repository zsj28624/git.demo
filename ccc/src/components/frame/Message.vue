<template>
<ListPage ref="page" title="消息提醒" api="/api/engine/message/list"
  :model="this" :beforeLoad="beforeLoad" @onCurrentRowChange="curRowChg">
  <div class="page-tools">
    <table cellpadding="0" cellspacing="0">
      <tr>  
          <td>
            <Button size="large" @click="sendMessage" icon="ios-paper-plane" v-power="'xtsz.xxtx.send'"  >发送消息</Button>
          </td>
          <td>
            <Button size="large"  @click="reads" icon="md-create" >标记已读</Button>
          </td>
        
      </tr> 
    </table>
  </div>
  <div class="page-searchbox">
    <table cellpadding="0" cellspacing="0">
      <tr> 
        <td style="width: 40px" align="right">内容</td>
        <td>
          <Input v-model="queryForm.content" style="width: 220px"  placeholder="内容"  @on-enter="query"/>
        </td>
        <td style="width: 40px" align="right">时间</td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.createTime"
              split-panels
              placeholder="入库日期"
              style="width: 220px"
              :clearable="true"
              ::transfer="true"
            ></DatePicker>
          </td>  
        <td style="width: 40px" align="right">状态</td>
        <td>
          <Select v-model="queryForm.read" style="width: 220px">
            <Option v-for="item in read" :value="item.code" :key="item.code">{{ item.text }}</Option>
          </Select>
        </td>
        <td>
            <Button @click="query"  type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset"  type="default">重置</Button>
          </td>
          <td>&nbsp;</td>
      </tr>
    </table>
  </div>
  <Edit ref="Edit" @on-save="query"></Edit>
</ListPage>
</template>
<script>
  import ListPage from '@/components/page/ListPage';
  import Loading from '@/components/loading';
  import page from '@/assets/js/page';
  import DataRowOperate from '@/components/commons/DataRowOperate';
  import Edit from '@/components/frame/MessageEdit';

  export default {
    components: {
      ListPage,
      Loading,
      DataRowOperate,
      Edit
    },
    data() {
      let that = this;
      return {
        curRow:{},
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            title:'操作',
            width: 150,
            align: 'center',
            render:(h,params)=>{
              var row = params.row;
              return h(DataRowOperate,{
                props:{
                  btns:[{
                    key:'edit',
                    text:'去处理',
                    disabled:!this.$user.hasPower('xtsz.xxtx.goedit')||row.link==null||row.link=="",
                  },
                  {
                    key:'deletetop',
                    text:'取消置顶',
                    disabled:row.top==0||!this.$user.hasPower('xtsz.xxtx.deletetop'),
                  },]
                },
                on:{
                  click:(key)=>{
                    if(key=="edit"){
                      this.rowCommand("去处理",params);
                    }
                    if(key=="deletetop"){
                      this.rowCommand("取消置顶",params);
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
            title: '内容',
            key: 'content',
            align: 'left',
            minWidth:250,
            render:(h, params)=>{
              var row = params.row;
              return h('span',{
                  style:{
                    
                  }
                },row.content);
            }
          },
          {
            title: '发送时间',
            key: 'createTime',
            width: 180,
            align: 'center',
          },
          page.table.initMapColumn({
            title: '状态',
            key: 'read',
            data:{
              '0':'未读',
              '1':'已读',
            }
          }),
          page.table.initMapColumn({
            title: '置顶',
            key: 'top',
            data:{
              '0':'未置顶',
              '1':'已置顶',
            }
          }),
        ], 
        queryForm: {
          content: '',
          createTime:[],
          read:null,
          receiver:this.$user.userId,
        }, 
        read:[{code:0,text:'未读'},{code:1,text:'已读'}],
      }
    },
    mounted() { 
      this.query();
      this.$bus.$emit('on-page-title-change',"消息提醒");
    },
    computed: {},
    methods: {  
      beforeLoad(){
        var queryParam = this.$refs.page.queryParam;
        queryParam.createTimeStart = '';
        queryParam.createTimeEnd = '';
        delete queryParam.createTime;
        if (this.queryForm.createTime.length > 0) {
          queryParam.createTimeStart = page.formatDate(this.queryForm.createTime[0]);
        }
        if (this.queryForm.createTime.length > 1) {
          queryParam.createTimeEnd = page.formatDate(this.queryForm.createTime[1]);
        }
      },
      query() {
        this.$refs.page.query();
      },
      reset() {
        Object.assign(this.queryForm,{
          content: '',
          createTime:[],
          read:null,
          receiver:this.$user.userId,
        });
        this.query();
      },
      curRowChg(row){
        if(row!=null){
           this.curRow = row;
        }else{
          this.curRow = null;
        }
      },
      reads(){
        let msg = '标记已读成功';
        let selection = this.$refs.page.getSelection();
        let ids=[];
        if(selection.length>0){
          selection.map((item)=>{
            ids.push(item.id);
          })
        }else{
          this.$Message.info("请选择需要操作的数据行");
          return;
        }
        
        this.$http.post('/api/engine/message/read',{ids: ids}).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            this.$Message.success(msg);
            this.query();
          }else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
      },
      rowCommand: function (name, params) {
        if (name === '取消置顶') {
          let msg = '取消置顶成功';
          this.$http.post('/api/engine/message/updatetop',{id: params.row.id}).then((res) => {
            this.loading = 0;
            if (res.data.code === 0) {
              this.$Message.success(msg);
              this.query();
            }else {
              this.$Message.error(res.data.message)
            }
          }).catch((error) => {
            this.loading = 0;
            this.$Message.error(error.message)
          });
        }
        if (name === '去处理') {
          if(params.row.link!=null&&params.row.link!=""){
            this.$router.push({ path: params.row.link  });
          }else{
            this.$Message.error("暂无跳转页面");
            retuen;
          }
        }
      },
      sendMessage(){
        this.$refs.Edit.open();
      },
    }
  }

</script>

<style type="text/css">
  
</style>
