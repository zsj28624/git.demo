<template>
<LayoutVer>
  <div slot="top">
  </div> 
  <LayoutHor :fix="true" :left="'contacts-layout-left'">
    <div slot="left" class="contacts-left">
       <LayoutVer>
          <div slot="top" class="contacts-top-title">园区列表</div>
          <div class="contacts-dept-tree">
            <Category ref="category" @on-select="selCate"></Category>
          </div>
      </LayoutVer> 
    </div>
    <projectList ref="powerList" class="contacts-member"></projectList>
  </LayoutHor>
</LayoutVer>
</template>

<script>

import LayoutVer from '@/components/layout/LayoutVer';
import LayoutHor from '@/components/layout/LayoutHor';
import Category from '@/components/project/settings/Category';
import projectList from '@/components/project/settings/projectList';
export default {
  components: {
    LayoutVer,
    LayoutHor,
    Category,
    projectList,
  },
  data() { 
    return { 
      actionDept:0,
      actionEmp:0
    }
  },
  mounted(){  
    this.loadCategory();
  },
  computed:{ 
  },
  methods:{
    loadCategory() {
      this.$http.post('/api/engine/project/settings/tree_list?', {}).then((res) => {
        if (res.data.code == 0 && res.data.data !=null) {
          this.$refs.category.load(res.data.data.rows);
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => { 
        this.$Message.error(error.message)
      });
    },
    selCate(cur){
      this.$refs.powerList.queryForm.id = cur.id;
      this.$refs.powerList.query();
    },
  }
}

</script>
<style type="text/css">
  /*部门树*/
  .contacts-left .dept-tree-node .tv-node.select{
    background-color: #e8f8fd;
    color: #20bfee;
  }
  .contacts-left .dept-tree-node .tv-node:hover {
    background-color: #e8f8fd;
  }

</style>

<style type="text/css">
  .contacts-bar-alert { 
    height: 42px;
    line-height: 24px;
    margin-bottom: 0px;
  }
  .contacts-left {
     height:100%;
     width:240px;
     background-color: white;
     border-right: 1px solid #eeeeee;
  }
  .contacts-top-title {
    height: 42px;
    line-height: 42px;
    font-size: 12px;
    padding-left:15px;
    border-bottom: 1px solid #eeeeee;
    /*background-color: #F9FAFB;*/
  }
  .contacts-left-footer {
    line-height: 40px;
    text-align: left;
    cursor: pointer;
    background-color: white;
  }

  .contacts-left-footer .footer-txt {
    display: block;
    color: #495060;
    border-top: 1px solid #eeeeee;
    padding-left: 15px;
    /*background-color: #F9FAFB;*/
  }
   .contacts-left-footer .footer-txt:hover {
    color: #20bfee;
    background-color: #e8f8fd;
    border-right:2px solid #20bfee; 
  }

  .contacts-left-footer .active {
    color:#20bfee;
    background-color: #e8f8fd;
    border-right:2px solid #20bfee; 
  }
  
  .contacts-layout-left.layout-hor-left{
    width: 240px;
  }
  
</style>