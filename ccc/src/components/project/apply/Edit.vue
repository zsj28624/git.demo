<template>
  <Modal v-model="show" :title="title" :closable="false" width="700" :mask-closable="false">
    <div class="page customeredit">
      <Loading :loading="loading">
      <div class="page-form">
        <Form :model="formItem" ref="form" :label-width="100" :rules="ruleValidate" class="form-item">
          <div class="form-sub-title">
            <Icon type="compose"></Icon>
            审批结果
          </div>
          <FormItem label="审批人" prop="auditPeopleName">
            <Input v-model="formItem.auditPeopleName" placeholder="审批人" readonly />
          </FormItem>
          <FormItem label="审批时间" prop="auditTime">
            <Input v-model="formItem.auditTime" placeholder="" readonly/>
          </FormItem>
          <FormItem label="审批结果" prop="auditResult">
            <Input v-model="formItem.auditResult" placeholder="" readonly/>
          </FormItem>
          <FormItem label="审批意见" prop="auditRemark">
            <Input v-model="formItem.auditRemark" placeholder="" readonly/>
          </FormItem>
          <FormItem>
            <!-- <Button type="primary" @click="goEdit" v-power="'xmgl.wdsq.goEdit'">详情页</Button> -->
            <Button  @click="close" style="margin-left: 170px;">关闭</Button>
          </FormItem>
        </Form>
      </div>
      </Loading>
    </div>
    <div slot="footer"></div>
  </Modal> 
</template>
<script>
  import Loading from '@/components/loading';
  import SelArea from '@/components/selarea';
  import page from '@/assets/js/page';
  import UploadBox from '@/components/upload/Index';
  import areajs from '@/assets/js/area'

  export default {
    components: {
      Loading, SelArea,UploadBox
    },
    data() {
      return {
        loading: 0,
        show: false,
        isEdit: false,
        //表单对象
        formItem: {
          auditPeople:null,
          auditPeopleName:'',
          auditTime:null,
          auditResult:'',
          status:0,
          auditRemark:'',
        },
        oriItem:{
        },
        //验证
        ruleValidate: {
        }
      }
    },
    computed: {
      title() {
        return "审批结果";
      },
    },
    mounted(){
    },
    methods: {
      open(item) {
        this.show = true;
        //this.$refs['form'].resetFields();
        if (item.id) {
          this.oriItem = item;
          if(this.oriItem.status==1){
            this.oriItem.auditResult='未审批';
          }
          if(this.oriItem.status==2){
            this.oriItem.auditResult='通过';
          }
          if(this.oriItem.status==3){
            this.oriItem.auditResult='驳回';
          }
        }
        Object.assign(this.formItem,this.oriItem);
      },
      
      close() {
        this.show = false;
      },
      reset() {
        $.extend(this.formItem,this.oriItem);
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

