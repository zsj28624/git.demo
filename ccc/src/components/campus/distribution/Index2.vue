<template>
  <div class="page">
    <Loading :loading="loading">
      <div class="page-searchbox">
        <table cellspacing="10">
          <tr>
            <td>
              <Select v-model="formItem.campusId" placeholder="所属园区" style="width: 150px" @on-change="queryBuilding(formItem.campusId)">
                <Option
                  v-for="item in campus"
                  :value="item.id"
                  :key="item.name"
                >{{ item.name }}</Option>
              </Select>
            </td>
            <td>
              <Select v-model="formItem.buildingId" placeholder="所属楼盘" style="width: 150px">
                <Option
                  v-for="item in building"
                  :value="item.id"
                  :key="item.number"
                >{{ item.number }}</Option>
              </Select>
            </td>
            <td>
              <Button @click="query" type="primary" icon="ios-search">查询</Button>
            </td>
            <td>
              <Button @click="reset" type="default">重置</Button>
            </td>
          </tr>
        </table>
      </div>

      <div class="external">
          <table cellspacing="10">
            <colgroup>
              <col width='10%'/>
              <col width='10%'/>
              <col width='10%'/>
              <col width='10%'/>
              <col width='10%'/>

              <col width='10%'/>
              <col width='10%'/>
              <col width='10%'/>
              <col width='10%'/>
              <col width='10%'/>
            </colgroup>
            <tr>
              <table class="table" cellspacing="10" >
                <colgroup>
                  <col width='10%'/>
                  <col width='10%'/>
                  <col width='10%'/>
                  <col width='10%'/>
                  <col width='10%'/>

                  <col width='10%'/>
                  <col width='10%'/>
                  <col width='10%'/>
                  <col width='10%'/>
                  <col width='10%'/>
                </colgroup>
                <tr>
                  <td></td>
                  <td></td>
                  <td class="hGray"><h1>•</h1></td>
                  <td class="tdLift">待售</td>
                  <td class="hYellow"><h1>•</h1></td>

                  <td class="tdLift">意向</td>
                  <td class="hRed"><h1>•</h1></td>
                  <td class="tdLift">签约</td>
                  <td></td>
                  <td></td>
                </tr>
              </table>
            </tr>
            <template v-if="list.length>0">
              <tr v-for="item in list">
                <table class="table" cellspacing="10" >
                  <colgroup>
                    <col width='10%'/>
                    <col width='10%'/>
                    <col width='10%'/>
                    <col width='10%'/>
                    <col width='10%'/>

                    <col width='10%'/>
                    <col width='10%'/>
                    <col width='10%'/>
                    <col width='10%'/>
                    <col width='10%'/>
                  </colgroup>
                  <tr>
                    <td class='divHead'>第{{item.floor}}层</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>

                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr v-if="item.page==1">
                    <td v-for="room in item.roomlist">
                      <div class='div' @click="roomShow(room.id)">
                        <hr v-if="room.status=='待售'" class='hrGray' />
                        <hr v-if="room.status=='签约'" class='hrRed' />
                        <hr v-if="room.status=='意向'" class='hrYellow' />
                        {{room.number}}
                      </div>
                    </td>
                  </tr>
                  <tr v-else v-for="(floor,index) in item.floorlist">
                    <td v-for="item2 in item.floorlist[index]">
                      <div class='div' @click="roomShow(item2.id)">
                        <hr v-if="item2.status=='待售'" class='hrGray' />
                        <hr v-if="item2.status=='签约'" class='hrRed' />
                        <hr v-if="item2.status=='意向'" class='hrYellow' />
                        {{item2.number}}
                      </div>
                    </td>
                  </tr>
                </table>
              </tr>
            </template>
            <template  v-else>
              <div class="mydiv" >暂无数据,请切换查询条件</div>
            </template>
          </table>
      </div>
      <DistributionShow ref="DistributionShow" ></DistributionShow>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import page from '@/assets/js/page';
import DistributionShow from '@/components/campus/distribution/DistributionShow';

