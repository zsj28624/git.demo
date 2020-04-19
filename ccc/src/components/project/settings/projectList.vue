<template>
<div class="powermenu">
    <div class="header">{{title}}</div>
    <div class="powermenu-body">

      <Loading :loading="loading">
        <div class="page-form">
          <div class="subtitle">基本信息</div>
          <Form
            :model="formItem"
            ref="form"
            :label-width="180"
            class="form-item"
          >
            <FormItem label="入库项目审批" prop="warehouseApproval">
              <RadioGroup v-model="formItem.warehouseApproval">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Radio label="1">是</Radio>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="意向项目保护期（天）" prop="intentProject">
              <InputNumber :max="999999" :min="0" v-model="formItem.intentProject" style="width: 300px"></InputNumber>
            </FormItem>
            <FormItem label="意向项目保护个数" prop="intentProjectNumber">
              <InputNumber :max="999999" :min="0" v-model="formItem.intentProjectNumber" style="width: 300px"></InputNumber>
            </FormItem>
            <FormItem label="重点项目保护期（天）">
              <InputNumber :max="999999" :min="0" v-model="formItem.keyProjects" style="width: 300px"></InputNumber>
            </FormItem>
            <FormItem>
              <Button type="primary" icon="md-checkmark" @click="save" v-power="'xmgl.cssz.save'">保存</Button>
            </FormItem>
          </Form>
        </div>
      </Loading>
    </div>
  </div>
</template>
<script>
  import Loading from '@/components/loading';

  export default {
    components: {
      Loading,
    },
    props: {
    },
    data() {
      var that = this;
      return {
        loading:0,
        title:'参数设置',
        formItem: {
          id: null,
          intentProject: null,
          intentProjectNumber: null,
          keyProjects: null,
          warehouseApproval: null,
        },
        queryForm:{
          id:null,
        },
     }
   },
   mounted:function(){
    //this.query();
  },
  computed:{
  },
  methods:{
    query() {
      var url = '/api/engine/campus/campus/get';
      this.loading = 1; 
      if(this.queryForm.id==''){
        this.loading = 0;
        return;
      }
      this.$http.post(url,this.queryForm).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data !=null) {
          this.formItem = res.data.data[0];
          this.formItem.warehouseApproval = res.data.data[0].warehouseApproval + "";
        } else {
          this.$Message.error(res.statusText);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    save(){
      var url = '/api/engine/campus/campus/update';
      this.loading = 1;
      this.$http.post(url, this.formItem).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            this.$Message.success("操作成功");
            this.query();
          } else { 
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
    },
  }
}

</script>

<style type="text/css">
  .powermenu{
    height: 100%;
    overflow-y: auto; 
    padding-top: 42px;
  }

  .powermenu-body{
    height: 100%;
    width: 100%;
    overflow-y: auto; 
    padding:10px;
  }

  .powermenu .header{
    font-size: 14px; 
    color:green;
    position: absolute; 
    left:240px;
    right:0px;
    margin-top: -42px;
    line-height: 42px;
    height: 42px;
    padding-left: 10px;
    background-color: white;
    border-bottom: 1px solid #eeeeee;
  }
  .powermenu .subtitle{
    padding: 4px;
    color: #20bfee;
    font-size: 12px;
  }
     
  .powermenu .form td{
    padding: 4px;
  }
  .powermenu .tab td{
    padding: 4px;
  }
  .powermenu .label{
    width: 100px;
    text-align: right;
    color:#999;
  }
</style>

