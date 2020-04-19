<template>
  <div class="page page-bill pay-edit">
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
        <div class="page-form">
          <Form
            :model="formItem"
            ref="editFormRule"
            :label-width="110"
            :rules="ruleValidate"
            class="form-item"
          >
            <table cellspacing="0" cellpadding="0">
              <colgroup>
                <col width="33%" />
                <col width="auto" />
                <col width="53%" />
              </colgroup>
              <tr>
                <td colspan="3">
                  <FormItem label="支付类别" key="payType">
                    <RadioGroup v-model="formItem.payType">
                      <Radio label="1">
                        <div class="pay-type">
                          <img src="/corp/images/payway/wxpay.png" />
                        </div>
                      </Radio>
                      <Radio label="2">
                        <div class="pay-type">
                          <img src="/corp/images/payway/alipay.jpg" />
                        </div>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <FormItem label="标题" prop="title" key="title">
                    <Input v-model="formItem.title" placeholder="不超过250个字符" />
                  </FormItem>
                </td>
                <td></td>
              </tr>
              <template v-if="iswx()">
                <tr>
                  <td colspan="2">
                    <FormItem label="商户号" prop="wxMchId" key="wxMchId">
                      <Input v-model="formItem.wxMchId" placeholder="微信支付->账户中心->商户信息->商户号" />
                    </FormItem>
                  </td>
                  <td>
                    <div class="ivu-form-item prompt">微信支付->账户中心->商户信息->商户号</div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <FormItem label="密钥" prop="wxMchKey" key="wxMchKey">
                      <Input v-model="formItem.wxMchKey" placeholder="微信支付->账户中心->API安全->API密钥" />
                    </FormItem>
                  </td>
                  <td>
                    <div class="ivu-form-item prompt">微信支付->账户中心->API安全->API密钥</div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <FormItem label="APPID" prop="wxAppId" key="wxAppId">
                      <Input v-model="formItem.wxAppId" placeholder="微信支付->产品中心->APPID授权管理->已关联账号" />
                    </FormItem>
                  </td>
                  <td>
                    <div class="ivu-form-item prompt">微信支付->产品中心->APPID授权管理->已关联账号</div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <FormItem label="APP密钥" key="wxAppSecret">
                      <Input v-model="formItem.wxAppSecret" placeholder="APP密钥" />
                    </FormItem>
                  </td>
                  <td>
                    <div class="ivu-form-item prompt">在微信浏览器内支付时需要</div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <FormItem label="域名验证文件" key="wxMpVerify">
                      <Input v-model="formItem.wxMpVerify" placeholder />
                    </FormItem>
                  </td>
                  <td class="prompt">请将网页授权域名验证文件内容填入，如 MP_verify_abc.txt</td>
                </tr>
                <tr>
                  <td colspan="2">
                    <FormItem label="网页授权域名" key="wxMpDomain">
                      <Input v-model="formItem.wxMpDomain" placeholder="doman.com/corp/pay" />
                    </FormItem>
                  </td>
                  <td class="prompt">
                    请将
                    <span style="color:#ff9900;">{{formItem.wxMpDomain}}</span> 填入网页授权域名（这一步操作需要在填入验证文件保存后，微信页面设置才会有效）
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="2">
                    <FormItem label="支付宝网关" prop="alipayUrl" key="alipayUrl">
                      <Input v-model="formItem.alipayUrl" placeholder="支付宝网关" />
                    </FormItem>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td colspan="2">
                    <FormItem label="APPID" prop="alipayAppId" key="alipayAppId">
                      <Input v-model="formItem.alipayAppId" placeholder="APPID" />
                    </FormItem>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td colspan="2">
                    <FormItem label="应用私钥" prop="alipayPrivateKey" key="alipayPrivateKey">
                      <Input
                        type="textarea"
                        :rows="2"
                        v-model="formItem.alipayPrivateKey"
                        placeholder="应用私钥"
                      />
                    </FormItem>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td colspan="2">
                    <FormItem label="支付宝公钥" prop="alipayPublicKey" key="alipayPublicKey">
                      <Input
                        type="textarea"
                        :rows="4"
                        v-model="formItem.alipayPublicKey"
                        placeholder="支付宝公钥"
                      />
                    </FormItem>
                  </td>
                  <td></td>
                </tr>
              </template>
              <tr>
                <td colspan="2">
                  <FormItem label="回调地址" prop="payNotify" key="payNotify">
                    <Input v-model="formItem.payNotify" placeholder="回调地址" />
                  </FormItem>
                </td>
                <td></td>
              </tr>
              <tr>
                <td colspan="2">
                  <FormItem label="测试">
                    <Button @click="doTestConfig" type="info">测试配置</Button>
                  </FormItem>
                </td>
                <td></td>
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
      </div>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import page from '@/assets/js/page';
