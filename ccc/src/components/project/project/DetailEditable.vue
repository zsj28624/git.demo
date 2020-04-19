<template> 
  <Editable @add="add" @remove="remove"  :editable="editable">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
        <thead>
          <th style="width: 100px;">序号</th> 
          <th style="width: 150px;">联系人</th>
          <th style="width: 180px;">职务</th>
          <th style="width: 180px;">联系人电话</th>
        </thead> 
        <tbody>
          <tr v-for="(item,index) in list"  :key="'mater_'+index" @click="curIndex = index">
            <td :class="{'col-xh':true,'cur':index==curIndex}">
              {{index+1}}
            </td>  
            <td >
              {{item.linkMan}}
            </td>
            <td >
              {{item.position}}
            </td>
            <td >
              {{item.phone}}
            </td>
          </tr>
        </tbody>
      </table>
      <table cellspacing="0" cellpadding="0" v-else>
        <thead>
          <th style="width: 100px;">序号</th> 
          <th style="width: 150px;">联系人</th>
          <th style="width: 180px;">职务</th>
          <th style="width: 180px;">联系人电话</th>
        </thead> 
        <tbody>
          <tr v-for="(item,index) in list"  :key="'mater_'+index" @click="curIndex = index">
            <td :class="{'col-xh':true,'cur':index==curIndex}">
              {{index+1}}
            </td>  
            <td >
              <Input type="text" v-model="item.linkMan"/>
            </td>
            <td >
              <Input type="text" v-model="item.position" />
            </td>
            <td >
              <Input type="text" v-model="item.phone" />
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
          linkMan:'',
          position:'',
          phone:'',
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
