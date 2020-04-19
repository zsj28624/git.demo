<template>
  <ListPage
    ref="page"
    title="企业客户管理"
    api="/api/engine/enterprise-ecology/corp/list"
    :model="this"
    :beforeLoad="beforeLoad"
  >
    <div class="page-tools" slot="page-tools">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Button @click="add" icon="md-add">添加企业客户</Button>
          </td>
          <td>
            <Button @click="selEcology" icon="md-add">设置企业等级</Button>
          </td>
          <td>
            <Button @click="selMangager" icon="md-add">更换生态管理员</Button>
          </td>
          <td>
            <UploadButton @on-upload="importExcel"></UploadButton>
          </td>
          <td>
            <Button @click="exportDown" type="info" icon="ios-download-outline">导出</Button>
          </td>
          <td>
            <Button @click="exportDownModel" type="info" icon="ios-download-outline">下载模板</Button>
          </td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input
              v-model="queryForm.corpName"
              placeholder="企业名称"
              style="width: 210px"
              @on-enter="query"
            />
          </td>
          <td>
            <Select
              v-model="queryForm.ecologyType"
              placeholder="所属生态分类"
              style="width: 210px"
              filterable
            >
              <Option v-for="item in ecologyType" :value="item.id" :key="item.name">{{ item.name }}</Option>
            </Select>
          </td>
          <td>
            <Input
              v-model="queryForm.managerName"
              placeholder="生态管理员"
              style="width: 210px"
              @on-enter="query"
            />
          </td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.createTime"
              split-panels
              placeholder="加入日期"
              style="width: 210px"
              :clearable="true"
              ::transfer="true"
            ></DatePicker>
          </td>
        </tr>
        <br />
        <tr>
          <td>
            <Select v-model="queryForm.level" placeholder="企业级别" style="width: 210px">
              <Option
                v-for="item in level"
                :value="item.argCode"
                :key="item.argCode"
              >{{ item.argText }}</Option>
            </Select>
          </td>
          <td>
            <Select
              v-model="queryForm.cooperationDirection"
              placeholder="产业合作方向"
              style="width: 210px"
            >
              <Option
                v-for="item in cooperationDirection"
                :value="item.argCode"
                :key="item.argCode"
              >{{ item.argText }}</Option>
            </Select>
          </td>
          <td>
            <Input
              v-model="queryForm.cooperationIntentcity"
              placeholder="意向城市"
              @on-enter="query"
              style="width: 210px"
            />
          </td>
          <td>
            <Button @click="query" type="primary" icon="ios-search">查询</Button>
            <Button @click="reset" type="default">重置</Button>
          </td>
        </tr>
      </table>
    </div>
    <RoleEdit ref="editRole" @on-save="query"></RoleEdit>
    <ChangeManagerEdit ref="ChangeManagerEdit" @on-save="query"></ChangeManagerEdit>
    <SetLevel ref="SetLevel" @on-save="query"></SetLevel>
    <Modal v-model="importExcelMsg" width="360" :closable="false" :mask-closable="false">
      <p slot="header">
        <Icon type="information-circled"></Icon>
        <span>导入完成</span>
      </p>
      <div style="text-align:left" v-html="importMsg"></div>
      <div slot="footer">
        <Button type="info" size="large" @click="importExcelMsg = false">确定</Button>
      </div>
    </Modal>
  </ListPage>
</template>
<script>    
import RoleEdit from '@/components/frame/RoleEdit';
import ListPage from '@/components/page/ListPage';
import DataRowOperate from '@/components/commons/DataRowOperate';
import page from '@/assets/js/page';
import ChangeManagerEdit from '@/components/enterprise-ecology/corp/ChangeManagerEdit';
import SetLevel from '@/components/enterprise-ecology/corp/SetLevel';
import UploadButton from '@/components/upload/UploadButton';


