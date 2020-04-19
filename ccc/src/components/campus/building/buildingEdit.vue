<template>
  <Modal v-model="show" :title="title" :closable="false" width="700" :mask-closable="false">
    <div class="page customeredit">
      <Loading :loading="loading">
      <div class="page-form">
        <Form :model="formItem" ref="form" :label-width="130" :rules="ruleValidate" class="form-item">
          <div class="form-sub-title">
            <Icon type="compose"></Icon>
            基本信息
          </div>
          <FormItem label="楼盘编号" prop="number">
            <Input v-model="formItem.number" placeholder="楼盘编号" />
          </FormItem>
          <FormItem label="所属园区" prop="campusId">
            <Select v-model="formItem.campusId" style="width: 100%" >
              <Option v-for="item in campus" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="层数" prop="floor">
            <InputNumber :max="999999" :min="0" :precision="0" v-model="formItem.floor" style="width: 100%" ></InputNumber>
          </FormItem>
          <FormItem label="总建筑面积(㎡)" prop="area">
            <InputNumber :max="999999" :min="0" v-model="formItem.area" style="width: 100%" ></InputNumber>
          </FormItem>
          <FormItem label="设计图纸" prop="designDiagram">
            <UploadBox v-model="formItem.designDiagram" style="width:100%"></UploadBox>
          </FormItem>
          <FormItem label="楼盘介绍" prop="introduction">
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
  import page from '@/assets/js/page';
  import UploadBox from '@/components/upload/Index';
  import areajs from '@/assets/js/area'

  export default {
    components: {
      Loading,UploadBox
    },
    data() {
      return {
        loading: 0,
        show: false,
        isEdit: false,
        //表单对象
        formItem: {
          number:'',
          campusId:null,
          floor:null,
          area:null,
          designDiagram:'',
          introduction:'',
        },
        campus: [],
        oriItem:{
        },
        //验证
        ruleValidate: {
          number: [
            {required: true, whitespace: true, message: '楼盘编号不能为空'},
          ],
          campusId: [
            {required: true, type: 'number', message: '所属园区不能为空', trigger: 'change'},
          ],
        }
      }
    },
    computed: {
      title() {
        if (this.isEdit) {
          return "编辑楼盘";
        } else {
          return "添加楼盘";
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
          url = '/api/engine/campus/building/update';
          msg = '修改成功';
        } else {
          url = '/api/engine/campus/building/add';
          msg = '添加成功';  
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
          this.isEdit = true;
          this.oriItem = item;
        } else {
          this.isEdit = false;
          this.oriItem = Object.assign({
            number:'',
            campusId:null,
            floor:null,
            area:null,
            designDiagram:'',
            introduction:'',
          },item);
        }
        this.loadCampus();
        Object.assign(this.formItem,this.oriItem);
      },
      loadCampus(){
        this.loading = 1;
        this.$http.post('/api/engine/campus/campus/listAll', {}).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
             if(res.data.data.total>0){
              this.campus = res.data.data.rows; 
             }
             this.loading = 0;
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

