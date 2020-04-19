<template>
  <div class="page page-bill tenant-edit">
    <div class="page-bar">
      <LayoutHor>
        <div slot="left">
          <Button size="small" @click="goBack" icon="ios-arrow-back" type="warning">返回</Button>
        </div>
        <div class="page-bar-title">{{pageTitle}}</div>
        <div slot="right">
          <Button size="small" @click="doDel" v-if="isEdit" icon="trash-a" type="error">删除</Button>
        </div>
      </LayoutHor>
    </div>
    <Loading :loading="loading">
      <div class="baseinfo">
        <div class="page-tools"></div>
        <Form
          ref="form"
          class="page-form"
          @submit.native.prevent
          :model="formItem"
          :rules="formRules"
          :label-width="120"
        >
          <table cellspacing="0" cellpadding="0">
            <colgroup>
              <col width="33%" />
              <col width="auto" />
              <col width="33%" />
            </colgroup>
            <tr>
              <td>
                <FormItem label="租户名称" prop="tenantName">
                  <Input v-model="formItem.tenantName" placeholder :maxlength="100" />
                </FormItem>
              </td>
              <td colspan="2">
                <FormItem label="租户AppKey">{{formItem.appKey}}</FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem label="租户密钥" prop>
                  <Input
                    type="textarea"
                    :rows="2"
                    v-model="formItem.appSecret"
                    placeholder
                    :maxlength="100"
                  />
                  <Button type="info" @click="createSecret">生成秘钥</Button>
                </FormItem>
              </td>
              <td style="color:#ccc;">租户密钥</td>
            </tr>
            <!-- <tr>
              <td colspan="2">
                <FormItem label="白名单">
                  <Input
                    type="textarea"
                    :rows="2"
                    v-model="formItem.whiteList"
                    placeholder
                    :maxlength="500"
                  />
                </FormItem>
              </td>
              <td style="color:#ccc;">白名单</td>
            </tr>-->
            <tr>
              <td colspan="3">
                <FormItem label="描述">
                  <Input type="textarea" :rows="2" v-model="formItem.description" />
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <FormItem prop="providerCode" label="分配权限">
                  <CheckboxGroup v-model="formItem.payIds">
                    <Checkbox
                      class="check-item"
                      v-for="item in payList"
                      :label="item.payId"
                      :key="item.payId"
                    >
                      <div class="pay-type">
                        <img :src="item.image" />
                        <div>{{item.title}}</div>
                      </div>
                    </Checkbox>
                  </CheckboxGroup>
                </FormItem>
              </td>
            </tr>
          </table>
        </Form>
      </div>
      <table class="savebar" cellpadding="0" cellspacing="0">
        <tr>
          <td class="save" @click="save">保存</td>
          <td class="reset" @click="reset">重置</td>
          <td></td>
        </tr>
      </table>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import pagejs from '@/assets/js/page';
export default {
  components: {
    Loading,
    LayoutHor
  },
  data() {
    return {
      loading: 0,
      show: false,
      //是否编辑 0 添加 1 编辑
      isEdit: false,
      tenantId: 0,
      //表单对象
      formItem: {
        tenantId: 0,//编号	 			 
        tenantName: '',//名称	
        appKey: '系统生成',//租户识别号	
        appSecret: '',//租户密钥	
        description: '',//描述	
        whiteList: '',//白名单IP 
        status: 1,//状态（1.正常 2.禁用）
        payIds: []
      },
      oriItem: {
      },
      payList: [],
      //验证
      formRules: {
        tenantName: [
          { required: true, whitespace: true, message: '租户名称不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    pageTitle() {
      if (this.isEdit) {
        return "编辑租户信息";
      } else {
        return "添加租户信息";
      }
    },
  },
  mounted() {
    this.queryPayList();
    this.tenantId = this.$route.query.id;
    if (this.tenantId) {
      this.isEdit = 1;
      this.load();
    } else {
      this.isEdit = 0;
      this.oriItem = {
        tenantId: 0,//编号	 			 
        tenantName: '',//名称	
        appKey: '系统生成',//租户识别号	
        appSecret: '',//租户密钥	
        description: '',//描述	
        whiteList: '',//白名单IP 
        status: 1,//状态（1.正常 2.禁用）
        payIds: []
      }
    }
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
        url = '/api/engine/tenant/update';
        msg = '修改成功';
      } else {
        url = '/api/engine/tenant/add';
        msg = '添加成功';
      }
      this.loading = 1;
      this.$http.post(url, this.formItem).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.$Message.success("操作成功！");
          this.goBack();
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    load() {
      this.loading = 1;
      this.$http.post("/api/engine/tenant/get", { tenantId: this.tenantId }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);
          } else {
            this.$Message.error('信息不存在！');
            this.goBack();
          }
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("操作失败！")
      });
    },
    reset() {
      this.$refs.form.resetFields();
      $.extend(this.formItem, this.oriItem);
    },
    queryPayList() {
      this.loading = 1;
      this.$http.post("/api/engine/pay/list", {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            this.payList = res.data.data.rows;
            console.log(this.payList);
          }
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("操作失败！")
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    doDel() {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>删除后不能恢复，确定删除该条记录吗？</p>',
        onOk: () => {
          this.loading = 1;
          this.$http.post('/api/engine/tenant/delete?tenantId=' + this.tenantId, {}).then((res) => {
            this.loading = 0;
            if (res.data.code === 0) {
              this.$Message.success("操作成功！");
              this.goBack();
            } else {
              this.$Message.error(res.data.message)
            }
          }).catch((error) => {
            this.loading = 0;
            this.$Message.error(error.toString())
          });
        }
      });
    },
    createSecret() {
      this.formItem.appSecret = this.uuid();
    },
    uuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "";

      var uuid = s.join("");
      return uuid;
    }
  }
} 
</script>  
<style>
.tenant-edit .pay-type {
  border: 1px solid #efefef;
  min-width: 180px;
  margin-left: 10px;
  text-align: center;
  float: right;
  padding: 10px 20px;
}
.tenant-edit .check-item {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>