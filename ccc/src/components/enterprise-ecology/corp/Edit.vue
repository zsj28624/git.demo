<template>
  <div class="page page-bill page-bill-max">
    <CorpTabs tabvalue="jbxx" :corpId="corpId"></CorpTabs>
    <Loading :loading="loading">
      <div class="page-form">
        <Form
          :model="formItem"
          ref="form"
          :label-width="150"
          :rules="ruleValidate"
          class="form-item"
        >
          <table cellspacing="0" cellpadding="0">
            <colgroup>
              <col width="33%" />
              <col width="auto" />
              <col width="33%" />
            </colgroup>
            <tr>
              <td>
                <FormItem label="生态企业编号" prop="corpNo">
                  <Input v-model="formItem.corpNo" placeholder disabled/>
                </FormItem>
              </td>
              <td>
                <FormItem label="生态企业名称" prop="corpName">
                  <Input v-model="formItem.corpName" placeholder />
                </FormItem>
              </td>
              <td>
                <FormItem label="企业法人信息" prop="corporation">
                  <Input v-model="formItem.corporation" placeholder />
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="生态企业对接人" prop="contactName">
                  <Input v-model="formItem.contactName" placeholder />
                </FormItem>
              </td>
              <td>
                <FormItem label="对接人职位" prop="contactPosition">
                  <Input v-model="formItem.contactPosition" placeholder />
                </FormItem>
              </td>
              <td>
                <FormItem label="对接人联系电话" prop="contactPhone">
                  <Input v-model="formItem.contactPhone" placeholder />
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="对接人微信" prop="contactWechat">
                  <Input v-model="formItem.contactWechat" placeholder />
                </FormItem>
              </td>
              <td>
                <FormItem label="对接人邮箱" prop="contactEmail">
                  <Input v-model="formItem.contactEmail" placeholder />
                </FormItem>
              </td>
              <td>
                <FormItem label="注册资金(万元)" prop="registeredCapital">
                  <Input v-model="formItem.registeredCapital" placeholder />
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="公司规模" prop="companySize">
                  <Select v-model="formItem.companySize">
                    <Option
                      v-for="item in companySize"
                      :value="item.argCode"
                      :key="item.argCode"
                    >{{ item.argText }}</Option>
                  </Select>
                </FormItem>
              </td>
              <td>
                <FormItem label="年销售额" prop="usd">
                  <Select v-model="formItem.usd">
                    <Option
                      v-for="item in usd"
                      :value="item.argCode"
                      :key="item.argCode"
                    >{{ item.argText }}</Option>
                  </Select>
                </FormItem>
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem label="企业官网" prop="website">
                  <Input v-model="formItem.website" placeholder />
                </FormItem>
              </td>
              <td></td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem label="企业所属地域" prop="district">
                  <SelArea v-model="formItem.district" style="width:100%"></SelArea>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <FormItem label="企业简介" prop="profile">
                  <Input
                    v-model="formItem.profile"
                    type="textarea"
                    :autosize="{minRows: 2,maxRows: 5}"
                    placeholder
                  />
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="生态管理员" prop="manager">
                  <Input v-model="formItem.managerName" icon="md-search" @on-click="SelectMember" readonly/>
                </FormItem>
              </td>
              <td>
                <FormItem label="生态管理员手机号" prop="managerPhone">
                  <Input v-model="formItem.managerPhone" placeholder />
                </FormItem>
              </td>
              <td></td>
            </tr> 
            <tr>
              <td colspan="2">
                <FormItem>
                  <table class="savebar" cellpadding="0" cellspacing="0">
                    <tr> 
                      <Button type="primary" icon="md-checkmark" @click="save">保存</Button>
                      <Button  @click="reset" style="margin-left: 8px">重置</Button>
                    </tr>
                  </table>
                </FormItem>
              </td>
            </tr>
          </table>  
        </Form> 
      </div>
      
      <SelectMember ref="SelectMember"></SelectMember>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import CorpTabs from '@/components/enterprise-ecology/corp/Tabs';
import SelArea from '@/components/enterprise-ecology/selarea/index';
import SelectMember from '@/components/contacts/SelectMember';
import page from '@/assets/js/page';

