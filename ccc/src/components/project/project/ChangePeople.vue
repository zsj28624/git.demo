<template>
  <Modal v-model="show" :title="title" :closable="false" :mask-closable="false" :transfer="false">
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
            <div class="form-sub-title">
              <Icon type="compose"></Icon>
              {{title}}
            </div>
            <FormItem label="项目名称">
              <Input v-model="formItem.name" placeholder="项目名称" readonly/>
            </FormItem>
            <FormItem label="原负责人">
              <Input v-model="formItem.operatorName" placeholder="原负责人" readonly/>
            </FormItem>
            <FormItem label="新负责人" prop="newOperatorName">
              <Input v-model="formItem.newOperatorName" placeholder="新负责人" icon="md-search" @on-click="SelectMember" readonly/>
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
    <SelectMember ref="SelectMember"></SelectMember>
  </Modal>
</template>
<script>
import Loading from '@/components/loading';
import SelectMember from '@/components/contacts/SelectMember'
import page from '@/assets/js/page';

export default {
  components: {
    Loading,
    SelectMember,
  },
  data() {
    return {
      loading: 1,
      show: false,
      isEdit: true,
      isTwo:true,
      parentId: 0,

      //表单对象
      formItem: {
        id: null,
        name: '',
        operator:null,
        operatorName:'',
        newOperator:null,
        newOperatorName: '',
      },
      oriItem: {
      },
      //验证
      ruleValidate: {
        newOperatorName: [
          { required: true, message: '新负责人不能为空' },
        ],
      }
    }
  },
  computed: {
    title() {
      return "变更负责人";
    },
  },
  mounted() {
  },
  methods: {
    SelectMember(row) {
      var sel = this.$refs.SelectMember;//引用该控件，赋值给变量对象
      sel.show({
        ok: (data) => {
          if (data) {
            this.formItem.newOperator = data.id;
            this.formItem.newOperatorName = data.trueName;
          }
        }
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
        url = '/api/engine/project/update';
        msg = '分配成功';
      }
      this.loading = 1;
      this.formItem.operator = this.formItem.newOperator;
      this.formItem.projectStatus="保护";
      this.formItem.protectionTime=page.formatDate(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 60));
      this.$http.post(url, this.formItem).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.$Message.success(msg);
          this.close();
          this.$emit("on-save");
          if (this.formItem.newOperator) {
          this.$http.post('/api/engine/message/add', {module:"项目信息库",content:"您收到一条新的项目:"+this.formItem.name,link:"/project/myproject",receiver:this.formItem.newOperator}).then((res) => {
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
          this.formItem.newOperatorName = "";
          this.formItem.newOperator = null;
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    open(project) {
      this.loading = 1;
      this.show = true;
      this.$refs['form'].resetFields();
      this.oriItem=project;
      Object.assign(this.formItem, this.oriItem);
      this.loading = 0;
    },
    close() {
      this.show = false;
    },
  },
    
}

</script>

<style type="text/css">
.form-sub-title {
  font-size: 14px;
  margin: 0 0 12px 18px;
  color: #2b85e4;
}
</style>
