

<template>
  <div class="tyleftbarsub">
    <div class="tyleftbarsub-head">
      <span class="tyleftbarsub-head-title">{{nav.title}}</span>
      <Icon v-if="fixed" @click.native="switchFixed"
        type="pin tyleftbarsub-head-icon"></Icon>
      <Icon v-else @click.native="switchFixed"
        type="pin tyleftbarsub-head-icon unfixed"></Icon>
    </div>
    <div class="tyleftbarsub-menu wt-scroll">
      <div class="tyleftbarsub-menu-item" v-if="item.hasPower"
        v-for="(item,index) in nav.subItems" @click="open(item)">
        <Icon :type="item.iconfont" class="tyleftbarsub-menu-item-icon" v-if="item.iconfont"></Icon>
        <img :src="item.icon" v-else class="tyleftbarsub-menu-item-icon"/>
        <span class="tyleftbarsub-menu-item-title">
          {{item.title}}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    fixed:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      nav:{}
    }
  },
  mounted: function () {
    this.load();
  },
  methods: {
    load(){

    },
    open(item) {
      this.$emit('on-open',item);
    },
    switchFixed(){
      this.$emit('on-fixed-change');
    }
  }
}
</script>

<style type="text/css">
  .tyleftbarsub{
    height: 100%;
    padding-top: 42px;
    width: 150px;
    background-color: white;
  }
  .tyleftbarsub:after {
    content: '';
    display: block;
    width: 1px;
    height: 100%;
    background: #eeeeee;
    position: absolute;
    right: 0;
    top: 0;
  }
  /*菜单*/
  .tyleftbarsub-menu{
    height: 100%;
    background-color: white;
    overflow-y: auto;
  }
  .tyleftbarsub-menu-item{
    line-height: 42px;
    height: 42px;
    overflow: hidden;
    font-size: 14px;
    padding: 0px 15px;
    padding-left: 45px;
    cursor: pointer;
    position: relative;
  }
  .tyleftbarsub-menu-item:hover{
    background-color: #e8f8fd;
    color:#20bfee;
  }
  .tyleftbarsub-menu-item:hover .tyleftbarsub-menu-item-icon{
    color:#20bfee;
  }
  .tyleftbarsub-menu-item-icon{
    position: absolute;
    display: block;
    left:17px;
    top:13px;
    width: 16px;
    height: 16px;
    font-size: 16px;
    color:#999;
    text-align: center;
  }
  /*头部*/
  .tyleftbarsub-head {
    height: 42px;
    line-height: 42px;
    padding: 0 0 0 15px;
    font-size: 14px;
    color: #666;
    border-bottom: 1px solid #eee;
    cursor: default;
    margin-top: -42px;
  }

  .tyleftbarsub-head-icon{
    float: right;
    color: #666;
    cursor: pointer;
    line-height: 42px;
    height: 42px;
    width: 50px;
    display: block;
    text-align: center;
  }
  .tyleftbarsub-head-icon:hover{
    background: #DCDEE5;
    background: #f1f2f4;
    color:#20bfee;
  }
  .tyleftbarsub-head-icon.unfixed{
    line-height: 30px;
  }

</style>
