<template>
  <Modal
    v-model="show"
    :title="'设置企业等级'"
    :closable="false"
    :mask-closable="false"
    :transfer="false"
  >
    <div class="page">
      <Loading :loading="loading">
        <div class="page-form">
          <Form
            :model="formItem"
            ref="form"
            :label-width="100"
            :rules="ruleValidate"
            class="form-item"
          >
            <FormItem label="企业名称">{{formItem.corpName}}</FormItem>
            <FormItem label="合作企业等级" prop="level">
              <Select v-model="formItem.level" style="width: 180px">
                <Option
                  v-for="item in levelOption"
                  :value="item.code"
                  :key="item.code"
                >{{ item.text }}</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" icon="md-checkmark" @click="save">保存</Button>
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

export default {
  components: {
    Loading,
  },
  data() {
    return {
      loading: 1,
      show: false,
      id: 0,
      levelOption: [
        { code: '认证级', text: '认证级' },
        { code: '标准级', text: '标准级' },
        { code: '核心级', text: '核心级' },
        { code: '战略级', text: '战略级' }],
      //表单对象
      formItem: {
        id: null,
        corpName: '',
        level: ''
      },
      oriItem: {
      },
      //验证
      ruleValidate: {
        level: [
          { required: true, message: '企业等级不能为空' },
        ],
      }
    }
  },
  computed: {
  },
  mounted() {
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
      let url = '/api/engine/enterprise-ecology/corp/setLevel';
      this.loading = 1;
      this.$http.post(url, this.formItem).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.$Message.success('操作成功');
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
    close() {
      this.show = false;
    },
    open(corpObj) {
      this.id = corpObj.id;
      this.loading = 1;
      this.show = true;
      this.$refs['form'].resetFields();

      if (corpObj.id != null && corpObj.id != '') {
        this.$http.post('/api/engine/enterprise-ecology/corp/get', { id: corpObj.id }).then((res) => {
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
        this.isEdit = true;
      } else {
        this.$Message.error('参数有误')
        this.close();
      }
    },
  }
}

</script>

<style type="text/css">
</style>
