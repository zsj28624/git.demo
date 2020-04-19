<template>
  <div class="page page-bill">
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
            :label-width="140"
            :rules="formRules"
            class="form-item"
          >
            <table cellspacing="0" cellpadding="0">
              <colgroup>
                <col width="33%" />
                <col width="auto" />
                <col width="33%" />
              </colgroup>
              <tr>
                <td colspan="3">
                  <FormItem
                    v-for="(item, index) in ecologyTypeTag.items"
                    :key="index"
                    :label="'所属生态分类 ' + (index+1)"
                  >
                    <Row>
                      <Col span="6">
                        <Select v-model="item.value" @on-change="ecologyTypeChange(item)">
                          <Option
                            v-for="typeItem in ecologyTypeOption"
                            :value="typeItem.id"
                            :key="typeItem.id"
                          >{{ typeItem.name }}</Option>
                        </Select>
                      </Col>
                      <Col span="12" offset="1">
                        <Select v-model="item.tag" filterable multiple placeholder="标签">
                          <Option
                            v-for="obj in item.tagOption"
                            :value="obj.value"
                            :key="obj.value"
                          >{{ obj.label }}</Option>
                        </Select>
                      </Col>
                      <Col span="1" offset="1">
                        <Button  @click="ecologyTypeTag.items.splice(index, 1)">删除</Button>
                      </Col>
                    </Row>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem>
                    <Row>
                      <Col span="6">
                        <Button type="dashed" long @click="handleAdd" icon="md-add-round">所属生态分类</Button>
                      </Col>
                    </Row>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="合作企业等级" prop="level">
                    <Select v-model="formItem.level" style="width: 180px" v-power="'qystk.qykhgl.sjqystxx.setlevel'">
                      <Option
                        v-for="item in levelOption"
                        :value="item.code"
                        :key="item.code"
                      >{{ item.text }}</Option>
                    </Select>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="合作企业有效期" prop="time">
                    <Row>
                      <Col span="6">
                        <FormItem prop="validityBeginTime">
                          <DatePicker
                            type="date"
                            placeholder="开始日期"
                            v-model="formItem.validityBeginTime"
                            format="yyyy-MM-dd"
                            style="width: 180px"
                          ></DatePicker>
                        </FormItem>
                      </Col>
                      <Col span="6" offset="1">
                        <FormItem prop="validityEndTime">
                          <DatePicker
                            type="date"
                            placeholder="结束日期"
                            v-model="formItem.validityEndTime"
                            format="yyyy-MM-dd"
                            style="width: 180px"
                          ></DatePicker>
                        </FormItem>
                      </Col>
                    </Row>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="有效状态" prop="validityStatic">
                    <Select v-model="formItem.validityStatic" style="width: 180px">
                      <Option value="1">有效</Option>
                      <Option value="0">无效</Option>
                    </Select>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="产业合作方向">
                    <Select v-model="formItem.cooperationDirection" style="width: 180px" clearable>
                      <Option value="方向1">方向1</Option>
                      <Option value="方向2">方向2</Option>
                    </Select>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="产业合作意向城市">
                    <Input
                      type="textarea"
                      :rows="2"
                      v-model="formItem.cooperationIntentcity"
                      placeholder
                    />
                  </FormItem>
                </td>
                <td class="prompt"></td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="企业业绩">
                    <Input type="textarea" :rows="2" v-model="formItem.achievement" placeholder />
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="代表性案例" prop>
                    <Input
                      type="textarea"
                      :rows="2"
                      v-model="formItem.representativeCases"
                      placeholder
                    />
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="生态企业行为承诺书" prop>
                    <UploadBox v-model="formItem.files" :readonly="false"></UploadBox>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem>
                    <Button type="info" size="large" @click="save(0)">保存</Button>
                    <Button type="info" size="large" @click="save(1)">保存并提交</Button>
                    <Button  size="large" @click="reset">重置</Button>
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
      levelOption: [
        { code: '认证级', text: '认证级' },
        { code: '标准级', text: '标准级' },
        { code: '核心级', text: '核心级' },
        { code: '战略级', text: '战略级' }],
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
        cooperationDirection: '',//合作方向
        cooperationIntentcity: '',//合作意向城市
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
        level: [
          { required: true, message: '请选择合作企业等级', trigger: 'change' }
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
    pageTitle() {
      if (this.isEdit === 0) {
        return "添加生态信息";
      } else {
        return "编辑生态信息";
      }
    },
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
    save(auditStatus) {
      var that = this;
      this.$refs['editFormRule'].validate((valid) => {
        if (valid) {
          if (that.formItem.cooperationDirection && that.formItem.cooperationIntentcity.trim() == '') {
            this.$Message.error('请填写产业合作意向城市');
            return;
          } 
          this.formItem.corpId = this.corpId;
          this.formItem.auditStatus = auditStatus;
          this.saveItem();
        } else {
          return;
        }
      });
    },
    saveItem() {
      var that = this;
      var ecologyTypeTagList = [];
      if (that.ecologyTypeTag.items.length == 0) {
        this.$Message.error('请选择所属生态分类');
        return;
      }
      var ecologyTypeTagText = [];
      for (var i = 0; i < that.ecologyTypeTag.items.length; i++) {
        var element = that.ecologyTypeTag.items[i];
        if (element.value == '') {
          this.$Message.error('请选择所属生态分类' + (i + 1));
          return;
        }
        ecologyTypeTagList.push({ 'ecologyTypeId': element.value, 'tag': element.tag ? element.tag.join(',') : '' });

        var selectItem = that.ecologyTypeOption.filter(o => o.id === element.value)[0];
        var typeName = selectItem.name.trim();
        if (selectItem.parentId > 0) {
          var selectParentItem = that.ecologyTypeOption.filter(o => o.id === selectItem.parentId)[0];
          typeName = selectParentItem.name.trim() + ' - ' + typeName;
        }
        ecologyTypeTagText.push(typeName + '【' + element.tag + '】');
      }

      let url = '';
      let msg = '';
      if (this.isEdit) {
        url = '/api/engine/enterprise-ecology/corp/ecology/update';
        msg = '修改成功';
      } else {
        url = '/api/engine/enterprise-ecology/corp/ecology/add';
        msg = '添加成功';
      }
      var form = {};
      Object.assign(form, this.formItem);
      form.ecologyTypeTagList = ecologyTypeTagList;
      form.ecologyTypeTag = ecologyTypeTagText.join('<br/>');
      form.validityBeginTime = page.formatDate(form.validityBeginTime);
      form.validityEndTime = page.formatDate(form.validityEndTime);
      this.loading = 1;
      this.$http.post(url, form).then((res) => {
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
    get(id) {
      var that = this;
      this.loading = 1;
      this.$http.post('/api/engine/enterprise-ecology/corp/ecology/get', { 'id': id }).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          Object.assign(this.formItem, res.data.data);
          this.formItem.validityStatic = this.formItem.validityStatic.toString();
          this.oriItem = eval('(' + JSON.stringify(this.formItem) + ')');

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
    doDel() {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>删除后不能恢复，确定删除该条记录吗？</p>',
        onOk: () => {
          this.loading = 1;
          this.$http.post('/api/engine/enterprise-ecology/corp/ecology/delete?id=' + this.ecologyId, {}).then((res) => {
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
  }
} 
</script> 
<style>
.ecology-edit-save-table td {
  /* padding-right: 0px !important; */
}
</style>