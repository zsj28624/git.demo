<template>
  <div class="page page-bill page-bill-max">
    <CorpTabs tabvalue="qyxx" :projectId="projectId"></CorpTabs>
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
                </FormItem>
              </td>
              <td >
                <FormItem label="所属楼盘" prop="buildingId">
                  <Input v-model="formItem.buildingNumber" type="text" readonly ></Input>
                </FormItem>
              </td>
              <td >
                <FormItem label="房间编号" prop="roomId">
                  <Input v-model="formItem.roomNumber" type="text" readonly ></Input>
                </FormItem>
              </td>
            </tr>
          </table>
          <table cellspacing="0" cellpadding="0" style="width:65%;">
            <tr>
              <td colspan="2">
                <FormItem label="签约附件" prop="contractFiles">
                  <UploadBox v-model="formItem.contractFiles" :readonly="isView" style="width:100%"></UploadBox>
                </FormItem>
              </td>
            </tr>
          </table>
        </Form>
      </div>
      <table class="savebar" cellpadding="0" cellspacing="0" style="width:65%;">
        <tr v-if="!isView">
          <td style="text-align: center;">
          <Button type="info" size="large" @click="update" style="margin-left: 15px;">保存</Button>
          <Button  size="large" @click="reset" style="margin-left: 15px;">重置</Button>
          </td>
        </tr>
      </table>
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

export default {
  components: {
    Loading, LayoutHor, CorpTabs,Editable,UploadBox
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
        contractFiles:'',
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
        contractFiles:'',
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
  },
  methods: {
    getProject() {
      this.loading = 1;
      this.$http.post('/api/engine/project/get', { id: this.projectId }).then((res) => {
        if (res.data.code == 0 && res.data.data != null) {
          this.oriItem = res.data.data[0];
          /*this.oriItem.relStep='正式签约';
          if(this.oriItem.status==1||this.oriItem.step=="待入库"||this.oriItem.step=="正式签约"){
            this.isView=true;
            this.oriItem.relStep=this.oriItem.step;
          }*/
          this.oriItem.relStep=this.oriItem.step;
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
    
    update(item) {
      let url = '';
      let msg = '';
      url = '/api/engine/project/update';
      msg = '保存成功';
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