export default {
  components: {
    Loading, LayoutHor,
  },
  data() {
    var wxKeyContentVali = (rule, value, callback) => {
      if (!value && this.isEdit == 0) {
        return callback(new Error('请导入证书'));
      } else {
        callback()
      }
    }
    return {
      loading: 0,
      payId: 0,
      //是否编辑 0 添加 1 编辑
      isEdit: 0,
      //表单对象
      formItem: {
        title: '',//标题
        payId: 0,//
        payType: '1',//
        payNo: '',//
        wxAppId: '',//
        wxMchId: '',//
        wxMchKey: '',//
        wxKeyContent: '',//  
        wxAppSecret: '',//
        alipayUrl: '',//支付宝网关
        alipayAppId: '',//支付宝应用编号 
        alipayPrivateKey: '',//支付宝私钥
        alipayPublicKey: '',//支付宝公钥
        status: 1,
        image: '/corp/images/payway/wxpay.png',//
        payNotify: '',//支付平台回调地址（协议+域名）
        wxMpVerify: '',//域名验证文件
        wxMpDomain: 'doman.com/corp/pay',//网页授权域名
      },
      file: null,
      oriItem: {
      },
      //初始加载所有验证
      ruleValidate: {
        payNo: [
          { required: true, whitespace: true, message: '支付商户号不能为空', trigger: 'blur' },
          { type: 'string', max: 100, message: '不能超过100个字', trigger: 'blur' }
        ],
        title: [
          { required: true, whitespace: true, message: '标题不能为空', trigger: 'blur' },
          { type: 'string', max: 250, message: '不能超过250个字', trigger: 'blur' }
        ],
        payNotify: [
          { required: true, whitespace: true, message: '回调地址不能为空', trigger: 'blur' }
        ],
        wxMchId: [
          { required: true, whitespace: true, message: '商户号不能为空', trigger: 'blur' }
        ],
        wxMchKey: [
          { required: true, whitespace: true, message: '密钥不能为空', trigger: 'blur' }
        ],
        wxAppId: [
          { required: true, whitespace: true, message: 'APPID不能为空', trigger: 'blur' }
        ],
        // wxKeyContent: [
        //   { required: true, validator: wxKeyContentVali, trigger: 'blur' }
        // ], 
        alipayUrl: [
          { required: true, whitespace: true, message: '支付宝网关不能为空', trigger: 'blur' }
        ],
        alipayAppId: [
          { required: true, whitespace: true, message: 'APPID不能为空', trigger: 'blur' }
        ],
        alipayPrivateKey: [
          { required: true, whitespace: true, message: '支付宝私钥不能为空', trigger: 'blur' }
        ],
        alipayPublicKey: [
          { required: true, whitespace: true, message: '支付宝公钥不能为空', trigger: 'blur' }
        ],
      },
    }
  },
  computed: {
    pageTitle() {
      if (this.isEdit === 0) {
        return "添加支付账号";
      } else {
        return "编辑支付账号";
      }
    },
  },
  watch: {
    'formItem.payType'(curVal, oldVal) {
      switch (curVal) {
        case '1':
          this.formItem.image = '/corp/images/payway/wxpay.png';
          break;
        case '2':
          this.formItem.image = '/corp/images/payway/alipay.jpg';
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    this.payId = this.$route.query.id;
    if (this.payId) {
      this.isEdit = 1;
      this.get(this.payId);
    } else {
      this.isEdit = 0;
      this.oriItem = {
        title: '',//标题
        payId: 0,//
        payType: '1',//
        payNo: '',//
        wxAppId: '',//
        wxMchId: '',//
        wxMchKey: '',//
        wxKeyContent: '',//
        wxAppSecret: '',//
        alipayUrl: '',//支付宝网关
        alipayAppId: '',//支付宝应用编号 
        alipayPrivateKey: '',//支付宝私钥
        alipayPublicKey: '',//支付宝公钥
        status: 1,
        image: '/corp/images/payway/wxpay.png',//
        payNotify: '',//支付平台回调地址（协议+域名）
        wxMpVerify: '',//域名验证文件
        wxMpDomain: 'doman.com/corp/pay',//网页授权域名
      }
    }
  },
  methods: {
    iswx() {
      return this.formItem.payType == "1";
    },
    save() {
      var that = this;
      this.$refs['editFormRule'].validate((valid) => {
        if (valid) {
          this.saveItem(function (msg) {
            that.$Message.success(msg);
            that.goBack();
          });
        } else {
          return;
        }
      });
    },
    saveItem(callback) {
      let url = '';
      let msg = '';
      if (this.isEdit === 0) {
        url = '/api/engine/pay/add';
        msg = '添加成功';
      } else {
        url = '/api/engine/pay/update';
        msg = '修改成功';
      }
      this.loading = 1;
      if (this.iswx()) {//微信 下 支付商户号  == 商户号 
        this.formItem.payNo = this.formItem.wxMchId;//
      } else {//支付 下 支付商户号  == 支付宝APPID 
        this.formItem.payNo = this.formItem.alipayAppId
      }

      this.$http.post(url, this.formItem).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          //保存成功赋值 payId   
          //测试配置 操作需要payId
          this.isEdit = true;
          this.formItem.payId = res.data.data.payId;
          this.payId = this.formItem.payId;
          callback(msg);
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    get(id) {
      var that = this;
      this.loading = 1;
      this.$http.post('/api/engine/pay/get', { 'payId': id }).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          Object.assign(this.formItem, res.data.data);
          this.formItem.payType = this.formItem.payType.toString();
          this.oriItem = eval('(' + JSON.stringify(this.formItem) + ')');
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    reset() {
      this.$refs.editFormRule.resetFields();
      $.extend(this.formItem, this.oriItem);
    },
    goBack() {
      this.$router.go(-1);
    },
    sendTest() {
      this.loading = 1;
      this.$http.post('/api/engine/pay/testConfig ', { "payId": this.payId }).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.$Notice.success({
            title: res.data.data
          });
        } else {
          this.$Notice.error({
            title: '链接失败',
            desc: res.data.message
          });
        }
      }).catch((error) => {
        this.$Message.error(error.toString())
      });
    },
    doTestConfig() {
      var that = this;
      this.$refs['editFormRule'].validate((valid) => {
        if (valid) {
          this.saveItem(function () {
            that.sendTest();
          });
        } else {
          return;
        }
      });
    },
    doDel() {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>删除后不能恢复，确定删除该条记录吗？</p>',
        onOk: () => {
          this.$http.post('/api/engine/pay/delete', { payId: this.payId }).then((res) => {
            if (res.data.code === 0) {
              this.$Message.success("删除成功");
              this.goBack();
            } else {
              this.$Message.error(res.data.message)
            }
          }).catch((error) => {
            this.$Message.error(error.toString())
          });
        }
      });
    },
    handleUpload(file) {
      var that = this;
      this.loading = 1;
      this.fileByBase64(file, function (result) {
        that.loading = 0;
        that.formItem.wxKeyContent = result.split(',')[1];
      });
      return false;
    },
    fileByBase64(file, callback) {
      var reader = new FileReader();
      // 传入一个参数对象即可得到基于该参数对象的文本内容
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        // target.result 该属性表示目标对象的DataURL
        //console.log(e.target.result);
        callback(e.target.result)
      };
    }
  }
} 
</script> 
<style>
.pay-edit .pay-type {
  border: 1px solid #efefef;
  margin: 0 10px;
  text-align: center;
  float: right;
  padding-top: 5px;
}
.pay-edit .prompt {
  color: #80848f;
}
</style>