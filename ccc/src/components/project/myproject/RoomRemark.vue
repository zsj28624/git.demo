<template>
  <Modal v-model="show" :title="title" :closable="false" :mask-closable="false" :transfer="false">
    <div class="page">
      <Loading :loading="loading">
        <div class="page-form">
          <table class="table" cellspacing="0" cellpadding="0">
            <colgroup>
              <col width="25%" />
              <col width="25%" />
              <col width="25%" />
              <col width="25%" />
            </colgroup>
            <tr>
              <td colspan=4>
                <div class="form-sub-title">
                  <Icon type="compose"></Icon>
                  基本信息
                </div>
              </td>
            </tr>
            <tr>
              <td class="head">房间编号：</td>
              <td class="tdContent">{{formItem.number}}</td>
              <td class="head">所属园区：</td>
              <td class="tdContent">{{formItem.name}}</td>
            </tr>
            <tr>
              <td class="head">所属楼盘：</td>
              <td class="tdContent">{{formItem.buildingNumber}}</td>
              <td class="head">所属楼层：</td>
              <td class="tdContent">{{formItem.floor}}</td>
            </tr>
            <tr>
              <td class="head">建筑面积：</td>
              <td class="tdContent">{{formItem.area}}</td>
              <td class="head">房间状态：</td>
              <td class="tdContent">{{formItem.status}}</td>
            </tr>
            <tr>
              <td colspan=4>
                <div class="form-sub-title">
                  <Icon type="compose"></Icon>
                  户型展示
                </div>
              </td>
            </tr>
            <tr>
              <td colspan=4>
                <UploadBox v-model="formItem.show" :readonly="true"></UploadBox>
              </td>
            </tr>
            <tr>
              <td colspan=4>
                <Button type="primary" icon="md-checkmark" @click="submit">确认</Button>
                <Button @click="reset">取消</Button>
              </td>
            </tr>
          </table>
        </div>
      </Loading>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import Loading from '@/components/loading';
import UploadBox from '@/components/upload/Index';

export default {
  components: {
    Loading,UploadBox,
  },
  data() {
    return {
      loading: 1,
      show: false,
      isEdit: true,
      isTwo:true,
      parentId: 0,
      room:{},
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
      return "房间信息";
    },
  },
  mounted() {
  },
  methods: {
    open(obj) {
      if(obj){
        this.room = obj;
        this.id = obj.id;
        this.loading = 1;
        this.show = true;
        
        if (obj.id != null && obj.id != '') {
          this.$http.post('/api/engine/campus/room/list', {id:obj.id}).then((res) => {
            this.loading = 0;
            if (res.data.code == 0 && res.data.data != null) {
              this.oriItem = res.data.data.rows[0];
              $.extend(this.formItem, this.oriItem);
            } else {
              this.$Message.error(res.data.message);
            }
          }).catch((error) => {
            this.loading = 0;
            this.$Message.error(error.message)
          });
          this.isEdit = true;
        }
      }
    },
    submit() {
      this.$emit("on-submit",this.formItem,this.room);
    },
    close() {
      this.show = false;
    },
    reset() {
      this.show = false;
      this.$emit("on-close",this.room);
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

.table { 
  width: 90%;
  min-height: 40px; 
  line-height: 40px; 
  text-align: center;
  margin:auto;
  /*border-color:#b6ff00; 
  border-collapse: collapse;*/
}

.tdContent{
  text-align: left;
}

.head{
  font-weight:bold;
}
</style>
