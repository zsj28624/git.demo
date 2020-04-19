<template>
  <div class="page page-bill page-bill-max">
    <CorpTabs tabvalue="zyxmsq" :projectId="projectId"></CorpTabs>
    <br />
    <Loading :loading="loading">
      <div class="page-form">
        <Form
          :model="formItem"
          ref="form"
          :label-width="150"
          :rules="ruleValidate"
          class="form-item"
        >
          <div class="form-sub-title">
            <Icon type="compose"></Icon>
            项目基本信息
          </div>
          <table cellspacing="0" cellpadding="0" style="width:75%;">
            <tr>
              <td>
                <FormItem label="公司全称">
                  {{formItem.name}}
                </FormItem>
              </td>
              <td>
                <FormItem label="意向区域">
                  {{formItem.campusName}}
                </FormItem>
              </td>
              <td>
                <FormItem label="项目阶段">
                  {{formItem.relStep}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="入库时间">
                  {{formItem.createTime}}
                </FormItem>
              </td>
              <td>
                <FormItem label="负责人">
                  {{formItem.operatorName}}
                </FormItem>
              </td>
              <td>
                <FormItem label="所属部门">
                  {{formItem.deptName}}
                </FormItem>
              </td>
            </tr>
          </table>
          <hr style="width:75%;" />
          <br/>
          <table cellspacing="0" cellpadding="0" style="width:65%;"> 
            <tr>
              <td >
                <FormItem label="所属园区" prop="campusId">
                  <Input v-model="formItem.campusName" type="text" readonly ></Input>
                  <!-- <Select v-model="formItem.campusId" style="width:100%;" @on-change="onCampusChange">
                    <Option v-for="item in campus" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select> -->
                </FormItem>
              </td>
              <td >
                <FormItem label="所属楼盘" prop="buildingId">
                  <Input v-model="formItem.buildingNumber" type="text" readonly ></Input>
                  <!-- <Select v-model="formItem.buildingId" style="width:100%;" @on-change="onBuildChange">
                    <Option v-for="item in build" :value="item.id" :key="item.id">{{ item.number }}</Option>
                  </Select> -->
                </FormItem>
              </td>
              <td >
                <FormItem label="房间编号" prop="roomId">
                  <Input v-model="formItem.roomNumber" type="text" readonly ></Input>
                  <!-- <Select v-model="formItem.roomId" >
                    <Option v-for="item in room" :value="item.id" :key="item.id">{{ item.number }}</Option>
                  </Select>  -->
                </FormItem>
              </td>
              <td style="padding-left: 10px;" v-if="!isView">
                <i-button type="success" @click="checkRoom" style="margin-top: -15px">选择</i-button>
              </td>
            </tr>
          </table>
          <table cellspacing="0" cellpadding="0" style="width:65%;">
            <tr>
              <td>
                <FormItem label="选址说明" prop="siteIntroduction">
                  <Input v-model="formItem.siteIntroduction" type="textarea" :readonly="isView" style="width:100%" :rows="4"></Input>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="其他需求" prop="otherNeeds">
                  <Input v-model="formItem.otherNeeds" type="textarea" :readonly="isView" style="width:100%" :rows="4"></Input>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem label="重点项目附件" prop="importantFiles">
                  <UploadBox v-model="formItem.importantFiles" :readonly="isView" style="width:100%"></UploadBox>
                </FormItem>
              </td>
            </tr>
          </table>
        </Form>
      </div>
      <table class="savebar" cellpadding="0" cellspacing="0" style="width:65%;">
        <tr v-if="!isView">
          <td style="text-align: center;">
          <Button type="info" size="large" @click="update">保存</Button>
          <!-- <Button type="info" size="large" @click="sumbit" style="margin-left: 15px;">提交申请</Button> -->
          <Button  size="large" @click="reset" style="margin-left: 15px;">重置</Button>
          </td>
        </tr>
      </table>
      <SelectRoom ref="selectRoom" @on-submit="selectRoom"></SelectRoom>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import CorpTabs from '@/components/project/project/Tabs';
import Editable from '@/components/project/project/DetailEditable';
import UploadBox from '@/components/upload/Index';
import page from '@/assets/js/page';
import SelectRoom from '@/components/project/myproject/SelectRoom';

export default {
  components: {
    Loading, LayoutHor, CorpTabs,Editable,UploadBox,SelectRoom
  },
  data() {
    return {
      loading: 0,
      isEdit: false,
      isView: false,
      projectId:null,
      campus: [],
      build: [],
      room: [],

      //表单对象
      formItem: {
        id:0,
        name: '',
        campusId: null,
        buildingId:null,
        roomId:null,
        createTime: null,
        operator: null,
        operatorName: '',
        deptId:null,
        deptName:'',
        step: '',
        projectStatus: '',
        industry: '',
        attribute: '',
        nowRegistered: null,
        nowTaxes: null,
        nowAcreage: null,
        information:'',
        question:'',
        area:'',
        requirementType: '',
        preAcreage: null,
        preRegistered: null,
        preValue: null,
        preTaxes:null,
        lianMan:'',//企业联系人
        introduction: '',
        photo: '',
        siteIntroduction:'',
        otherNeeds:'',
        importantFiles:'',
      },
      oriItem: {
        id:0,
        name: '',
        campusId: null,
        buildingId:null,
        roomId:null,
        createTime: null,
        operator: null,
        operatorName: '',
        deptId:null,
        deptName:'',
        step: '',
        projectStatus: '',
        industry: '',
        attribute: '',
        nowRegistered: null,
        nowTaxes: null,
        nowAcreage: null,
        information:'',
        question:'',
        area:'',
        requirementType: '',
        preAcreage: null,
        preRegistered: null,
        preValue: null,
        preTaxes:null,
        lianMan:'',//企业联系人
        introduction: '',
        photo: '',
        siteIntroduction:'',
        otherNeeds:'',
        importantFiles:'',
      },
      //验证
      ruleValidate: {
        campusId: [
          {required: true, message: '所属园区不能为空',},
        ],
        buildingId: [
          {required: true, message: '所属楼盘不能为空', },
        ],
        roomId: [
          {required: true, message: '房间编号不能为空',},
        ],
      }
    }
  },
  computed: {
  },
  mounted() {
    this.$refs['form'].resetFields();
    this.projectId = this.$route.query.projectId;
    if (this.projectId) {
      this.projectId = parseInt(this.projectId);
      this.isEdit = true;
      this.formItem.id = this.projectId;
      this.getProject();
    }else{
      
    }
    //this.loadCampus();
  },
  methods: {
    getProject() {
      this.loading = 1;
      this.$http.post('/api/engine/project/get', { id: this.projectId }).then((res) => {
        if (res.data.code == 0 && res.data.data != null) {
          this.oriItem = res.data.data[0];
   
          this.oriItem.relStep=this.oriItem.step;
          /*if(this.oriItem.campusId){
            this.onCampusChange();
          }
          if(this.oriItem.buildingId){
            this.onBuildChange();
          }*/
          $.extend(this.formItem, this.oriItem);
          this.loading = 0;
        } else {
          this.$Message.error(res.data.message);
          this.loading = 0;
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
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
    onCampusChange(){
      this.loading = 1;
      this.formItem.buildingId=null;
      this.formItem.roomId=null;
      this.$http.post('/api/engine/campus/building/listAll', {campusId:this.formItem.campusId}).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.build = res.data.data.rows; 
          this.loading = 0;
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    onBuildChange(){
      this.loading = 1;
      this.formItem.roomId=null;
      this.$http.post('/api/engine/campus/room/listAll', {buildingId:this.formItem.buildingId}).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.room = res.data.data.rows; 
          this.loading = 0;
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    checkRoom(){
      var campusId=null;
      var buildingId=null;
      if(this.formItem.campusId){
        campusId = this.formItem.campusId;
      }
      if(this.formItem.buildingId){
        buildingId = this.formItem.buildingId;
      }
      this.$refs.selectRoom.open({campusId:campusId,buildingId:buildingId});
    },
    selectRoom(item){
      this.loading=1;
      if(item){
        var roomId='';
        var roomNumber='';
        item.map((it)=>{
          this.formItem.campusId=it.campusId;
          this.formItem.buildingId=it.buildingId;
          this.formItem.buildingNumber=it.buildingNumber;
          roomId +=it.id+',';
          roomNumber+=it.number+',';
        })
        this.formItem.roomId =roomId.substring(0,roomId.length-1);
        this.formItem.roomNumber=roomNumber.substring(0,roomNumber.length-1);
      }
      this.loading=0;
    },
    update(item) {
      let url = '';
      let msg = '';
      url = '/api/engine/project/update';
      msg = '保存成功';
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = 1;
          this.$http.post(url, this.formItem).then((res) => {
            this.loading = 0;
            if (res.data.code === 0) {
              this.$Message.success(msg);
              this.goBack();
            } else {
              this.$Message.error(res.data.message)
            }
          }).catch((error) => {
            this.loading = 0;
            this.$Message.error(error.message)
          });
        } else {
          return;
        }
      });     
    },
    reset() {
      this.$refs.form.resetFields();
      $.extend(this.formItem, this.oriItem);

    },
    goBack() {
      this.$router.push({ path: '/project/project' });
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
</style>
