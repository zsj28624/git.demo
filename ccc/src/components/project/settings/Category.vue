<template>
  <div class="tv-div">
    <DeptTreeNode :model="root"></DeptTreeNode>
  </div>
</template>
<script>
import DeptTreeNode from '@/components/project/settings/DeptTreeNode'
import treeComponent from '@/components/tree/treeComponent.js'

export default {
  components: {
    DeptTreeNode,
  },
  data() {
    return {
      contextmenu:{
         top:1,
         left:0,
         show:true
      },
      cur:null,
      root:{
        title:'园区名称',
        children:[]
      },
      tree:null,
      editDept:null,
      data:[]
    };
  },
  mounted(){
    var that = this;
    var tree = new treeComponent({
        idProperty:'id',
        titleProperty:'title', 
        parentIdProperty:'parentId',
        root:{title:'园区名称',data:{title:'园区名称',id:0,parentId:null}},
        onLoad:function(){
          if(!tree.options.isLoad){
            tree.build();
            tree.openLevel(0);
          }else{
            tree.buildRestoreStatus();
          }
          tree.options.isLoad = true;
        },
        onSelect:function(e){
           that.sel(e.sender.data);
        }
    });
    this.tree= tree;
    this.root= tree.options._root;
  },
  computed:{
  },
  methods:{
    load(data){
      if(typeof(data) != 'undefined' && data.length > 0){
        this.tree.options.data = data;
        this.tree.load();
        this.tree.foreach((node)=>{
          node.tooltip = node.data.title;
          node.title = node.data.title;
        })
        if(this.cur!=null){
          this.sel(this.cur);
        }else{
        this.sel(data[0]);
        this.tree.setSelect([data[0].id]);
      }
      }
    },
    sel(cur){
      this.contextmenu.show = true;
      this.cur = cur;
      this.$emit("on-select",cur);
    },
    setSelect(){
      this.tree.setSelect([]);
    },
  }
}
</script>

