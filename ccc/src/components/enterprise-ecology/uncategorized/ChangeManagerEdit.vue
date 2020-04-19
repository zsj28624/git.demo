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
            <FormItem label="新生态管理员" prop="managerNew">
              <Input v-model="formItem.managerNewName" placeholder="新生态管理员" icon="md-search" @on-click="SelectMember"/>
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
      ecologyTypeList: [],
      signList : 0,
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
      return "分配生态管理员";
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
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if(this.signList == 1){
            this.saveItemList();
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
        url = '/api/engine/enterprise-ecology/corp/editmanager';
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
    saveItemList() {
      let url = '';
      let msg = '';
      if (this.isEdit) {
        url = '/api/engine/enterprise-ecology/corp/editmanager';
        msg = '修改成功';
      }
      this.loading = 1;
      this.formItem.manager = this.formItem.managerNew;
      var ecologyTypeList = this.ecologyTypeList;
      
      for(var i = 0;i < ecologyTypeList.length;i++){
        var formItem = ecologyTypeList[i];
        formItem.manager = this.formItem.manager;

        this.$http.post(url, formItem).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            this.$emit("on-save");
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
      }
      this.formItem.managerNewName = "";
      this.formItem.managerNew = null;
      this.ecologyTypeList = [];
      this.$Message.success(msg);
      this.close();
      this.$emit("on-save");
    },
    openList(ecologyType){
      this.loading = 1;
      this.show = true;
      this.$refs['form'].resetFields();
      this.signList = 1;

      for(var i = 0;i < ecologyType.length;i++){
        this.$http.post('/api/engine/enterprise-ecology/corp/get', {id:ecologyType[i].id}).then((res) => {
          this.loading = 0;

          if (res.data.code == 0 && res.data.data != null) {
            this.ecologyTypeList.push(res.data.data);
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
        this.isEdit = true;
      }
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
