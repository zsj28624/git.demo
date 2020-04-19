<template>
  <Modal v-model="show" :title="title" :closable="false" width="700" :mask-closable="false">
    <div class="page customeredit">
      <Loading :loading="loading">
      <div class="page-form">
        <Form :model="formItem" ref="form" :label-width="100" :rules="ruleValidate" class="form-item">
          <div class="form-sub-title">
            <Icon type="compose"></Icon>
            基本信息
          </div>
          <FormItem label="园区名称" prop="name">
            <Input v-model="formItem.name" placeholder="(不可重复)" />
          </FormItem>
          <FormItem label="园区分类" prop="type">
            <Select v-model="formItem.type" style="width: 100%">
              <Option v-for="item in action" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </FormItem>
          <FormItem label="所在区域" prop="area">
            <SelArea v-model="formItem.area" style="width:100%"></SelArea>
          </FormItem>
          <FormItem label="详细地址" prop="address">
            <Input v-model="formItem.address" placeholder="" :maxlength="50"/>
          </FormItem>
          <FormItem label="园区LOGO" prop="logo">
            <UploadBox v-model="formItem.logo" style="width:100%"></UploadBox>
          </FormItem>
          <FormItem label="园区海报" prop="poster">
            <UploadBox v-model="formItem.poster"  style="width:100%"></UploadBox>
          </FormItem>
          <FormItem label="联系电话" prop="phone">
            <Input v-model="formItem.phone" placeholder="" style="width:100%" :maxlength="50"/>
          </FormItem>
          <FormItem label="E-Mail" prop="email">
            <Input v-model="formItem.email" placeholder="" style="width:100%" :maxlength="50"/>
          </FormItem>
          <FormItem label="传真" prop="fax">
            <Input v-model="formItem.fax" placeholder="" style="width:100%" :maxlength="50"/>
          </FormItem>
          <FormItem label="邮编" prop="postcode">
            <Input v-model="formItem.postcode" placeholder="" style="width:100%" :maxlength="50"/>
          </FormItem>
          <FormItem label="园区介绍" prop="introduction">
            <Input v-model="formItem.introduction" type="textarea" style="width:100%" :rows="4"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" icon="md-checkmark" @click="save">保存</Button>
            <Button  @click="reset" style="margin-left: 8px" >重置</Button>
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
        isEdit: false,
        //表单对象
        formItem: {
          name:'',
          type:'',
          area:'',
          address:'',
          logo:'',
          poster:'',
          phone:'',
          email:'',
          fax:'',
          postcode:'',
          introduction:'',
        },
        oriItem:{
        },
        action: [
          { code: '传统园区', text: '传统园区' },
          { code: '信创园区', text: '信创园区' }
        ],
        //验证
        ruleValidate: {
          name: [
            {required: true, whitespace: true, message: '园区名称不能为空'},
          ],
          area: [
            {required: true, whitespace: true, message: '所在区域不能为空', trigger: 'change'},
          ],
        }
      }
    },
    computed: {
      title() {
        if (this.isEdit) {
          return "编辑园区";
        } else {
          return "添加园区";
        }
      },
    },
    mounted(){
    },
    methods: {
      save() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.saveItem();
          } else {
            return;
          }
        });
      },
      saveItem() {
        let url = '';
        let msg = '';
        if (this.isEdit) {
          url = '/api/engine/campus/campus/update';
          msg = '修改成功';
        } else {
          url = '/api/engine/campus/campus/add';
          msg = '添加成功';  
        }
        if(this.formItem.area){
          var area = areajs.getText(this.formItem.area).split('|');
          this.formItem.provincial = area[0];
          if(area[0]!=area[1]){
            this.formItem.city = area[1];
          }
          if(area[1]!=area[2]){
            this.formItem.district = area[2];
          }
        }
        this.loading = 1;
        this.$http.post(url, this.formItem).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            this.$Message.success(msg);
            this.close();
            this.$emit("on-save");
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
      },
      open(item) {
        this.show = true;
        this.$refs['form'].resetFields();
        if (item.id) {
          this.$http.post("/api/engine/campus/campus/get", {id:item.id}).then((res) => {
            this.loading = 0;
            if (res.data.code === 0) {
              this.oriItem = res.data.data[0];
              Object.assign(this.formItem,this.oriItem);
              return;
            } else {
              this.$Message.error(res.data.message)
            }
          }).catch((error) => {
            this.loading = 0;
            this.$Message.error(error.message)
          });
          this.isEdit = true;
          
        } else {
          this.isEdit = false;
          this.oriItem = Object.assign({
            name:'',
            type:'',
            area:'',
            address:'',
            logo:'',
            poster:'',
            phone:'',
            email:'',
            fax:'',
            postcode:'',
            introduction:'',
          },item);
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

