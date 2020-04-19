<template>
  <Modal v-model="show" :title="title" :closable="false" width="800" :mask-closable="false">
    <div class="page customeredit">
      <Loading :loading="loading">
      <div align="center">
        <table cellpadding="0" cellspacing="0" >
          <tr>
            <td>
              <Transfer
                  :data="list"
                  :target-keys="targetKeys"
                  :list-style="listStyle"
                  filterable
                  @on-change="handleChange">
              </Transfer>
            </td>
          </tr>
          <br/>
          <tr>
            <td align="right">
              <Button type="primary" @click="save" style="margin-left: 8px">确定</Button>
              <Button  @click="close" style="margin-left: 8px">取消</Button>
            </td>
          </tr>
        </table>
      </div>
      </Loading>
    </div>
    <div slot="footer"></div>
  </Modal> 
</template>
<script>
  import Loading from '@/components/loading';
  import page from '@/assets/js/page';

  export default {
    components: {
      Loading
    },
    data() {
      return {
        loading: 0,
        show: false,
        list: [
          { "key": 1, "label": "项目名称", "disabled": false },
          { "key": 2, "label": "项目阶段", "disabled": false },
          { "key": 3, "label": "保护期", "disabled": false },
          { "key": 4, "label": "行业", "disabled": false },
          { "key": 5, "label": "企业所在地", "disabled": false },
          { "key": 6, "label": "入库时间", "disabled": false },
          { "key": 7, "label": "意向区域", "disabled": false },
          { "key": 8, "label": "负责人", "disabled": false },
          { "key": 9, "label": "所属部门", "disabled": false },
        ],
        targetKeys:[],
        listStyle: 
          {
            width: '290px',
            height: '350px'
          },

      }
    },
    computed: {
      title() {
        return "自定义列";
      },
    },
    mounted(){
    },
    methods: {
      open() {
        this.show = true;
        this.targetKeys=[];
      },
      save(){
        this.show = false;
        this.$emit("on-save",this.targetKeys);
      },
      close() {
        this.show = false;
      },
      reloadData(){

      },
      handleChange(newTargetKeys){
        this.targetKeys = newTargetKeys;
      },
    }
  }

</script>

<style type="text/css">
  .form-sub-title {
    font-size: 14px;
    margin: 0 0 12px 18px;
    color: #2b85e4;
  }

  .customeredit .width-1{
    width: 160px;
  }
</style>

