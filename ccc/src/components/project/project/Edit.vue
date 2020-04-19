<template>
  <div class="page page-bill page-bill-max">
    <CorpTabs tabvalue="rksq" :projectId="projectId" ></CorpTabs>
    <br />
    <Loading :loading="loading">
      <div class="page-form">
        <Form
          :model="formItem"
          ref="form"
          :label-width="160"
          :rules="ruleValidate"
          class="form-item"
        >
          <div class="form-sub-title">
            <Icon type="compose"></Icon>
            项目基本信息
          </div>
          <table cellspacing="0" cellpadding="0" >
            <tr>
              <td colspan="3">
                <FormItem label="公司全称" prop="name">
                  <Input v-model="formItem.name" readonly style="width:100%;"/>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <FormItem label="意向园区" prop="campusId">
                  <Select v-model="formItem.campusId" style="width:100%;" :disabled="isView">
                    <Option v-for="item in campus" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td style="width:280px;">
                <FormItem label="创建时间">
                  {{formItem.createTime}}
                </FormItem>
              </td>
              <td>
                <FormItem label="负责人">
                  {{formItem.operatorName}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="所属部门">
                  <Select v-model="formItem.projectDeptId" :disabled="isView">
                    <Option v-for="item in projectDept" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                  </Select>
                </FormItem>
              </td>
              <td>
                <FormItem label="项目阶段">
                  {{formItem.step}}
                </FormItem>
              </td>
              <td>
                <FormItem label="项目状态">
                  {{formItem.projectStatus}}
                </FormItem>
              </td>
            </tr>
          </table>
          <div class="form-sub-title">
            <Icon type="compose"></Icon>
            企业信息
          </div>
          <table cellspacing="0" cellpadding="0" style="width:65%;">
            <tr>
              <td>
                <FormItem label="所属行业" prop="industry">
                  <Select v-model="formItem.industry" :disabled="isView">
                    <Option v-for="item in industry" :value="item.code" :key="item.id">{{ item.text }}</Option>
                  </Select>
                </FormItem>
              </td>
              <td>
                <!-- <FormItem label="企业属性" prop="attribute">
                  <Select v-model="formItem.attribute" :disabled="isView">
                    <Option v-for="item in attribute" :value="item.code" :key="item.id">{{ item.text }}</Option>
                  </Select>
                </FormItem> -->
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="注册资本金(万)" prop="nowRegistered">
                  <InputNumber :max="9999999" :min="0" v-model="formItem.nowRegistered" style="width: 100%" :readonly="isView"></InputNumber>
                </FormItem>
              </td>
              <td>
                <FormItem label="当前税收（万）" prop="nowTaxes">
                  <InputNumber :max="9999999" :min="0" v-model="formItem.nowTaxes" style="width: 100%" :readonly="isView"></InputNumber>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="当前占地（亩）" prop="nowAcreage">
                  <InputNumber :max="9999999" :min="0" v-model="formItem.nowAcreage" style="width: 100%" :readonly="isView"></InputNumber>
                </FormItem>
              </td>
              <td>
                <FormItem label="项目信息渠道" prop="information">
                  <Input v-model="formItem.information" placeholder :readonly="isView"/>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem label="当前问题" prop="question">
                  <Input v-model="formItem.question" type="textarea" :readonly="isView" style="width:100%" :rows="4"></Input>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem label="企业所在地" prop="area">
                  <Input v-model="formItem.area" :readonly="isView" />
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem label="项目需求类型" prop="requirementType">
                  <RadioGroup v-model="formItem.requirementType" @on-change="requireChange">
                    <Radio label="用地" :disabled="isView"></Radio>
                    <Radio label="购房" :disabled="isView"></Radio>
                    <Radio label="租赁" :disabled="isView"></Radio>
                  </RadioGroup>
                </FormItem>
              </td>
            </tr>
            <template v-if="formItem.requirementType!='购房'&&formItem.requirementType!='租赁'">
            <tr >
              <td>
                <FormItem label="占地需求（亩）" prop="preAcreage">
                  <InputNumber :max="9999999" :min="0" v-model="formItem.preAcreage" style="width: 100%" :readonly="isView"></InputNumber>
                </FormItem>
              </td>
              <td>
                <FormItem label="预计投资额（亿）" prop="preRegistered">
                  <InputNumber :max="9999999" :min="0" v-model="formItem.preRegistered" style="width: 100%" :readonly="isView"></InputNumber>
                </FormItem>
              </td> 
            </tr>
            <tr>
              <td>
                <FormItem label="达产产值（亿）" prop="preValue">
                  <InputNumber :max="9999999" :min="0" v-model="formItem.preValue" style="width: 100%" :readonly="isView"></InputNumber>
                </FormItem>
              </td>
              <td>
                <FormItem label="达产税收（万）" prop="preTaxes">
                  <InputNumber :max="9999999" :min="0" v-model="formItem.preTaxes" style="width: 100%" :readonly="isView"></InputNumber>
                </FormItem>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="2">
                <FormItem label="面积要求" prop="areaRequire">
                  <Select v-model="formItem.areaRequire" :disabled="isView" style="width: 200px;">
                    <Option v-for="item in areaRequires" :value="item.code" :key="item.id">{{ item.text }}</Option>
                  </Select>
                </FormItem>
              </td>
            </tr>
          </template>
            <tr>
              <td colspan="2">
                <div class="form-sub-title">
                  <Icon type="compose"></Icon>
                  企业联系人
                </div>
                <FormItem label="" >
                  <Editable ref="editable"
                    :list="list"
                    :editable="!isView"></Editable>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem label="项目需求说明" prop="introduction">
                  <Input v-model="formItem.introduction" type="textarea" :readonly="isView" style="width:100%" :rows="4"></Input>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem label="入库附件" prop="photo">
                  <UploadBox v-model="formItem.photo" :readonly="isView" style="width:100%"></UploadBox>
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
            <Button  size="large" @click="reset" style="margin-left: 15px">重置</Button>
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
      projectId:null,
      isEdit: false,
      isView: false,
      list:[{linkMan:'',position:'',phone:''}],
      campus: [],
      industry:[{code:'电子信息',text:'电子信息'},
        {code:'专用装备',text:'专用装备'},
        {code:'激光切割',text:'激光切割'},
        {code:'轨道交通',text:'轨道交通'},
        {code:'汽车零部件',text:'汽车零部件'},
        {code:'航天制造',text:'航天制造'},
        {code:'环保节能装备',text:'环保节能装备'},
        {code:'化工',text:'化工'},
        {code:'新材料',text:'新材料'},
        {code:'医疗器械',text:'医疗器械'},
        {code:'生物医药',text:'生物医药'},
        {code:'食品',text:'食品'},
        {code:'现代物流',text:'现代物流'},
        {code:'文化创意',text:'文化创意'},
        {code:'传统制造',text:'传统制造'},
        {code:'建筑材料',text:'建筑材料'},],
      attribute:[{code:'交通',text:'交通'},{code:'IT',text:'IT'},{code:'化工',text:'化工'},{code:'机械加工',text:'机械加工'}],
      areaRequires:[
        {code:'100平米以下',text:'100平米以下'},
        {code:'100~300平米',text:'100~300平米'},
        {code:'300~500平米',text:'300~500平米'},
        {code:'500平米以上',text:'500平米以上'}
      ],
      projectDept:[],

      //表单对象
      formItem: {
        name: '',
        campusId: null,
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
        areaRequire:'',
        projectDeptId:'',
      },
      oriItem: {
        name: '',
        campusId: null,
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
        areaRequire:'',
        projectDeptId:'',
      },
      protectNum:0,
      //验证
      ruleValidate: {
        name: [
          { required: true, message: '公司全称不能为空' },
        ],
        campusId: [
          {required: true, type: 'number', message: '意向园区不能为空', trigger: 'change'},
        ],
      }
    }
  },
  computed: {
  },
  mounted() {
    this.projectId = this.$route.query.projectId;
    if (this.projectId) {
      this.projectId = parseInt(this.projectId);
      this.isEdit = true;
      this.formItem.id = this.projectId;
      this.getProject();
    }else{
      if(this.$user.userId){
        this.formItem.operator = this.$user.userId;
        this.formItem.operatorName = this.$user.trueName;
        this.formItem.createTime = page.formatDate(new Date(),'yyyy-MM-dd');
        this.formItem.step = '待入库';
        this.formItem.projectStatus = '未保护';
        this.getDept(this.formItem.operator);
        this.list.push(this.$refs.editable.listNewRow()); 
      }
    }
    this.loadCampus();
  },
  methods: {
    getProject() {
      this.$http.post('/api/engine/project/get', { id: this.projectId }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          this.oriItem = res.data.data[0];
          $.extend(this.formItem, this.oriItem);
          if(this.formItem.linkMan){
            this.list = eval(this.formItem.linkMan);
          }
          this.getDept(this.formItem.operator);
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    getDept(id) {
      this.$http.post('/api/engine/user/getDeptById', { id: id }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if(res.data.data&&res.data.data.length>0){
            this.projectDept=res.data.data;
            if(this.formItem.projectDeptId==null||this.formItem.projectDeptId==''){
              this.formItem.projectDeptId = res.data.data[0].deptId;
            } 
          }
        } else {
          //this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    requireChange(item){
      if(item=="用地"){
        this.formItem.areaRequire='';
      }else if(item=="购房"||item=="租赁"){
        this.formItem.preAcreage=null;
        this.formItem.preRegistered=null;
        this.formItem.preValue=null;
        this.formItem.preTaxes=null;

      }
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
    
    update(item) {
      let url = '';
      let msg = '';
      url = '/api/engine/project/update';
      msg = '保存成功';
      if(this.list.length>0){
        this.formItem.linkMan=JSON.stringify(this.list);
      }
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
    goBack: function () {
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
