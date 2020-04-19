<template> 
  <Editable @add="add" @remove="remove"  :editable="editable">
    <table cellspacing="0" cellpadding="0" >
        <thead>
          <th style="width: 100px;">序号</th> 
          <th style="width: 150px;">审批人</th>
          <th style="width: 180px;">审批结果</th>
          <th style="width: 180px;">审批意见</th>
          <th style="width: 180px;">审批时间</th>
        </thead> 
        <tbody>
          <tr v-for="(item,index) in list"  :key="'mater_'+index" @click="curIndex = index">
            <td :class="{'col-xh':true,'cur':index==curIndex}">
              {{index+1}}
            </td>  
            <td >
              {{item.auditPeopleName}}
            </td>
            <td >
              {{item.status==2?'通过':item.status==3?'驳回':'其他'}}
            </td>
            <td >
              {{item.auditRemark}}
            </td>
            <td >
              {{item.auditTime}}
            </td>
          </tr>
        </tbody>
      </table>
  </Editable>  
</template>
<script>
  import Editable from '@/components/editable-table';
  import floatObj from '@/assets/js/floatObj';
  export default {
    components: {
      Editable
    },
    props:{
      list:{
        type:Array,
        default:function () {
          var arr = [];
        }
      },
      editable:{
        type:Boolean,
        default:false
      },
      isImport:{  // 是否为导入的数据，导入的数据不能添加行，部分字段不能编辑
        type:Boolean,
        default:false
      }
    },
    data() { 
      return {
        curIndex:0, 
      }
    },
    mounted: function () {
      
    },
    computed: {},
    methods: { 
      load() {

      }, 
      listNewRow(){
        var def = {
          auditPeopleName:'',
          status:null,
          auditRemark:'',
          auditTime:'',
        };
        return def;
      },
      add(){
        if(!this.isImport){
          this.list.push(this.listNewRow()); 
        } 
      },
      remove(){
        if(this.list.length > this.curIndex){
          this.list.splice(this.curIndex,1);
        }
        if(this.list.length <= this.curIndex){
          this.curIndex = this.list.length - 1;
        }
        if(this.curIndex == -1){
          this.curIndex = 0;
        }
      },
      selMater(row){
        
      },
    }
  }

</script>

<style type="text/css"> 
   
</style>
