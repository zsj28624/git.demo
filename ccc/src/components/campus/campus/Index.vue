<template>
  <ListPage ref="page" title="园区列表" api="/api/engine/campus/campus/list" 
  :model="this" :beforeLoad="beforeLoad">
    <div class="page-tools" slot="page-tools">
      <table cellpadding="0" cellspacing="0">
        <tr>  
            <td>
              <Button  @click="add" icon="md-add" v-power="'cyygl.yqlb.add'">添加园区</Button>
            </td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="width: 450px">
            <SelArea v-model="queryForm.area"></SelArea>
          </td>
          <td>
            <Select v-model="queryForm.type" style="width: 180px" placeholder="园区分类">
              <Option v-for="item in action" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </td>
          <td>
            <Input v-model="queryForm.name"  placeholder="园区名称" @on-enter="query"/>
          </td> 
          <td>
            <Button @click="query"  type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset"  type="default">重置</Button>
          </td>
        </tr>
      </table>
    </div>
    <CampusEdit ref="CampusEdit" @on-save="query"></CampusEdit>
  </ListPage> 
</template>
<script>    
  import ListPage from '@/components/page/ListPage';
  import DataRowOperate from '@/components/commons/DataRowOperate';
  import CampusEdit from '@/components/campus/campus/campusEdit';
  import SelArea from '@/components/selarea/index';
  import areajs from '@/assets/js/area'

  export default {
    components: {
      ListPage,
      DataRowOperate,
      CampusEdit,
      SelArea
    },
    data() {
      let that = this;
      return {
        tabName:'1',
        columns: [
          {
            title:'操作',
            width: 120,
            align: 'center',
            render:(h,params)=>{
              var row = params.row;
              var text = '楼盘';
              return h(DataRowOperate,{
                props:{
                  btns:[{
                    key:'edit',
                    disabled:!this.$user.hasPower('cyygl.yqlb.edit'),
                  },
                  {
                    key:'delete',
                    disabled:!this.$user.hasPower('cyygl.yqlb.delete'),
                  },
                  {
                    key:'building',
                    text:text,
                    disabled:!this.$user.hasPower('cyygl.yqlb.building'),
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
                    if(key=="building"){
                      this.rowCommand("楼盘",params);
                    }
                  }
                }
              });
            }
          },
          {
            title: '序号',
            width: 50,
            type:'index',
            align: 'center',
          },  
          {
            title: '园区名称',
            key: 'name',
            minWidth:180,
          }, 
          {
            title: '所在区域',
            key: 'area',
            width:250,
            render:(h,params)=>{
              var row = params.row;
              var area = "";
              if(row.provincial!=null){
                area += row.provincial;
              }
              if(row.city!=null){
                area += "-"+row.city;
              }
              if(row.district!=null){
                area += "-"+row.district;
              }
              return h('span',area);
            }
          }, 
          {
            title: '类型',
            key: 'type',
            width:120,
          },
          {
            title: '电话',
            key: 'phone',
            align: 'center',
            width:150,
          },
        ],
        action: [
          { code: '传统园区', text: '传统园区' },
          { code: '信创园区', text: '信创园区' }
        ],
        list: [],
        total:0,
        queryParam: {},
        queryForm: {
          area: null,
          provincial: '',
          city: '',
          district: '',
          type: '',
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
      beforeLoad(){

      },
      query() {
        if(this.queryForm.area){
          var area = areajs.getText(this.queryForm.area).split('|');
          this.queryForm.provincial = area[0];
          if(area[0]!=area[1]){
            this.queryForm.city = area[1];
          }
          if(area[1]!=area[2]){
            this.queryForm.district = area[2];
          }
        }
        this.$refs.page.query();
      },
      reset: function () {
        // 清空条件
        this.queryForm.area = null;
        this.queryForm.provincial = '';
        this.queryForm.city = '';
        this.queryForm.district = '';
        this.queryForm.type = '';
        this.queryForm.name = '';
        this.query();
      },
      select: function (selection) {
        this.selection = selection;
      },
      rowCommand: function (name, params) {
        if (name === '编辑') {
          this.$refs.CampusEdit.open(params.row);
          return;
        }
        if (name === '楼盘') {
         this.$router.push({path:'/campus/building?campusId='+params.row.id});
         return;
        }
        if (name === '删除') {
          this.$Modal.confirm({
            title: '删除确认',
            content: '<p>确定删除该园区吗？</p>',
            closable:true,
            onOk: () => {
              let that = this;
              this.$http.post('/api/engine/campus/campus/delete',{id:params.row.id}).then((res) => {
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
        this.$refs.CampusEdit.open({});
      },
    }
  }

</script>

<style type="text/css">

</style>
