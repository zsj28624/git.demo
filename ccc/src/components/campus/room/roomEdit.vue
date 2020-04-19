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
          <FormItem label="房间编号" prop="number">
            <Input v-model="formItem.number" placeholder="房间编号" />
          </FormItem>
          <FormItem label="所属园区" prop="campusId">
            <Select v-model="formItem.campusId" style="width: 100%" @on-change="onChange">
              <Option v-for="item in campus" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="所属楼盘" prop="buildingId">
            <Select v-model="formItem.buildingId" style="width: 100%" >
              <Option v-for="item in building" :value="item.id" :key="item.id">{{ item.number }}</Option>
            </Select>
          </FormItem>
          <FormItem label="所属楼层" prop="floor">
            <InputNumber :max="999999" :min="0" :precision="0" v-model="formItem.floor" style="width: 100%" ></InputNumber>
          </FormItem>
          <FormItem label="建筑面积(㎡)" prop="area">
            <InputNumber :max="999999" :min="0" v-model="formItem.area" style="width: 100%" ></InputNumber>
          </FormItem>
          <FormItem label="类型" prop="type">
            <Select v-model="formItem.type" style="width: 100%" >
              <Option v-for="item in type" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </FormItem>
          <FormItem label="状态" prop="status">
            <Select v-model="formItem.status" style="width: 100%" >
              <Option v-for="item in status" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </FormItem>
          <FormItem label="户型展示" prop="show">
            <UploadBox v-model="formItem.show" style="width:100%"></UploadBox>
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
          buildingId:null,
          floor:null,
          area:null,
          type:'',
          status:'',
          show:''
        },
        campus: [],
        building: [],
        type: [{code:'出售',text:'出售'},{code:'出租',text:'出租'}],
        status: 
          [
            {code:'待售',text:'待售'},
            {code:'意向',text:'意向'},
            {code:'签约',text:'签约'},
          ],
        oriItem:{
        },
        //验证
        ruleValidate: {
          number: [
            {required: true, whitespace: true, message: '房间编号不能为空'},
          ],
          campusId: [
            {required: true, type: 'number', message: '所属园区不能为空', trigger: 'change'},
          ],
          buildingId: [
            {required: true, type: 'number', message: '所属楼盘不能为空', trigger: 'change'},
          ],
          floor: [
            {required: true, type: 'number', message: '所属楼层不能为空', trigger: 'change'},
          ],
        }
      }
    },
    computed: {
      title() {
        if (this.isEdit) {
          return "编辑房间";
        } else {
          return "添加房间";
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
          url = '/api/engine/campus/room/update';
          msg = '修改成功';
        } else {
          url = '/api/engine/campus/room/add';
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
            buildingId:null,
            floor:null,
            area:null,
            type:'出售',
            status:'待售',
            show:''
          },item);
        }
        this.loadCampus();
        if(this.oriItem.campusId){
          this.loadBuilding();
        }
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
      loadBuilding(){
        this.loading = 1;
        this.$http.post('/api/engine/campus/building/listAll', {campusId:this.formItem.campusId}).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
             if(res.data.data.total>0){
              this.building = res.data.data.rows; 
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
      onChange(){
        this.loading = 1;
        this.formItem.buildingId=null;
        this.$http.post('/api/engine/campus/building/listAll', {campusId:this.formItem.campusId}).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
             if(res.data.data.total>0){
              this.building = res.data.data.rows; 
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

