<template>
  <Modal v-model="show" :title="title" :closable="false" width="700" :mask-closable="false">
    <div class="page customeredit">
      <Loading :loading="loading">
      <div class="page-form">
        <Form :model="formItem" ref="form" :label-width="100" :rules="ruleValidate" class="form-item">
          <FormItem label="消息内容" prop="content">
            <Input v-model="formItem.content" type="textarea"  style="width:85%" :rows="8"/>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="send" >发送</Button>
            <Button  @click="close" style="margin-left: 8px">取消</Button>
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
        //表单对象
        formItem: {
          content:'',
        },
        oriItem:{
          content:'',
        },
        //验证
        ruleValidate: {
        }
      }
    },
    computed: {
      title() {
        return "发送消息";
      },
    },
    mounted(){
    },
    methods: {
      open(item) {
        this.show = true;
        Object.assign(this.formItem,this.oriItem);
      },
      send(){
        this.$http.post('/api/engine/user/listAll', {}).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            if(res.data.data.total>0){
              var userList = res.data.data.rows;
              userList.map((item)=>{
                this.message(item.id);
              })
            }
            this.$Message.success("发送成功");
            this.$emit("on-save");
            this.close();
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
        
      },
      message(receiver){
        this.$http.post('/api/engine/message/add', {module:"管理员消息",content:this.formItem.content,receiver:receiver}).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {

          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
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

