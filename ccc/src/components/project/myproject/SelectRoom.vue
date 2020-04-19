<template>
  <Modal v-model="show" :title="title" :closable="true" width="1000" >
    <div class="page">
      <Loading :loading="loading">
      <div >
        <table cellspacing="10" cellpadding="10">
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
                      <div :class="room.isSelect?'selectdiv':'div'" @click="roomShow(room)" tabindex="0" >
                        <hr v-if="room.status=='待售'" class='hrGray' />
                        <hr v-if="room.status=='签约'" class='hrRed' />
                        <hr v-if="room.status=='意向'" class='hrYellow' />
                        {{room.number}}
                      </div>
                    </td>
                  </tr>
                  <tr v-else v-for="(floor,index) in item.floorlist">
                    <td v-for="item2 in item.floorlist[index]">
                      <div :class="item2.isSelect?'selectdiv':'div'" @click="roomShow(item2)" >
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
              <div class="mydiv">暂无数据,请切换查询条件</div>
            </template>
          </table>
      </div>
      <RoomRemark ref="roomRemark" @on-submit="selectRoom" @on-close="resetRoom"></RoomRemark>
      </Loading>
    </div>
    <div slot="footer">
      <Button type="primary" icon="md-checkmark" @click="submit">确认</Button>
      <Button @click="close">关闭</Button>
    </div>
  </Modal> 
</template>
<script>
  import Loading from '@/components/loading';
  import LayoutHor from '@/components/layout/LayoutHor';
  import page from '@/assets/js/page';
  import RoomRemark from '@/components/project/myproject/RoomRemark';


  export default {
    components: {
      Loading, LayoutHor,page,RoomRemark
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
        show:false,
        rooms:[],//已选择房间
        campusId:null,//园区
      }
    },
    computed: {
      title() {
        return "选择房间";
      },
    },
    mounted(){
    },
    methods: {
      query() {
        this.rooms=[];
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
            list.map((item)=>{
              item.roomlist.map((it)=>{
                it.isSelect=false;//是否选择
              })
            })
            //楼栋信息
            for(var i = 0 ; i < list.length;i++){
              var roomlist = list[i].roomlist;//楼层信息
              list[i].floorlist = [];

              var total = list[i].roomlist.length;//房间总数
              list[i].total =  total;

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
      reset(){
        this.formItem.buildingId = null;
        this.formItem.campusId = null;
      },
      queryCampus() {
        this.$http.post('/api/engine/campus/campus/listAll?', {}).then((res) => {
          this.loading = 0;
          if (res.data.code == 0 && res.data.data != null) {
            this.campus = res.data.data.rows;
            //this.formItem.buildingId = null;
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
      },
      queryBuilding(campusId) {
        this.loading = 1;
        this.building = [];
        this.$http.post('/api/engine/campus/building/listAll?', {campusId:campusId}).then((res) => {
          if (res.data.code == 0 && res.data.data != null) {
            this.building = res.data.data.rows;
            this.loading = 0;
          } else {
            this.loading = 0;
            this.$Message.error(res.data.message);
          }
          this.formItem.buildingId = null;
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
      },
      roomShow : function(item) {
        this.loading = 1;
        //item.isSelect=true;
        this.$refs.roomRemark.open(item);
        this.loading = 0;
      },
      open(item) {
        this.show = true;
        this.reset();
        this.queryCampus();
        this.list=[];
        if(item.campusId){
          this.formItem.campusId=item.campusId;
          this.campusId=item.campusId;
          this.building=[];
          this.$http.post('/api/engine/campus/building/listAll?', {campusId:item.campusId}).then((res) => {
            this.loading = 0;
            if (res.data.code == 0 && res.data.data != null) {
              if(res.data.data.rows.length>0){
                this.building = res.data.data.rows;
                this.loading = 0;
              }
              if(item.buildingId){
                this.formItem.buildingId=item.buildingId;
                this.query();
              }
              this.loading = 0;
            } else {
              this.$Message.error(res.data.message);
            }
          }).catch((error) => {
            this.loading = 0;
            this.$Message.error(error.message)
          });
        } 
      },
      selectRoom(item,it){
        this.loading = 1;
        if(it.status=="签约"){
          this.$Message.error("当前房间已签约,不能选择!");
          this.loading = 0;
          return;
        }
        if(!it.isSelect){
          it.isSelect=true;
          this.rooms.push(it);
        }
        this.$refs.roomRemark.close();
        this.loading = 0;
      },
      submit() {
        if(this.rooms.length>0){
          if(this.campusId != this.rooms[0].campusId){
            this.$Message.error("当前园区不一致，请不要更换园区!");
            return;
          }
          this.$emit("on-submit",this.rooms);
          this.close();
        }else{
          this.$Message.error("请选择房间！");
        }
      },
      resetRoom(it){
        this.loading = 1;
        if(it.isSelect){
          it.isSelect=false;
          var reRooms=[];
          this.rooms.map((item)=>{
            if(item.id!=it.id){
              reRooms.push(item);
            }
          })
          this.rooms=reRooms;
        }
        this.loading = 0;
      },
      close() {
        this.show = false;
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
  background:rgba(255,255,255,1);
  box-shadow:0px 3px 7px 0px rgba(0, 0, 0, 0.05);
  border-radius:4px;
}
.selectdiv{
  background:#97B8FB;
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
  height:260px;
  margin:100px 0px 0px 0px;
}
</style>

