<template>
  <ListPage ref="page" title="楼盘列表" api="/api/engine/campus/building/list" 
  :model="this" :beforeLoad="beforeLoad">
    <div class="page-tools" slot="page-tools">
      <table cellpadding="0" cellspacing="0">
        <tr>  
            <td>
              <Button  @click="add" icon="md-add" v-power="'cyygl.lplb.add'">添加楼盘</Button>
            </td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr> 
          <td>
            <Input v-model="queryForm.number" placeholder="楼盘编号" @on-enter="query" style="width: 180px"/>
          </td>
          <td>
            <Select v-model="queryForm.campusId" style="width: 180px" placeholder="所属园区">
              <Option v-for="item in campus" :value="item.id" :key="item.id">{{ item.name }}</Option>
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
    <BuildingEdit ref="BuildingEdit" @on-save="query"></BuildingEdit>
  </ListPage> 
</template>
<script>    
  import ListPage from '@/components/page/ListPage';
  import DataRowOperate from '@/components/commons/DataRowOperate';
  import BuildingEdit from '@/components/campus/building/buildingEdit';
  import SelArea from '@/components/selarea/index';
  import areajs from '@/assets/js/area'

  export default {
    components: {
      ListPage,
      DataRowOperate,
      BuildingEdit,
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
              var text = '房间';
              return h(DataRowOperate,{
                props:{
                  btns:[{
                    key:'edit',
                    disabled:!this.$user.hasPower('cyygl.lplb.edit'),
                  },
                  {
                    key:'delete',
                    disabled:!this.$user.hasPower('cyygl.lplb.delete'),
                  },
                  {
                    key:'room',
                    text:text,
                    disabled:!this.$user.hasPower('cyygl.lplb.room'),
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
                    if(key=="room"){
                      this.rowCommand("房间",params);
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
            title: '楼盘编号',
            key: 'number',
            width:120,
          }, 
          {
            title: '园区名称',
            key: 'name',
            minWidth:180,
          }, 
          {
            title: '所在区域',
            key: 'campusArea',
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
            title: '房态',
            key: 'area',
            width:250,
            render:(h,params)=>{
              var row = params.row;
              return h('a',{
                  props:{

                  },
                  on:{
                    click:()=>{
                      this.$router.push({path:'/campus/distribution?campusId='+row.campusId+'&buildingId='+row.id});
                    }
                  }
                },"总数:"+row.sum+" 待售:"+row.forsale+" 意向:"+row.intention+" 签约:"+row.sign);
            }
          }, 
          {
            title: '电话',
            key: 'phone',
            align: 'center',
            width:150,
          },
        ],
        campus: [],
        list: [],
        total:0,
        queryParam: {},
        queryForm: {
          number: '',
          campusId: null,
        },
        selection: [],
        loading: 0
      }
    },
    mounted: function () {
      this.loadCampus();
      this.$bus.$emit('on-page-title-change',"楼盘列表");
    },
    computed: {},
    methods: {
      beforeLoad(){

      },
      query() {
        this.$refs.page.query();
      },
      loadCampus() {
        this.loading = 1;
        this.$http.post('/api/engine/campus/campus/listAll', {}).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
             if(res.data.data.total>0){
              this.campus = res.data.data.rows;
              this.campus.map(item=>{
                if(this.$route.query.campusId&&this.$route.query.campusId==item.id){
                  this.queryForm.campusId=item.id;
                }
              })
              this.query();
             }
             this.loading = 0;
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
      },
      reset: function () {
        // 清空条件
        this.queryForm.number = '';
        this.queryForm.campusId =null;
        this.query();
      },
      select: function (selection) {
        this.selection = selection;
      },
      rowCommand: function (name, params) {
        if (name === '编辑') {
          this.$refs.BuildingEdit.open(params.row);
          return;
        }
        if (name === '房间') {
          this.$router.push({path:'/campus/room?campusId='+params.row.campusId+'&buildingId='+params.row.id+'&buildingNumber='+params.row.number})
          return;
        }
        if (name === '删除') {
          this.$Modal.confirm({
            title: '删除确认',
            content: '<p>确定删除该楼盘吗？</p>',
            closable:true,
            onOk: () => {
              let that = this;
              this.$http.post('/api/engine/campus/building/delete',{id:params.row.id}).then((res) => {
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
        this.$refs.BuildingEdit.open({});
      },
    }
  }

</script>

<style type="text/css">

</style>
