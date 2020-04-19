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
            <FormItem label="企业名称">
              <Input v-model="formItem.corpName" placeholder="企业名称" disabled/>
            </FormItem>
            <FormItem label="原生态管理员">
              <Input v-model="formItem.managerName" placeholder="原生态管理员" disabled/>
            </FormItem>
            <FormItem label="新生态管理员" prop="managerNew">
              <Input v-model="formItem.managerNewName" placeholder="新生态管理员" readonly icon="md-search" @on-click="SelectMember"/>
            </FormItem>
            <br/>
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
        corpName: '',
        manager: '',
        managerNew: null,
        managerNewName:null,
      },
      oriItem: {
      },
      //验证
      ruleValidate: {
        managerNew: [
          { required: true, message: '新生态管理员不能为空' },
        ],
      }
    }
  },
  computed: {
    title() {
      return "更换生态管理员";
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
            this.formItem.managerNew = data.id;
            this.formItem.managerNewName = data.trueName;
          }
        }
      });
    },
    save() {
      if(this.formItem.managerName == this.formItem.managerNewName){
        this.$Message.error("新生态管理员不能与原生态管理员一样!");
        return;
      }
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
        url = '/api/engine/enterprise-ecology/corp/edit';
        msg = '修改成功';
      }
      this.loading = 1;
      this.formItem.manager = this.formItem.managerNew;
      this.$http.post(url, this.formItem).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.$Message.success(msg);
          this.close();
          this.$emit("on-save");
          this.formItem.managerNewName = "";
          this.formItem.managerNew = null;
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    open(ecologyType) {
      this.id = ecologyType.id;
      this.loading = 1;
      this.show = true;
      this.$refs['form'].resetFields();
      
      if (ecologyType.id != null && ecologyType.id != '') {
        this.$http.post('/api/engine/enterprise-ecology/corp/get', ecologyType).then((res) => {
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
        Object.assign(this.oriItem, {
          id: null,
          name: '',
          tags: '',
          parentId: null,
        });
        Object.assign(this.formItem, this.oriItem);
        this.loading = 0;
        if (ecologyType.parentId != null && ecologyType.parentId != '') {
          this.formItem.parentId = ecologyType.parentId;
          this.oriItem.parentId = ecologyType.parentId;
        } else {
          this.formItem.parentId = 0;
          this.oriItem.parentId = 0;
        }
        this.isEdit = false;
      }
    },
    close() {
      this.show = false;
    },
    openUser(){
      this.$refs.SelectMember.open({});
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
