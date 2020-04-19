<template>
  <div class="page page-max-bill trace">
    <Loading :loading="loading">
      <div>
        <table class="table">
          <tr>
            <td><Input style="width:400px;" v-model="keywords" size="large" placeholder="全文检索" @on-enter="query()"/></td>
            <td><button class="button" @click="query()">全文检索</button></td>
          </tr>
        </table>
      </div>
      <!--<div v-if="this.list.length==0" style="color: tomato;padding-left: 10px;">查询暂无数据！</div>-->
      <div class="page-form" style="background-color:#f5f6f7;padding:0px;">
        <div style="height: 100%;margin-right: 353px;">
          <div :key="obj" v-for="obj in list" class="trace-left-item">
            <div class="left-content">
              <div class="left-item" >
                <div class="describe">
                  <table style="width:100%;">
                    <tr>
                      <td colspan="2">
                        <span style="color: #135195;">{{obj.title1}}</span>
                        <span style="color: tomato;">{{obj.keywords}}</span>
                        <span style="color: #135195;">{{obj.title2}}</span>
                        <br><br>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <div v-if="obj.tagName == '企业客户基本信息'">
                            <span  :key="obj2" v-for="obj2 in obj.content" class="lookup">
                              <span style="color:#999">{{obj2.title}} : </span><span style="color:#333">{{obj2.content}}</span>, &nbsp;&nbsp;&nbsp;
                            </span>
                        </div>
                        <div v-else>{{obj.content}}</div>
                        <br>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span style="color: rgb(180, 180, 180);">{{obj.tagSign}}</span>
                        <img v-if="obj.type=='docx'" src="@/assets/img/doc.png" style="height: 20px;width: 20px;" >
                        <img v-if="obj.type=='pdf'" src="@/assets/img/pdf.png" style="height: 20px;width: 20px;" >
                        <img v-if="obj.type=='pptx'" src="@/assets/img/ppt.png" style="height: 20px;width: 20px;" >
                      </td>
                      <td style="float:right;color: #135195;" v-if="obj.tagName=='立即下载'" @click="download(obj.objId)">{{obj.tagName}}</td>
                      <td style="float:right;color: #135195;" v-else @click="replace(obj)">{{obj.tagName}}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CampusEdit ref="CampusEdit" @on-save="query"></CampusEdit>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import page from '@/assets/js/page';
