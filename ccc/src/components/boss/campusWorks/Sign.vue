<template>
  <div class="page page-bill page-bill-max">
    <div class="page-bar">
      <LayoutHor>
        <div slot="left">
          <Button size="small" @click="goBack" icon="ios-arrow-back" type="warning">返回</Button>
        </div>
        <div class="page-bar-title">项目签约</div>
      </LayoutHor>
    </div>
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
          <table cellspacing="0" cellpadding="0" style="width:80%;">
            <colgroup>
              <col width="33%" />
              <col width="auto" />
              <col width="36%" />
            </colgroup>
            <tr>
              <td>
                <FormItem label="公司全称" prop="name">
                  <Select v-model="formItem.name" style="width:100%;" filterable @on-change="changeName" >
                    <Option v-for="item in selectProject" :value="item.name" :key="item.name">{{ item.name }}</Option>
                  </Select>
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
          <hr style="width:70%;" />
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
          <Button type="info" size="large" @click="sumbit" style="margin-left: 15px;">提交申请</Button>
          <Button  size="large" @click="goBack" style="margin-left: 15px;">取消</Button>
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
      isEdit: false,
      isView: false,
      projectId:null,
      campus: [],
      build: [],
      room: [],
      source:'',//来源页面

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
      selectProject:[],
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
        name: [
          {required: true, message: '公司名称不能为空', tigger:'change'},
        ],
      }
    }
  },
  computed: {
  },
  mounted() {
    this.$refs['form'].resetFields();
    this.getMyProject();
  },
  methods: {
    getMyProject() {
      this.$http.post('/api/engine/project/listAll', { operator: this.$user.userId,step:'重点项目',}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 ) {
          if(res.data.data.total>0){
            this.selectProject = res.data.data.rows;
          }
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    changeName(item){
      if(item){
        this.selectProject.map((it)=>{
          if(item==it.name){
            this.oriItem = it;
            this.oriItem.relStep='正式签约';
            $.extend(this.formItem, this.oriItem);
            if(this.formItem.linkMan){
              this.list = eval(this.formItem.linkMan);
            }
          }
        })
      }
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.saveItem("保存");
        } else {
          return;
        }
      });
    },
    sumbit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.saveItem("提交");
        } else {
          return;
        }
      });
    },
    saveItem(text) {
      let url = '';
      let msg = '';
      url = '/api/engine/project/update';
      msg = '提交成功';
      if(text=="提交"){
        this.formItem.status=1;
      }
      this.loading = 1;
      this.$http.post(url, this.formItem).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          if(text=="提交"){
            var projectId =this.formItem.id;
            var form = {
              projectId : projectId,
              applyType : '申请签约',
              applyPeople : this.$user.userId,
              applyPeopleName : this.$user.trueName,
              status : 1,
              module:"我的项目", //消息提醒设置
              content:"您有一条"+this.formItem.name+"签约项目申请需要审核",
              link:"/project/audit",
              powerKey:"spzx.cyyywsp.audit",
              receiver:null,
            }
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
    reset() {
      this.$refs.form.resetFields();
      $.extend(this.formItem, this.oriItem);

    },
    goBack() {
      this.$router.go(-1);
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