export default {
  components: {
    Loading,
    LayoutHor,
    page,
    DistributionShow,
  },
  data() {
    return {
      loading: 0,
      pageSize:10,
      addHtml:"",
      campus:[],
      building:[],
      //表单对象
      formItem: {
        campusId: null,
        buildingId: null,
      },
      list:[],
    }
  },
  computed: {
  },
  mounted() {
    this.queryCampus();
  },
  methods: {
    query() {
      if(this.formItem.campusId == null){
        this.$Message.error('请选择园区');
        return;
      }
      if(this.formItem.buildingId == null){
        this.$Message.error('请选择楼盘');
        return;
      }
      this.$http.post('/api/engine/campus/distribution/list?', this.formItem).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          var list = res.data.data.rows;
          //楼栋信息
          for(var i = 0 ; i < list.length;i++){
            var roomlist = list[i].roomlist;//楼层信息
            list[i].floorlist = [];

            var total = list[i].roomlist.length;//房间总数
            list[i].total = total;

            var page = parseInt(total/this.pageSize);//每层房间行数
            if(page*this.pageSize<total){//判断是否有多出房价+1行
              page++;
            }
            list[i].page =  page;

            var start = 0;
            var end = 0;
            if(page>1){//判断行数是一层否多行房间
              for (var index = 0; index < page; index++) {
                var floorlist = [];
                if((index + 1) * this.pageSize >= total){
                  start = total;
                }else{
                  start = this.pageSize * (index + 1);
                }
                for (end ;end < start; end++) {//房间信息
                  floorlist.push(roomlist[end]);
                }
                end = start;
                list[i].floorlist.push(floorlist);
              }
            }
          }
          this.list = list;
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    goBack: function () {
      this.$router.go(-1);
    },
    goPage(page) {
      this.$router.push({ path: page });
    },
    reset(){
      this.formItem.buildingId = "";
      this.formItem.campusId = "";
    },
    queryCampus() {
      this.$http.post('/api/engine/campus/campus/listAll?', {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          this.campus = res.data.data.rows;
          this.formItem.buildingId = "";
          this.building = [];
          this.campus.map(item=>{
            if(this.$route.query.campusId&&this.$route.query.campusId==item.id){
              this.formItem.campusId=item.id;
              this.queryBuilding(this.formItem.campusId);
            }
          })
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    queryBuilding(campusId) {
      this.$http.post('/api/engine/campus/building/listAll?', {campusId:campusId}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          this.building = res.data.data.rows;
          this.building.map(item=>{
            if(this.$route.query.buildingId&&this.$route.query.buildingId==item.id){
              this.formItem.buildingId=item.id;
              this.query();
            }
          })
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
      this.formItem.buildingId = "";
    },
    roomShow : function(id) {
      this.$refs.DistributionShow.open({ id: id });
    },
  }
}

</script>

<style type="text/css">
.external{
  width: 100%;
  background: rgb(245, 245, 245);
}

.form-sub-title {
  font-size: 14px;
  margin: 0 0 12px 18px;
  color: #2b85e4;
}

.pageSearchbox{
  background: #ffffff;
}

.pageAll{
  background: rgb(245, 245, 245);
  height: 100%;
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

.divHead{
  font-weight:bold;
  text-align: left;
}

.div{
  /*background: rgb(255, 255, 255);
  box-shadow: 7px 7px 3px #0000000D;*/
  background:rgba(255,255,255,1);
  box-shadow:0px 3px 7px 0px rgba(0, 0, 0, 0.05);
  border-radius:4px;
}

.hrRed{
  border: 2px solid rgb(235, 50, 50);
}

.hrGray{
  border: 2px solid rgb(200, 200, 200);
}

.hrYellow{
  border: 2px solid rgb(226, 184, 47);
}

.hRed{
  color: rgb(235, 50, 50);
  font-size : 1em;
  text-align: right;
}

.hGray{
  color: rgb(200, 200, 200);
  font-size : 1em;
  text-align: right;
}

.hYellow{
  color: rgb(226, 184, 47);
  font-size : 1em;
  text-align: right;
}

.tdLift{
  text-align: left;
}

.mydiv{
  text-align:center;
  color:#c5c8ce;
  width:100%;
  height:300px;
  margin:100px 0px 0px 0px;
}
</style>