export default {
  components: {
    RoleEdit,
    ListPage,
    DataRowOperate,
    page,
    ChangeManagerEdit,
    SetLevel,
    UploadButton,
  },
  data() {
    let that = this;
    return {
      importExcelMsg: false,
      importMsg: '',
      tabName: '1',
      columns: [
        {
          type: 'selection',
          width: 40,
          align: 'center',
        },
        {
          title: '操作',
          width: 150,
          align: 'center',
          render: (h, params) => {
            var row = params.row;
            return h(DataRowOperate, {
              props: {
                btns: [{
                  key: 'edit',
                },
                {
                  key: 'delete',
                }, {
                  key: 'trace',
                  text: '跟进企业'
                }
                /*, {
                  key: 'comment',
                  text: '评论',
                }*/]
              },
              on: {
                click: (key) => {
                  if (key == "edit") {
                    this.rowCommand("编辑", params);
                  }
                  if (key == "delete") {
                    this.rowCommand("删除", params);
                  }
                  if (key == "trace") {
                    this.rowCommand("跟进企业", params);
                  }
                  if (key == "comment") {
                    this.rowCommand("评论", params);
                  }
                }
              }
            });
          }
        },
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 50,
        },
        {
          title: '企业名称',
          key: 'corpName',
          align: 'left',
          minWidth: 200,
          render: (h, params) => {
            var row = params.row;
            var btns = [];

            btns.push(h('span', {
              props: {
                size: 'small',
                type: 'warning',
              },
              on: {
                click: () => {
                  this.sel(row.id);
                }
              }
            }, row.corpName));
            return h('a', btns);
          }
        },
        {
          title: '企业级别',
          key: 'level',
          align: 'center',
          minWidth: 80
        },
        {
          title: '企业法人',
          key: 'corporation',
          align: 'center',
          minWidth: 80,
        },
        {
          title: '年销售额（元）',
          key: 'usd',
          align: 'right',
          width: 150,
        },
        {
          title: '企业对接人',
          key: 'contactName',
          align: 'center',
          minWidth: 100
        },
        {
          title: '对接人电话',
          key: 'contactPhone',
          align: 'center',
          width: 100,
        },
        {
          title: '对接人职务',
          key: 'contactPosition',
          align: 'center',
          minWidth: 80,
        },
        {
          title: '注册资金（元）',
          key: 'registeredCapital',
          align: 'right',
          width: 120,
        },
        {
          title: '生态管理员',
          key: 'managerName',
          align: 'center',
          width: 100,
        }
      ],
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        corpName: '',
        page: '',
        pageSize: '',
        createTimeStart: '',
        createTimeEnd: '',
        ecologyType: '',
        managerName: '',
        level: '',
        cooperationDirection: '',
        cooperationIntentcity: '',
        createTime: '',
        ecologyTypeName: '',
      },
      action: [
        { code: '大型', text: '大型' },
        { code: '中型', text: '中型' },
        { code: '小型', text: '小型' },
      ],
      cooperationDirection:[
        { argCode: '方向1', argText: '方向1' },
        { argCode: '方向2', argText: '方向2' },
        { argCode: '方向3', argText: '方向3' },
      ],
      selection: [],
      loading: 0,
      level: [],
      ecologyType: [],
    }
  },
  mounted: function () {
    this.queryEcologyType();
    this.level = page.$args.getArgGroup("enterprise_level");
    this.query();
  },
  computed: {},
  methods: {
    importExcel(fileId) {
      if(fileId.substring(fileId.lastIndexOf("_")+1,fileId.length) == "xlsx" || (fileId.substring(fileId.lastIndexOf("_")+1,fileId.length) == "xls") ){
        this.$http.post('/api/engine/enterprise-ecology/corp/import', { fileId: fileId }).then((res) => {
          if (res.data.code === 0) {
            this.importExcelMsg = true;
            this.importMsg = "成功 <span style='color:green;'>" + res.data.data.add + "</span> 条，失败 <span style='color:red;'>" + res.data.data.error + '</span> 条<br/>' + res.data.data.msg
            this.reset();
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.$Message.error(error.toString())
        });
      }else{
        this.$Message.error("导入文件格式不正确")
        return;
      }
      
    },
    beforeLoad() {
      var queryParam = this.$refs.page.queryParam;
      queryParam.createTimeStart = '';
      queryParam.createTimeEnd = '';
      delete queryParam.createTime;
      if (this.queryForm.createTime.length > 0) {
        queryParam.createTimeStart = page.formatDate(this.queryForm.createTime[0]);
      }
      if (this.queryForm.createTime.length > 1) {
        queryParam.createTimeEnd = page.formatDate(this.queryForm.createTime[1]);
      }
      queryParam.managerSign = 1;
    },
    query() {
      this.$refs.page.query();
    },
    reset: function () {
      // 清空条件
      this.queryForm.ecologyType = null;
      this.queryForm.ecologyTypeName = '';
      this.queryForm.managerName = '';
      this.queryForm.corpName = '';
      this.queryForm.level = null;
      this.queryForm.createTime = '';
      this.queryForm.cooperationDirection = null;
      this.queryForm.cooperationIntentcity = '';
      this.query();
    },
    rowCommand: function (name, params) {
      if (name === '编辑') {
        this.update(params.row.id);
        return;
      }
      if (name === '删除') {
        this.$Modal.confirm({
          title: '删除确认',
          content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
          onOk: () => {
            this.$http.post('/api/engine/enterprise-ecology/corp/del?id=' + params.row.id, params.row).then((res) => {
              if (res.data.code === 0) {
                this.$Message.success("删除成功");
                this.$refs.page.query();
              } else {
                this.$Message.error(res.data.message)
              }
            }).catch((error) => {
              this.$Message.error(error.toString())
            });
          }
        });
      }
      if (name === '跟进企业') {
        this.updateTrace(params.row.id);
        return;
      }
      if (name === '评论') {
        this.comment(params.row.id);
        return;
      }
    },
    goBack: function () {
      this.$router.go(-1);
    },
    exportDown() {
      this.$refs.page.exportDown();
    },
    exportDownModel() {
      window.open(this.$http.defaults.baseURL + '/templete/生态企业客户模板.xlsx');
    },
    add: function () {
      this.$router.push({ path: "/ecology/corp/edit?forward" });
    },
    update: function (corpId) {
      this.$router.push({ path: "/ecology/corp/edit?corpId=" + corpId });
    },
    updateMangager: function (corpId) {
      this.$refs.ChangeManagerEdit.open({ id: corpId });
    },
    updateEcology(corpId) {
      this.$refs.SetLevel.open({ id: corpId });
    },
    updateTrace(corpId) {
      this.$router.push({ path: "/ecology/corp/trace/edit?corpId=" + corpId });
    },
    queryArg(argGroup) {
      this.$http.post('/api/engine/arg/list?', { argGroup: argGroup }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          if (argGroup == "enterprise_level") {
            this.level = res.data.data;
          }
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    queryEcologyType() {
      this.$http.post('/api/engine/enterprise-ecology/corp/typelist?', {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          var treeList = res.data.data.rows;
          var tree = [{name: "全部",id: "",parentId: 0}];
          treeList.map((row) => {
            row._checked = false;
            if (this.enableCheckStatus) {
              if (typeof (row[this.idPath]) != 'undefined') {
                row._checked = this.checkIds.indexOf(row[this.idPath]) >= 0;
              }
            }
            if (row.parentId == 0) {
              tree.push(row);
              for (var i = 0; i < treeList.length; i++) {
                if (row.id == treeList[i].parentId) {
                  tree.push(treeList[i]);
                }
              }
            }
          });
          this.ecologyType = tree;
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    selMangager() {
      var selectList = this.$refs.page.getSelection();
      if (selectList.length == 0) {
        this.$Message.error('请选择一条数据');
        return;
      }
      if (selectList.length > 1) {
        this.$Message.error('只能选择一条数据');
        return;
      }
      this.updateMangager(selectList[0].id);
    },
    selEcology() {
      var selectList = this.$refs.page.getSelection();
      if (selectList.length == 0) {
        this.$Message.error('请选择一条数据');
        return;
      }
      if (selectList.length > 1) {
        this.$Message.error('只能选择一条数据');
        return;
      }
      this.updateEcology(selectList[0].id);
    },
    sel: function (corpId) {
      this.$router.push({ path: "/ecology/selcorp/edit?corpId=" + corpId });
    },
    comment(corpId) {
      this.$router.push({ path: "/ecology/comment/index?corpId=" + corpId });
    }
  }
}

</script>

<style type="text/css">
</style>