export default {
  components: {
    Loading, LayoutHor, CorpTabs ,SelArea ,SelectMember ,page
  },
  data() {
    return {
      loading: 0,
      show: false,
      isEdit: false,
      isTwo: true,
      parentId: 0,
      companySize: [],
      usd: [],
      corpId: 0,
      enterpriseLevel: [],

      //表单对象
      formItem: {
        id: null,
        corpNo:null,
        corpName: "",
        corporation: "",
        contactName: "",
        contactPosition: "",
        contactPhone: "",
        contactWechat: "",
        contactEmail: "",
        registeredCapital: "",
        companySize: "",
        usd: "",
        website: "",
        district: "",
        profile: "",
        manager: this.$user.userId,
        managerName: this.$user.trueName,
        managerPhone: "",
        enterpriseLevel: "",
      },
      oriItem: {
        id: null,
        corpNo:null,
        corpName: "",
        corporation: "",
        contactName: "",
        contactPosition: "",
        contactPhone: "",
        contactWechat: "",
        contactEmail: "",
        registeredCapital: "",
        companySize: "",
        usd: "",
        website: "",
        district: "",
        profile: "",
        manager: this.$user.userId,
        managerName: this.$user.trueName,
        managerPhone: "",
        enterpriseLevel: "",
      },
      //验证
      ruleValidate: {
        corpName: [
          { required: true, message: '生态企业名称不能为空' },
        ],
        corporation: [
          { required: true, message: '企业法人信息不能为空' },
        ],
        contactName: [
          { required: true, message: '生态企业对接人不能为空' },
        ],
        contactPosition: [
          { required: true, message: '对接人职位不能为空' },
        ],
        contactPhone: [
          { required: true, message: '对接人联系电话不能为空' },
        ],
        companySize: [
          { required: true, message: '公司规模不能为空' },
        ],
        usd: [
          { required: true, message: '年销售额不能为空' },
        ],
        district: [
          { required: true, message: '企业所属地域不能为空' },
        ],
        profile: [
          { required: true, message: '企业简介不能为空' },
        ],
      }
    }
  },
  computed: {
    pageTitle() {
      if (this.isEdit) {
        return "编辑企业客户";
      } else {
        return "添加企业客户";
      }
    },
  },
  mounted() {
    this.corpId = this.$route.query.corpId;
    if (this.corpId) {
      this.corpId = parseInt(this.corpId);
      this.isEdit = true;
      this.formItem.id = this.corpId;
      this.getCorpInfo();
    }

    /*this.queryArg("company_size");
    this.queryArg("usd");
    this.queryArg("enterprise_level");*/
    this.companySize = page.$args.getArgGroup("company_size");
    this.usd = page.$args.getArgGroup("usd");
    this.enterpriseLevel = page.$args.getArgGroup("enterprise_level");
  },
  methods: {
    SelectMember(row) {
      var sel = this.$refs.SelectMember;//引用该控件，赋值给变量对象
      sel.show({
        ok: (data) => {
          if (data) {
            this.formItem.manager = data.id;
            this.formItem.managerName = data.trueName;
            this.formItem.managerPhone = data.mobile;
          }
        }
      });
    },
    queryArg(argGroup) {
      this.$http.post('/api/engine/arg/list?', { argGroup: argGroup }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          if (argGroup == "company_size") {
            this.companySize = res.data.data;
          } else if (argGroup == "usd") {
            this.usd = res.data.data;
          } else if (argGroup == "enterprise_level") {
            this.enterpriseLevel = res.data.data;
          }
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    getCorpInfo() {
      this.$http.post('/api/engine/enterprise-ecology/corp/get', { id: this.corpId }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          this.oriItem = res.data.data;
          $.extend(this.formItem, this.oriItem);
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
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
        url = '/api/engine/enterprise-ecology/corp/edit?';
        msg = '修改成功';
      } else {
        url = '/api/engine/enterprise-ecology/corp/add?';
        msg = '添加成功';
      }
      this.loading = 1;
      this.$http.post(url, this.formItem).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.$Message.success(msg);
          //this.close();
          //this.$emit("on-save");
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
