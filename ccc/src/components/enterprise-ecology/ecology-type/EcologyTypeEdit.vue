<template>
  <Modal v-model="show" :title="title" :closable="false" :mask-closable="false">
    <div class="page">
      <Loading :loading="loading">
        <div class="page-form">
          <Form
            :model="formItem"
            ref="form"
            :label-width="50"
            :rules="ruleValidate"
            class="form-item"
          >
            <!--<div class="form-sub-title">
              <Icon type="compose"></Icon>
              {{title}}
            </div>
            <FormItem label="生态分类ID" prop="id">
              <InputNumber
                :max="999999"
                :min="0"
                v-model="formItem.id"
                :disabled="this.isEdit"
              ></InputNumber>
            </FormItem>-->
            <FormItem label="名称" prop="name">
              <Input v-model="formItem.name" placeholder="生态分类名称" style="width:400px;"/>
            </FormItem>
            <FormItem label="标签" prop="tags">
              <!--<Input v-model="formItem.tags" placeholder="生态分类标签"/>-->
              <Input v-model="formItem.tags" type="textarea" :autosize="{minRows: 3,maxRows: 5}" style="width:400px;"/>
            </FormItem>
            <FormItem label="排序" prop="seq">
              <InputNumber :max="999999" :min="0" v-model="formItem.seq" style="width:400px;"></InputNumber>
            </FormItem>
            <div>
              <FormItem>
                <Button type="primary" icon="md-checkmark" @click="save">保存</Button>
                <Button  @click="reset" style="margin-left: 8px">重置</Button>
                <Button  @click="close" style="margin-left: 8px">取消</Button>
              </FormItem>
            </div>
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
      isEdit: true,
      isTwo:true,
      parentId: 0,

      //表单对象
      formItem: {
        id: null,
        name: '',
        tags: '',
        parentId: null,
        seq: 0,
      },
      oriItem: {
      },
      //验证
      ruleValidate: {
        id: [
          { required: true, message: '生态分类ID不能为空' },
        ],
        name: [
          { required: true, message: '生态分类名称不能为空' },
          { type: 'string', max: 20, message: '不能超过20个字', trigger: 'blur'}
        ],
        /*tags: [
          { required: true, message: '标签不能为空' },
        ],*/
        parentId: [
          { required: true, message: '父级ID不能为空' },
        ],
      }
    }
  },
  computed: {
    title() {
      if (this.isEdit) {
        if(this.parentId == 0){
          return"编辑一级生态分类";
        }else{
          return"编辑二级生态分类";
        }
        return "编辑生态分类";
      } else {
        /*if(this.parentId == 0){
          return"新建一级生态分类";
        }else{
          return"新建二级生态分类";
        }*/
        return "新建生态分类";
      }
    },
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
      if (this.formItem.id == this.formItem.parentId) {
        this.$Message.error('生态分类ID和父级ID不能相同!');
        return;
      }
      let url = '';
      let msg = '';
      if (this.isEdit) {
        url = '/api/engine/enterprise-ecology/ecology-type/edit?';
        msg = '修改成功';
      } else {
        url = '/api/engine/enterprise-ecology/ecology-type/add?';
        msg = '添加成功';
      }
      this.loading = 1;
      this.$http.post(url, this.formItem).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.$Message.success(msg);
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
    open(ecologyType) {
      this.parentId = ecologyType.parentId;
      this.loading = 1;
      this.show = true;
      this.$refs['form'].resetFields();
      
      if (ecologyType.id != null && ecologyType.id != '') {
        this.$http.post('/api/engine/enterprise-ecology/ecology-type/get?', ecologyType).then((res) => {
          this.loading = 0;

          if (res.data.code == 0 && res.data.data != null) {
            this.oriItem = res.data.data[0];
            if(ecologyType.isTwo){
              this.oriItem.parentId = ecologyType.id;
              this.oriItem.name = '';
              this.oriItem.tags = '';
              this.oriItem.id = 0;
              this.formItem.id = 0;
              this.isEdit = false;
              this.isTwo = true;
            }
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
    reset() {
      $.extend(this.formItem, this.oriItem);
    }
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
