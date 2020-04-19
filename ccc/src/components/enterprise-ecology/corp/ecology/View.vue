<template>
  <div class="page page-bill">
    <div class="page-bar">
      <LayoutHor>
        <div slot="left">
          <Button size="small" @click="goBack" icon="ios-arrow-back" type="warning">返回</Button>
        </div>
        <div class="page-bar-title">{{'生态信息明细'}}</div>
        <div slot="right"></div>
      </LayoutHor>
    </div>
    <Loading :loading="loading">
      <div class="baseinfo">
        <div class="page-tools"></div>
        <div class="page-form">
          <Form
            :model="formItem"
            ref="editFormRule"
            :label-width="120"
            :rules="formRules"
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
                  <FormItem label="所属生态分类" prop="level">{{formItem.level}}</FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="合作企业等级" prop="level">{{formItem.level}}</FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem
                    label="合作企业有效期"
                  >{{formItem.validityBeginTime+' - '+ formItem.validityEndTime}}</FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="有效状态">{{formItem.validityStatic}}</FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="产业合作方向">{{formItem.cooperationDirection}}</FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="产业合作意向城市">{{formItem.cooperationIntentcity}}</FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="企业业绩">{{formItem.achievement}}</FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="代表性案例" prop>{{formItem.representativeCases}}</FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="生态企业行为承诺书" prop>
                    <UploadBox v-model="formItem.files" :readonly="true"></UploadBox>
                  </FormItem>
                </td>
              </tr>
            </table>
          </Form>
        </div>
      </div>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import page from '@/assets/js/page';
import UploadBox from '@/components/upload/Index';
export default {
  components: {
    Loading, LayoutHor, UploadBox
  },
  data() {
    return {
      loading: 0,
      ecologyId: 0,
      corpId: 0,
      //是否编辑 0 添加 1 编辑
      isEdit: 0,
      ecologyTypeOption: [],
      tagOption: [],
      selectTag: [],
      levelOption: [],
      index: 1,
      ecologyTypeTag: {
        items: [
          {
            value: '',
            index: 1,
            tag: '',
            tagOption: []
          }
        ]
      },
      //表单对象
      formItem: {
        id: 0,
        corpId: 0,
        ecologyTypeTag: '',//所属生态分类标签 
        level: '',//合作企业等级
        validityBeginTime: '',//合作企业有效期开始日期
        validityEndTime: '',//合作企业有效期结束日期
        validityStatic: '1',//有效状态
        achievement: '',//企业业绩
        representativeCases: '',//代表性案例
        auditStatus: 0,
        files: '',
        ecologyTypeTagList: [],//
      },
      file: null,
      oriItem: {
      },
      //初始加载所有验证
      formRules: {
        ecologyTypeId: [
          { required: true, message: '请选择所属生态分类', trigger: 'change', type: 'number' }
        ],
        tag: [
          { required: true, message: '请选择企业标签', trigger: 'change' },
          // { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
        ],
        validityBeginTime: [
          { type: 'date', required: true, whitespace: true, message: '开始日期不能为空', trigger: 'change' },
        ],
        validityEndTime: [
          { type: 'date', required: true, whitespace: true, message: '结束日期不能为空', trigger: 'change' },
        ],
      },
    }
  },
  computed: {
  },
  watch: {

  },
  mounted() {
    this.loadType();
    this.ecologyId = this.$route.query.id;
    this.corpId = this.$route.query.corpId;
    if (this.ecologyId) {
      this.isEdit = 1;
      //this.get(this.ecologyId);
    } else {
      this.isEdit = 0;
      this.oriItem = {
        id: 0,
        corpId: this.corpId,
        ecologyTypeTag: '',//所属生态分类标签 
        level: '',//合作企业等级
        validityBeginTime: '',//合作企业有效期开始日期
        validityEndTime: '',//合作企业有效期结束日期
        validityStatic: '1',//有效状态
        achievement: '',//企业业绩
        representativeCases: '',//代表性案例
        auditStatus: 0,
        files: '',
        ecologyTypeTagList: [],//
      }
    }
  },
  methods: {
    handleAdd() {
      this.index++;
      this.ecologyTypeTag.items.push({
        value: '',
        index: this.index,
        tag: '',
        tagOption: []
      });
    },
    loadType() {
      this.loading = 1;
      this.$http.post("/api/engine/enterprise-ecology/ecology-type/all", {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            var data = res.data.data;
            var arr = [];
            var data1 = data.filter(item => item.parentId === 0);
            var data2 = data.filter(item => item.parentId != 0);
            for (var i = 0; i < data1.length; i++) {
              var item = data1[i];
              if (item.parentId == 0) {
                arr.push(item);
                var childs = data2.filter(o => o.parentId === item.id);
                for (var j = 0; j < childs.length; j++) {
                  childs[j].name = '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + childs[j].name;
                  arr.push(childs[j]);
                }
              }
            }
            this.ecologyTypeOption = arr;
          } else {
            this.$Message.error('信息不存在！');
          }
        } else {
          this.$Message.error(res.data.message);
        }
        if (this.isEdit) {
          this.get(this.ecologyId);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("操作失败！")
      });
    },
    ecologyTypeChange(ecologyTypeItem) {
      var selectItem = this.ecologyTypeOption.filter(o => o.id === ecologyTypeItem.value)[0];
      var tagOption = [];
      if (selectItem && selectItem.tags) {
        var arry = selectItem.tags.split('，');
        for (let i = 0; i < arry.length; i++) {
          var item = arry[i];
          tagOption.push({
            value: item,
            label: item
          });
        }
      }
      ecologyTypeItem.tagOption = tagOption;

    },
    get(id) {
      var that = this;
      this.loading = 1;
      this.$http.post('/api/engine/enterprise-ecology/corp/ecology/get', { 'id': id }).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          Object.assign(this.formItem, res.data.data);
          this.formItem.validityStatic = this.formItem.validityStatic == '1' ? '有效' : '无效';
          if (this.formItem.validityBeginTime) {
            this.formItem.validityBeginTime = this.formItem.validityBeginTime.substr(0, 10);
          }
          if (this.formItem.validityEndTime) {
            this.formItem.validityEndTime = this.formItem.validityEndTime.substr(0, 10);
          }
          this.ecologyTypeTag.items = [];
          for (let i = 0; i < this.formItem.ecologyTypeTagList.length; i++) {
            var item = this.formItem.ecologyTypeTagList[i];
            var typTagItem = {
              value: item.ecologyTypeId,
              index: i,
              tag: item.tag ? item.tag.split(',') : [],
              tagOption: []
            };
            this.ecologyTypeChange(typTagItem);
            this.ecologyTypeTag.items.push(typTagItem);
          }
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
  }
} 
</script> 
<style>
.ecology-edit-save-table td {
  padding-right: 0px !important;
}
</style>