import CampusEdit from '@/components/campus/campus/campusEdit';
export default {
  components: {
    Loading,
    LayoutHor,
    page,
    CampusEdit,
  },
  data() {
    return {
      loading: 0,
      list: [],
      keywords:"",
    }
  },
  computed: {
  },
  mounted() {
    //this.keywords = this.$route.query.keywords;
    //this.query();
  },
  methods: {
    query() {//全文检索查询
    console.log(this.keywords);
      var that = this;
      var keywords = this.keywords;
      this.$http.post('/api/engine/search/doSearch?', {keywords:keywords}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0 && res.data.data != null) {
          var list = res.data.data.rows;
          //遍历处理数据
          for (var i = 0; i < list.length; i++) {
            //判断标题改变颜色
            if(list[i].title!=null||list[i].title!=""){
              
              var size = list[i].title.indexOf(keywords);//获取关键字下表
              var length = keywords.length;//判断关键字长度
              list[i].keywords = keywords;
              
              if(size>0){
                if((size+length)==list[i].title.length){
                  list[i].title1 = list[i].title.substring(0,size);
                  list[i].title2 = "";
                }else{
                  list[i].title1 = list[i].title.substring(0,size);
                  list[i].title2 = list[i].title.substring(size+length,list[i].title.length);
                }
              }else{
                list[i].title1 = "";
                list[i].title2 = list[i].title.substring(length,list[i].title.length);
              }
              if(size==-1){
                list[i].title1 = list[i].title;
                list[i].title2 = "";
                list[i].keywords = "";
              }
            }
            //判断下标信息
            if(list[i].tag=="corp_base"){//企业客户基本信息
              list[i].tagName = "企业客户基本信息";
              var basisArr = list[i].content.split(":");
              var listCon = [];
              var con = 0;
              var arr2="";
              for(var j=1;j<basisArr.length;j++){
                var arr = basisArr[j].split(",");
                var obj = {};
                if(j==1){
                  obj =  {"title":basisArr[0],"content":arr[0]}
                }else{
                  if(arr[0]){
                    obj = {"title":arr2,"content":arr[0]}
                  }else{
                    arr2 = arr[1];
                    continue;
                  }
                }
                arr2 = arr[1];
                listCon[con] = obj;
                con++;
              }
              list[i].content = listCon;


            }else if(list[i].tag=="corp_ecology_base"){//企业客户生态信息
              list[i].tagName = "企业客户生态信息";
            }else if(list[i].tag=="campus_base"){// 园区信息
              list[i].tagName = "园区信息";
            }else if(list[i].tag=="project_base"){// 项目信息
              list[i].tagName = "项目信息";
            }else if(list[i].tag=="corp_trace_base"){// 企业客户跟进信息
              list[i].tagName = "企业客户跟进信息";
            }
            if(list[i].type=="tb"){
              list[i].tagSign = "文本";
            }else if(list[i].type=="docx"||list[i].type=="pdf"||list[i].type=="pptx"){
              list[i].tagSign = "附件";
              list[i].tagName = "立即下载";
              list[i].content = list[i].content + "... ..."
            }
            console.log("********22222222************")
            console.log(list[i].content);
            console.log(list[i].content.indexOf(keywords));
          }

          if(list.length == 0){
            this.$Message.error('全文检索没有查询到数据！');
          }
          this.list = list;
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    download(fileId){//下载文件
      window.open(this.$http.defaults.baseURL + '/api/file/download?fileId='+fileId);
    },
    replace(obj){
      //判断下标信息
      if(obj.tag=="corp_base"){//企业客户基本信息
        this.$router.replace({ path: '/ecology/selcorp/edit?corpId=' + obj.objId });
        return;
      }else if(obj.tag=="corp_ecology_base"){//企业客户生态信息
        this.$router.replace({ path: '/ecology/selcorp/ecology?corpId=' + obj.objId });
        return;
      }else if(obj.tag=="campus_base"){// 园区信息
        this.$refs.CampusEdit.open({id:obj.objId});
        return;
      }else if(obj.tag=="project_base"){// 项目信息
        this.$router.push({ path: "/project/myedit?projectId="+ obj.objId });
        return;
      }else if(obj.tag=="corp_trace_base"){// 企业客户跟进信息
        this.$router.replace({ path: '/ecology/selcorp/trace/index?corpId=' + obj.objId });
        return;
      }
    },
  }
}

</script>

<style type="text/css">
.trace {
  background: #f5f6f7;
}
.trace .trace-left-item {
  padding: 15px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  min-width: 500px;
}
.trace .date {
  width: 110px;
  text-align: center;
  display: table-cell;
  vertical-align: middle;

  height: 15px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 300;
  color: rgba(51, 51, 51, 1);
  line-height: 36px;
}
.trace .left-item {
  margin: 10px;
  line-height: 25px;
  font-size: 16px;
  font-family: PingFang SC;
}

.trace .left-item .initial {
  border-radius: 50%;
  width: 25px;
  height: 25px;
  background: #135195;
  color: #fff;
  display: inline-block;
  text-align: center;
}
.trace .left-item .titleblue {
  padding-left: 10px;
  font-weight: bold;
  color: #135195;
}
.trace .left-item .titlered {
  padding-left: 10px;
  font-weight: bold;
  color: tomato;
}
.trace .left-item .describe {
  padding-left: 20px;
  padding-right: 15px;
  color: #666666;
}
.trace .left-item .describe .vertical {
  display: inline-block;
  width: 1px;
  height: 15px;
  margin-left: 15px;
  border-right: 1px solid #d9d9d9;
}
.table{
  padding: 10px;
}
.table .button{
  background: #0d4580;
  color: #fff;
  padding:10px;
  border: 1px solid #ddd;
}
</style>










