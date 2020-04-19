<template>
  <div class="page page-bill page-bill-max">
    <CorpTabs tabvalue="rksq" :projectId="projectId" :source="source"></CorpTabs>
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
                <!-- <FormItem label="公司全称" prop="name">
                  <Input v-model="formItem.name" :readonly="isView"  style="width:100%;"/>
                </FormItem> -->
                <FormItem label="公司全称" prop="name">
                  <auto-complete clearable ref="text1" :disabled="isView" v-model="formItem.name" @on-change="changeSel" @on-select="selectSel" style="width:100%;"  >
                    <i-Option v-for="item in selectProject1" :value="item.name" :key="item.id">
                      <span>{{item.name}}</span>
                    </i-Option>
                  </auto-complete>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <FormItem label="意向园区" prop="campusId">
                  <Select v-model="formItem.campusId" style="width:100%;" :disabled="isView" >
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
            <template v-if="formItem.requirementType=='用地'">
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
            <Button type="info" size="large" @click="save">提交入库申请</Button>
            <Button  size="large" @click="reset" style="margin-left: 15px">重置</Button>
          </td>
        </tr>
        <tr v-else>
          <td style="text-align: center;">
          </td>
        </tr>
      </table>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import CorpTabs from '@/components/project/myproject/Tabs';
import Editable from '@/components/project/myproject/DetailEditable';
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
      source:'',//来源页面
      list:[{linkMan:'',position:'',phone:''}],
      campus: [],
      industry:[
        {code:'电子信息',text:'电子信息'},
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
        {code:'建筑材料',text:'建筑材料'},
        ],
      attribute:[
        {code:'交通',text:'交通'},
        {code:'IT',text:'IT'},
        {code:'化工',text:'化工'},
        {code:'机械加工',text:'机械加工'}
      ],
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
        requirementType: '用地',
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
      selectProject:[],
      selectProject1:[],
      isSel:false,
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
    this.source = this.$route.query.source;
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
        this.formItem.requirementType = "用地";
        this.getAllProject();
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
          if(this.oriItem.status==1||this.oriItem.step=="意向"||this.oriItem.step=="重点项目"||this.oriItem.step=="正式签约"){
            this.isView=true;
          }
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
    getAllProject() {
      this.$http.post('/api/engine/project/listAll', {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 ) {
          if(res.data.data.total>0){
            this.selectProject = res.data.data.rows;
            this.selectProject1 = res.data.data.rows;
          }
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
        if (res.data.code == 0 ) {
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
    requireChange(item){
      this.loading=1;
      if(item=="用地"){
        this.formItem.areaRequire='';
      }else if(item=="购房"||item=="租赁"){
        this.formItem.preAcreage=null;
        this.formItem.preRegistered=null;
        this.formItem.preValue=null;
        this.formItem.preTaxes=null;
      }
      this.loading=0;
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if(this.formItem.campusId){
            this.protectNum=0;
            this.$http.post('/api/engine/project/getProtectNum', {campusId:this.formItem.campusId}).then((res) => {
              this.loading = 0;
              if (res.data.code === 0) {
                 if(res.data.data>0){
                  this.protectNum = res.data.data; 
                 }
                 var bool = true;
                 this.campus.map((item)=>{
                  if(item.id == this.formItem.campusId){
                    if(this.protectNum>=item.intentProjectNumber){
                      this.$Message.error("该园区保护项目已达到最大值!");
                      bool=false;
                      return;
                    }
                    if(item.warehouseApproval==0){
                      this.saveNoAudit(item);
                      bool=false;
                      return;
                    } 
                  }
                })
                 if(bool){
                  this.saveItem();
                 }
                 this.loading = 0;
              } else {
                this.$Message.error(res.data.message)
              }
            }).catch((error) => {
              this.loading = 0;
              this.$Message.error(error.message)
            });
          }else{
            this.saveItem();
          }
        } else {
          return;
        }
      });
    },
    saveItem() {
      let url = '';
      let msg = '';
      if (this.isEdit) {
        url = '/api/engine/project/update';
        msg = '提交成功';
      } else {
        url = '/api/engine/project/add';
        msg = '提交成功';
      }
      if(this.list.length>0){
        this.formItem.linkMan=JSON.stringify(this.list);
      }
      this.formItem.status=1;
      this.loading = 1;
      this.$http.post(url, this.formItem).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {

          if(res.data.data.id!=null){
            var projectId =res.data.data.id;
            var form = {
              projectId : projectId,
              applyType : '申请入库',
              applyPeople : this.$user.userId,
              applyPeopleName : this.$user.trueName,
              status : 1,
              module:"我的项目", //消息提醒设置
              content:"您有一条"+this.formItem.name+"项目入库申请需要审核",
              link:"/project/audit",
              powerKey:"spzx.cyyywsp.audit",
              receiver:null,
            }
            //消息提醒设置
            this.$http.post('/api/engine/project/audit/add', form).then((res) => {
              this.loading = 0;
              if (res.data.code === 0) {
                
              } else {
                this.$Message.error(res.data.message)
              }
            }).catch((error) => {
              this.loading = 0;
              this.$Message.error(error.message)
            });
          }
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
    saveNoAudit(item) {
      let url = '';
      let msg = '';
      if (this.isEdit) {
        url = '/api/engine/project/update';
        msg = '提交成功';
      } else {
        url = '/api/engine/project/add';
        msg = '提交成功';
      }
      if(this.list.length>0){
        this.formItem.linkMan=JSON.stringify(this.list);
      }
      this.formItem.status=2;
      this.formItem.stockinTime=page.formatDateTime(new Date());
      this.formItem.projectStatus='保护';
      var number = item.intentProject;
      this.formItem.protectionTime=page.formatDate(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * number));
      this.formItem.step='意向';
      this.loading = 1;
      this.$http.post(url, this.formItem).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.saveTrace(res.data.data.id);
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
    saveTrace(projectId) {
      let url = '';
      let msg = '';
      url = '/api/engine/project/trace/add?';
      msg = '添加成功';
      this.loading = 1;
      this.$http.post(url, {traceDate:page.formatDateTime(new Date()),projectId:projectId,traceResult:this.formItem.introduction,creator:this.formItem.operator,creatorName:this.formItem.operatorName}).then((res) => {
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
    //公司名称下拉输入
    changeSel(){
      if(this.isSel){
        this.isSel=false;
        return false;
      }
      var item =this.formItem.name;
      this.selectProject1=[];
      if(item){
        this.selectProject.map((it)=>{
          if(it.name.indexOf(item)!=-1){
            this.selectProject1.push(it)
          }
        })
      }else{
        this.selectProject1=this.selectProject;
      }
    },
    selectSel(val){
      this.isSel=true;
      if(val){
        this.selectProject.map((it)=>{
          if(val==it.name){
            this.oriItem = it;
            this.oriItem.id=null;
            $.extend(this.formItem, this.oriItem);
            if(this.formItem.linkMan){
              this.list = eval(this.formItem.linkMan);
            }
          }
        })
      }
    },
    reset() {
      this.$refs.form.resetFields();
      $.extend(this.formItem, this.oriItem);

    },
    goBack: function () {
      this.$router.push({ path: '/project/myproject' });
      return;
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
.ivu-auto-complete.ivu-select-dropdown{
  max-height:300px;
}
</style>
